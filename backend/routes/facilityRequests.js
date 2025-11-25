import express from "express";
import multer from "multer";
import authenticate from "../middleware/auth.js";
import FacilityRequestService from "../services/facilityRequestService.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    },
});

router.post("/", authenticate, upload.any(), async (req, res) => {
    try {
        // Add user district_id to request data (defensive: ensure req.user exists)
        const requestData = {
            ...req.body,
            user_district_id: req.user ? req.user.district_id : null
        };

        const request = await FacilityRequestService.createRequest(
            requestData,
            req.user ? req.user.id : null,
            req.files || []
        );

        res.status(201).json({ 
            message: "Facility Request Created Successfully", 
            data: request 
        });
    } catch (error) {
        console.error("Error saving facility:", error);
        console.error("Full stack:", error.stack);
        console.error("Request data:", req.body);
        res.status(500).json({ 
            error: "Internal Server Error", 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Create facility update request
router.post("/update", authenticate, upload.any(), async (req, res) => {
    try {
        // Add user district_id to request data
        const updateData = {
            ...req.body,
            user_district_id: req.user ? req.user.district_id : null
        };

        const request = await FacilityRequestService.createUpdateRequest(
            updateData,
            req.user ? req.user.id : null,
            req.files || []
        );

        res.status(201).json({ 
            message: "Facility Update Request Created Successfully", 
            data: request 
        });
    } catch (error) {
        console.error("Error creating facility update request:", error);
        res.status(500).json({ 
            error: "Internal Server Error", 
            details: error.message 
        });
    }
});

// Create facility deactivation request
router.post("/deactivate", authenticate, upload.any(), async (req, res) => {
    try {
        // Add user district_id to request data
        const deactivationData = {
            ...req.body,
            user_district_id: req.user ? req.user.district_id : null
        };

        const request = await FacilityRequestService.createDeactivationRequest(
            deactivationData,
            req.user ? req.user.id : null,
            req.files || []
        );

        res.status(201).json({ 
            message: "Facility Deactivation Request Created Successfully", 
            data: request 
        });
    } catch (error) {
        console.error("Error creating facility deactivation request:", error);
        res.status(500).json({ 
            error: "Internal Server Error", 
            details: error.message 
        });
    }
});

router.get('/private', authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const requests = await FacilityRequestService.getRequestsByPrivate(req.user.district_id, page, limit);
        res.status(200).json({
            status: 'success',
            results: requests.length,
            request: requests,
            page,
            limit,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests' });
    }
});

router.get('/district', authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const requests = await FacilityRequestService.getRequestsByDistrict(req.user.district_id, page, limit);
        res.status(200).json({
            status: 'success',
            results: requests.length,
            request: requests,
            page,
            limit,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests' });
    }
});

router.get("/planning", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;

        const requests = await FacilityRequestService.getPlanningRequests(page, limit);

        res.status(200).json({
            status: "success",
            results: requests.length,
            request: requests,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/admin", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;

        const requests = await FacilityRequestService.getAdminRequests(page, limit);

        res.status(200).json({
            status: "success",
            results: requests.length,
            request: requests,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get('/my', authenticate, async (req, res) => {
    try {
        const requests = await FacilityRequestService.getRequestsByUser(req.user.id);
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests' });
    }
});

// Get status history for current user by owner_id
router.get('/my/status', authenticate, async (req, res) => {
    try {
        const history = await FacilityRequestService.getStatusHistoryByOwner(req.user.id);
        res.status(200).json({
            status: 'success',
            results: history.length,
            data: history,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching status history' });
    }
});

// Get status history by request id
router.get('/:id/status', authenticate, async (req, res) => {
    try {
        const history = await FacilityRequestService.getStatusHistory(req.params.id);
        res.status(200).json({
            status: 'success',
            results: history.length,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const request = await FacilityRequestService.getRequestById(req.params.id);

        if (!request) {
            return res.status(404).json({
                status: "error",
                message: "Facility request not found",
            });
        }

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const request = await FacilityRequestService.updateRequest(req.params.id, req.body);
        res.status(200).json(request);
    } catch (error) {
        if (error.message === 'Request not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await FacilityRequestService.deleteRequest(req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Request not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// Approve facility request
router.post('/:id/approve', authenticate, async (req, res) => {
    try {
        const { comments } = req.body;
        const request = await FacilityRequestService.approveRequest(
            req.params.id, 
            req.user.id, 
            comments
        );

        res.status(200).json({ 
            message: 'Request approved successfully',
            request
        });
    } catch (error) {
        console.error('Error approving request:', error);
        if (error.message === 'Request not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// Reject facility request
router.post('/:id/reject', authenticate, async (req, res) => {
    try {
        const { comments } = req.body;
        const request = await FacilityRequestService.rejectRequest(
            req.params.id, 
            req.user.id, 
            comments
        );

        res.status(200).json({ 
            message: 'Request rejected successfully',
            request
        });
    } catch (error) {
        console.error('Error rejecting request:', error);
        if (error.message === 'Request not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

export default router;