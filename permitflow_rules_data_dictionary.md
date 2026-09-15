# Data Dictionary: PermitFlow Nexus Regulatory Rules Dataset

This data dictionary documents the structure, schema, field definitions, and governance rules for `permitflow_rules_dataset.csv`.

---

## 1. Purpose of the Dataset

The **PermitFlow Nexus Regulatory Rules Dataset** provides a source-controlled, machine-readable repository of statutory business registration and incorporation requirements in India. It serves as:
1. Evidence of official regulatory compliance for jury presentation and audit.
2. The core dataset for PermitFlow Nexus's **Conditional Rules Engine** and **RAG (Retrieval-Augmented Generation)** knowledge system.

---

## 2. Column Definitions & Allowed Values

| # | Column Name | Data Type | Mandatory | Allowed Values / Pattern | Description |
|---|---|---|---|---|---|
| 1 | `rule_id` | String | Yes | `RUL-[DEPT]-[0-9]{3}` | Unique canonical identifier for each regulatory rule. |
| 2 | `category` | String | Yes | `incorporation`, `llp_registration`, `startup_recognition`, `gst`, `labour_registration`, `state_registration`, `sector_licence`, `document_requirement`, `form_requirement`, `fee`, `timeline`, `eligibility` | High-level regulatory classification. |
| 3 | `service` | String | Yes | `company_incorporation`, `llp_registration`, `dpiit_startup_recognition`, `gst_registration`, `epfo_registration`, `esic_registration`, `maharashtra_registration`, `sector_specific_registration` | Associated statutory government service workflow. |
| 4 | `entity_type` | String | Yes | `private_limited_company`, `public_company`, `opc`, `llp`, `partnership`, `startup`, `all`, `unknown` | Type of legal entity to which the rule applies. |
| 5 | `jurisdiction` | String | Yes | `India`, `Maharashtra`, specific state, `all` | Geographic jurisdiction governing the rule. |
| 6 | `industry_or_sector` | String | Yes | `all`, `manufacturing`, `services`, `food`, etc. | Business sector or industry classification. |
| 7 | `rule_title` | String | Yes | Text string | Concise, human-readable title suitable for UI display. |
| 8 | `rule_description` | String | Yes | Text string | Comprehensive explanation based strictly on source text. |
| 9 | `applicability_condition` | String | Yes | Logical Expression (e.g. `IF premises_type equals rented`) | Boolean trigger condition evaluating when the rule activates. |
| 10 | `required_document` | String | No | Semicolon-separated string | List of physical or digital documents required. |
| 11 | `accepted_alternatives` | String | No | Semicolon-separated string | Acceptable alternative documents (e.g. Voter ID / Passport). |
| 12 | `required_form` | String | No | Semicolon-separated string | Statutory e-forms or filing formats required. |
| 13 | `mandatory` | String | Yes | `true`, `false`, `needs_review` | Indicates if the requirement is legally non-negotiable when triggered. |
| 14 | `conditional` | String | Yes | `true`, `false` | Indicates if rule activation depends on applicant inputs. |
| 15 | `authority` | String | Yes | Text string | Official government authority enforcing the rule. |
| 16 | `official_source_title` | String | Yes | Text string | Official title of the law, act, rule, or instruction kit. |
| 17 | `official_source_url` | String | Yes | Valid HTTPS URL | Direct official government URL pointing to the source document. |
| 18 | `source_section_or_page` | String | Yes | Text string | Section, rule number, or page citation in official text. |
| 19 | `effective_from` | String | Yes | YYYY-MM-DD | Date when the statutory rule came into force. |
| 20 | `effective_to` | String | No | YYYY-MM-DD or empty string | Sunset date if retired; empty string if currently active. |
| 21 | `last_verified` | String | Yes | YYYY-MM-DD | Most recent verification date against official sources. |
| 22 | `status` | String | Yes | `approved`, `draft`, `needs_review`, `retired` | Verification status of the rule in the repository. |
| 23 | `confidence` | String | Yes | `high`, `medium`, `low` | Legal confidence rating based on source authority. |
| 24 | `notes` | String | No | Text string | Fee breakdown, exceptions, or practical guidance notes. |

---

## 3. Representation of Conditions & Requirements

1. **Conditional Triggers**: Every rule is conditional. For example:
   - Rule `RUL-MCA-003` triggers *only if* `premises_occupancy_type == 'rented'`.
   - Rule `RUL-MCA-006` triggers *only if* `subscriber_citizenship == 'foreign_national'`.
2. **Separation of Services**: Company Incorporation (`SPICe+`) and LLP Registration (`FiLLiP`) are kept as independent service categories.
3. **Double-Quote CSV Format**: Every value is enclosed in double quotes (`"..."`) with internal double quotes escaped as `""`.

---

## 4. Production Review Notice

> [!WARNING]
> While all `approved` rules are verified against official MCA, GST, and State publications, rules marked as `needs_review` (such as sector-specific pollution clearances) depend on dynamic plant capacity and pollution index scores. Legal counsel or domain officers should re-verify `needs_review` items prior to production automated approvals.
