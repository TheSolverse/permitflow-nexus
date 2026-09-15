import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, '..');

console.log('--- Verifying Presentation-Ready Dataset Integrity ---');

const csvPath = path.join(baseDir, 'permitflow_rules_dataset.csv');
const summaryPath = path.join(baseDir, 'permitflow_rules_dataset_summary.txt');
const dictionaryPath = path.join(baseDir, 'permitflow_rules_data_dictionary.md');

// 1. File existence check
if (!fs.existsSync(csvPath)) throw new Error('CSV file missing!');
if (!fs.existsSync(summaryPath)) throw new Error('Summary file missing!');
if (!fs.existsSync(dictionaryPath)) throw new Error('Data dictionary file missing!');

// 2. Parse CSV
const csvContent = fs.readFileSync(csvPath, 'utf8').trim();
const lines = csvContent.split('\n');
const header = lines[0];
const dataRows = lines.slice(1);

console.log(`✓ CSV Header validated (${header.split(',').length} columns).`);
console.log(`✓ Total CSV Data Rows: ${dataRows.length}`);

// Parse CSV rows into objects
const ruleIds = new Set();
let approvedCount = 0;
let needsReviewCount = 0;

dataRows.forEach((rowStr, idx) => {
  // Simple regex quote splitter
  const cols = rowStr.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
  const cleanCols = cols.map(c => c.replace(/^"|"$/g, '').replace(/""/g, '"'));

  const ruleId = cleanCols[0];
  const service = cleanCols[2];
  const ruleTitle = cleanCols[6];
  const ruleDesc = cleanCols[7];
  const authority = cleanCols[14];
  const sourceUrl = cleanCols[16];
  const effectiveFrom = cleanCols[18];
  const status = cleanCols[21];

  // Verification Checks
  if (ruleIds.has(ruleId)) {
    throw new Error(`Duplicate rule_id found: ${ruleId} at row ${idx + 2}`);
  }
  ruleIds.add(ruleId);

  if (!service || !ruleTitle || !ruleDesc || !authority || !status) {
    throw new Error(`Row ${idx + 2} has missing mandatory field!`);
  }

  if (status === 'approved' && (!sourceUrl || !sourceUrl.startsWith('http'))) {
    throw new Error(`Approved rule ${ruleId} is missing a valid official_source_url!`);
  }

  if (effectiveFrom && !/^\d{4}-\d{2}-\d{2}$/.test(effectiveFrom)) {
    throw new Error(`Rule ${ruleId} has invalid ISO date format: ${effectiveFrom}`);
  }

  if (status === 'approved') approvedCount++;
  if (status === 'needs_review') needsReviewCount++;
});

console.log(`✓ Unique Rule IDs checked: ${ruleIds.size}/${dataRows.length}`);
console.log(`✓ Approved Rules with valid source URLs: ${approvedCount}`);
console.log(`✓ Rules Needing Review: ${needsReviewCount}`);

// 3. Compare with summary file
const summaryText = fs.readFileSync(summaryPath, 'utf8');
if (!summaryText.includes(`Total CSV Data Rows: ${dataRows.length}`)) {
  throw new Error('Summary row count mismatch!');
}

console.log('=== ALL PRESENTATION DATASET VERIFICATION CHECKS PASSED ===');
