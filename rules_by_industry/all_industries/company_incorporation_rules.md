# Company Incorporation Rules (SPICe+ Statutory Workflow)

**Industry**: All Industries  
**Sector**: Corporate Governance  
**Subsector**: Company Registration  

Statutory requirements, documents, e-forms, and residency conditions for incorporating Private Limited, OPC, and Public Companies under MCA Companies Act 2013.

---

### Rule 1: Registered Office Rented Premises Proof Package

**Rule ID**: `RUL-MCA-003`  
**Industry**: all  
**Sector**: Corporate Governance  
**Subsector**: Company Registration  
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
**Sector**: Corporate Governance  
**Subsector**: Company Registration  
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
**Sector**: Corporate Governance  
**Subsector**: Company Registration  
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
**Sector**: Corporate Governance  
**Subsector**: Company Registration  
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
**Sector**: Corporate Governance  
**Subsector**: Company Registration  
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
**Sector**: Corporate Governance  
**Subsector**: Company Registration  
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

### Rule 7: SPICe+ Part A & Part B Integrated Company Incorporation Application

**Rule ID**: `RUL-MCA-001`  
**Industry**: all  
**Sector**: Corporate Governance  
**Subsector**: Company Registration  
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

## Sources

- **Companies (Incorporation) Rules, 2014 & SPICe+ Amendments**: [Official Government Source](https://www.mca.gov.in/content/mca/global/en/acts-rules/companies-act/rules.html) (Companies (Incorporation) Rules 2014 - Rule 25(1)(b) & (c))
- **Frequently Asked Questions (FAQs) on SPICe+ and Company Incorporation**: [Official Government Source](https://www.mca.gov.in/content/mca/global/en/help/faqs/company-incorporation-faqs.html) (Company Incorporation FAQs - Q4: OPC Rules)
- **SPICe+ (INC-32) Part A and Part B Instruction Kit & User Guide**: [Official Government Source](https://www.mca.gov.in/content/mca/global/en/services/company-services/incorporation-services.html) (SPICe+ Instruction Kit - Section 1: Integrated Incorporation Procedure)
