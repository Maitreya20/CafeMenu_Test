/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Building2, Paintbrush, Store, Users, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface SaaSSetupWizardProps {
  onSuccess: (newOrgId: number) => void;
  onClose: () => void;
}

export default function SaaSSetupWizard({ onSuccess, onClose }: SaaSSetupWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Cafe Identity
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [businessType, setBusinessType] = useState("Café");
  const [gstNumber, setGstNumber] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  // Step 2: Theme Builder
  const [primaryColor, setPrimaryColor] = useState("#a855f7"); // Purple default for newly onboarded
  const [secondaryColor, setSecondaryColor] = useState("#c084fc");
  const [accentColor, setAccentColor] = useState("#10b981");
  const [fontFamily, setFontFamily] = useState("Outfit");
  const [borderRadius, setBorderRadius] = useState("16px");
  const [buttonStyle, setButtonStyle] = useState("Rounded");
  const [cardStyle, setCardStyle] = useState("Glass");

  // Step 3: Branch Info
  const [branchAddress, setBranchAddress] = useState("");
  const [branchPhone, setBranchPhone] = useState("");

  // Step 4: Tables setup
  const [tableCount, setTableCount] = useState(8);
  const [tablePrefix, setTablePrefix] = useState("Table ");

  // Step 5: Employee Invites
  const [employees, setEmployees] = useState([
    { name: "Chef Ranjan", role: "Chef", salary: 35000 },
    { name: "Waiter Kiran", role: "Waiter", salary: 16000 },
    { name: "Cashier Tina", role: "Cashier", salary: 20000 },
  ]);
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpRole, setNewEmpRole] = useState("Waiter");

  // Step 6: Plan Selection
  const [selectedPlanId, setSelectedPlanId] = useState(2); // Professional Default

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const addEmployee = () => {
    if (!newEmpName.trim()) return;
    setEmployees([
      ...employees,
      {
        name: newEmpName,
        role: newEmpRole,
        salary: newEmpRole === "Chef" ? 35000 : newEmpRole === "Manager" ? 40000 : 16000,
      },
    ]);
    setNewEmpName("");
  };

  const removeEmployee = (idx: number) => {
    setEmployees(employees.filter((_, i) => i !== idx));
  };

  const handleGoLive = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/saas/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          businessType,
          gstNumber,
          timezone,
          currency,
          primaryColor,
          secondaryColor,
          accentColor,
          fontFamily,
          borderRadius,
          buttonStyle,
          cardStyle,
          tableCount,
          tablePrefix,
          employees,
          planId: selectedPlanId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create organization");
      }

      // Success
      onSuccess(data.id);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during onboarding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-12 px-4 select-none">
      <div className="max-w-3xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        {/* Progress header bar */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-2xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">SaaS Onboarding Wizard</h2>
              <p className="text-xs text-slate-400">Launch your restaurant on BiteFlow Platform</p>
            </div>
          </div>
          <div className="text-xs font-mono font-bold bg-slate-800 px-3 py-1.5 rounded-full text-indigo-400">
            Step {step} of 6
          </div>
        </div>

        {/* Step contents */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs mb-6 font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        {/* STEP 1: Cafe Identity */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Café & Business Identity 🏢</h3>
              <p className="text-xs text-slate-400">Tell us a bit about your hospitality brand.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cafe / Restaurant Name</label>
                <input
                  type="text"
                  placeholder="e.g. Blue Lagoon Bistro"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Subdomain Slug / Custom Route</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="blue-lagoon"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}
                    className="bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-32 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white w-full font-mono"
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-slate-500 font-mono">.biteflow.com</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                >
                  <option>Café</option>
                  <option>Fine Dining</option>
                  <option>Quick Service Restaurant</option>
                  <option>Bistro & Pub</option>
                  <option>Bakery</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tax Registration (GSTIN)</label>
                <input
                  type="text"
                  placeholder="e.g. 27AAAAA1111A1Z1"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Billing Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (BST)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Theme Builder & White-Label Design */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">White-Label Branding & Theme Builder 🎨</h3>
              <p className="text-xs text-slate-400">Design an isolated, stylized consumer portal matching your corporate identity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 rounded-xl border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white w-28"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Typography / Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 text-white font-medium"
                  >
                    <option value="Inter">Inter (Classic / Clean)</option>
                    <option value="Outfit">Outfit (Tech / Modern)</option>
                    <option value="Space Grotesk">Space Grotesk (Bold / Retro)</option>
                    <option value="Playfair Display">Playfair Display (Serif / Regal)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Button Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Sharp", "Rounded", "Pill"].map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setButtonStyle(style)}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          buttonStyle === style
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Border Radius</label>
                  <select
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                  >
                    <option value="4px">Sharp (4px)</option>
                    <option value="12px">Rounded (12px)</option>
                    <option value="16px">Cozy (16px)</option>
                    <option value="24px">Pill (24px)</option>
                  </select>
                </div>
              </div>

              {/* Live Preview block */}
              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 font-bold uppercase">White-Label Live Preview</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-800 shadow-xl" style={{ borderRadius: borderRadius }}>
                    <h4 className="text-sm font-bold text-white" style={{ fontFamily }}>
                      {name || "Lagoon Bistro"}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-sans">
                      Enjoy contactless mobile ordering at your fingertip.
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        className="text-[11px] font-black uppercase px-4 py-2 text-white shadow"
                        style={{
                          backgroundColor: primaryColor,
                          borderRadius: buttonStyle === "Sharp" ? "0px" : buttonStyle === "Pill" ? "999px" : "12px",
                        }}
                      >
                        View Menu
                      </button>
                      <button
                        type="button"
                        className="text-[11px] font-bold uppercase px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200"
                        style={{
                          borderRadius: buttonStyle === "Sharp" ? "0px" : buttonStyle === "Pill" ? "999px" : "12px",
                        }}
                      >
                        Call Staff
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-[10px] font-mono text-slate-500 text-center">
                  Theme CSS variables adapt in real-time.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Branch setup */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Branch Details 📍</h3>
              <p className="text-xs text-slate-400">Configure your primary physical branch parameters.</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Branch Location Address</label>
                <input
                  type="text"
                  placeholder="e.g. Ground Floor, Cyber City, Sector 24, Gurugram, HR"
                  value={branchAddress}
                  onChange={(e) => setBranchAddress(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Contact Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={branchPhone}
                  onChange={(e) => setBranchPhone(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/60 text-xs text-indigo-400/90 leading-relaxed font-sans">
                <b>💡 Multi-Branch Capabilities:</b> Enterprise subscriptions unlock central control dashboard to manage unlimited physical venues and aggregate multi-location inventory streams effortlessly.
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Table Setup & QR Generation */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Dynamic Table Layout & QR Code Config 📱</h3>
              <p className="text-xs text-slate-400">Specify standard table counting and automatic guest QR links.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Active Tables</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={tableCount}
                      onChange={(e) => setTableCount(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="text-lg font-bold text-white bg-slate-800 px-4 py-1.5 rounded-xl font-mono">
                      {tableCount}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Naming Prefix / Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Table, VIP, Deck"
                    value={tablePrefix}
                    onChange={(e) => setTablePrefix(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>
              </div>

              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 mb-3">
                  <span className="material-symbols-outlined text-4xl text-indigo-400" style={{ fontSize: "36px" }}>qr_code_2</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Automatic Table QR Code Generator</h4>
                <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                  Generates {tableCount} secure unique table credentials. Custom logo placement can be added later.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Employee Teams */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Invite Employee Staff Team 👥</h3>
              <p className="text-xs text-slate-400">Pre-configure active culinary team with default security roles.</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Employee Full Name"
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white w-full"
                  />
                </div>
                <div>
                  <select
                    value={newEmpRole}
                    onChange={(e) => setNewEmpRole(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold"
                  >
                    <option>Chef</option>
                    <option>Waiter</option>
                    <option>Cashier</option>
                    <option>Manager</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={addEmployee}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 rounded-xl transition"
                >
                  Add Staff
                </button>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 max-h-[180px] overflow-y-auto p-4 space-y-2">
                {employees.map((emp, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-900 border border-slate-800/80 px-4 py-2 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span className="font-bold text-white">{emp.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-bold uppercase">{emp.role}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEmployee(i)}
                      className="text-rose-400 hover:text-rose-500 text-[10px] font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Plan selection & launch summary */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Select SaaS Plan & Deploy 🚀</h3>
              <p className="text-xs text-slate-400">Choose plan parameters matching your commercial operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Starter */}
              <div
                onClick={() => setSelectedPlanId(1)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedPlanId === 1
                    ? "bg-slate-800/80 border-indigo-500 shadow-xl"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Starter</div>
                <div className="text-lg font-black text-white leading-none">₹4,999<span className="text-[10px] text-slate-400 font-medium">/mo</span></div>
                <div className="text-[9px] text-indigo-400 font-bold mt-2">Max 10 Tables • 5 Employees</div>
              </div>

              {/* Professional */}
              <div
                onClick={() => setSelectedPlanId(2)}
                className={`p-4 rounded-2xl border cursor-pointer transition relative overflow-hidden ${
                  selectedPlanId === 2
                    ? "bg-slate-800/80 border-indigo-500 shadow-xl"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="absolute top-0 right-0 bg-indigo-600 text-[8px] uppercase tracking-widest text-white px-2 py-0.5 rounded-bl font-black">Popular</div>
                <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">Professional</div>
                <div className="text-lg font-black text-white leading-none">₹9,999<span className="text-[10px] text-slate-400 font-medium">/mo</span></div>
                <div className="text-[9px] text-indigo-400 font-bold mt-2">Max 30 Tables • 15 Employees</div>
              </div>

              {/* Enterprise */}
              <div
                onClick={() => setSelectedPlanId(3)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedPlanId === 3
                    ? "bg-slate-800/80 border-indigo-500 shadow-xl"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest mb-1">Enterprise</div>
                <div className="text-lg font-black text-white leading-none">₹24,999<span className="text-[10px] text-slate-400 font-medium">/mo</span></div>
                <div className="text-[9px] text-indigo-400 font-bold mt-2">Max 100 Tables • 50 Employees</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
              <span className="font-bold text-white uppercase font-mono text-[10px] tracking-widest text-indigo-400 block mb-1">Onboarding Deploy Summary:</span>
              <div className="grid grid-cols-2 gap-y-1 text-slate-300">
                <span>• Brand: <b>{name || "Lagoon Bistro"}</b></span>
                <span>• Slug/Route: <b>{slug || "lagoon"}</b></span>
                <span>• Generating Tables: <b>{tableCount} tables</b></span>
                <span>• Invited Team: <b>{employees.length} employees</b></span>
              </div>
            </div>
          </div>
        )}

        {/* Next/Back buttons footer */}
        <div className="flex justify-between items-center mt-8 border-t border-slate-800 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white font-bold px-4 py-2"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold px-4 py-2.5 transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !name.trim()) {
                    setError("Cafe Name is required.");
                    return;
                  }
                  setError("");
                  setStep(step + 1);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold px-5 py-2.5 transition flex items-center gap-1.5"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleGoLive}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider px-6 py-2.5 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? "Deploying..." : "Deploy & Go Live! 🚀"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
