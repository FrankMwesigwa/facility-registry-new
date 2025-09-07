import { sequelize, DataTypes } from "../config/db.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'public'
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        isEmail: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    organisation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneno: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    verification_code: {
        type: DataTypes.STRING(6),
        allowNull: true,
    },
    verification_code_expires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reset_token_expires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    district_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { 
    timestamps: true, 
    tableName: 'users', 
    schema: 'nhfr',
    instanceMethods: {
        isVerificationCodeExpired() {
            if (!this.verification_code_expires) {
                return true;
            }
            return new Date() > this.verification_code_expires;
        },
        isResetTokenExpired() {
            if (!this.reset_token_expires) {
                return true;
            }
            return new Date() > this.reset_token_expires;
        }
    }
});

// User.sync({ alter: true });
export default User;