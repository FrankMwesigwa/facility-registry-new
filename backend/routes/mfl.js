import express from "express";
import authenticate from "../middleware/auth.js";
import MflService from "../services/mflService.js";

const router = express.Router();

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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const data = await MflService.findAll(page, limit);
        res.status(200).json({ results: data.length, facilities: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get by facility_id
router.get("/:facility_id", async (req, res) => {
    try {
        const item = await MflService.findById(req.params.facility_id);
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


