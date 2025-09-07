import { sequelize, DataTypes } from '../config/db.js';

const HealthService = sequelize.define('HealthService', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['VHT', 'HC II', 'HC III', 'HC IV', 'General Hospital', 'Regional Referral', 'Specialist and National Referral Hospital']]
        }
    },
    no_of_beds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    health_care_services: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    }
}, {
    tableName: 'services',
    timestamps: true,
    schema: 'nhfr',
});

export default HealthService;