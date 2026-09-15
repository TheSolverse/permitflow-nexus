# Trading & Wholesale/Retail Business Registration Rules

**Industry**: Trading  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  

Applicable incorporation, GSTIN threshold, labour, and state shop registration rules for wholesale, retail, and e-commerce trading entities.

---

### Rule 1: Registered Office Rented Premises Proof Package

**Rule ID**: `RUL-MCA-003`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: private_limited_company  
**Condition**: IF premises_occupancy_type equals rented  
**Mandatory**: true | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
When the proposed registered office is rented, the applicant must provide a notarized/registered Lease Deed or Rent Agreement, owner NOC, and utility bill not older than two months.

**Required Documents**:  
  - Registered Lease Deed or Rent Agreement
  - Owner No Objection Certificate (NOC)
  - Utility Bill (Electricity, Gas, Water, Telephone) < 2 months old

**Accepted Alternatives**:  
  - Lease Deed
  - Rent Agreement with Rent Paid Receipt

**Required Forms**:  
  - SPICe+ Part B Attachment
  - Form FiLLiP Attachment

**Authority**: Ministry of Corporate Affairs (MCA), Government of India  
**Notes**: Utility bill (electricity, gas, water, mobile) must be in the property owner name and strictly less than 2 months old.

---

### Rule 2: Registered Office Owned Premises Proof Package

**Rule ID**: `RUL-MCA-004`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: private_limited_company  
**Condition**: IF premises_occupancy_type equals owned  
**Mandatory**: true | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
When the proposed registered office is owned by the company or promoter, property title deed or municipal tax receipt must be submitted along with a recent utility bill.

**Required Documents**:  
  - Property Title Deed or Municipal Tax Paid Receipt
  - Owner NOC (if owned by promoter individually)
  - Utility Bill < 2 months old

**Accepted Alternatives**:  
  - Property Title Deed
  - Municipal Tax Paid Receipt
  - Registry Conveyance Deed

**Required Forms**:  
  - SPICe+ Part B Attachment
  - Form FiLLiP Attachment

**Authority**: Ministry of Corporate Affairs (MCA), Government of India  
**Notes**: Owner NOC is required if property is owned by individual promoter or director in their personal capacity.

---

### Rule 3: Indian Resident Subscriber Identity & Address Proof

**Rule ID**: `RUL-MCA-005`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: private_limited_company  
**Condition**: IF subscriber_citizenship equals indian_resident  
**Mandatory**: true | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
Indian resident subscribers and directors must submit mandatory PAN card along with identity proof (Voter ID, Passport, Driving License, or Aadhaar) and address proof (Bank statement, Electricity bill, Mobile bill < 2 months old).

**Required Documents**:  
  - PAN Card of Directors/Subscribers
  - Identity Proof
  - Address Proof (< 2 months old)

**Accepted Alternatives**:  
  - Voter ID
  - Passport
  - Driving License
  - Aadhaar Card

**Required Forms**:  
  - SPICe+ Part B Director Proofs
  - Form FiLLiP Attachments

**Authority**: Ministry of Corporate Affairs (MCA), Government of India  
**Notes**: PAN is mandatory for Indian nationals residing in India. Aadhaar is acceptable but not exclusively mandated.

---

### Rule 4: Foreign Subscriber Passport & Apostilled Verification Proofs

**Rule ID**: `RUL-MCA-006`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: private_limited_company  
**Condition**: IF subscriber_citizenship equals foreign_national  
**Mandatory**: true | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
Foreign subscribers or directors must submit valid Passport copy notarized and apostilled in the home country (or embassy certified), along with apostilled proof of residential address.

**Required Documents**:  
  - Apostilled / Consular Certified Foreign Passport
  - Apostilled Proof of Residential Address
  - Physical MoA and AoA Subscriber Sheet

**Accepted Alternatives**:  
  - Apostilled Foreign Passport
  - Consular Certified Identity Card

**Required Forms**:  
  - SPICe+ Part B Attachment
  - Physical MoA/AoA Attachment

**Authority**: Ministry of Corporate Affairs (MCA), Government of India  
**Notes**: Physical MoA and AoA are mandatory when subscribers include foreign individuals or foreign body corporates.

---

### Rule 5: Corporate Shareholder Board Resolution & Certificate of Incorporation

**Rule ID**: `RUL-MCA-007`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: private_limited_company  
**Condition**: IF has_corporate_shareholder equals true  
**Mandatory**: true | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
When a body corporate is a subscriber, it must submit Board Resolution authorizing investment & appointment of authorized representative, Certificate of Incorporation, and MoA/AoA of holding corporate.

**Required Documents**:  
  - Board Resolution of Corporate Shareholder
  - Certificate of Incorporation of Holding Corporate
  - Identity & Address Proof of Authorized Representative

**Accepted Alternatives**:  
  - Board Resolution with Seal & Certified Copy of Charter

**Required Forms**:  
  - SPICe+ Part B Attachment
  - Form FiLLiP Attachment

**Authority**: Ministry of Corporate Affairs (MCA), Government of India  
**Notes**: If holding company is foreign, board resolution and incorporation documents must be apostilled/consular certified.

---

### Rule 6: One Person Company (OPC) Member Eligibility & Nominee Consent (Form INC-3)

**Rule ID**: `RUL-MCA-008`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: opc  
**Condition**: IF entity_type equals opc  
**Mandatory**: true | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
One Person Company (OPC) member must be a natural person who is an Indian citizen. A nominee consent in Form INC-3 along with nominee identity/address proof is mandatory.

**Required Documents**:  
  - Form INC-3 Written Consent of Nominee
  - Identity & Address Proof of Sole Member and Nominee

**Accepted Alternatives**:  
  - Voter ID
  - Passport
  - Driving License
  - Aadhaar Card

**Required Forms**:  
  - SPICe+ Part B
  - Form INC-3 Nominee Consent

**Authority**: Ministry of Corporate Affairs (MCA), Government of India  
**Notes**: Nominee must be an Indian citizen. NRI residency requirement reduced to 120 days under Companies Amendment Rules 2021.

---

### Rule 7: AGILE-PRO-S Linked GSTIN Application During Incorporation

**Rule ID**: `RUL-GST-009`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: private_limited_company  
**Condition**: IF apply_gst_during_incorporation equals true  
**Mandatory**: false | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
Opting for GST registration during company incorporation via AGILE-PRO-S form (INC-35). Requires primary authorized signatory declaration and bank account nomination.

**Required Documents**:  
  - Photo of Primary Authorized Signatory
  - Board Resolution / Letter of Authorization for GST Signatory
  - Proof of Principal Place of Business

**Accepted Alternatives**:  
  - Post-Incorporation Form GST REG-01

**Required Forms**:  
  - AGILE-PRO-S (INC-35)
  - Form GST REG-01

**Authority**: Central Board of Indirect Taxes and Customs (CBIC) & MCA  
**Notes**: GST registration is optional during incorporation unless business activity triggers mandatory registration under Section 24 CGST Act.

---

### Rule 8: SPICe+ Part A & Part B Integrated Company Incorporation Application

**Rule ID**: `RUL-MCA-001`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: private_limited_company  
**Condition**: IF entity_type equals private_limited_company AND incorporation_channel equals spice_plus  
**Mandatory**: true | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
Filing of integrated web application SPICe+ Part A for name reservation and SPICe+ Part B for incorporation, DIN allotment, PAN, TAN, EPFO, ESIC, Bank Account, and Professional Tax.

**Required Documents**:  
  - Digital Signature Certificate (DSC) Class 3
  - Proof of Identity and Address of Directors
  - Registered Office Lease Deed or Ownership Deed

**Accepted Alternatives**:  
  - Voter ID
  - Passport
  - Driving License
  - Aadhaar Card

**Required Forms**:  
  - SPICe+ Part A (INC-32)
  - SPICe+ Part B (INC-32)
  - e-MoA (INC-33)
  - e-AoA (INC-34)
  - AGILE-PRO-S (INC-35)
  - INC-9

**Authority**: Ministry of Corporate Affairs (MCA), Government of India  
**Notes**: Zero MCA Government Fee applies for companies with Authorized Capital up to Rs. 15,00,000 under SPICe+ Part B scheme. State Stamp Duty remains payable.

---

### Rule 9: EPFO Employee Provident Fund Mandatory Threshold Registration

**Rule ID**: `RUL-LBR-013`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: private_limited_company  
**Condition**: IF employee_count greater_than 19  
**Mandatory**: true | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
Registration under EPF & MP Act 1952 is mandatory for commercial and industrial establishments employing 20 or more persons.

**Required Documents**:  
  - PAN Card of Establishment
  - Bank Account Cancelled Cheque
  - Specimen Signatures of Authorized Signatories
  - Employee List

**Accepted Alternatives**:  
  - AGILE-PRO-S Auto-Allotted EPF Code Number

**Required Forms**:  
  - Shram Suvidha Portal EPF Application
  - AGILE-PRO-S (INC-35)

**Authority**: Employees Provident Fund Organisation (EPFO), Ministry of Labour & Employment  
**Notes**: Auto-allotment of EPF Code Number is enabled for all newly incorporated companies via MCA AGILE-PRO-S form. Compliance obligations commence when employee strength reaches 20.

---

### Rule 10: ESIC Employee State Insurance Mandatory Threshold Registration

**Rule ID**: `RUL-LBR-014`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: private_limited_company  
**Condition**: IF employee_count greater_than 9 AND employee_monthly_wages_inr less_than_or_equal 21000  
**Mandatory**: true | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
Registration under ESI Act 1948 is mandatory for non-seasonal factories or establishments employing 10 or more persons with wages up to Rs. 21,000 per month.

**Required Documents**:  
  - PAN & GSTIN of Entity
  - Factory/Establishment Address Proof
  - List of Employees with Family Details & Wages

**Accepted Alternatives**:  
  - AGILE-PRO-S Auto-Allotted ESI Code Number

**Required Forms**:  
  - Shram Suvidha Portal ESI Application
  - AGILE-PRO-S (INC-35)

**Authority**: Employees State Insurance Corporation (ESIC), Ministry of Labour & Employment  
**Notes**: ESI Code Number is auto-allotted via MCA AGILE-PRO-S form during incorporation.

---

### Rule 11: Form FiLLiP Integrated LLP Incorporation & Form 3 Agreement Filing

**Rule ID**: `RUL-MCA-002`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: llp  
**Condition**: IF entity_type equals llp AND incorporation_channel equals fillip  
**Mandatory**: true | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
Filing of Form FiLLiP for incorporation of LLP and DPIN allotment, followed by Form 3 within 30 days of registration for filing the executed LLP Agreement.

**Required Documents**:  
  - Subscriber Sheet & Consent of Partners
  - Proof of Registered Office Address
  - Identity & Address Proof of Designated Partners

**Accepted Alternatives**:  
  - Voter ID
  - Passport
  - Driving License
  - Aadhaar Card

**Required Forms**:  
  - RUN-LLP
  - Form FiLLiP
  - Form 3 LLP Agreement

**Authority**: Ministry of Corporate Affairs (MCA), Government of India  
**Notes**: Form 3 must be filed within 30 days of LLP incorporation with executed LLP Agreement stamped under State Stamp Act.

---

### Rule 12: DPIIT Startup Recognition Certificate & Eligibility

**Rule ID**: `RUL-DPIIT-010`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: startup  
**Condition**: IF is_startup_applicant equals true AND annual_turnover_inr_cr less_than 100 AND years_since_incorporation less_than 10  
**Mandatory**: false | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
Entity registered as Private Limited, LLP, or Registered Partnership within 10 years of incorporation with annual turnover < Rs. 100 Crore and working on innovation/scalability.

**Required Documents**:  
  - Certificate of Incorporation or Registration Certificate
  - Pitch Deck / Write-up on Nature of Business & Innovation

**Accepted Alternatives**:  
  - Patents Granted Certificate
  - Proof of Concept Write-up

**Required Forms**:  
  - Startup India Online Application Form

**Authority**: Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce & Industry  
**Notes**: Entities formed by splitting up or reconstruction of existing business are ineligible.

---

### Rule 13: Maharashtra Shops and Establishments Registration Certificate (Form A)

**Rule ID**: `RUL-MAH-011`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: private_limited_company  
**Condition**: IF state equals Maharashtra AND employee_count greater_than 9  
**Mandatory**: true | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
Establishments in Maharashtra employing 10 or more workers must apply online in Form A for Shops and Establishment Registration Certificate within 60 days of business launch.

**Required Documents**:  
  - PAN & Aadhaar of Employer
  - Premises Address Proof & Rent Agreement
  - List of Employees
  - Photo of Establishment Board in Marathi

**Accepted Alternatives**:  
  - Aaple Sarkar Online Portal Verified Uploads

**Required Forms**:  
  - Form A Registration Application (Aaple Sarkar / MAITRI Portal)

**Authority**: Labour Department, Government of Maharashtra  
**Notes**: For establishments with 0 to 9 workers, only Form F Intimation (Gumasta Intimation) is required.

---

### Rule 14: Maharashtra Shops Intimation Receipt (Form F - Gumasta)

**Rule ID**: `RUL-MAH-012`  
**Industry**: all  
**Sector**: Wholesale & Retail Commerce  
**Subsector**: General Trading & Retail  
**Applicable to**: private_limited_company  
**Condition**: IF state equals Maharashtra AND employee_count less_than 10  
**Mandatory**: true | **Conditional**: true  
**Status**: `approved` ✅  

**Description**:  
Establishments in Maharashtra with 0 to 9 workers submit online Intimation in Form F along with self-declaration to receive instant online receipt.

**Required Documents**:  
  - Self-Declaration of Employer
  - Identity & Address Proof
  - Self-Attested Premises Ownership/Lease Proof

**Accepted Alternatives**:  
  - Online Self-Declaration Receipt

**Required Forms**:  
  - Form F Online Intimation (Aaple Sarkar / MAITRI Portal)

**Authority**: Labour Department, Government of Maharashtra  
**Notes**: No inspection or renewal fee is required for Form F intimation receipts.

---

## Sources

- **Companies (Incorporation) Rules, 2014 & SPICe+ Amendments**: [Official Government Source](https://www.mca.gov.in/content/mca/global/en/acts-rules/companies-act/rules.html) (Companies (Incorporation) Rules 2014 - Rule 25(1)(b) & (c))
- **Frequently Asked Questions (FAQs) on SPICe+ and Company Incorporation**: [Official Government Source](https://www.mca.gov.in/content/mca/global/en/help/faqs/company-incorporation-faqs.html) (Company Incorporation FAQs - Q4: OPC Rules)
- **AGILE-PRO-S (INC-35) Application Guide for GSTIN, EPFO, ESIC, Bank Account & Professional Tax**: [Official Government Source](https://www.mca.gov.in/content/mca/global/en/services/company-services/agile-pro-s-guidelines.html) (AGILE-PRO-S Instruction Kit - Section 1: GSTIN Option)
- **SPICe+ (INC-32) Part A and Part B Instruction Kit & User Guide**: [Official Government Source](https://www.mca.gov.in/content/mca/global/en/services/company-services/incorporation-services.html) (SPICe+ Instruction Kit - Section 1: Integrated Incorporation Procedure)
- **EPFO & ESIC Mandatory Registration Criteria under Shram Suvidha & MCA AGILE-PRO-S Portal**: [Official Government Source](https://www.epfindia.gov.in/) (EPF & MP Act 1952 - Section 1(3) Applicability Criteria)
- **RUN-LLP & Form FiLLiP Instruction Kit for LLP Incorporation and Form 3 Rules**: [Official Government Source](https://www.mca.gov.in/content/mca/global/en/services/llp-services/fillip-instruction-kit.html) (RUN-LLP & FiLLiP Instruction Kit - Section 2: FiLLiP E-Form Procedure)
- **DPIIT Recognition Eligibility and Online Application Guidelines for Startups**: [Official Government Source](https://www.startupindia.gov.in/content/sih/en/startup-scheme.html) (DPIIT Notification G.S.R. 127(E) - Paragraph 1 & 2)
- **Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017**: [Official Government Source](https://maharashtra.gov.in/) (Maharashtra Shops & Establishments Act 2017 - Section 6)
