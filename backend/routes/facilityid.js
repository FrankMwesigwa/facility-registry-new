import express from "express";
import { pool } from "../config/db.js";
import generateFacilityIdentifier from "../utils/generateIdentifier.js";
import MflService from "../services/mflService.js";

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

// Assign NHFR IDs for facilities by generating IDs via generateFacilityIdentifier
router.post("/", async (req, res) => {
	const client = await pool.connect();
	try {
		// Fetch facilities needing an NHFR ID; adjust filter if you want to force-regenerate
		const { rows } = await client.query(
			`SELECT uid, name, shortname, nhfrid
			 FROM nhfr.facilities_ids
			 WHERE nhfrid IS NULL OR nhfrid = ''`
		);

		if (!rows.length) {
			return res.json({ updated: 0, message: "No facilities required assignment" });
		}

		await client.query("BEGIN");

		let updatedCount = 0;
		const updatedSamples = [];

		for (const facility of rows) {
			// Generate numeric seed from service (uid is not numeric)
			const seed = await MflService.generateNumericSeed();
			const newId = generateFacilityIdentifier(seed);
			await client.query(
				`UPDATE nhfr.facilities_ids
				 SET nhfrid = $1
				 WHERE uid = $2`,
				[newId, facility.uid]
			);
			updatedCount += 1;
			if (updatedSamples.length < 5) {
				updatedSamples.push({ uid: facility.uid, nhfrid: newId });
			}
		}

		await client.query("COMMIT");
		return res.json({ updated: updatedCount, samples: updatedSamples });
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("Error assigning NHFR IDs:", error);
		return res.status(500).json({ error: "Failed to assign NHFR IDs" });
	} finally {
		client.release();
	}
});

export default router;