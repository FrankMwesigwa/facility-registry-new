import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Pool } = pkg;

const runMigration = async () => {
    try {
        console.log('🔄 Running database migration for deactivation fields...');
        
        // Create a basic pool connection (you may need to adjust these credentials)
        const pool = new Pool({
            user: process.env.POSTGRES_USER || 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            database: process.env.POSTGRES_DB || 'facility_registry',
            password: process.env.POSTGRES_PASSWORD || 'password',
            port: Number(process.env.POSTGRES_PORT) || 5432,
        });
        
        // Read the migration SQL file
        const migrationPath = path.join(process.cwd(), 'migrations', 'add_deactivation_fields.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        // Execute the migration
        await pool.query(migrationSQL);
        
        console.log('✅ Migration completed successfully!');
        console.log('   - Added deactivation_reason column');
        console.log('   - Added remarks column');
        
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.log('💡 Make sure your database is running and credentials are correct');
        console.log('   You can set database credentials as environment variables:');
        console.log('   POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD');
        process.exit(1);
    }
};

runMigration();
