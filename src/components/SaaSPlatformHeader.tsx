/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { LayoutDashboard, Users, UserCog, Sparkles, Building2, PlusCircle } from "lucide-react";

interface SaaSPlatformHeaderProps {
  tenants: any[];
  activeTenantId: number;
  onSelectTenant: (id: number) => void;
  onOpenWizard: () => void;
  onOpenSuperAdmin: () => void;
  onOpenTenantDashboard: () => void;
  activeView: string;
  onCloseSpecialView: () => void;
}

export default function SaaSPlatformHeader({
  tenants,
  activeTenantId,
  onSelectTenant,
  onOpenWizard,
  onOpenSuperAdmin,
  onOpenTenantDashboard,
  activeView,
  onCloseSpecialView,
}: SaaSPlatformHeaderProps) {
  const activeTenant = tenants.find((t) => t.id === activeTenantId);

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-slate-200 px-4 py-3 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* SaaS Platform Identity & Tenant Switcher */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold uppercase">BiteFlow SaaS</span>
              <span className="text-sm font-bold tracking-tight text-white leading-none">Multi-Tenant Platform</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Active Tenant Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Active Café:</span>
            <div className="relative">
              <select
                value={activeTenantId}
                onChange={(e) => onSelectTenant(parseInt(e.target.value, 10))}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-8 cursor-pointer appearance-none"
              >
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name} {tenant.id === 1 ? "🧡" : tenant.id === 2 ? "💚" : tenant.id === 3 ? "❤️" : "✨"}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-xs">unfold_more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls for Demos, Wizard, Portals */}
        <div className="flex flex-wrap items-center gap-2">
          {activeView !== "Consumer" && (
            <button
              onClick={onCloseSpecialView}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs">arrow_back</span>
              Customer View
            </button>
          )}

          <button
            onClick={onOpenTenantDashboard}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeView === "TenantDashboard"
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Café Dashboard
          </button>

          <button
            onClick={onOpenSuperAdmin}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeView === "SuperAdmin"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
          >
            <UserCog className="w-3.5 h-3.5" />
            Super Admin
          </button>

          <button
            onClick={onOpenWizard}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeView === "SetupWizard"
                ? "bg-purple-600 text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Café Wizard
          </button>
        </div>
      </div>
    </div>
  );
}
