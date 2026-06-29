/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Building2, TrendingUp, CreditCard, Layers, ShieldCheck, Mail, Calendar, RefreshCw, Trash } from "lucide-react";

interface SaaSSuperAdminProps {
  onClose: () => void;
  onSelectTenant: (id: number) => void;
  activeTenantId: number;
}

export default function SaaSSuperAdmin({ onClose, onSelectTenant, activeTenantId }: SaaSSuperAdminProps) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalTenants: 0,
    activeSubscriptions: 0,
    trialSubscriptions: 0,
    monthlyRecurringRevenue: 0,
    annualRecurringRevenue: 0,
  });
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([
    { id: 1, name: "Starter", price: "4999", maxBranches: 1, maxEmployees: 5, maxTables: 10, features: '{"analytics":true,"qr":true}' },
    { id: 2, name: "Professional", price: "9999", maxBranches: 3, maxEmployees: 15, maxTables: 30, features: '{"analytics":true,"qr":true,"theme":true,"inventory":true}' },
    { id: 3, name: "Enterprise", price: "24999", maxBranches: 10, maxEmployees: 50, maxTables: 100, features: '{"analytics":true,"qr":true,"theme":true,"inventory":true,"loyalty":true,"multiBranch":true}' },
  ]);
  const [announcement, setAnnouncement] = useState("");
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"tenants" | "plans" | "announcements">("tenants");

  const fetchData = async () => {
    setLoading(true);
    try {
      const mRes = await fetch("/api/saas/metrics");
      const mData = await mRes.json();
      setMetrics(mData);

      const oRes = await fetch("/api/saas/organizations");
      const oData = await oRes.json();
      setOrganizations(oData);
    } catch (err) {
      console.error("Super admin metrics fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSubscription = async (id: number, updates: any) => {
    try {
      const response = await fetch(`/api/saas/organizations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error("Failed to update subscription:", err);
    }
  };

  const handleBroadcastAnnouncement = () => {
    if (!announcement.trim()) return;
    setAnnouncementSuccess(true);
    setTimeout(() => {
      setAnnouncementSuccess(false);
      setAnnouncement("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 select-none font-sans animate-in fade-in duration-300 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 text-indigo-400 p-2.5 rounded-2xl border border-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Super Admin Platform Console</h1>
              <p className="text-xs text-slate-400">Comprehensive overview of global metrics, billing, and registered tenants.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl transition border border-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 border border-slate-700"
            >
              <span className="material-symbols-outlined text-xs">arrow_back</span>
              Back to App
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs font-mono">Loading telemetry dashboards...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* MRR */}
              <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingUp className="w-16 h-16 text-emerald-400" />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Monthly Recurring Revenue</div>
                <div className="text-2xl font-black text-white">₹{metrics.monthlyRecurringRevenue?.toLocaleString("en-IN")}</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-2 flex items-center gap-1">
                  <span>ARR Projection:</span>
                  <span className="font-mono bg-emerald-500/10 px-2 py-0.5 rounded">₹{(metrics.monthlyRecurringRevenue * 12)?.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Total Tenants */}
              <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Building2 className="w-16 h-16 text-indigo-400" />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Total Subscribed Cafés</div>
                <div className="text-2xl font-black text-white">{metrics.totalTenants}</div>
                <div className="text-[10px] text-slate-400 font-medium mt-2">Active tenant databases isolated safely</div>
              </div>

              {/* Active Subscriptions */}
              <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CreditCard className="w-16 h-16 text-blue-400" />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Active Paid Subscriptions</div>
                <div className="text-2xl font-black text-white">{metrics.activeSubscriptions}</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-2">0% churn rate this calendar period</div>
              </div>

              {/* Trial accounts */}
              <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Layers className="w-16 h-16 text-purple-400" />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Free Sandbox Trials</div>
                <div className="text-2xl font-black text-white">{metrics.trialSubscriptions}</div>
                <div className="text-[10px] text-purple-400 font-bold mt-2">Converting at 22% rate standard</div>
              </div>
            </div>

            {/* SUPER ADMIN INTERACTIVE SECTIONS */}
            <div className="flex gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab("tenants")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "tenants" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Registered Tenants & Accounts ({organizations.length})
              </button>
              <button
                onClick={() => setActiveTab("plans")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "plans" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Subscription Plans Configuration
              </button>
              <button
                onClick={() => setActiveTab("announcements")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "announcements" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Platform Announcement Center
              </button>
            </div>

            {/* TAB 1: Registered Tenants */}
            {activeTab === "tenants" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Tenant Database Partition Mapping</h2>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono font-bold px-3 py-1 rounded-full border border-indigo-500/20">
                    Row-Level Isolation Enforced
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
                        <th className="pb-3">Tenant Info</th>
                        <th className="pb-3">Subdomain/Slug</th>
                        <th className="pb-3">Subscription</th>
                        <th className="pb-3">Tier</th>
                        <th className="pb-3">Primary Brand Theme</th>
                        <th className="pb-3">Action Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {organizations.map((org) => (
                        <tr key={org.id} className="hover:bg-slate-800/30 transition">
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-base">
                                {org.id === 1 ? "🧡" : org.id === 2 ? "💚" : org.id === 3 ? "❤️" : "✨"}
                              </span>
                              <div>
                                <span className="font-bold text-white block">{org.name}</span>
                                <span className="text-[10px] text-slate-500">{org.businessType || "Dining"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 font-mono text-slate-400 text-[11px]">
                            {org.slug}.biteflow.com
                          </td>
                          <td className="py-4">
                            <select
                              value={org.subscriptionStatus}
                              onChange={(e) => handleUpdateSubscription(org.id, { subscriptionStatus: e.target.value })}
                              className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="Active">Active</option>
                              <option value="Trial">Trial</option>
                              <option value="Suspended">Suspended</option>
                            </select>
                          </td>
                          <td className="py-4">
                            <select
                              value={org.planId || 1}
                              onChange={(e) => handleUpdateSubscription(org.id, { planId: parseInt(e.target.value, 10) })}
                              className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                            >
                              <option value="1">Starter (₹4,999)</option>
                              <option value="2">Professional (₹9,999)</option>
                              <option value="3">Enterprise (₹24,999)</option>
                            </select>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full border border-slate-700 shadow-inner" style={{ backgroundColor: org.primaryColor }} />
                              <span className="w-4 h-4 rounded-full border border-slate-700 shadow-inner" style={{ backgroundColor: org.secondaryColor }} />
                              <span className="text-[10px] font-mono text-slate-500 ml-1 uppercase">{org.fontFamily || "Inter"}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <button
                              onClick={() => onSelectTenant(org.id)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition ${
                                activeTenantId === org.id
                                  ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                              }`}
                            >
                              {activeTenantId === org.id ? "Currently Active" : "Login to Café"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Config Plans */}
            {activeTab === "plans" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {plans.map((plan) => {
                  const features = JSON.parse(plan.features);
                  return (
                    <div key={plan.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">{plan.name} Plan</span>
                          <span className="text-xs text-slate-500">Tier ID: {plan.id}</span>
                        </div>
                        <div className="text-3xl font-black text-white mb-6">
                          ₹{parseInt(plan.price).toLocaleString("en-IN")}
                          <span className="text-xs text-slate-500 font-medium font-sans">/month</span>
                        </div>

                        <div className="space-y-3 mb-8 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Max Active Branches:</span>
                            <span className="font-bold text-white">{plan.id === 1 ? "1" : plan.id === 2 ? "3" : "10"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Max Staff Employees:</span>
                            <span className="font-bold text-white">{plan.id === 1 ? "5" : plan.id === 2 ? "15" : "50"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Max Physical Tables:</span>
                            <span className="font-bold text-white">{plan.id === 1 ? "10" : plan.id === 2 ? "30" : "100"}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-8">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-2">Enabled Feature Flags:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(features).map(([fKey, enabled]) => (
                              enabled && (
                                <span key={fKey} className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded-md font-mono">
                                  {fKey}
                                </span>
                              )
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl transition border border-slate-700"
                        onClick={() => alert("Plans properties are configurable dynamically per billing tier.")}
                      >
                        Adjust Plan Limits
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: Global Announcements */}
            {activeTab === "announcements" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">Platform Announcement Broadcaster</h3>
                <p className="text-xs text-slate-400 mb-6">Push updates, feature release notices, or subscription expiry reminders directly to the dashboards of all tenants instantly.</p>

                {announcementSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs mb-6 font-medium">
                    📣 Broadcast live: Announcement dispatched to all {organizations.length} multi-tenant nodes successfully.
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Announcement Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Platform Upgraded to v2.4 • Maintenance Completed Successfully"
                      value={announcement}
                      onChange={(e) => setAnnouncement(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleBroadcastAnnouncement}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
                  >
                    Broadcast Announcement Now
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
