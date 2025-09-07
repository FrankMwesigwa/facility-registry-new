import { sequelize, DataTypes } from "../config/db.js";
import FacilityRequests from "./facilityRequests.js";
import User from "./users.js";

const StatusTrackling = sequelize.define(
    "StatusTrackling",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        request_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "facility_requests",
                key: "id",
            },
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        comments: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
        },
        approved_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
        },
        rejected_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
        },
    },
    {
        tableName: "status_trackling",
        timestamps: true,
        schema: "nhfr",
    }
);

StatusTrackling.belongsTo(FacilityRequests, { foreignKey: "request_id" });
StatusTrackling.belongsTo(User, { as: "Owner", foreignKey: "owner_id" });
StatusTrackling.belongsTo(User, { as: "ApprovedBy", foreignKey: "approved_by" });
StatusTrackling.belongsTo(User, { as: "RejectedBy", foreignKey: "rejected_by" });

export default StatusTrackling;