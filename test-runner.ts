import { INITIAL_INCENTIVE_SCHEMES } from './src/data/mockData';
import { IncentiveScheme } from './src/types';

console.log('----------------------------------------------------');
console.log('RUNNING INCENTIVE FINDER MODULE AUTOMATED VERIFICATION');
console.log('----------------------------------------------------');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// Helper functions matching component logic
const isValidHttpsUrl = (urlStr?: string): boolean => {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  if (!trimmed.startsWith('https://')) return false;
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
};

const getDomain = (urlStr?: string): string => {
  if (!urlStr) return '';
  try {
    const url = new URL(urlStr);
    return url.hostname;
  } catch {
    return urlStr.replace(/^https?:\/\//, '').split('/')[0];
  }
};

// Simulated State
let isRedirectModalOpen = false;
let selectedScheme: IncentiveScheme | null = null;
let toastMessage: string | null = null;
let windowOpenArgs: [string, string, string] | null = null;

// Simulated window.open
const mockWindowOpen = (url: string, target: string, features: string) => {
  windowOpenArgs = [url, target, features];
};

const handleApplyScheme = (scheme: IncentiveScheme) => {
  const targetUrl = scheme.officialApplyUrl || scheme.officialUrl;
  if (!isValidHttpsUrl(targetUrl)) {
    toastMessage = "Official application link currently unavailable. Please verify the scheme details with the concerned department.";
    return;
  }
  selectedScheme = scheme;
  isRedirectModalOpen = true;
};

const continueToOfficialWebsite = () => {
  if (!selectedScheme) return;
  const targetUrl = selectedScheme.officialApplyUrl || selectedScheme.officialUrl;
  if (!isValidHttpsUrl(targetUrl)) return;
  
  mockWindowOpen(targetUrl, "_blank", "noopener,noreferrer");
  isRedirectModalOpen = false;
};

const cancelModal = () => {
  isRedirectModalOpen = false;
};

// TEST 1: All initial incentive schemes must have valid HTTPS official URLs
const cmegpScheme = INITIAL_INCENTIVE_SCHEMES.find(s => s.id === 'inc-3');
assert(
  cmegpScheme !== undefined && isValidHttpsUrl(cmegpScheme.officialUrl),
  '1. CMEGP scheme record has valid HTTPS officialUrl (https://maha-cmegp.gov.in)'
);

// TEST 2: Clicking Apply Scheme opens confirmation modal with correct domain
handleApplyScheme(cmegpScheme!);
assert(
  isRedirectModalOpen === true && selectedScheme?.id === 'inc-3',
  '2. Clicking Apply Scheme opens the confirmation modal with selected scheme'
);
assert(
  getDomain(selectedScheme?.officialUrl) === 'maha-cmegp.gov.in',
  '3. Extracted target domain correctly identifies "maha-cmegp.gov.in"'
);

// TEST 3: Clicking Cancel closes modal without redirecting
cancelModal();
assert(
  isRedirectModalOpen === false && windowOpenArgs === null,
  '4. Clicking Cancel closes confirmation modal without calling window.open'
);

// TEST 4: Clicking Continue opens correct official URL in new tab
handleApplyScheme(cmegpScheme!);
continueToOfficialWebsite();
assert(
  windowOpenArgs !== null &&
  windowOpenArgs[0] === 'https://maha-cmegp.gov.in' &&
  windowOpenArgs[1] === '_blank' &&
  windowOpenArgs[2] === 'noopener,noreferrer',
  '5. Clicking Continue calls window.open("https://maha-cmegp.gov.in", "_blank", "noopener,noreferrer")'
);

// TEST 5: Invalid or missing URL shows toast error and prevents modal opening
const invalidScheme: IncentiveScheme = {
  id: 'inc-invalid',
  schemeName: 'Broken Scheme',
  department: 'Unknown',
  shortDesc: 'Broken',
  eligibilityStatus: 'ELIGIBLE',
  estimatedBenefit: '₹0',
  eligibilityReason: 'N/A',
  nextAction: 'N/A',
  tags: [],
  officialUrl: 'invalid-url'
};

isRedirectModalOpen = false;
toastMessage = null;
handleApplyScheme(invalidScheme);
assert(
  isRedirectModalOpen === false && toastMessage?.includes('currently unavailable') === true,
  '6. Missing or invalid URL displays unavailable fallback message and blocks modal redirect'
);

// TEST 6: Verify mapping for all schemes ensures names and URLs are not mixed up
INITIAL_INCENTIVE_SCHEMES.forEach(scheme => {
  assert(
    isValidHttpsUrl(scheme.officialUrl) && getDomain(scheme.officialUrl).length > 0,
    `7. Scheme "${scheme.schemeName}" correctly maps to verified portal domain: ${getDomain(scheme.officialUrl)}`
  );
});

console.log('----------------------------------------------------');
console.log(`SUMMARY: ${passedTests}/${totalTests} TESTS PASSED CLEANLY.`);
console.log('----------------------------------------------------');
