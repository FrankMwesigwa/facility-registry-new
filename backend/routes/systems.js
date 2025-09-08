import express from "express";
import { v4 as uuidv4 } from "uuid";
import System from "../models/system.js";
import WebhookService from "../services/webhookService.js";

const router = express.Router();

// List systems
router.get('/', async (req, res) => {
    try {
        const rows = await System.findAll({ order: [['createdAt', 'DESC']] });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new system. If api_key not provided, generate one.
router.post('/', async (req, res) => {
    try {
        const { name, url, api_key, secret, is_active } = req.body || {};
        if (!name || !url || !secret) {
            return res.status(400).json({ error: 'name, url and secret are required' });
        }

        const payload = {
            name,
            url,
            api_key: api_key || uuidv4(),
            secret,
            is_active: typeof is_active === 'boolean' ? is_active : true,
        };
        const created = await System.create(payload);
        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a system
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const record = await System.findByPk(id);
        if (!record) return res.status(404).json({ error: 'System not found' });
        const { name, url, api_key, secret, is_active } = req.body || {};
        await record.update({ name, url, api_key, secret, is_active });
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a system
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const record = await System.findByPk(id);
        if (!record) return res.status(404).json({ error: 'System not found' });
        await record.destroy();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Broadcast sample event to all active systems
router.post('/broadcast', async (req, res) => {
    try {
        const { event, data } = req.body || {};
        if (!event) return res.status(400).json({ error: 'event is required' });
        const systems = await System.findAll({ where: { is_active: true } });
        const summary = await WebhookService.broadcast(systems, event, data || {});
        res.json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;


