import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sector, ProjectType, EntityType, ProjectStage, LandType } from '../../types';
import { MASTER_SECTOR_DATA } from '../../data/sectorData';
import { Building2, Layers, MapPin, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export const NewProjectForm: React.FC = () => {
  const { addProject, setActiveTab } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [businessName, setBusinessName] = useState('Sahyadri Food Extracts & Spices');
  const [businessType, setBusinessType] = useState('Spice Milling, Extraction & Export Packaging');
  const [projectType, setProjectType] = useState<ProjectType>('New Setup');
  const [entityType, setEntityType] = useState<EntityType>('Private Limited');
  const [sector, setSector] = useState<Sector>('Food Processing');
  const [subSector, setSubSector] = useState<string>('Edible oil and spices (processing, refining, packaging)');

  const [investmentRange, setInvestmentRange] = useState('₹5 Cr - ₹15 Cr');
  const [employeeCount, setEmployeeCount] = useState(35);
  const [businessActivity, setBusinessActivity] = useState('Automated spice washing, grinding, quality testing and cold storage unit');
  const [projectStage, setProjectStage] = useState<ProjectStage>('Construction');
  const [hasConstruction, setHasConstruction] = useState(true);
  const [hasHazardousMaterials, setHasHazardousMaterials] = useState(false);

  const [district, setDistrict] = useState('Pune');
  const [cityTaluka, setCityTaluka] = useState('Khed / Chakan');
  const [pincode, setPincode] = useState('410501');
  const [midcArea, setMidcArea] = useState('Chakan Phase II Industrial Area');
  const [landType, setLandType] = useState<LandType>('MIDC Allotted');
  const [address, setAddress] = useState('Plot No. C-42, Chakan Industrial Area, Phase II, Pune');

  const maharashtraDistricts = [
    'Pune', 'Thane', 'Chhatrapati Sambhajinagar', 'Palghar', 'Nagpur', 'Nashik', 
    'Raigad', 'Kolhapur', 'Solapur', 'Satara', 'Ahmednagar', 'Amravati'
  ];

  const midcAreas = [
    'Chakan MIDC Phase II (Pune)',
    'Tarapur MIDC Zone E (Palghar)',
    'Waluj MIDC Sector F (Chhatrapati Sambhajinagar)',
    'Butibori Industrial Area (Nagpur)',
    'Ambad MIDC (Nashik)',
    'Taloja MIDC (Raigad)',
    'Ranjangaon MIDC (Pune)',
    'Kagal-Hupari MIDC (Kolhapur)'
  ];

  const handleComplete = () => {
    addProject({
      businessName,
      businessType,
      projectType,
      entityType,
      sector,
      subSector,
      investmentRange,
      employeeCount: Number(employeeCount),
      businessActivity,
      projectStage,
      hasConstruction,
      hasHazardousMaterials,
      district,
      cityTaluka,
      pincode,
      midcArea,
      landType,
      address
    });

    setActiveTab('checklist');
  };

  const selectedSectorConfig = MASTER_SECTOR_DATA.find(s => s.id === sector);
  const subSectorOptions = selectedSectorConfig ? selectedSectorConfig.subSectors : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Header - Rich Light Gradient */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-50/40 to-white p-6 rounded-2xl border border-amber-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold border border-amber-300/80 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Register New Business Project</h1>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              MAITRI Single-Window Wizard • Automatically configures your statutory Maharashtra permissions & licences
            </p>
          </div>
        </div>
      </div>

      {/* Wizard Progress Stepper - White Background with Royal Indigo Completed Badges */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center text-xs">
        {[
          { step: 1, label: '1. Sector & Entity' },
          { step: 2, label: '2. Scale & Features' },
          { step: 3, label: '3. Location Profile' },
          { step: 4, label: '4. Review & Checklist' }
        ].map((item) => (
          <div
            key={item.step}
            onClick={() => setCurrentStep(item.step)}
            className={`flex items-center gap-2 cursor-pointer font-bold ${
              currentStep === item.step
                ? 'text-amber-600 font-extrabold'
                : currentStep > item.step
                ? 'text-indigo-700'
                : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs ${
                currentStep === item.step
                  ? 'bg-amber-500 text-white font-extrabold'
                  : currentStep > item.step
                  ? 'bg-indigo-600 text-white font-extrabold'
                  : 'bg-slate-100 text-slate-600 font-semibold'
              }`}
            >
              {currentStep > item.step ? '✓' : item.step}
            </span>
            <span className="hidden sm:inline">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Form Card Body - White Background */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* STEP 1: BASIC BUSINESS IDENTITY */}
        {currentStep === 1 && (
          <div className="space-y-5 text-xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Step 1: Primary Business Identity & Sector Classification
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Agro Processing Hub"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Business Type</label>
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="e.g. Food Processing & Spice Extraction"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Type</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as ProjectType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="New Setup">New Setup (Greenfield)</option>
                  <option value="Expansion">Expansion (Brownfield)</option>
                  <option value="Renewal">Renewal / Re-licensing</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Entity Constitution</label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as EntityType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="Private Limited">Private Limited Company</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Partnership">Partnership Firm</option>
                  <option value="Proprietorship">Proprietorship Firm</option>
                </select>
              </div>

              {/* Major Sector Selection */}
              <div className="sm:col-span-2">
                <label className="block text-slate-900 font-extrabold mb-2">
                  Primary Industry Sector *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MASTER_SECTOR_DATA.map((sec) => {
                    const isSelected = sector === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => {
                          setSector(sec.id);
                          if (sec.subSectors.length > 0) {
                            setSubSector(sec.subSectors[0].name);
                          }
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-500 font-extrabold shadow-md scale-[1.02] ring-2 ring-amber-300'
                            : 'bg-indigo-50/50 hover:bg-indigo-100/70 border-indigo-200/80 text-indigo-950 font-bold hover:border-amber-400'
                        }`}
                      >
                        <div className="text-xs font-extrabold">{sec.name}</div>
                        <div className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-amber-100' : 'text-indigo-600'}`}>
                          {sec.subSectors.length} Sub-Sectors
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sub-Sector Selection */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-amber-50/90 border border-amber-300 shadow-xs space-y-2">
                <label className="block text-amber-950 font-extrabold text-xs">
                  Select Specific Sub-Sector ({sector}):
                </label>
                <select
                  value={subSector}
                  onChange={(e) => setSubSector(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-slate-900 font-extrabold focus:outline-none focus:border-amber-500 shadow-xs"
                >
                  {subSectorOptions.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-700 font-medium italic">
                  {subSectorOptions.find(s => s.name === subSector)?.description}
                </p>
              </div>

            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer transition-all"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROJECT DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-100">Step 2: Project Scale & Operational Features</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Total Investment Range</label>
                <select
                  value={investmentRange}
                  onChange={(e) => setInvestmentRange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="₹50 Lakhs - ₹1 Cr">₹50 Lakhs - ₹1 Cr (Micro)</option>
                  <option value="₹1 Cr - ₹5 Cr">₹1 Cr - ₹5 Cr (Small)</option>
                  <option value="₹5 Cr - ₹15 Cr">₹5 Cr - ₹15 Cr (Medium)</option>
                  <option value="₹15 Cr - ₹50 Cr">₹15 Cr - ₹50 Cr (Large)</option>
                  <option value="> ₹50 Cr">Above ₹50 Cr (Mega Project)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Estimated Employees / Workers</label>
                <input
                  type="number"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  placeholder="35"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Current Project Stage</label>
                <select
                  value={projectStage}
                  onChange={(e) => setProjectStage(e.target.value as ProjectStage)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="Planning">Planning & Land Survey</option>
                  <option value="Site Acquisition">Site Acquisition / Lease Deed</option>
                  <option value="Construction">Building Construction</option>
                  <option value="Machinery Setup">Machinery Erection & Trial</option>
                  <option value="Ready to Operate">Ready to Commence Production</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Primary Business Activity Description</label>
                <textarea
                  rows={2}
                  value={businessActivity}
                  onChange={(e) => setBusinessActivity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Checkboxes */}
              <div className="sm:col-span-2 space-y-3 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasConstruction}
                    onChange={(e) => setHasConstruction(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900">Building / Civil Construction Required</div>
                    <div className="text-[10px] text-slate-500">Triggers MIDC Building Plan Approval & Provisional Fire NOC requirements</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasHazardousMaterials}
                    onChange={(e) => setHasHazardousMaterials(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900">Hazardous / Flammable Materials Handled</div>
                    <div className="text-[10px] text-slate-500">Triggers State Environmental Clearance (EC) & DISH Hazardous Authorization</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-extrabold hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-100">Step 3: Maharashtra Location & Land Profile</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                >
                  {maharashtraDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">City / Taluka</label>
                <input
                  type="text"
                  value={cityTaluka}
                  onChange={(e) => setCityTaluka(e.target.value)}
                  placeholder="e.g. Khed / Chakan"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="410501"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Industrial Area / MIDC Cluster</label>
                <select
                  value={midcArea}
                  onChange={(e) => setMidcArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                >
                  {midcAreas.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Land Ownership Category</label>
                <select
                  value={landType}
                  onChange={(e) => setLandType(e.target.value as LandType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="MIDC Allotted">MIDC Allotted Industrial Plot</option>
                  <option value="Private Industrial">Private Industrial Zone Plot</option>
                  <option value="Agricultural Conversion">Agricultural Land (Requires NA Sanction)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Plot Number & Full Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-extrabold hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Review & Generate Checklist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & GENERATE CHECKLIST */}
        {currentStep === 4 && (
          <div className="space-y-6 text-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Step 4: Summary Review</h2>
              <p className="text-slate-500 font-medium">Verify your entered profile parameters before initiating rules engine analysis.</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-medium">Business Name:</span>
                  <div className="font-extrabold text-slate-900">{businessName}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Sector & Scale:</span>
                  <div className="font-extrabold text-slate-900">{sector} • {investmentRange}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Entity & Workers:</span>
                  <div className="font-extrabold text-slate-900">{entityType} ({employeeCount} Workers)</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Location:</span>
                  <div className="font-extrabold text-slate-900">{district} ({midcArea})</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Construction Needed:</span>
                  <div className="font-extrabold text-emerald-600">{hasConstruction ? 'Yes (Triggers MIDC & Fire NOC)' : 'No'}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Hazardous Materials:</span>
                  <div className="font-extrabold text-amber-600">{hasHazardousMaterials ? 'Yes (Triggers EC & DISH Hazard)' : 'No'}</div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-amber-950 font-medium">
                PermitFlow Rules Engine will auto-generate exact prerequisite approvals, fees, document checklists & state incentive matches for this project profile.
              </p>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-extrabold hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Edit Details
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Generate Smart Checklist</span>
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
