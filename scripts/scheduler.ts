import cron from 'node-cron';
import dotenv from 'dotenv';

// Load environment variables if running locally
dotenv.config({ path: '.env.local' });
dotenv.config();

const CRON_SECRET = process.env.CRON_SECRET;
const SYNC_INTERVAL = process.env.SYNC_INTERVAL_CRON || '0 */6 * * *';
const API_URL = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/sync/repos`
  : 'http://localhost:3000/api/sync/repos';

console.log(`Starting scheduler for GitHub Sync...`);
console.log(`Schedule: ${SYNC_INTERVAL}`);
console.log(`Target API: ${API_URL}`);

cron.schedule(SYNC_INTERVAL, async () => {
  console.log(`[${new Date().toISOString()}] Triggering GitHub sync...`);
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`[${new Date().toISOString()}] Sync successful:`, data);
    } else {
      console.error(`[${new Date().toISOString()}] Sync failed with status ${response.status}:`, data);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Failed to trigger sync endpoint:`, error);
  }
});
