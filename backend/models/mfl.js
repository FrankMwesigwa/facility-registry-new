import { sequelize, DataTypes } from "../config/db.js";
import User from "./users.js";
import AdminUnit from "./adminunit.js";

const Mfl = sequelize.define(
    "Mfl",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        uid: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "name",
        },
        shortname: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        longtitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        nhfrid: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        subcounty_uid: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        subcounty: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        district_uid: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        district: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        region: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        level: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ownership: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        authority: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        facility_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        subcounty_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        district_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        region_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        licensed: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
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
        operating_license: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        district_letter: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        services: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        user_district_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: "id",
            },
        },
    },
    {
        tableName: "mfl",
        schema: "nhfr",
        timestamps: true,
    }
);

Mfl.belongsTo(User, { as: 'OwnerId', foreignKey: 'owner_id' });
Mfl.belongsTo(AdminUnit, { as: 'Region', foreignKey: 'region_id' });
Mfl.belongsTo(AdminUnit, { as: 'District', foreignKey: 'district_id' });
Mfl.belongsTo(AdminUnit, { as: 'SubCounty', foreignKey: 'subcounty_id' });
Mfl.belongsTo(AdminUnit, { as: 'Facility', foreignKey: 'facility_id' });

export default Mfl;


