-- ==============================================================================
-- PERMITFLOW NEXUS: REGULATORY RULES ENGINE SUPABASE / POSTGRESQL DDL SCHEMA
-- ==============================================================================

-- 1. Regulatory Sources Registry Table
CREATE TABLE IF NOT EXISTS public.regulatory_sources (
    source_id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL,
    authority TEXT NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    official_url TEXT NOT NULL,
    local_file_name TEXT NOT NULL,
    publication_date DATE,
    effective_date DATE,
    downloaded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    last_verified_at DATE NOT NULL DEFAULT CURRENT_DATE,
    checksum VARCHAR(64) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active'
);

-- 2. Regulatory Rules Table
CREATE TABLE IF NOT EXISTS public.regulatory_rules (
    rule_id VARCHAR(50) PRIMARY KEY,
    service VARCHAR(50) NOT NULL, -- 'company_incorporation', 'llp_registration', etc.
    entity_type VARCHAR(50) NOT NULL, -- 'private_limited_company', 'llp', 'opc', etc.
    country VARCHAR(50) NOT NULL DEFAULT 'India',
    state VARCHAR(50) NOT NULL DEFAULT 'all',
    requirement_type VARCHAR(30) NOT NULL, -- 'document', 'form', 'eligibility', etc.
    requirement_name TEXT NOT NULL,
    description TEXT NOT NULL,
    mandatory BOOLEAN NOT NULL DEFAULT true,
    accepted_alternatives JSONB DEFAULT '[]'::jsonb,
    forms JSONB DEFAULT '[]'::jsonb,
    authority TEXT NOT NULL,
    source_id VARCHAR(50) REFERENCES public.regulatory_sources(source_id),
    source_url TEXT NOT NULL,
    source_section TEXT NOT NULL,
    effective_from DATE,
    effective_to DATE,
    last_verified DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'approved',
    notes TEXT
);

-- 3. Rule Trigger Conditions Table
CREATE TABLE IF NOT EXISTS public.rule_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id VARCHAR(50) NOT NULL REFERENCES public.regulatory_rules(rule_id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    operator VARCHAR(20) NOT NULL, -- 'equals', 'not_equals', 'in', 'greater_than', etc.
    field_value TEXT NOT NULL
);

-- 4. Test Suite Executions Table
CREATE TABLE IF NOT EXISTS public.rule_test_cases (
    test_case_id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    user_answers JSONB NOT NULL,
    expected_rules JSONB NOT NULL,
    expected_documents JSONB NOT NULL,
    expected_forms JSONB NOT NULL,
    rules_that_must_not_trigger JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning fast querying by rules engine & RAG
CREATE INDEX IF NOT EXISTS idx_regulatory_rules_service ON public.regulatory_rules(service);
CREATE INDEX IF NOT EXISTS idx_regulatory_rules_entity_type ON public.regulatory_rules(entity_type);
CREATE INDEX IF NOT EXISTS idx_regulatory_rules_state ON public.regulatory_rules(state);
CREATE INDEX IF NOT EXISTS idx_rule_conditions_rule_id ON public.rule_conditions(rule_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.regulatory_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulatory_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_test_cases ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active rules
CREATE POLICY "Allow public read access to regulatory rules" ON public.regulatory_rules
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow public read access to sources" ON public.regulatory_sources
    FOR SELECT USING (status = 'active');
