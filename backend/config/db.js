import pkg from 'pg';
import dotenv from 'dotenv';
import { Sequelize, DataTypes, QueryTypes } from "sequelize";

dotenv.config();
const { Pool } = pkg;

// Configure PostgreSQL connection pool
// Validate and coerce environment variables used for DB connection
const pgUser = process.env.POSTGRES_USER || '';
const pgHost = process.env.POSTGRES_HOST || 'localhost';
const pgDatabase = process.env.POSTGRES_DB || '';
const pgPort = process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432;
const pgPassword = process.env.POSTGRES_PASSWORD;

if (typeof pgPassword !== 'string' || pgPassword.length === 0) {
    console.error('❌ POSTGRES_PASSWORD must be set in backend/.env and be a non-empty string');
    console.error('   Hint: create backend/.env using backend/ENVIRONMENT_SETUP.md and set POSTGRES_PASSWORD');
    process.exit(1);
}

const pool = new Pool({
    user: pgUser,
    host: pgHost,
    database: pgDatabase,
    password: pgPassword,
    port: pgPort,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 2000,
});

const connectPool = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Pool connection established successfully.');
        client.release();  // Release the client back to the pool
    } catch (error) {
        console.error('❌ Unable to connect to the database via pool:', error.message);
    }
};

// Configure Sequelize instance
const sequelize = new Sequelize({
    dialect: "postgres",
    host: pgHost,
    port: pgPort,
    database: pgDatabase,
    username: pgUser,
    password: pgPassword,
    logging: false, 
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Function to test Sequelize connection
const connectSequelize = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Sequelize connection established successfully.");
    } catch (error) {
        console.error("❌ Unable to connect to the database via Sequelize:", error.message);
    }
};

// Exporting both connections and utilities
export {
    connectPool,
    connectSequelize,
    pool,
    sequelize,
    Sequelize,
    DataTypes,
    QueryTypes
};