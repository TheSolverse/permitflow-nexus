import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  try {
    const res = await pool.query(`
      DELETE FROM documents 
      WHERE doc_name ILIKE '%yuvanpan%'
         OR doc_name ILIKE '%pan%'
         OR doc_name IN (
           'CTE Approval Copy',
           'Hazardous Waste Authorization',
           'Analysis Report of Effluents',
           'Structural Stability Certificate by Chartered Engineer',
           'Effluent Treatment Plant (ETP) Structural Design',
           'Factory Fire System Hydraulic Calculation Layout',
           'Water Quality Analysis Report (NABL Lab)',
           'MIDC Land Possession Deed',
           'GST Registration Certificate (Form REG-06)',
           'Company PAN Card'
         );
    `);
    console.log(`[CLEANUP] Removed ${res.rowCount} fake/yuvanpan documents from DB.`);

    const remaining = await pool.query('SELECT id, doc_name, category, status FROM documents ORDER BY created_at DESC;');
    console.log('[CLEANUP] Current documents in DB:', remaining.rows);
  } catch (err) {
    console.error('[CLEANUP] Error:', err);
  } finally {
    await pool.end();
  }
}

main();
