import { sequelize, DataTypes } from "../config/db.js";

const System = sequelize.define("System", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            isHttpUrl(value) {
                try {
                    const parsed = new URL(value);
                    const protocolOk = parsed.protocol === 'http:' || parsed.protocol === 'https:';
                    if (!protocolOk) throw new Error('Only http/https are allowed');
                    const hostname = parsed.hostname;
                    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
                    const hasTld = hostname.includes('.') && !hostname.endsWith('.')
                    if (!isLocal && !hasTld) {
                        throw new Error('Hostname must be localhost, 127.0.0.1, or a domain');
                    }
                } catch (e) {
                    throw new Error('Validation isUrl on url failed');
                }
            }
        }
    },
    api_key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    secret: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    timestamps: true,
    tableName: 'systems',
    schema: 'nhfr'
});

// System.sync({ alter: true });
export default System;


