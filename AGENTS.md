# PermitFlow NEXUS — Architectural Rules & Developer Guidelines

This document defines the core architecture, design patterns, security constraints, and code conventions for **PermitFlow NEXUS** (Maharashtra Single Window Clearance System for Industrial Approvals).

---

## 1. System Architecture Overview

PermitFlow NEXUS is a dual-tier full-stack application designed to streamline industrial clearances, statutory permissions, NOC issuances, and regulatory compliance across Maharashtra.

### Core Stack
- **Frontend**: React 19 + TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Recharts
- **Backend API**: Express 5 on Node.js (Port 5000), TypeScript execution via `tsx`
- **Database Layer**: Supabase PostgreSQL (`@supabase/supabase-js`, `pg` pool) with synchronized in-memory fallback for resilient offline development
- **AI / OCR Engines**: Tesseract OCR engine + local statutory heuristic parser + multi-lingual Maharashtra Regulatory RAG engine
- **Testing & Quality**: Vitest 4, Testing Library, Oxlint, TypeScript (`tsc`)

---

## 2. Role-Based Access & Data Isolation

The system supports strict role-based access control (RBAC) across three distinct user categories:

### A. Entrepreneur (`ENTREPRENEUR`)
- **Isolation Rule**: Can only view and modify projects, applications, documents, compliance tasks, and queries where `userId` matches the active session.
- **Key Workflows**:
  - Smart Checklist Generation (sector, scale, investment, and land zone based)
  - Document Centre upload & AI OCR pre-validation
  - Application Tracker & query response submission
  - NOC Application submission (Fire, MPCB, DISH)
  - Joint Inspection scheduling & Compliance Locker renewals

### B. Department Officer (`OFFICER_*` / `OFFICER`)
- **Isolation Rule**: Officers are scoped to their respective department jurisdiction:
  - `OFFICER_MPCB`: Maharashtra Pollution Control Board (Water/Air acts, CTE/CTO)
  - `OFFICER_FIRE`: Maharashtra Fire & Rescue Services (Provisional & Final Fire NOC)
  - `OFFICER_DISH`: Directorate of Industrial Safety & Health (Factories Act Form 1)
  - `OFFICER_MIDC`: Maharashtra Industrial Development Corporation (Building Plan Sanction)
  - `OFFICER_MSEDCL`: Maharashtra State Electricity Distribution Co.
  - `OFFICER_FSSAI`: Food Safety and Standards Authority
- **Key Workflows**:
  - Department Officer Desk inbox
  - Application Review Modal (Approve, Reject, Request Clarification)
  - Raising technical queries and reviewing entrepreneur responses
  - Conducting Joint Inspections & submitting rubric checklists
  - Granting Provisional and Final NOC certificates with digital verification QR codes

### C. System Administrator (`ADMIN`)
- Unrestricted cross-departmental oversight, audit logging, system diagnostics, and regulatory approval rules configuration.

---

## 3. Code Conventions & Standards

### TypeScript & Purity
1. **Strict Types**: Always define explicit interfaces in [src/types/index.ts](file:///d:/gokul/PermitFlow%20NEXUS/permitflow-nexus/src/types/index.ts) or [server/types.ts](file:///d:/gokul/PermitFlow%20NEXUS/permitflow-nexus/server/types.ts). Avoid using `any` whenever specific types are available.
2. **React 19 Immutability**:
   - Define helper callbacks (`useCallback`) before referencing them in effects.
   - Do not call impure functions like `Date.now()` directly inside rendering calculations; use effects or handlers.
   - Maintain exhaustive dependency arrays in `useEffect` and `useMemo`.

### State Management & Context
- State is managed via `AppContext` ([src/context/AppContext.tsx](file:///d:/gokul/PermitFlow%20NEXUS/permitflow-nexus/src/context/AppContext.tsx)).
- Remote API requests and fallback mock data must remain synchronized: API helpers in [src/services/api.ts](file:///d:/gokul/PermitFlow%20NEXUS/permitflow-nexus/src/services/api.ts) should gracefully handle offline backend scenarios.

---

## 4. Document & OCR Verification Standards

- **Strict Whitelist Matching**: Document names and categories must strictly conform to recognized statutory certifications (PAN, Aadhaar, Registered Lease Deed, Utility Bill, Owner NOC, MoA/AoA, GST REG-06, Fire Safety NOC, MPCB Consent, DISH Factory Licence).
- **Anti-Fabrication Principles**: Never invent artificial registration numbers or fake document dates. If text is illegible or not detected, return `'NOT DETECTED'` and flag with `'Blurry / Unreadable'`.
- **Pre-Validation Bundle**: Application bundles must verify completeness (no missing mandatory documents), active validity (no expired certificates), and exact legal entity name matching before submission is permitted.

---

## 5. Automated Testing & Verification

Every major feature modification must pass the following test cycle:
1. **Typecheck**: `npx tsc --noEmit` (0 errors required)
2. **Lint**: `npm run lint`
3. **Unit Tests**: `npm test`
4. **Integration Test Suite**: `npm run test:features` (or `npx tsx scripts/test_all_features.ts`)
5. **Production Build**: `npm run build`
