import Mfl from "../models/mfl.js";
import AdminUnit from "../models/adminunit.js";
import User from "../models/users.js";
import { sequelize, QueryTypes } from "../config/db.js";
import { Op } from "sequelize";

class MflService {
    static async create(data) {
        return await Mfl.create(data);
    }

    static async getStats() {
        const [
            totalFacilities,
            government,
            pnfp,
            privateOwned,
            functional,
            nonFunctional,
        ] = await Promise.all([
            Mfl.count(),
            Mfl.count({ where: { ownership: "GOV" } }),
            Mfl.count({ where: { ownership: "PNFP" } }),
            Mfl.count({ where: { ownership: "PFP" } }),
            Mfl.count({ where: { status: "Functional" } }),
            Mfl.count({ where: { status: { [Op.in]: ["Non-Functional", "Non Functional", "Nonfunctional", "Non functional"] } } }),
        ]);

        return {
            totalFacilities,
            government,
            pnfp,
            private: privateOwned,
            functional,
            nonFunctional,
        };
    }

    static async getLevelOwnershipSummary() {
        const rows = await sequelize.query(
            `
            SELECT 
                f."level" as "level",
                COUNT(DISTINCT CASE WHEN f.ownership = 'GOV' THEN f.id END) AS "GOV",
                COUNT(DISTINCT CASE WHEN f.ownership = 'PFP' THEN f.id END) AS "PFP",
                COUNT(DISTINCT CASE WHEN f.ownership = 'PNFP' THEN f.id END) AS "PNFP"
            FROM nhfr.mfl f
            GROUP BY f."level"
            ORDER BY f."level" ASC;
            `,
            { type: QueryTypes.SELECT }
        );
        return rows;
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

    static async findAll(page = 1, limit = 50, query = {}) {
        const offset = (page - 1) * limit;

        const where = {};
        // Text search by facility name or NHFR/UID
        if (query.search) {
            const like = `%${query.search.trim()}%`;
            where[Op.or] = [
                { name: { [Op.iLike]: like } },
                { shortname: { [Op.iLike]: like } },
                { nhfrid: { [Op.iLike]: like } },
                { uid: { [Op.iLike]: like } },
            ];
        }

        // Exact match filters if provided
        if (query.level) where.level = query.level;
        if (query.ownership) where.ownership = query.ownership;
        if (query.authority) where.authority = query.authority;
        if (query.region_id) where.region_id = parseInt(query.region_id);
        if (query.district_id) where.district_id = parseInt(query.district_id);
        if (query.sub_county_id) where.subcounty_id = parseInt(query.sub_county_id);
        if (query.status) where.status = query.status;

        const { rows, count } = await Mfl.findAndCountAll({
            where,
            limit,
            offset,
            order: [
                [{ model: AdminUnit, as: "Region" }, "name", "ASC"],
                [{ model: AdminUnit, as: "District" }, "name", "ASC"],
                ["name", "ASC"]
            ],
            include: [
                { model: AdminUnit, as: "Region", attributes: ["id", "name"] },
                { model: AdminUnit, as: "District", attributes: ["id", "name"] },
                { model: AdminUnit, as: "SubCounty", attributes: ["id", "name"] },
                { model: AdminUnit, as: "Facility", attributes: ["id", "name"] },
                { model: User, as: "OwnerId", attributes: ["id", "firstname", "lastname", "email"] },
            ],
            distinct: true,
        });

        return { rows, count };
    }

    static async findAllForExport(query = {}) {
        const where = {};
        if (query.search) {
            const like = `%${query.search.trim()}%`;
            where[Op.or] = [
                { name: { [Op.iLike]: like } },
                { shortname: { [Op.iLike]: like } },
                { nhfrid: { [Op.iLike]: like } },
                { uid: { [Op.iLike]: like } },
            ];
        }

        if (query.level) where.level = query.level;
        if (query.ownership) where.ownership = query.ownership;
        if (query.authority) where.authority = query.authority;
        if (query.region_id) where.region_id = parseInt(query.region_id);
        if (query.district_id) where.district_id = parseInt(query.district_id);
        if (query.sub_county_id) where.subcounty_id = parseInt(query.sub_county_id);
        if (query.status) where.status = query.status;

        const rows = await Mfl.findAll({
            where,
            order: [
                [{ model: AdminUnit, as: "Region" }, "name", "ASC"],
                [{ model: AdminUnit, as: "District" }, "name", "ASC"],
                ["name", "ASC"]
            ],
            include: [
                { model: AdminUnit, as: "Region", attributes: ["id", "name"] },
                { model: AdminUnit, as: "District", attributes: ["id", "name"] },
                { model: AdminUnit, as: "SubCounty", attributes: ["id", "name"] },
                { model: AdminUnit, as: "Facility", attributes: ["id", "name"] },
                { model: User, as: "OwnerId", attributes: ["id", "firstname", "lastname", "email"] },
            ],
            distinct: true,
        });

        return rows;
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

    static async findDetails(identifier) {
        const where = {};
        // Numeric: try both id and facility_id
        if (/^\d+$/.test(String(identifier))) {
            where[Op.or] = [
                { id: parseInt(identifier) },
                { facility_id: parseInt(identifier) },
            ];
        } else {
            // String: try nhfrid and uid
            where[Op.or] = [
                { nhfrid: String(identifier) },
                { uid: String(identifier) },
            ];
        }

        return await Mfl.findOne({
            where,
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

    /**
     * Upload data from nhfr.facilityuploads joined with nhfr.facility_hierarchy
     * into nhfr.mfl. Missing optional fields default to null. The required
     * owner_id is injected via parameter. Uses upsert semantics per row based
     * on underlying DB constraints (expects a unique key such as uid).
     *
     * @param {number} ownerId - Owner user id for inserted/updated rows
     * @returns {Promise<{inserted: number, updated: number, total: number}>}
     */
    static async uploadFromFacilityUploads(ownerId) {
        if (!ownerId) {
            throw new Error("ownerId is required to upload MFL data");
        }

        const rows = await sequelize.query(
            `
            SELECT
              f.uid,
              f."name",
              f.shortname,
              f.longtitude,
              f.latitude,
              f.nhfrid,
              f.subcounty_uid,
              f.subcounty,
              f.district_uid,
              f.district,
              f.region,
              f."level",
              f.ownership,
              f.authority,
              f.status,
              h.facility_id,
              h.subcounty_id,
              h.district_id,
              h.region_id
            FROM nhfr.facilityuploads f
            LEFT JOIN nhfr.facility_hierarchy h
              ON lower(btrim(f.shortname))  = lower(btrim(h.facility))
             AND lower(btrim(f.subcounty))  = lower(btrim(h.subcounty))
             AND lower(btrim(f.district))   = lower(btrim(h.district))
             AND lower(btrim(f.region))     = lower(btrim(h.region))
            ORDER BY f.subcounty, f.district, f.shortname
            `,
            { type: QueryTypes.SELECT }
        );

        if (!rows || rows.length === 0) {
            return { inserted: 0, updated: 0, total: 0 };
        }

        let inserted = 0;
        let updated = 0;

        await sequelize.transaction(async (t) => {
            for (const r of rows) {
                const payload = {
                    uid: r.uid ?? null,
                    name: r.name ?? null,
                    shortname: r.shortname ?? null,
                    longtitude: r.longtitude ?? null,
                    latitude: r.latitude ?? null,
                    nhfrid: r.nhfrid ?? null,
                    subcounty_uid: r.subcounty_uid ?? null,
                    subcounty: r.subcounty ?? null,
                    district_uid: r.district_uid ?? null,
                    district: r.district ?? null,
                    region: r.region ?? null,
                    level: r.level ?? null,
                    ownership: r.ownership ?? null,
                    authority: r.authority ?? null,
                    status: r.status ?? null,
                    facility_id: r.facility_id ?? null,
                    subcounty_id: r.subcounty_id ?? null,
                    district_id: r.district_id ?? null,
                    region_id: r.region_id ?? null,
                    owner_id: ownerId,
                };

                // Try update by uid if present, else create
                if (payload.uid) {
                    const [count] = await Mfl.update(payload, { where: { uid: payload.uid }, transaction: t });
                    if (count === 0) {
                        await Mfl.create(payload, { transaction: t });
                        inserted += 1;
                    } else {
                        updated += 1;
                    }
                } else {
                    await Mfl.create(payload, { transaction: t });
                    inserted += 1;
                }
            }
        });

        return { inserted, updated, total: rows.length };
    }
}

export default MflService;


