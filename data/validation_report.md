# Regulatory Data Pipeline Audit & Validation Report

**Generated Date**: 2026-09-13  
**Authority Scope**: Ministry of Corporate Affairs (MCA), DPIIT Startup India, CBIC GST, EPFO/ESIC, Govt of Maharashtra (MAITRI & Labour Dept)  
**Total Sources Registry Records**: 14  
**Total Conditional Rules Built**: 12  
**Total Test Cases Built**: 8

---

## 1. Source Document Verification Summary

All 14 official source documents have been verified, stored in `data/sources/`, extracted into `data/extracted/`, and indexed with unique SHA-256 checksums in `data/source_registry.csv`.

| Source ID | Authority | Title | Official URL Status | Checksum (SHA-256) |
|---|---|---|---|---|
| **SRC-MCA-001** | Ministry of Corporate Affairs (MCA), Government of India | Companies Act, 2013 - Section 7: Incorporation of Company | Verified (200 OK) | `a3f402c3531f...` |
| **SRC-MCA-002** | Ministry of Corporate Affairs (MCA), Government of India | Companies (Incorporation) Rules, 2014 & SPICe+ Amendments | Verified (200 OK) | `8ea4882946b5...` |
| **SRC-MCA-003** | Ministry of Corporate Affairs (MCA), Government of India | SPICe+ (INC-32) Part A and Part B Instruction Kit & User Guide | Verified (200 OK) | `59bd328f4bd7...` |
| **SRC-MCA-004** | Ministry of Corporate Affairs (MCA), Government of India | e-MoA (INC-33) and e-AoA (INC-34) E-Form Specifications and Linking Rules | Verified (200 OK) | `f21719c187d8...` |
| **SRC-MCA-005** | Ministry of Corporate Affairs (MCA), Government of India | AGILE-PRO-S (INC-35) Application Guide for GSTIN, EPFO, ESIC, Bank Account & Professional Tax | Verified (200 OK) | `91ee5f8ac43c...` |
| **SRC-MCA-006** | Ministry of Corporate Affairs (MCA), Government of India | Frequently Asked Questions (FAQs) on SPICe+ and Company Incorporation | Verified (200 OK) | `3826352c84dc...` |
| **SRC-MCA-007** | Ministry of Corporate Affairs (MCA), Government of India | Limited Liability Partnership Act, 2008 - Incorporation & Partners | Verified (200 OK) | `0c73dccaa394...` |
| **SRC-MCA-008** | Ministry of Corporate Affairs (MCA), Government of India | Limited Liability Partnership Rules, 2009 & FiLLiP Amendment Rules | Verified (200 OK) | `b92c2579bbf2...` |
| **SRC-MCA-009** | Ministry of Corporate Affairs (MCA), Government of India | RUN-LLP & Form FiLLiP Instruction Kit for LLP Incorporation and Form 3 Rules | Verified (200 OK) | `e24054b7f868...` |
| **SRC-DPIIT-010** | Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce & Industry | DPIIT Recognition Eligibility and Online Application Guidelines for Startups | Verified (200 OK) | `79cada5e81c7...` |
| **SRC-GST-011** | Central Board of Indirect Taxes and Customs (CBIC), Ministry of Finance | Central Goods and Services Tax Rules, 2017 - Chapter III: Registration Rules | Verified (200 OK) | `482c8fb6cd59...` |
| **SRC-LBR-012** | Employees Provident Fund Organisation (EPFO) & ESIC, Ministry of Labour & Employment | EPFO & ESIC Mandatory Registration Criteria under Shram Suvidha & MCA AGILE-PRO-S Portal | Verified (200 OK) | `08cc87976acf...` |
| **SRC-MAH-013** | Industry, Energy and Labour Department, Government of Maharashtra | Maharashtra Industry Trade and Investment Facilitation Cell (MAITRI) Act & Portal Guidelines | Verified (200 OK) | `4451d503ab3b...` |
| **SRC-MAH-014** | Labour Department, Government of Maharashtra | Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017 | Verified (200 OK) | `3572eac9eb3c...` |

---

## 2. Universal Rule Audit & Compliance

> [!NOTE]
> All rules have been audited to ensure zero unanchored or invalid universal declarations.

- **Missing Source URLs**: 0 rules. Every rule references an official `source_url` and explicit `source_section`.
- **Universal Aadhaar / PAN Rule Violation**: Corrected. Rules specify conditional triggers (`subscriber_citizenship === 'indian_resident'` vs. `foreign_national`).
- **Hardcoded Fees / Timelines**: Removed flat ₹1,500 / 5-day fees. Rules document specific MCA fee schedules (e.g., ₹0 MCA Govt Fee under SPICe+ for capital ≤ ₹15L; ₹500 FiLLiP fee for LLP).
- **Service Separation**: MCA Company Incorporation (`RUL-MCA-001`) and MCA LLP Registration (`RUL-MCA-002`) are strictly isolated as independent statutory workflows.

---

## 3. Rules Requiring Manual Review (`needs_review`)

The following state or sector-specific rules are flagged for manual legal verification upon state policy changes:
1. **Professional Tax Registration Thresholds (State-varying)**: Currently covered under AGILE-PRO-S for Maharashtra & WB.
2. **Special Sector Approvals (RBI / IRDAI / FSSAI)**: Requiring secondary clearance rules when main business activity falls in regulated categories.

---

## 4. Test Suite Matrix Validation

The 8 test scenarios in `data/test_cases.json` validate proper rule activation and negative rule suppression across diverse company types, ownership statuses, and geographic jurisdictions. All test cases evaluate to 100% expected rule alignment.
