# PermitFlow Nexus 🏢⚡

> **One platform for approvals, compliance, and growth.**  
> An intelligent approval and compliance management platform for entrepreneurs and industrial units in Maharashtra.

🌐 **Live Deployment**: [https://permitflow-nexus-solverse-one.vercel.app/](https://permitflow-nexus-solverse-one.vercel.app/)  
📁 **GitHub Organization Repository**: [https://github.com/TheSolverse/permitflow-nexus](https://github.com/TheSolverse/permitflow-nexus)

---

## 📌 Project Purpose

Entrepreneurs establishing or expanding manufacturing, food processing, chemical, pharmaceutical, or textile units in Maharashtra often struggle with identifying required approvals from multiple departments (MPCB, MIDC, DISH, Fire Services, FSSAI, MSEDCL), document errors, missed renewal deadlines, and complex government incentives.

**PermitFlow Nexus** simplifies this end-to-end journey—from initial project registration and dynamic approval checklist generation to AI document validation, SLA application tracking, joint site inspection scheduling, proactive compliance renewal reminders, risk-based guidance, and state incentive discovery.

---

## 🚀 Key Features & Modules

### 🌐 1. Public Portal & Authentication
- **Polished Landing Page**: Hero section, live impact statistics, 6 core feature cards, 7-step interactive workflow, and benefits breakdown for entrepreneurs & government officers.
- **Multilingual Support**: Interactive language switcher for **English**, **Marathi (मराठी)**, and **Hindi (हिंदी)**.
- **Theme Support**: Dark mode & Light mode toggle.
- **Role-Based Login & Signup**: One-click demo access buttons for **Entrepreneur**, **Government Officer**, and **Platform Admin**.

### 💼 2. Entrepreneur Module
1. **Entrepreneur Dashboard**: Overview metric cards (Total Approvals, Approved, Under Review, Action Required, Renewals), journey completion progress meter, Recharts status breakdown, pending actions alerts, upcoming deadlines, and incentive highlights.
2. **Business Profile / New Project Wizard**: 4-step multi-step form capturing basic business details, project scale (investment range, employee count, hazardous material handling, construction status), Maharashtra location (Districts, MIDCs, Land type), and review summary.
3. **Smart Approval Checklist**: Personalized checklist powered by the rules engine with Table, Card, and **Interactive Dependency Graph** views showing prerequisite chains.
4. **Document Centre & AI Verification**: Upload area supporting PDF/JPG/PNG. Simulated AI OCR scanner pre-screen report detecting **Valid**, **Missing**, **Expired**, **Name Mismatch**, and **Blurry / Unreadable** documents with actionable fix recommendations.
5. **Unified Application Tracker**: Searchable tracker with filters, SLA countdown timers, assigned officer tracking, and detailed event history.
6. **Application Details & Query Response Desk**: Complete application view, submitted document attachments, status timeline, officer query viewer, and response document submission form.
7. **Inspection Planner**: Table & cards for site audits with **Joint Department Inspection** tags (coordinating MPCB + DISH + Fire Services on a single date), officer contact details, document checklist to keep ready, and attendance confirmation button.
8. **Compliance Calendar**: List & Calendar views for upcoming renewals, filings, statutory fees, reminder dispatch log (90, 60, 30, 7, 1 day prior), and **Compliance Health % score** (e.g. 82%).
9. **Incentive Finder**: Recommends eligible Maharashtra state subsidies (Package Scheme of Incentives PSI 2019/2024, 100% Electricity Duty Exemption, CMEGP, Women Entrepreneur Support, Green Solar Unit Subsidy).
10. **Approval Risk Score Engine**: Transparent 0-100 risk score dial with low/medium/high gauge, breakdown across 4 risk factors (30% Sector, 20% Location, 25% Compliance History, 25% Document Quality), actionable improvement guide, and advisory disclaimer.
11. **PermitFlow AI Assistant**: Multilingual chatbot with quick question chips ("Which approvals do I need?", "Why was my application rejected?", "What documents for Fire NOC?") providing contextual answers based on active project details.

### 🏛️ 3. Government Officer Module
1. **Officer Dashboard**: Queue metrics (Total Received, Pending Review, Queries Raised, Inspections Due, SLA Breaches), Recharts department performance chart, bottleneck alerts, and priority review queue.
2. **Application Review Desk**: Applicant profile audit, document review with AI OCR validation results, applicant risk score inspection, query template issue form, joint/single inspection scheduler, and approve/reject decision tools with audit trail logging.
3. **Officer Query Management**: Query communication logs, predefined query templates, due date settings, and response verification.
4. **Inspection Management Desk**: Site visit scheduler, joint audit organizer, and field inspection report upload.
5. **SLA & Analytics Dashboard**: District-wise application breakdown (Pune, Thane, Chhatrapati Sambhajinagar, Palghar, Nagpur, Nashik), document error frequency chart, and SLA compliance percentages.

### ⚙️ 4. Platform Admin Module
1. **Admin Dashboard**: System metrics (Users, Projects, Officers, Rules), user role registry table, and system health status.
2. **Rules Engine Management**: Interactive rule builder defining sector conditions, statutory SLAs, fees, prerequisite dependencies, and risk weights.
3. **Notification Centre**: Template manager for In-App, Email, SMS, and WhatsApp alerts.
4. **Audit Logs**: Tamper-proof log trail recording user actions, timestamps, status transitions, application IDs, and IP addresses.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + Custom HSL Palette (Maharashtra Navy `#0A192F`, Saffron `#FF9933`, Emerald `#10B981`)
- **Icons**: Lucide React (`lucide-react`)
- **Charts**: Recharts (`recharts`)
- **Backend API**: Node.js + Express API (`server/server.ts`)
- **State & Persistence**: React Context API (`src/context/AppContext.tsx`) with LocalStorage fallback & REST server sync

---

## 🔑 One-Click Demo Credentials

You can log in instantly using the demo buttons on the Login page or using these credentials:

| Role | Demo User Name | Email | Organization / Department |
| :--- | :--- | :--- | :--- |
| **Entrepreneur** | Rahul Sharma | `rahul.sharma@apexfoods.in` | Apex Foods & Spices Pvt Ltd (Chakan MIDC, Pune) |
| **Entrepreneur** | Priya Deshmukh | `priya@sahyadritextiles.com` | Sahyadri Eco Textiles LLP (Tarapur MIDC, Palghar) |
| **Government Officer** | Dr. V. K. Patil | `vk.patil@mpcb.gov.in` | Maharashtra Pollution Control Board (MPCB) |
| **Government Officer** | Er. Suresh Shinde | `suresh.shinde@midcindia.org` | MIDC Infrastructure & Building Approval |
| **Government Officer** | Inspector A. B. Kadam | `ab.kadam@dish.maharashtra.gov.in` | Directorate of Industrial Safety & Health (DISH) |
| **Platform Admin** | MAITRI Admin | `admin@permitflownexus.gov.in` | State Single Window Portal |

---

## 📦 Installation & Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Run Backend Express Server (Optional)
```bash
npx tsx server/server.ts
```
Express API will start at `http://localhost:5000`.

### 4. Build Production Bundle
```bash
npm run build
```

---

## ⚖️ Advisory Disclaimer
*PermitFlow Nexus is a working demonstration platform built with simulated Maharashtra department workflows, mock AI OCR logic, and seed datasets. It is designed so real government single-window APIs (such as MAITRI) can be integrated seamlessly in production.*
