import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sector, ProjectType, EntityType, ProjectStage, LandType } from '../../types';
import { MASTER_SECTOR_DATA } from '../../data/sectorData';
import { Building2, Layers, MapPin, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export const NewProjectForm: React.FC = () => {
  const { addProject, setActiveTab, currentUser } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State - Clean initial states without dummy data
  const [businessName, setBusinessName] = useState(currentUser?.organization || '');
  const [businessType, setBusinessType] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('New Setup');
  const [entityType, setEntityType] = useState<EntityType>('Private Limited');
  const [sector, setSector] = useState<Sector>('Food Processing');
  const [subSector, setSubSector] = useState<string>(
    MASTER_SECTOR_DATA.find(s => s.id === 'Food Processing')?.subSectors[0]?.name || ''
  );

  const [investmentRange, setInvestmentRange] = useState('₹50 Lakhs - ₹1 Cr');
  const [employeeCount, setEmployeeCount] = useState<number | ''>('');
  const [businessActivity, setBusinessActivity] = useState('');
  const [projectStage, setProjectStage] = useState<ProjectStage>('Planning');
  const [hasConstruction, setHasConstruction] = useState(false);
  const [hasHazardousMaterials, setHasHazardousMaterials] = useState(false);

  const [district, setDistrict] = useState('Pune');
  const [cityTaluka, setCityTaluka] = useState('');
  const [pincode, setPincode] = useState('');
  const [midcArea, setMidcArea] = useState('Chakan MIDC Phase II (Pune)');
  const [landType, setLandType] = useState<LandType>('MIDC Allotted');
  const [address, setAddress] = useState('');

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
      businessName: businessName.trim() || 'New Business Project',
      businessType: businessType.trim() || `${sector} Enterprise`,
      projectType,
      entityType,
      sector,
      subSector,
      investmentRange,
      employeeCount: employeeCount === '' ? 0 : Number(employeeCount),
      businessActivity: businessActivity.trim() || 'General Operations',
      projectStage,
      hasConstruction,
      hasHazardousMaterials,
      district,
      cityTaluka: cityTaluka.trim() || district,
      pincode: pincode.trim(),
      midcArea,
      landType,
      address: address.trim() || `${district}, Maharashtra`
    });

    setActiveTab('checklist');
  };

  const selectedSectorConfig = MASTER_SECTOR_DATA.find(s => s.id === sector);
  const subSectorOptions = selectedSectorConfig ? selectedSectorConfig.subSectors : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Header - Consistent Maharashtra Gov Forest Green Theme */}
      <div className="bg-[#F8FCF9] dark:bg-[#16261C] p-6 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#CFFFDC]/60 dark:bg-[#253D2C] text-[#2E6F40] dark:text-[#CFFFDC] flex items-center justify-center font-bold border border-[#68BA7F]/40 shadow-xs">
            <Building2 className="w-6 h-6 text-[#2E6F40] dark:text-[#68BA7F]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#192A1E] dark:text-[#E8F7ED]">Register New Business Project</h1>
            <p className="text-xs text-[#4A6B53] dark:text-[#A3D4B3] font-medium mt-0.5">
              PFN Single-Window Wizard • Automatically configures your statutory Maharashtra permissions & licences
            </p>
          </div>
        </div>
      </div>

      {/* Wizard Progress Stepper */}
      <div className="bg-white dark:bg-[#16261C] p-4 rounded-2xl border border-slate-200 dark:border-[#253D2C] shadow-xs flex justify-between items-center text-xs">
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
                ? 'text-[#2E6F40] dark:text-[#68BA7F] font-extrabold'
                : currentStep > item.step
                ? 'text-[#2E6F40]'
                : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs ${
                currentStep === item.step
                  ? 'bg-[#2E6F40] text-white font-extrabold'
                  : currentStep > item.step
                  ? 'bg-[#D4EEDC] text-[#2E6F40] font-extrabold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 font-semibold'
              }`}
            >
              {currentStep > item.step ? '✓' : item.step}
            </span>
            <span className="hidden sm:inline">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Form Card Body */}
      <div className="bg-white dark:bg-[#16261C] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#253D2C] shadow-xs">
        
        {/* STEP 1: BASIC BUSINESS IDENTITY */}
        {currentStep === 1 && (
          <div className="space-y-5 text-xs">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Step 1: Primary Business Identity & Sector Classification
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Agro Processing Hub"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Business Type</label>
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="e.g. Food Processing & Spice Extraction"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Project Type</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as ProjectType)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                >
                  <option value="New Setup">New Setup (Greenfield)</option>
                  <option value="Expansion">Expansion (Brownfield)</option>
                  <option value="Renewal">Renewal / Re-licensing</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Entity Constitution</label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as EntityType)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                >
                  <option value="Private Limited">Private Limited Company</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Partnership">Partnership Firm</option>
                  <option value="Proprietorship">Proprietorship Firm</option>
                </select>
              </div>

              {/* Major Sector Selection */}
              <div className="sm:col-span-2">
                <label className="block text-slate-900 dark:text-white font-extrabold mb-2">
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
                            ? 'bg-[#2E6F40] text-white border-[#2E6F40] font-extrabold shadow-md scale-[1.02] ring-2 ring-[#68BA7F]/40'
                            : 'bg-slate-50 dark:bg-slate-900 hover:bg-[#F8FCF9] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:border-[#68BA7F]'
                        }`}
                      >
                        <div className="text-xs font-extrabold">{sec.name}</div>
                        <div className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-[#CFFFDC]' : 'text-slate-500'}`}>
                          {sec.subSectors.length} Sub-Sectors
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sub-Sector Selection */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-[#F8FCF9] dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs space-y-2">
                <label className="block text-[#192A1E] dark:text-[#E8F7ED] font-extrabold text-xs">
                  Select Specific Sub-Sector ({sector}):
                </label>
                <select
                  value={subSector}
                  onChange={(e) => setSubSector(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-extrabold focus:outline-none focus:border-[#2E6F40] shadow-xs"
                >
                  {subSectorOptions.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#4A6B53] dark:text-[#A3D4B3] font-medium italic">
                  {subSectorOptions.find(s => s.name === subSector)?.description}
                </p>
              </div>

            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-extrabold flex items-center gap-2 shadow-md shadow-[#2E6F40]/20 cursor-pointer transition-all"
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
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Step 2: Project Scale & Operational Features
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Total Investment Range</label>
                <select
                  value={investmentRange}
                  onChange={(e) => setInvestmentRange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                >
                  <option value="₹50 Lakhs - ₹1 Cr">₹50 Lakhs - ₹1 Cr (Micro)</option>
                  <option value="₹1 Cr - ₹5 Cr">₹1 Cr - ₹5 Cr (Small)</option>
                  <option value="₹5 Cr - ₹15 Cr">₹5 Cr - ₹15 Cr (Medium)</option>
                  <option value="₹15 Cr - ₹50 Cr">₹15 Cr - ₹50 Cr (Large)</option>
                  <option value="> ₹50 Cr">Above ₹50 Cr (Mega Project)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Estimated Employees / Workers</label>
                <input
                  type="number"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 25"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Current Project Stage</label>
                <select
                  value={projectStage}
                  onChange={(e) => setProjectStage(e.target.value as ProjectStage)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                >
                  <option value="Planning">Planning & Land Survey</option>
                  <option value="Site Acquisition">Site Acquisition / Lease Deed</option>
                  <option value="Construction">Building Construction</option>
                  <option value="Machinery Setup">Machinery Erection & Trial</option>
                  <option value="Ready to Operate">Ready to Commence Production</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Primary Business Activity Description</label>
                <textarea
                  rows={2}
                  value={businessActivity}
                  onChange={(e) => setBusinessActivity(e.target.value)}
                  placeholder="Describe your manufacturing, processing, or core business operations..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                />
              </div>

              {/* Checkboxes */}
              <div className="sm:col-span-2 space-y-3 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasConstruction}
                    onChange={(e) => setHasConstruction(e.target.checked)}
                    className="w-4 h-4 text-[#2E6F40] rounded focus:ring-[#2E6F40]"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white">Building / Civil Construction Required</div>
                    <div className="text-[10px] text-slate-500">Triggers MIDC Building Plan Approval & Provisional Fire NOC requirements</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasHazardousMaterials}
                    onChange={(e) => setHasHazardousMaterials(e.target.checked)}
                    className="w-4 h-4 text-[#2E6F40] rounded focus:ring-[#2E6F40]"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white">Hazardous / Flammable Materials Handled</div>
                    <div className="text-[10px] text-slate-500">Triggers State Environmental Clearance (EC) & DISH Hazardous Authorization</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-extrabold flex items-center gap-2 shadow-md shadow-[#2E6F40]/20 cursor-pointer transition-all"
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
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Step 3: Maharashtra Location & Land Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                >
                  {maharashtraDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">City / Taluka</label>
                <input
                  type="text"
                  value={cityTaluka}
                  onChange={(e) => setCityTaluka(e.target.value)}
                  placeholder="e.g. Khed / Chakan"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="410501"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Industrial Area / MIDC Cluster</label>
                <select
                  value={midcArea}
                  onChange={(e) => setMidcArea(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                >
                  {midcAreas.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Land Ownership Category</label>
                <select
                  value={landType}
                  onChange={(e) => setLandType(e.target.value as LandType)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                >
                  <option value="MIDC Allotted">MIDC Allotted Industrial Plot</option>
                  <option value="Private Industrial">Private Industrial Zone Plot</option>
                  <option value="Agricultural Conversion">Agricultural Land (Requires NA Sanction)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Plot Number & Full Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Plot No. C-42, Industrial Area Phase II, Taluka, District, PIN"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40]"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-extrabold flex items-center gap-2 shadow-md shadow-[#2E6F40]/20 cursor-pointer transition-all"
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
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Step 4: Summary Review</h2>
              <p className="text-slate-500 font-medium">Verify your entered profile parameters before initiating rules engine analysis.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-medium">Business Name:</span>
                  <div className="font-extrabold text-slate-900 dark:text-white">{businessName || 'New Business Project'}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Sector & Scale:</span>
                  <div className="font-extrabold text-slate-900 dark:text-white">{sector} • {investmentRange}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Entity & Workers:</span>
                  <div className="font-extrabold text-slate-900 dark:text-white">{entityType} ({employeeCount || 0} Workers)</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Location:</span>
                  <div className="font-extrabold text-slate-900 dark:text-white">{district} {midcArea ? `(${midcArea})` : ''}</div>
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

            <div className="bg-[#F8FCF9] dark:bg-[#16261C] p-4 rounded-xl border border-[#D4EEDC] dark:border-[#253D2C] flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#2E6F40] dark:text-[#68BA7F] shrink-0" />
              <p className="text-[#192A1E] dark:text-[#E8F7ED] font-medium">
                PermitFlow Rules Engine will auto-generate exact prerequisite approvals, fees, document checklists & state incentive matches for this project profile.
              </p>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Edit Details
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="px-8 py-3.5 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Generate Smart Checklist</span>
                <CheckCircle2 className="w-4 h-4 text-[#CFFFDC]" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
