import FacilityRequests from "../models/facilityRequests.js";
import StatusTrackling from '../models/statusTrackling.js';
import AdminUnit from '../models/adminunit.js';
import User from '../models/users.js';
import Mfl from '../models/mfl.js';
import generateFacilityIdentifier from "../utils/generateIdentifier.js";
import { pool, sequelize, Sequelize } from '../config/db.js';
import System from '../models/system.js';
import WebhookService from './webhookService.js';

/**
 * Service class for handling facility request operations
 */
class FacilityRequestService {
    
    /**
     * Helper function to convert empty strings to null for numeric fields
     */
    static sanitizeNumericField(value) {
        if (value === '' || value === null || value === undefined) {
            return null;
        }
        const numValue = parseFloat(value);
        return isNaN(numValue) ? null : numValue;
    }
    
    /**
     * Get status history for a facility request
     */
    static async getStatusHistory(requestId) {
        const items = await StatusTrackling.findAll({
            where: { request_id: requestId },
            order: [['createdAt', 'ASC']],
            include: [
                { model: User, as: 'Owner', attributes: ['id', 'firstname', 'lastname', 'email'] },
                { model: User, as: 'ApprovedBy', attributes: ['id', 'firstname', 'lastname', 'email'] },
                { model: User, as: 'RejectedBy', attributes: ['id', 'firstname', 'lastname', 'email'] },
            ]
        });

        return items.map(item => ({
            id: item.id,
            status: item.status,
            comments: item.comments,
            createdAt: item.createdAt,
            owner: item.Owner ? {
                id: item.Owner.id,
                name: `${item.Owner.firstname} ${item.Owner.lastname}`.trim(),
                email: item.Owner.email
            } : null,
            approvedBy: item.ApprovedBy ? {
                id: item.ApprovedBy.id,
                name: `${item.ApprovedBy.firstname} ${item.ApprovedBy.lastname}`.trim(),
                email: item.ApprovedBy.email
            } : null,
            rejectedBy: item.RejectedBy ? {
                id: item.RejectedBy.id,
                name: `${item.RejectedBy.firstname} ${item.RejectedBy.lastname}`.trim(),
                email: item.RejectedBy.email
            } : null,
        }));
    }

    /**
     * Get status history for all requests owned by a user
     */
    static async getStatusHistoryByOwner(ownerId) {
        const items = await StatusTrackling.findAll({
            where: { owner_id: ownerId },
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, as: 'Owner', attributes: ['id', 'firstname', 'lastname', 'email'] },
                { model: User, as: 'ApprovedBy', attributes: ['id', 'firstname', 'lastname', 'email'] },
                { model: User, as: 'RejectedBy', attributes: ['id', 'firstname', 'lastname', 'email'] },
                { model: FacilityRequests, attributes: ['id', 'name', 'request_type', 'status'] },
            ]
        });

        return items.map(item => ({
            id: item.id,
            status: item.status,
            comments: item.comments,
            createdAt: item.createdAt,
            owner: item.Owner ? {
                id: item.Owner.id,
                name: `${item.Owner.firstname} ${item.Owner.lastname}`.trim(),
                email: item.Owner.email
            } : null,
            approvedBy: item.ApprovedBy ? {
                id: item.ApprovedBy.id,
                name: `${item.ApprovedBy.firstname} ${item.ApprovedBy.lastname}`.trim(),
                email: item.ApprovedBy.email
            } : null,
            rejectedBy: item.RejectedBy ? {
                id: item.RejectedBy.id,
                name: `${item.RejectedBy.firstname} ${item.RejectedBy.lastname}`.trim(),
                email: item.RejectedBy.email
            } : null,
            request: item.facility_request || item.FacilityRequest || (item.FacilityRequests ? item.FacilityRequests : null)
                ? {
                    id: item.FacilityRequest?.id || item.facility_request?.id || item.FacilityRequests?.id,
                    name: item.FacilityRequest?.name || item.facility_request?.name || item.FacilityRequests?.name,
                    request_type: item.FacilityRequest?.request_type || item.facility_request?.request_type || item.FacilityRequests?.request_type,
                    status: item.FacilityRequest?.status || item.facility_request?.status || item.FacilityRequests?.status,
                }
                : null,
        }));
    }
    
    /**
     * Create a new facility request
     */
    static async createRequest(requestData, userId, files = []) {
        const transaction = await sequelize.transaction();
        
        try {
            const request = await FacilityRequests.create({
                name: requestData.name,
                level: requestData.level,
                ownership: requestData.ownership,
                authority: requestData.authority,
                role: requestData.role,
                licensed: requestData.license_status || requestData.licensed,
                address: requestData.physical_location || requestData.address,
                latitude: this.sanitizeNumericField(requestData.latitude),
                longitude: this.sanitizeNumericField(requestData.longitude),
                contact_personemail: requestData.contact_personemail,
                contact_personmobile: requestData.contact_personmobile,
                contact_personname: requestData.contact_personname,
                contact_persontitle: requestData.contact_persontitle,
                date_opened: requestData.date_opened,
                bed_capacity: requestData.bed_capacity,
                services: requestData.services || [],
                region_id: requestData.region_id,
                district_id: requestData.district_id,
                subcounty_id: requestData.sub_county_id || requestData.subcounty_id,
                request_type: requestData.request_type,
                requested_by: userId,
                facility_id: requestData.facility_id,
                user_district_id: requestData.user_district_id,
                operating_license: files.find(f => f.fieldname === "operating_license")?.path || null,
                district_letter: files.find(f => f.fieldname === "district_letter")?.path || null,
            }, { transaction });

            const statusComment = requestData.request_type === 'Facility_Update' 
                ? "Facility Update Request" 
                : "Facility Addition Request";

            await StatusTrackling.create({
                request_id: request.id,
                comments: statusComment,
                status: "Request Initiated",
                owner_id: userId,
            }, { transaction });

            await transaction.commit();
            return request;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Create a facility update request
     */
    static async createUpdateRequest(updateData, userId, files = []) {
        const transaction = await sequelize.transaction();
        
        try {
            // Ensure facility_id is provided for update requests
            if (!updateData.facility_id) {
                throw new Error('Facility ID is required for update requests');
            }

            const request = await FacilityRequests.create({
                name: updateData.name,
                level: updateData.level,
                ownership: updateData.ownership,
                authority: updateData.authority,
                role: updateData.role,
                licensed: updateData.license_status || updateData.licensed,
                address: updateData.physical_location || updateData.address,
                latitude: this.sanitizeNumericField(updateData.latitude),
                longitude: this.sanitizeNumericField(updateData.longitude),
                contact_personemail: updateData.contact_personemail,
                contact_personmobile: updateData.contact_personmobile,
                contact_personname: updateData.contact_personname,
                contact_persontitle: updateData.contact_persontitle,
                date_opened: updateData.date_opened,
                bed_capacity: updateData.bed_capacity,
                services: updateData.services || [],
                region_id: updateData.region_id,
                district_id: updateData.district_id,
                subcounty_id: updateData.sub_county_id || updateData.subcounty_id,
                request_type: 'Facility_Update',
                requested_by: userId,
                facility_id: updateData.facility_id, // Reference to existing facility
                user_district_id: updateData.user_district_id,
                operating_license: files.find(f => f.fieldname === "operating_license")?.path || null,
                district_letter: files.find(f => f.fieldname === "district_letter")?.path || null,
                status: 'initiated'
            }, { transaction });

            await StatusTrackling.create({
                request_id: request.id,
                comments: "Facility Update Request Submitted",
                status: "Request Initiated",
                owner_id: userId,
            }, { transaction });

            await transaction.commit();
            return request;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Get paginated requests for planning department
     */
    static async getPlanningRequests(page = 1, limit = 100) {
        const offset = (page - 1) * limit;

        return await FacilityRequests.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { status: 'district_approved' },
                    { status: 'initiated', role: 'district' }
                ]
            },
            limit,
            offset,
            include: [
                { model: AdminUnit, as: 'Region', attributes: ["id", "name"] },
                { model: AdminUnit, as: 'District', attributes: ["id", "name"] },
                { model: AdminUnit, as: 'SubCounty', attributes: ["id", "name"] },
                { model: User, as: 'RequestedBy', attributes: ["id", "firstname", "lastname", "email"] },
            ],
        });
    }

    /**
     * Get paginated requests for admin (all pending requests that can be approved)
     */
    static async getAdminRequests(page = 1, limit = 100) {
        const offset = (page - 1) * limit;

        return await FacilityRequests.findAll({
            where: {
                status: ["initiated", "district_approved", "planning_approved", "moh_verified"]
            },
            limit,
            offset,
            include: [
                { model: AdminUnit, as: 'Region', attributes: ["id", "name"] },
                { model: AdminUnit, as: 'District', attributes: ["id", "name"] },
                { model: AdminUnit, as: 'SubCounty', attributes: ["id", "name"] },
                { model: User, as: 'RequestedBy', attributes: ["id", "firstname", "lastname", "email"] },
            ],
        });
    }

    /**
     * Get requests by user ID
     */
    static async getRequestsByUser(userId) {
        return await FacilityRequests.findAll({
            where: { requested_by: userId },
            include: [
                { model: User, as: 'RequestedBy', attributes: ["id", "firstname", "lastname", "email"] },
            ]
        });
    }

    /**
     * Get requests by For the made by the district BIO STAT
     */
    static async getRequestsByDistrict(districtId, page = 1, limit = 50) {
        const offset = (page - 1) * limit;
        return await FacilityRequests.findAll({
            where: { user_district_id: districtId, status: 'initiated', role: 'district' },
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                { model: User, as: 'RequestedBy', attributes: ["id", "firstname", "lastname", "email"] },
            ]
        });
    }

     /**
     * Get requests by For the made by the Priavte / Public View
     */
    static async getRequestsByPrivate(districtId, page = 1, limit = 50) {
        const offset = (page - 1) * limit;
        return await FacilityRequests.findAll({
            where: { user_district_id: districtId, status: 'initiated', role: 'private' },
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                { model: User, as: 'RequestedBy', attributes: ["id", "firstname", "lastname", "email"] },
            ]
        });
    }

    /**
     * Get a single request by ID with full details
     */
    static async getRequestById(requestId) {
        const request = await FacilityRequests.findByPk(requestId, {
            include: [
                { model: AdminUnit, as: 'Region', attributes: ["id", "name"] },
                { model: AdminUnit, as: 'District', attributes: ["id", "name"] },
                { model: AdminUnit, as: 'SubCounty', attributes: ["id", "name"] },
                { model: User, as: 'RequestedBy', attributes: ["id", "firstname", "lastname", "email", "phoneno"] },
            ],
        });

        if (!request) {
            return null;
        }

        // Get rejection information if the request is rejected
        let rejectionInfo = null;
        if (request.status === 'rejected') {
            const rejectionRecord = await StatusTrackling.findOne({
                where: { 
                    request_id: request.id, 
                    status: 'rejected' 
                },
                include: [
                    { model: User, as: 'RejectedBy', attributes: ["id", "firstname", "lastname", "email"] }
                ],
                order: [['createdAt', 'DESC']]
            });
            
            if (rejectionRecord) {
                rejectionInfo = {
                    rejectedBy: rejectionRecord.RejectedBy,
                    rejectedAt: rejectionRecord.createdAt,
                    comments: rejectionRecord.comments
                };
            }
        }

        // Ensure services is always an array
        if (request.services && typeof request.services === 'string') {
            try {
                request.services = JSON.parse(request.services);
            } catch (e) {
                request.services = [];
            }
        }
        if (!Array.isArray(request.services)) {
            request.services = [];
        }

        // Add rejection info to the response
        const response = request.toJSON();
        if (rejectionInfo) {
            response.rejectionInfo = rejectionInfo;
        }

        return response;
    }

    /**
     * Update a facility request
     */
    static async updateRequest(requestId, updateData) {
        const request = await FacilityRequests.findByPk(requestId);
        if (!request) {
            throw new Error('Request not found');
        }

        return await request.update(updateData);
    }

    /**
     * Delete a facility request
     */
    static async deleteRequest(requestId) {
        const request = await FacilityRequests.findByPk(requestId);
        if (!request) {
            throw new Error('Request not found');
        }

        return await request.destroy();
    }

    /**
     * Determine the next status based on current status
     */
    static getNextStatus(currentStatus) {
        switch (currentStatus) {
            case 'initiated':
                return 'district_approved';
            case 'district_approved':
                return 'moh_verified';
            case 'moh_verified':
                return 'published';
            default:
                return 'published';
        }
    }

    /**
     * Publish facility request to MFL when status is moh_verified
     */
    static async publishToMFL(request, transaction) {
        // For Facility_Update, update existing AdminUnit/MFL instead of creating new ones
        if (request.request_type === 'Facility_Update') {
            // SAFETY: Only allow re-parenting to a valid level-4 (Subcounty) unit.
            // Never attach facilities to district/region directly.
            if (request.facility_id) {
                const facilityUnit = await AdminUnit.findByPk(request.facility_id, { transaction });
                if (!facilityUnit) {
                    throw new Error('Facility admin unit not found');
                }
                if (Number(facilityUnit.level_id) !== 5) {
                    throw new Error('Target admin unit is not a Facility (level 5)');
                }

                // Only accept subcounty_id as the parent. Ignore district/region values for parentage.
                const newParentId = request.subcounty_id || null;

                const adminUnitUpdate = { name: request.name };
                if (newParentId) {
                    const parentUnit = await AdminUnit.findByPk(newParentId, { transaction });
                    if (!parentUnit) {
                        throw new Error('Provided subcounty parent not found');
                    }
                    if (Number(parentUnit.level_id) !== 4) {
                        throw new Error('Facility parent must be a Subcounty (level 4)');
                    }
                    adminUnitUpdate.parent_id = newParentId;
                }

                await AdminUnit.update(adminUnitUpdate, {
                    where: { id: request.facility_id },
                    transaction
                });
            }

            // Update existing MFL record linked to this facility. If not found by facility_id, try by id (as a fallback per integration data).
            let existingMfl = null;
            if (request.facility_id) {
                existingMfl = await Mfl.findOne({ where: { facility_id: request.facility_id }, transaction });
            }

            if (existingMfl) {
                await existingMfl.update({
                    name: request.name,
                    shortname: request.name,
                    longtitude: this.sanitizeNumericField(request.longitude),
                    latitude: this.sanitizeNumericField(request.latitude),
                    // keep existing nhfrid if present
                    nhfrid: existingMfl.nhfrid || null,
                    subcounty_uid: request.subcounty_uid || null,
                    subcounty: request.subcounty || null,
                    district_uid: request.district_uid || null,
                    district: request.district || null,
                    region: request.region || null,
                    level: request.level,
                    ownership: request.ownership,
                    authority: request.authority,
                    status: 'published',
                    subcounty_id: request.subcounty_id,
                    district_id: request.district_id,
                    region_id: request.region_id,
                    licensed: request.licensed || request.license_status || null,
                    address: request.address || request.physical_location || null,
                    contact_personemail: request.contact_personemail || null,
                    contact_personmobile: request.contact_personmobile || null,
                    contact_personname: request.contact_personname || null,
                    contact_persontitle: request.contact_persontitle || null,
                    date_opened: request.date_opened || null,
                    bed_capacity: request.bed_capacity || null,
                    operating_license: request.operating_license || null,
                    district_letter: request.district_letter || null,
                    services: request.services || [],
                    user_district_id: request.user_district_id || null,
                    owner_id: request.requested_by || existingMfl.owner_id || null,
                }, { transaction });

                const result = { facilityAdminUnit: { id: request.facility_id }, nhfrid: existingMfl.nhfrid };
                // Broadcast facility.updated
                const systems = await System.findAll({ where: { is_active: true }, transaction });
                try {
                    await WebhookService.broadcast(systems, 'facility.updated', {
                        facility_id: request.facility_id,
                        nhfrid: existingMfl.nhfrid,
                        name: request.name,
                        level: request.level,
                        ownership: request.ownership,
                        authority: request.authority,
                        district_id: request.district_id,
                        region_id: request.region_id,
                        subcounty_id: request.subcounty_id,
                        timestamp: new Date().toISOString(),
                    });
                } catch (e) {
                    console.error('Webhook broadcast (update) failed:', e.message);
                }
                return result;
            }

            // If no existing MFL record, do not create a new one for updates; just proceed
            return { facilityAdminUnit: { id: request.facility_id }, nhfrid: null };
        }

        // Default behavior for Facility_Addition: create new AdminUnit and MFL
        const facilityAdminUnit = await AdminUnit.create({
            name: request.name,
            parent_id: request.subcounty_id,
            level_id: 5
        }, { transaction });

        const nhfrid = generateFacilityIdentifier();

        const createdMfl = await Mfl.create({
            name: request.name,
            shortname: request.name,
            longtitude: this.sanitizeNumericField(request.longitude),
            latitude: this.sanitizeNumericField(request.latitude),
            nhfrid: nhfrid,
            subcounty_uid: request.subcounty_uid || null,
            subcounty: request.subcounty || null,
            district_uid: request.district_uid || null,
            district: request.district || null,
            region: request.region || null,
            level: request.level,
            ownership: request.ownership,
            authority: request.authority,
            status: 'published',
            facility_id: facilityAdminUnit.id,
            subcounty_id: request.subcounty_id,
            district_id: request.district_id,
            region_id: request.region_id,
            licensed: request.licensed || request.license_status || null,
            address: request.address || request.physical_location || null,
            contact_personemail: request.contact_personemail || null,
            contact_personmobile: request.contact_personmobile || null,
            contact_personname: request.contact_personname || null,
            contact_persontitle: request.contact_persontitle || null,
                    date_opened: request.date_opened || null,
                    bed_capacity: request.bed_capacity || null,
                    operating_license: request.operating_license || null,
                    district_letter: request.district_letter || null,
                    services: request.services || [],
                    user_district_id: request.user_district_id || null,
                    owner_id: request.requested_by || null,
        }, { transaction });

        // Broadcast facility.created
        const systems = await System.findAll({ where: { is_active: true }, transaction });
        try {
            await WebhookService.broadcast(systems, 'facility.created', {
                facility_id: facilityAdminUnit.id,
                nhfrid,
                name: request.name,
                level: request.level,
                ownership: request.ownership,
                authority: request.authority,
                district_id: request.district_id,
                region_id: request.region_id,
                subcounty_id: request.subcounty_id,
                timestamp: new Date().toISOString(),
            });
        } catch (e) {
            console.error('Webhook broadcast (create) failed:', e.message);
        }

        return { facilityAdminUnit, nhfrid };
    }

    /**
     * Approve a facility request
     */
    static async approveRequest(requestId, userId, comments = null) {
        const transaction = await sequelize.transaction();
        let committed = false;
        try {
            const request = await FacilityRequests.findByPk(requestId);
            
            if (!request) {
                throw new Error('Request not found');
            }

            // For district role, skip district_approved and move straight to moh_verified on first approval
            const newStatus = (request.role === 'district' && request.status === 'initiated')
                ? 'moh_verified'
                : this.getNextStatus(request.status);

            // If status is changing from moh_verified to published, we need to publish to MFL
            if (request.status === 'moh_verified' && newStatus === 'published') {
                await this.publishToMFL(request, transaction);

                // Update the request status to published
                await request.update({ status: newStatus }, { transaction });

                // Create status tracking entry with status published
                await StatusTrackling.create({
                    request_id: request.id,
                    comments: comments || 'Request published to MFL',
                    status: newStatus,
                    approved_by: userId,
                    owner_id: request.requested_by,
                }, { transaction });

            } else {
                // For other status transitions, just update status and create tracking entry
                await request.update({ status: newStatus }, { transaction });

                await StatusTrackling.create({
                    request_id: request.id,
                    comments: comments || `Request ${newStatus.replace('_', ' ')}`,
                    status: newStatus,
                    approved_by: userId,
                    owner_id: request.requested_by,
                }, { transaction });
            }

            await transaction.commit();
            committed = true;
        } catch (error) {
            if (!committed) {
                await transaction.rollback();
            }
            throw error;
        }
        // Fetch outside transaction scope
        return await this.getRequestById(requestId);
    }

    /**
     * Reject a facility request
     */
    static async rejectRequest(requestId, userId, comments = null) {
        const transaction = await sequelize.transaction();
        let committed = false;
        try {
            const request = await FacilityRequests.findByPk(requestId);
            
            if (!request) {
                throw new Error('Request not found');
            }

            await request.update({ status: 'rejected' }, { transaction });

            // Create status tracking entry
            await StatusTrackling.create({
                request_id: request.id,
                comments: comments || 'Request rejected',
                status: 'rejected',
                rejected_by: userId,
                owner_id: request.requested_by,
            }, { transaction });

            await transaction.commit();
            // Broadcast facility.deactivated after commit
            try {
                const systems = await System.findAll({ where: { is_active: true } });
                await WebhookService.broadcast(systems, 'facility.deactivated', {
                    facility_id: request.facility_id,
                    name: request.name,
                    reason: comments || deactivationData?.deactivation_reason || null,
                    timestamp: new Date().toISOString(),
                });
            } catch (e) {
                console.error('Webhook broadcast (deactivate) failed:', e.message);
            }
            committed = true;
        } catch (error) {
            if (!committed) {
                await transaction.rollback();
            }
            throw error;
        }
        // Fetch outside transaction scope
        return await this.getRequestById(requestId);
    }

    /**
     * Create a facility deactivation request
     */
    static async createDeactivationRequest(deactivationData, userId, files = []) {
        const transaction = await sequelize.transaction();
        
        try {
            // Validate required fields for deactivation requests
            if (!deactivationData.facility_id) {
                throw new Error('Facility ID is required for deactivation requests');
            }
            if (!deactivationData.name) {
                throw new Error('Facility name is required for deactivation requests');
            }
            if (!deactivationData.level) {
                throw new Error('Facility level is required for deactivation requests');
            }
            if (!deactivationData.ownership) {
                throw new Error('Facility ownership is required for deactivation requests');
            }
            if (!deactivationData.authority) {
                throw new Error('Facility authority is required for deactivation requests');
            }
            if (!deactivationData.region_id) {
                throw new Error('Region ID is required for deactivation requests');
            }
            if (!deactivationData.district_id) {
                throw new Error('District ID is required for deactivation requests');
            }
            if (!deactivationData.sub_county_id) {
                throw new Error('Sub County ID is required for deactivation requests');
            }

            const request = await FacilityRequests.create({
                facility_id: deactivationData.facility_id,
                name: deactivationData.name,
                level: deactivationData.level,
                ownership: deactivationData.ownership,
                authority: deactivationData.authority,
                role: deactivationData.role,
                region_id: deactivationData.region_id,
                district_id: deactivationData.district_id,
                subcounty_id: deactivationData.sub_county_id,
                deactivation_reason: deactivationData.deactivation_reason,
                remarks: deactivationData.remarks,
                request_type: 'Facility_Deactivation',
                requested_by: userId,
                user_district_id: deactivationData.user_district_id,
                status: 'initiated'
            }, { transaction });

            await StatusTrackling.create({
                request_id: request.id,
                comments: "Facility Deactivation Request Submitted",
                status: "Request Initiated",
                owner_id: request.requested_by,
            }, { transaction });

            await transaction.commit();
            return request;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

export default FacilityRequestService;
