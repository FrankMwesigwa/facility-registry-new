import Mfl from "../models/mfl.js";
import AdminUnit from "../models/adminunit.js";
import User from "../models/users.js";

class MflService {
    static async create(data) {
        return await Mfl.create(data);
    }

    static async findByOwnerId(ownerId, page = 1, limit = 50) {
        const offset = (page - 1) * limit;
        return await Mfl.findAll({
            where: { owner_id: ownerId },
            limit,
            offset,
            order: [["name", "ASC"]],
            include: [
                { model: AdminUnit, as: "Region", attributes: ["id", "name"] },
                { model: AdminUnit, as: "District", attributes: ["id", "name"] },
                { model: AdminUnit, as: "SubCounty", attributes: ["id", "name"] },
                { model: AdminUnit, as: "Facility", attributes: ["id", "name"] },
                { model: User, as: "OwnerId", attributes: ["id", "firstname", "lastname", "email"] },
            ],
        });
    }

    static async findByUserDistrictId(userDistrictId, page = 1, limit = 50) {
        const offset = (page - 1) * limit;
        return await Mfl.findAll({
            where: { user_district_id: userDistrictId },
            limit,
            offset,
            order: [["name", "ASC"]],
            include: [
                { model: AdminUnit, as: "Region", attributes: ["id", "name"] },
                { model: AdminUnit, as: "District", attributes: ["id", "name"] },
                { model: AdminUnit, as: "SubCounty", attributes: ["id", "name"] },
                { model: AdminUnit, as: "Facility", attributes: ["id", "name"] },
                { model: User, as: "OwnerId", attributes: ["id", "firstname", "lastname", "email"] },
            ],
        });
    }

    static async findAll(page = 1, limit = 50) {
        const offset = (page - 1) * limit;
        return await Mfl.findAll({
            limit,
            offset,
            order: [["name", "ASC"]],
            include: [
                { model: AdminUnit, as: "Region", attributes: ["id", "name"] },
                { model: AdminUnit, as: "District", attributes: ["id", "name"] },
                { model: AdminUnit, as: "SubCounty", attributes: ["id", "name"] },
                { model: AdminUnit, as: "Facility", attributes: ["id", "name"] },
                { model: User, as: "OwnerId", attributes: ["id", "firstname", "lastname", "email"] },
            ],
        });
    }

    static async findById(facilityId) {
        return await Mfl.findOne({
            where: { facility_id: facilityId },
            include: [
                { model: AdminUnit, as: "Region", attributes: ["id", "name"] },
                { model: AdminUnit, as: "District", attributes: ["id", "name"] },
                { model: AdminUnit, as: "SubCounty", attributes: ["id", "name"] },
                { model: AdminUnit, as: "Facility", attributes: ["id", "name"] },
                { model: User, as: "OwnerId", attributes: ["id", "firstname", "lastname", "email"] },
            ],
        });
    }

    static async update(facilityId, data) {
        const record = await Mfl.findOne({ where: { facility_id: facilityId } });
        if (!record) {
            throw new Error("MFL record not found");
        }
        return await record.update(data);
    }

    static async remove(facilityId) {
        const record = await Mfl.findOne({ where: { facility_id: facilityId } });
        if (!record) {
            throw new Error("MFL record not found");
        }
        await record.destroy();
        return true;
    }
}

export default MflService;


