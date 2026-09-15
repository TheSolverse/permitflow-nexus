# Industry Rulebook Generation & Quality Audit Report

**Generated Date**: 2026-09-13  
**Cleaned Dataset**: `permitflow_rules_dataset_clean.csv`  
**Target Folder**: `rules_by_industry/`

---

## 1. Cleaned Dataset Metrics

- **Total Unique Rules in Cleaned CSV**: 16
- **Duplicate Rows Removed**: 0
- **Approved Rules Count**: 14
- **Rules Needing Review Count**: 2
- **Unmapped Rules Count**: 0 ✅ (100% Rules Mapped)

---

## 2. Generated Markdown Files Audit

Total Markdown files created: **11 files** (plus Master Index & Generation Report).

| File Path | Industry Scope | Total Rules | Approved | Needs Review | URL Compliance |
|---|---|---|---|---|---|
| `rules_by_industry/all_industries/company_incorporation_rules.md` | All Industries | 7 | 7 | 0 | ✅ Sources Section Only |
| `rules_by_industry/all_industries/llp_registration_rules.md` | All Industries | 1 | 1 | 0 | ✅ Sources Section Only |
| `rules_by_industry/all_industries/gst_registration_rules.md` | All Industries | 1 | 1 | 0 | ✅ Sources Section Only |
| `rules_by_industry/all_industries/epfo_esic_rules.md` | All Industries | 2 | 2 | 0 | ✅ Sources Section Only |
| `rules_by_industry/all_industries/maharashtra_state_rules.md` | All Industries | 2 | 2 | 0 | ✅ Sources Section Only |
| `rules_by_industry/all_industries/startup_recognition_rules.md` | All Industries | 1 | 1 | 0 | ✅ Sources Section Only |
| `rules_by_industry/manufacturing/manufacturing_general_rules.md` | Manufacturing | 16 | 14 | 2 | ✅ Sources Section Only |
| `rules_by_industry/manufacturing/manufacturing_maharashtra_rules.md` | Manufacturing | 4 | 2 | 2 | ✅ Sources Section Only |
| `rules_by_industry/services/services_general_rules.md` | Services | 14 | 14 | 0 | ✅ Sources Section Only |
| `rules_by_industry/trading/trading_general_rules.md` | Trading | 14 | 14 | 0 | ✅ Sources Section Only |
| `rules_by_industry/agriculture/agriculture_general_rules.md` | Agriculture | 14 | 14 | 0 | ✅ Sources Section Only |

---

## 3. Data Quality & URL Compliance Verification

1. **No URLs in Main Rule Body**: Verified. All source URLs are restricted exclusively to the `## Sources` section at the bottom of each Markdown file.
2. **Double Quote & UTF-8 Format**: Verified. `permitflow_rules_dataset_clean.csv` contains exactly 24 columns with proper double-quoting.
3. **Unique Rule IDs**: Verified. All 16 rule IDs are 100% unique.
4. **Service Isolation**: Company Incorporation (`company_incorporation`) and LLP Registration (`llp_registration`) remain strictly separated.
