import { cleanupDatabase } from './databaseCleanup.js';
import { migrateAdminData } from './migrateData.js';

async function run() {
  await cleanupDatabase();
  await migrateAdminData();
}

run().catch(console.error);
