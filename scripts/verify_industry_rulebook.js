import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, '..');

console.log('--- Verifying Industry Rulebook & Clean CSV Integrity ---');

const cleanCsvPath = path.join(baseDir, 'permitflow_rules_dataset_clean.csv');
const rulesDir = path.join(baseDir, 'rules_by_industry');

// 1. Read clean CSV rules
const rawCleanCsv = fs.readFileSync(cleanCsvPath, 'utf8').trim();
const lines = rawCleanCsv.split('\n').filter(l => l.trim().length > 0);
const dataRows = lines.slice(1);

const cleanRuleIds = new Set();
dataRows.forEach(row => {
  const match = row.match(/^"([^"]+)"/);
  if (match) cleanRuleIds.add(match[1]);
});

console.log(`✓ Clean CSV contains ${cleanRuleIds.size} unique rule IDs.`);

// 2. Scan all generated Markdown files in rules_by_industry/
function getMdFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getMdFiles(filePath));
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  });
  return results;
}

const mdFiles = getMdFiles(rulesDir);
console.log(`✓ Found ${mdFiles.length} Markdown files in rules_by_industry/`);

const mappedRuleIds = new Set();

mdFiles.forEach(filePath => {
  const relPath = path.relative(rulesDir, filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check URL Placement: Main body must NOT contain http:// or https:// before "## Sources"
  const parts = content.split('## Sources');
  const mainBody = parts[0];
  const sourcesSection = parts[1] || '';

  if (/https?:\/\//.test(mainBody)) {
    throw new Error(`File ${relPath} contains HTTP/HTTPS URLs inside the main rule body!`);
  }

  // Extract rule IDs mentioned in file
  const matches = mainBody.match(/`RUL-[A-Z]+-\d+`/g) || [];
  matches.forEach(m => {
    const rid = m.replace(/`/g, '');
    mappedRuleIds.add(rid);
  });
});

console.log(`✓ Mapped Rule IDs across Markdown files: ${mappedRuleIds.size}/${cleanRuleIds.size}`);

// Verify all clean CSV rules are mapped
cleanRuleIds.forEach(rid => {
  if (!mappedRuleIds.has(rid)) {
    throw new Error(`Rule ID ${rid} from clean CSV is not mapped in any Markdown file!`);
  }
});

console.log('=== ALL INDUSTRY RULEBOOK VERIFICATION CHECKS PASSED ===');
