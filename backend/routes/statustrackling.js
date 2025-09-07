import express from "express";
import { sequelize } from '../config/db.js';
import User from "../models/users.js";
import Requests from "../models/facilityRequests.js";
import Trackling from "../models/statusTrackling.js";
import Facilities from "../models/facilities.js";
import authenticate from "../middleware/auth.js";
import generateFacilityIdentifier from "../utils/generateIdentifier.js";

const router = express.Router();

router.post("/district", authenticate, async (req, res) => {

    try {
        const approval = await Trackling.create({
            ...req.body,
            approved_by: req.user.id,
        });

        const updatedRequest = await Requests.update(
            { status: "district_approved"},
            { where: { id: req.body.request_id } }
        );

        res.status(201).json({
            status: "success",
            approval,
            updatedRequest
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.post("/planning", authenticate, async (req, res) => {

    try {
        const approval = await Trackling.create({
            ...req.body,
            approved_by: req.user.id,
        });

        const updatedRequest = await Requests.update(
            { status: "planning_approved"},
            { where: { id: req.body.request_id } }
        );

        res.status(201).json({
            status: "success",
            approval,
            updatedRequest
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.post("/moh", authenticate, async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { facility, request_id, status, comments, approved, owner_id, verified } = req.body;

        if (!facility) {
            throw new Error("Facility details are missing in the request body.");
        }

        // Step 1: Save Trackling
        const approval = await Trackling.create(
            {
                request_id,
                status,
                comments,
                approved,
                owner_id,
                verified,
                approved_by: req.user.id,
            },
            { transaction }
        );

        // Step 2: Generate Unique Identifier
        const identifier = generateFacilityIdentifier(
            facility.region_id,
            facility.district_id,
            facility.sub_county_id,
            Math.floor(Math.random() * 10000)
        );

        // Step 3: Save Facility in Admin Facility Table
        const adminFacility = await Facility.create(
            {
                name: facility.name,
                sub_county_id: facility.sub_county_id,
            },
            { transaction }
        );

        console.log(adminFacility)

        // Step 4: Save Facility in Main Facilities Table with the ID from Admin Facility
        const newFacility = await Facilities.create(
            {
                owner_id: owner_id,
                unique_identifier: identifier,
                name: facility.name || null,
                level: facility.level || null,
                ownership: facility.ownership || null,
                authority: facility.authority || null,
                operational_status: facility.operational_status || null,
                license_status: facility.license_status || null,
                region_id: facility.region_id || null,
                district_id: facility.district_id || null,
                sub_county_id: facility.sub_county_id || null,
                physical_location: facility.physical_location || null,
                latitude: facility.latitude || null,
                longitude: facility.longitude || null,
                contact_person_email: facility.contact_person_email || null,
                contact_person_mobile: facility.contact_person_mobile || null,
                contact_person_name: facility.contact_person_name || null,
                date_opened: facility.date_opened || null,
                bed_capacity: facility.bed_capacity || null,
                regulatory_body: facility.regulatory_body || null,
                license_number: facility.license_number || null,
                date_registered: facility.date_registered || null,
                facility_inspection_status: facility.date_opened || null,
                ambulances: facility.ambulances || null,
                services: facility.services || [],
                status: status,
                district_approved: facility.district_approved || false,
                approved: approved,
                verified: verified,
                rejected: facility.rejected || false,
                district_rejected: facility.district_rejected || false,
                facility_id: adminFacility.id
            },
            { transaction }
        );

        // Step 5: Update Request Status
        const [updatedCount, updatedRows] = await Requests.update(
            { status: "published", approved: true },
            { where: { id: request_id }, returning: true, transaction }
        );

        // Step 6: Commit Transaction
        await transaction.commit();

        res.status(201).json({
            status: "success",
            approval,
            updatedRequest: updatedRows[0],
            facility: newFacility,
        });
    } catch (error) {
        try {
            await transaction.rollback();
        } catch (rollbackError) {
            console.error("Transaction rollback failed:", rollbackError);
        }

        console.error("Error in /moh endpoint:", error);
        res.status(500).json({
            status: "error",
            message: error || "Something went wrong.",
        });
    }
});

router.post("/", authenticate, async (req, res) => {
    try {

        const request = await Trackling.create({
            request_id: request.id,
            comments: req.body.comments,
            owner_id: req.user.id,
        });

        res.status(201).json({ message: "Status Added", data: request });
    } catch (error) {
        console.error("Error saving facility:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

router.get("/", authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const offset = (page - 1) * limit;

        const approvals = await Trackling.findAll({
            where: { owner_id: req.user.id },
            limit,
            offset,
            include: [
                { model: Requests },
                { model: User }
            ]
        });

        res.status(200).json({
            status: "success",
            results: approvals.length,
            approvals,
        });
    } catch (error) {
        console.error("Error fetching approvals:", error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});


router.patch("/:id", async (req, res) => {
    try {
        const result = await Trackling.update(
            { ...req.body, updatedAt: Date.now() },
            {
                where: {
                    id: req.params.id,
                },
            }
        );

        if (result[0] === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        const approval = await Trackling.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            approval
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const approval = await Trackling.findByPk(req.params.id,
            {
                include: [{ model: Brand }, { model: Type }, { model: Category }, { model: Model }]
            });

        if (!approval) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            approval,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await Trackling.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(204).json();
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});


export default router;