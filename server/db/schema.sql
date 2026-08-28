-- PermitFlow Nexus PostgreSQL Database Schema
-- Version 1.0.0

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(32) NOT NULL CHECK (role IN ('ENTREPRENEUR', 'OFFICER', 'ADMIN')),
    department VARCHAR(255),
    designation VARCHAR(255),
    district VARCHAR(128),
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS business_projects (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    business_name VARCHAR(255) NOT NULL,
    sector VARCHAR(128) NOT NULL,
    sub_sector VARCHAR(128),
    investment_range VARCHAR(64) NOT NULL,
    estimated_investment_cr NUMERIC(12, 2),
    proposed_employees INT,
    land_status VARCHAR(64),
    midc_area VARCHAR(128),
    district VARCHAR(128),
    taluka VARCHAR(128),
    power_requirement_kw NUMERIC(10, 2),
    water_requirement_lpd NUMERIC(12, 2),
    hazardous_materials BOOLEAN DEFAULT FALSE,
    project_stage VARCHAR(64) DEFAULT 'PLANNING',
    created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(64) PRIMARY KEY,
    app_id VARCHAR(128) UNIQUE NOT NULL,
    project_id VARCHAR(64) REFERENCES business_projects(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    approval_id VARCHAR(64) NOT NULL,
    approval_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    submission_date DATE NOT NULL,
    sla_deadline_date DATE NOT NULL,
    sla_days_remaining INT NOT NULL,
    status VARCHAR(64) NOT NULL,
    officer_assigned VARCHAR(255),
    risk_score INT DEFAULT 20,
    remarks TEXT,
    timeline JSONB DEFAULT '[]'::jsonb,
    queries JSONB DEFAULT '[]'::jsonb,
    document_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES business_projects(id) ON DELETE CASCADE,
    doc_name VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    file_url TEXT,
    file_size VARCHAR(32),
    upload_date DATE,
    status VARCHAR(64) NOT NULL DEFAULT 'Valid',
    expiry_date DATE,
    ai_validation_result JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inspections (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES business_projects(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    inspection_type VARCHAR(128) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(32),
    officer_name VARCHAR(255) NOT NULL,
    officer_contact VARCHAR(64),
    status VARCHAR(64) NOT NULL,
    rubric_checklist JSONB DEFAULT '[]'::jsonb,
    outcome_summary TEXT,
    report_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compliance_tasks (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES business_projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    statutory_act VARCHAR(255),
    due_date DATE NOT NULL,
    days_left INT NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('VALID', 'DUE_SOON', 'OVERDUE', 'COMPLETED')),
    renewal_fee VARCHAR(64),
    renewal_period_months INT DEFAULT 12,
    action_required TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incentive_schemes (
    id VARCHAR(64) PRIMARY KEY,
    scheme_name VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    department VARCHAR(255) NOT NULL,
    eligible_sectors JSONB DEFAULT '[]'::jsonb,
    eligible_taluka_categories JSONB DEFAULT '[]'::jsonb,
    min_investment_cr NUMERIC(10, 2) DEFAULT 0,
    max_benefit VARCHAR(255) NOT NULL,
    description TEXT,
    application_status VARCHAR(64) DEFAULT 'Eligible',
    deadline DATE,
    official_url VARCHAR(512),
    official_apply_url VARCHAR(512),
    official_info_url VARCHAR(512)
);

CREATE TABLE IF NOT EXISTS noc_applications (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES business_projects(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    noc_type VARCHAR(64) NOT NULL,
    noc_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    applied_date DATE NOT NULL,
    status VARCHAR(64) NOT NULL,
    urgency VARCHAR(32) DEFAULT 'NORMAL',
    sla_days_left INT DEFAULT 15,
    technical_parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,
    queries JSONB DEFAULT '[]'::jsonb,
    provisional_cert_url VARCHAR(512),
    final_cert_url VARCHAR(512),
    qr_code_data TEXT,
    issued_date DATE,
    certificate_id VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS joint_inspections (
    id VARCHAR(64) PRIMARY KEY,
    noc_application_id VARCHAR(64) REFERENCES noc_applications(id) ON DELETE SET NULL,
    project_id VARCHAR(64) REFERENCES business_projects(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(32) NOT NULL,
    attending_departments JSONB NOT NULL DEFAULT '[]'::jsonb,
    officer_names JSONB NOT NULL DEFAULT '[]'::jsonb,
    inspection_location VARCHAR(512) NOT NULL,
    rubric_checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(32) DEFAULT 'SCHEDULED',
    outcome_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp VARCHAR(32) NOT NULL,
    "user" VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL,
    action VARCHAR(255) NOT NULL,
    application_id VARCHAR(128),
    previous_status VARCHAR(64),
    new_status VARCHAR(64),
    ip_address VARCHAR(64) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp VARCHAR(32) NOT NULL,
    type VARCHAR(32) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS approval_rules (
    id VARCHAR(64) PRIMARY KEY,
    sector VARCHAR(128) NOT NULL,
    scale VARCHAR(64) NOT NULL,
    location_zone VARCHAR(128) NOT NULL,
    required_approvals JSONB NOT NULL DEFAULT '[]'::jsonb,
    conditional_approvals JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for optimized querying
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON business_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_compliance_project_id ON compliance_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_noc_project_id ON noc_applications(project_id);
CREATE INDEX IF NOT EXISTS idx_joint_insp_project_id ON joint_inspections(project_id);
