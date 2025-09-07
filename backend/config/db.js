import pkg from 'pg';
import dotenv from 'dotenv';
import { Sequelize, DataTypes, QueryTypes } from "sequelize";

dotenv.config();
const { Pool } = pkg;

// Configure PostgreSQL connection pool
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
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
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
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