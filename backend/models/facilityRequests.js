import { sequelize, DataTypes } from "../config/db.js";
import User from "./users.js";
import AdminUnit from "./adminunit.js";

const FacilityRequests = sequelize.define("FacilityRequests",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ownership: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        authority: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        licensed: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        contact_personemail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contact_personmobile: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contact_personname: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contact_persontitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date_opened: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        bed_capacity: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        services: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "initiated"
        },
        operating_license: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        council_minutes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        district_letter: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        request_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        support_document: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_district_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        requested_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: "id",
            },
        },
        region_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        district_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        subcounty_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        facility_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        deactivation_reason: {
            type: DataTypes.STRING,
            allowNull: true
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "facility_requests",
        timestamps: true,
        schema: "nhfr",
    }
);

// FacilityRequests.sync({ alter: true });
FacilityRequests.belongsTo(User, { as: 'RequestedBy', foreignKey: 'requested_by' });
FacilityRequests.belongsTo(AdminUnit, { as: 'Region', foreignKey: 'region_id' });
FacilityRequests.belongsTo(AdminUnit, { as: 'District', foreignKey: 'district_id' });
FacilityRequests.belongsTo(AdminUnit, { as: 'SubCounty', foreignKey: 'subcounty_id' });

export default FacilityRequests;