import fs from 'fs';
import path from 'path';
import { pool } from './config/db.js';

const migrationsDir = './src/database/migrations';

async function runMigrations() {
    try {
        console.log('🔄 Running database migrations...');

        // Get all SQL files in migrations directory
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Sort to ensure consistent order

        const client = await pool.connect();

        for (const file of migrationFiles) {
            const filePath = path.join(migrationsDir, file);
            console.log(`📄 Executing migration: ${file}`);

            const sql = fs.readFileSync(filePath, 'utf8');

            // Split SQL into individual statements (by semicolon)
            const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

            for (const statement of statements) {
                if (statement.trim()) {
                    await client.query(statement);
                }
            }

            console.log(`✅ Migration ${file} executed successfully`);
        }

        client.release();
        console.log(' All migrations completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    }
}

runMigrations();
