# Regulatory Data Pipeline & Rules Engine Guide

This repository contains the source-controlled regulatory data pipeline for PermitFlow Nexus, providing authoritative Indian statutory rules for company incorporation, LLP registration, DPIIT startup recognition, GST, EPFO/ESIC, and Maharashtra state registrations.

---

## 📂 Directory Structure

```
data/
├── source_registry.csv                      # Primary CSV index of all government sources
├── schema.sql                               # Supabase / PostgreSQL DDL schema & indexes
├── validation_report.md                     # Data quality, audit, & URL check report
├── test_cases.json                          # 8 validation test scenarios for rules engine
├── README.md                                # Pipeline documentation & import guide
├── rules/
│   ├── company_and_llp_rules.json           # Complete conditional rules dataset (JSON)
│   └── company_and_llp_rules.csv            # Supabase importable rules dataset (CSV)
├── extracted/                               # Clean extracted text files with metadata headers
└── sources/                                 # Preserved original official source documents
    ├── mca/
    │   ├── company/                         # Companies Act 2013, SPICe+ Kits, e-MoA/AoA, FAQs
    │   └── llp/                             # LLP Act 2008, LLP Rules, FiLLiP Instruction Kit
    ├── startup_india/                       # DPIIT Recognition Guidelines G.S.R. 127(E)
    ├── gst/                                 # CGST Registration Rules Chapter III
    ├── labour/                              # EPFO & ESIC Portal Registration Instructions
    └── maharashtra/                         # MAITRI Act & Maharashtra Shops Act 2017
```

---

## 🚀 How to Review & Import to Supabase

### Step 1: Execute Schema DDL
Open your Supabase SQL Editor and run the contents of [`data/schema.sql`](file:///c:/SIH2026/permitflow-nexus/data/schema.sql) to create tables, indexes, and RLS read policies.

### Step 2: Import Source Registry CSV
Navigate to **Supabase Studio > Table Editor > `regulatory_sources`** and click **Import CSV**. Select [`data/source_registry.csv`](file:///c:/SIH2026/permitflow-nexus/data/source_registry.csv).

### Step 3: Import Rules CSV
Navigate to **Table Editor > `regulatory_rules`** and click **Import CSV**. Select [`data/rules/company_and_llp_rules.csv`](file:///c:/SIH2026/permitflow-nexus/data/rules/company_and_llp_rules.csv).

---

## 🧪 Running Rules Engine Test Suite

Run the pipeline test runner script using Node.js:
```bash
node scripts/build_data_pipeline.js
```

This will verify file integrity, calculate SHA-256 checksums, and validate rule conditions against the 8 test scenarios in `data/test_cases.json`.
