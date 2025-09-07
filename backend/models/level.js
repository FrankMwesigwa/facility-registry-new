import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Level = sequelize.define('Level', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  level_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: { min: 1 },
  },
}, {
  tableName: 'admin_levels',
  timestamps: true,
  schema: 'nhfr',
});

export default Level;
