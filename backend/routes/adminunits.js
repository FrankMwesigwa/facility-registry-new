import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

router.get("/regions", async (req, res) => {
    try {
        const result = await pool.query(
            "select id, name , parent_id from nhfr.admin_units where level_id = 2 order by name"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching admin levels:", error);
        res.status(500).json({ error: "Failed to fetch admin levels" });
    }
});

router.get("/districts", async (req, res) => {
    try {
        const { id } = req.query;
        let result;
        if (id) {
            result = await pool.query(
                "select id, name, parent_id from nhfr.admin_units where level_id = 3 and parent_id = $1 order by name",
                [id]
            );
        } else {
            result = await pool.query(
                "select id, name, parent_id from nhfr.admin_units where level_id = 3 order by name"
            );
        }
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching admin levels:", error);
        res.status(500).json({ error: "Failed to fetch admin levels" });
    }
});

router.get("/subcounties", async (req, res) => {
    try {
        const { id } = req.query;
        let result;
        if (id) {
            result = await pool.query(
                "select id, name, parent_id from nhfr.admin_units where level_id = 4 and parent_id = $1 order by name",
                [id]
            );
        } else {
            result = await pool.query(
                "select id, name, parent_id from nhfr.admin_units where level_id = 4 order by name"
            );
        }
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching admin levels:", error);
        res.status(500).json({ error: "Failed to fetch admin levels" });
    }
});

router.get("/facilities", async (req, res) => {
    try {
        const { id } = req.query;
        let result;
        if (id) {
            result = await pool.query(
                "select id, name, parent_id from nhfr.admin_units where level_id = 5 and parent_id = $1 order by name",
                [id]
            );
        } else {
            result = await pool.query(
                "select id, name, parent_id from nhfr.admin_units where level_id = 5 order by name"
            );
        }
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching admin levels:", error);
        res.status(500).json({ error: "Failed to fetch admin levels" });
    }
});



export default router;