import { Router } from 'express';
import { sequelize, pool } from '../config/db.js';
import Level from '../models/level.js';
import AdminUnit from '../models/adminunit.js';

const { Op } = sequelize;
const router = Router();

async function computePath(unitId, parentId) {
    if (!parentId) return `/${unitId}/`;
    const parent = await AdminUnit.findByPk(parentId);
    return `${parent.path}${unitId}/`;
}


async function getLevelById(levelId) {
    const lvl = await Level.findByPk(levelId);
    if (!lvl) throw new Error('Invalid level');
    return lvl;
}

// Validate parent is exactly one level above child
async function validateParentRule(levelId, parentId) {
    if (!parentId) {
        // only allowed if this is the top level
        const lvl = await getLevelById(levelId);
        const min = await Level.min('level_number');
        if (lvl.level_number !== min) throw new Error('Root units must be at the top level');
        return;
    }
    const childLevel = await getLevelById(levelId);
    const parentUnit = await AdminUnit.findByPk(parentId, { include: [Level] });
    if (!parentUnit) throw new Error('Parent not found');
    const parentLevelNumber = parentUnit.Level.level_number;
    if (childLevel.level_number !== parentLevelNumber + 1)
        throw new Error('Parent must be exactly one level above the child');
}

// List units (+filters)
router.get('/', async (req, res) => {
    const { levelId, parentId, q } = req.query;
    const where = {};
    if (levelId) where.level_id = Number(levelId);
    if (parentId) where.parent_id = Number(parentId);
    if (q) where.name = { [Op.iLike]: `%${q}%` };


    const rows = await AdminUnit.findAll({
        where,
        include: [{ model: Level }],
        order: [['name', 'ASC']],
    });
    res.json(rows);
});

// Tree (simple)
router.get('/tree', async (_req, res) => {
    try {
        const levels = await Level.findAll({ order: [['level_number', 'ASC']] });

        // Read units directly from DB to avoid any model registration issues
        const { rows } = await pool.query(
            'select id, name, code, level_id, parent_id from nhfr.admin_units order by id asc'
        );

        const byParent = rows.reduce((acc, u) => {
            const key = u.parent_id === null ? 0 : u.parent_id;
            (acc[key] ||= []).push(u);
            return acc;
        }, {});

        function build(pid = 0) {
            return (byParent[pid] || []).map((u) => ({
                id: u.id,
                name: u.name,
                code: u.code,
                levelId: u.level_id,
                children: build(u.id),
            }));
        }

        // Prevent caching of this dynamic tree
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.json({ levels, tree: build(0) });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Create unit
router.post('/', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, code, levelId, parentId } = req.body;
        await validateParentRule(levelId, parentId || null);


        const row = await AdminUnit.create({ name, code, level_id: levelId, parent_id: parentId || null }, { transaction: t });
        const path = await computePath(row.id, parentId || null);
        row.path = path;
        await row.save({ transaction: t });


        await t.commit();
        res.status(201).json(row);
    } catch (e) {
        await t.rollback();
        res.status(400).json({ error: e.message });
    }
});

// Update unit
router.put('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { name, code, levelId, parentId } = req.body;
        const row = await AdminUnit.findByPk(id);
        if (!row) throw new Error('Not found');


        // if level or parent changes, re-validate
        const nextLevelId = levelId ?? row.level_id;
        const nextParentId = parentId === undefined ? row.parent_id : parentId;
        await validateParentRule(nextLevelId, nextParentId || null);


        if (name !== undefined) row.name = name;
        if (code !== undefined) row.code = code;
        if (levelId !== undefined) row.level_id = levelId;
        if (parentId !== undefined) row.parent_id = parentId || null;


        await row.save({ transaction: t });


        // recompute path for this node + descendants
        async function updateSubtreePaths(nodeId, parentPath) {
            const node = await AdminUnit.findByPk(nodeId);
            node.path = `${parentPath}${node.id}/`;
            await node.save({ transaction: t });
            const children = await AdminUnit.findAll({ where: { parent_id: nodeId } });
            for (const c of children) {
                await updateSubtreePaths(c.id, node.path);
            }
        }


        const parentPath = row.parent_id ? (await AdminUnit.findByPk(row.parent_id)).path : '/';
        await updateSubtreePaths(row.id, parentPath);


        await t.commit();
        res.json(row);
    } catch (e) {
        await t.rollback();
        res.status(400).json({ error: e.message });
    }
});

// Move unit (change parent only)
router.post('/:id/move', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { newParentId } = req.body;


        const row = await AdminUnit.findByPk(id, { include: [Level] });
        if (!row) throw new Error('Not found');


        await validateParentRule(row.level_id, newParentId || null);


        row.parent_id = newParentId || null;
        await row.save({ transaction: t });


        const parentPath = newParentId ? (await AdminUnit.findByPk(newParentId)).path : '/';


        // Update paths for subtree
        async function updateSubtreePaths(nodeId, parentPath) {
            const node = await AdminUnit.findByPk(nodeId);
            node.path = `${parentPath}${node.id}/`;
            await node.save({ transaction: t });
            const children = await AdminUnit.findAll({ where: { parent_id: nodeId } });
            for (const c of children) {
                await updateSubtreePaths(c.id, node.path);
            }
        }


        await updateSubtreePaths(row.id, parentPath);


        await t.commit();
        res.json({ ok: true });
    } catch (e) {
        await t.rollback();
        res.status(400).json({ error: e.message });
    }
});

// Delete unit (optionally cascade)
router.delete('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { cascade } = req.query; // "true" to cascade children


        const children = await AdminUnit.count({ where: { parent_id: id } });
        if (children > 0 && cascade !== 'true') {
            await t.rollback();
            return res.status(409).json({ error: 'Unit has children; pass ?cascade=true to delete subtree.' });
        }


        if (cascade === 'true') {
            const victim = await AdminUnit.findByPk(id);
            // delete all descendants using path
            await AdminUnit.destroy({ where: { path: { [Op.like]: `${victim.path}%` } }, transaction: t });
        } else {
            await AdminUnit.destroy({ where: { id }, transaction: t });
        }


        await t.commit();
        res.json({ ok: true });
    } catch (e) {
        await t.rollback();
        res.status(400).json({ error: e.message });
    }
});

export default router;