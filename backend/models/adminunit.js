import { sequelize, DataTypes } from '../config/db.js';
import Level from './level.js';

const AdminUnit = sequelize.define('AdminUnit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    level_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'admin_levels',
            key: 'id',
        },
    }
}, {
    tableName: 'admin_units',
    timestamps: true,
    schema: 'nhfr',
});

AdminUnit.belongsTo(Level, { foreignKey: 'level_id' });
AdminUnit.belongsTo(AdminUnit, { as: 'parent', foreignKey: 'parent_id' });
AdminUnit.hasMany(AdminUnit, { as: 'children', foreignKey: 'parent_id' });

export default AdminUnit;