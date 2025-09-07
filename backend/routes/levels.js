import express from 'express';
import Level from '../models/level.js';
import AdminUnit from '../models/adminunit.js';
import { sequelize } from '../config/db.js';

const router = express.Router();

// Seed initial levels (idempotent)
router.post('/seed', async (req, res) => {
  const seed = [
    { name: 'National', code: 'NAT', level_number: 1 },
    { name: 'Region', code: 'REG', level_number: 2 },
    { name: 'District / City / Municipality', code: 'DIST', level_number: 3 },
    { name: 'SUBCOUNTY/TOWN COUNCIL/DIVISION', code: 'SUB', level_number: 4 },
    { name: 'Facility', code: 'FAC', level_number: 5 },
  ];
  try {
    for (const row of seed) {
      await Level.upsert(row);
    }
    const rows = await Level.findAll({ order: [['level_number', 'ASC']] });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// List levels
router.get('/', async (_req, res) => {
  const rows = await Level.findAll({ order: [['level_number', 'ASC']] });
  res.json(rows);
});

// Create level (appends at bottom)
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, code } = req.body;
    const max = await Level.max('level_number');
    const row = await Level.create(
      { name, code, level_number: (max || 0) + 1 },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json(row);
  } catch (e) {
    await t.rollback();
    res.status(400).json({ error: e.message });
  }
});

// Update level name/code
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const row = await Level.findByPk(id);
    if (!row) return res.status(404).json({ error: 'Not found' });


    const { name, code } = req.body;
    if (name !== undefined) row.name = name;
    if (code !== undefined) row.code = code;
    await row.save();
    res.json(row);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete level (only if no units)
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const used = await AdminUnit.count({ where: { level_id: id } });
    if (used > 0) {
      await t.rollback();
      return res.status(409).json({ error: 'Level has units; move/delete units first.' });
    }


    const victim = await Level.findByPk(id);
    if (!victim) {
      await t.rollback();
      return res.status(404).json({ error: 'Not found' });
    }


    const removedNumber = victim.level_number;
    await victim.destroy({ transaction: t });


    // close gap: shift down levels above the removed one
    await Level.increment(
      { level_number: -1 },
      { where: { level_number: { [sequelize.Op.gt]: removedNumber } }, transaction: t }
    );


    await t.commit();
    res.json({ ok: true });
  } catch (e) {
    await t.rollback();
    res.status(400).json({ error: e.message });
  }
});

// Reorder levels by array of IDs
router.post('/reorder', async (req, res) => {
  const { ids } = req.body; // [levelIdInNewOrder]
  
  console.log('Reorder request received:', { ids });
  
  if (!Array.isArray(ids) || ids.length === 0) {
    console.error('Invalid ids array:', ids);
    return res.status(400).json({ error: 'ids array required' });
  }

  const t = await sequelize.transaction();
  try {
    // Verify all IDs exist before updating
    const existingLevels = await Level.findAll({ 
      where: { id: ids }, 
      transaction: t 
    });
    
    if (existingLevels.length !== ids.length) {
      await t.rollback();
      console.error('Some level IDs not found. Requested:', ids, 'Found:', existingLevels.map(l => l.id));
      return res.status(400).json({ error: 'Some level IDs not found' });
    }

    // Get the maximum level_number to use as offset
    const maxLevelNumber = await Level.max('level_number', { transaction: t });
    const offset = (maxLevelNumber || 0) + 1000;

    // First, set all level_numbers to offset values to avoid unique constraint conflicts
    for (let i = 0; i < ids.length; i++) {
      await Level.update(
        { level_number: offset + i },
        { where: { id: ids[i] }, transaction: t }
      );
    }

    // Then assign the correct sequential numbers
    for (let i = 0; i < ids.length; i++) {
      await Level.update(
        { level_number: i + 1 },
        { where: { id: ids[i] }, transaction: t }
      );
    }

    await t.commit();
    const rows = await Level.findAll({ order: [['level_number', 'ASC']] });
    console.log('Reorder successful, returning levels:', rows.map(r => ({ id: r.id, name: r.name, level_number: r.level_number })));
    res.json(rows);
  } catch (e) {
    await t.rollback();
    console.error('Reorder error:', e);
    res.status(400).json({ error: e.message });
  }
});

export default router;