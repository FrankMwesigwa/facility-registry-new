import express from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import csv from 'csv-parser';
import crypto from 'crypto';
import System from '../models/system.js';
import authenticate from "../middleware/auth.js";
import MflService from "../services/mflService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// GET endpoint to fetch latitude and longitude of health facilities
router.get("/coordinates", async (req, res) => {
    try {
        const coordinates = await MflService.findAllCoordinates();
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// POST /api/mfl/updates/webhook
router.post('/updates/webhook', async (req, res) => {
    try {
        const apiKey = req.header('X-API-KEY') || '';
        const signature = req.header('X-Signature') || '';
        const algo = req.header('X-Signature-Alg') || 'HMAC-SHA256';

        if (!apiKey) return res.status(401).json({ ok: false, error: 'Missing X-API-KEY' });
        if (!signature) return res.status(401).json({ ok: false, error: 'Missing X-Signature' });
        if (algo !== 'HMAC-SHA256') return res.status(400).json({ ok: false, error: 'Unsupported signature algorithm' });

        // Find system by API key
        const system = await System.findOne({ where: { api_key: apiKey, is_active: true } });
        if (!system) return res.status(403).json({ ok: false, error: 'Invalid or inactive API key' });

        // Recompute HMAC over the raw body. If raw body isn't available, use JSON re-serialized body.
        const bodyString = JSON.stringify(req.body || {});
        const expected = crypto.createHmac('sha256', system.secret).update(bodyString).digest('hex');

        const verified = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
        if (!verified) return res.status(401).json({ ok: false, error: 'Invalid signature' });

        // Handle supported events
        const eventName = req.body?.event;
        switch (eventName) {
            case 'facility.created':
            case 'facility.updated':
            case 'facility.deleted':
                // For now, acknowledge receipt. Integrate domain handling as needed.
                return res.json({ ok: true, receivedAt: new Date().toISOString() });
            default:
                return res.status(400).json({ ok: false, error: 'Unsupported event' });
        }
    } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// Stats
router.get("/stats", async (req, res) => {
    try {
        const stats = await MflService.getStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Summary by level and ownership
router.get("/summary/level-ownership", async (req, res) => {
    try {
        const filters = {
            region_id: req.query.region_id,
            district_id: req.query.district_id,
        };
        const rows = await MflService.getLevelOwnershipSummary(filters);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get regions from mfl
router.get("/regions", async (req, res) => {
    try {
        const rows = await MflService.getRegions();
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get districts by region
router.get("/districts", async (req, res) => {
    try {
        const region_id = req.query.region_id;
        const rows = await MflService.getDistricts(region_id);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload CSV directly into nhfr.mfl
router.post("/upload", authenticate, upload.single('file'), async (req, res) => {
    try {
        const ownerId = parseInt(req.user.id);

        // If no file provided, fallback to previous behavior (upload from staging table)
        if (!req.file) {
            const result = await MflService.uploadFromFacilityUploads(ownerId);
            return res.status(200).json({ message: "Upload completed (from staging table)", ...result });
        }

        const rows = await new Promise((resolve, reject) => {
            const out = [];
            const stream = Readable.from(req.file.buffer);
            stream
                .pipe(csv())
                .on('data', (row) => out.push(row))
                .on('end', () => resolve(out))
                .on('error', (err) => reject(err));
        });

        const result = await MflService.uploadFromCsv(rows, ownerId);
        res.status(200).json({ message: "Upload completed", ...result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Incremental upload using JSON chunks: { rows: Array<Record<string, any>> }
router.post("/upload/chunk", authenticate, async (req, res) => {
    try {
        const ownerId = parseInt(req.user.id);
        const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];
        if (rows.length === 0) {
            return res.status(400).json({ error: 'rows array is required' });
        }
        const result = await MflService.uploadFromCsv(rows, ownerId);
        res.status(200).json({ message: "Chunk processed", ...result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Query: by owner_id of logged-in user
router.get("/owner", authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const ownerId = parseInt(req.user.id);
        const data = await MflService.findByOwnerId(ownerId, page, limit);
        res.status(200).json({ results: data.length, facilities: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Query: by user_district_id of logged-in user
router.get("/district", authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const userDistrictId = parseInt(req.user.district_id);
        const data = await MflService.findByUserDistrictId(userDistrictId, page, limit);
        res.status(200).json({ results: data.length, facilities: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create
router.post("/", authenticate, async (req, res) => {
    try {
        const data = await MflService.create(req.body);
        res.status(201).json({ message: "MFL record created", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List
router.get("/", async (req, res) => {
    try {
        // If export=all is provided, return all facilities matching filters without pagination
        if (req.query.export === 'all') {
            const rows = await MflService.findAllForExport(req.query);
            return res.status(200).json({ results: rows.length, facilities: rows });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const { rows, count } = await MflService.findAll(page, limit, req.query);
        
        // Calculate pagination metadata
        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        
        res.status(200).json({
            facilities: rows,
            pagination: {
                total: count,
                page: page,
                limit: limit,
                totalPages: totalPages,
                hasNextPage: hasNextPage,
                hasPreviousPage: hasPreviousPage
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get facility details by flexible identifier (id, facility_id, nhfrid, uid)
router.get("/:identifier", async (req, res) => {
    try {
        const item = await MflService.findDetails(req.params.identifier);
        if (!item) return res.status(404).json({ message: "Not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update by facility_id
router.put("/:facility_id", authenticate, async (req, res) => {
    try {
        const item = await MflService.update(req.params.facility_id, req.body);
        res.status(200).json(item);
    } catch (error) {
        if (error.message === 'MFL record not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// Delete by facility_id
router.delete("/:facility_id", authenticate, async (req, res) => {
    try {
        await MflService.remove(req.params.facility_id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'MFL record not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

export default router;


