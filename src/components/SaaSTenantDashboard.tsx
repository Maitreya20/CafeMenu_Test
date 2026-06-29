/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { LayoutDashboard, Paintbrush, Store, Users, ClipboardList, TrendingUp, AlertTriangle, ShieldCheck, ShoppingBag, PlusCircle, CheckCircle, Save, Settings } from "lucide-react";

interface SaaSTenantDashboardProps {
  tenantId: number;
  onClose: () => void;
  onRefreshTenantConfig: () => void;
}

export default function SaaSTenantDashboard({ tenantId, onClose, onRefreshTenantConfig }: SaaSTenantDashboardProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "theme" | "tables" | "menu" | "inventory" | "staff" | "logs">("analytics");
  const [loading, setLoading] = useState(true);

  // States fetched from DB
  const [tenantConfig, setTenantConfig] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  // Editing structures
  // 1. Theme Builder
  const [primaryColor, setPrimaryColor] = useState("#ff6b35");
  const [secondaryColor, setSecondaryColor] = useState("#f7b05b");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [borderRadius, setBorderRadius] = useState("16px");
  const [buttonStyle, setButtonStyle] = useState("Rounded");
  const [cardStyle, setCardStyle] = useState("Glass");
  const [themeSuccess, setThemeSuccess] = useState(false);

  // 2. Table Config
  const [tableCount, setTableCount] = useState(10);
  const [tablePrefix, setTablePrefix] = useState("Table ");
  const [tableSuccess, setTableSuccess] = useState(false);

  // 3. Menu Item Addition
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuCategory, setNewMenuCategory] = useState("Mains");
  const [newMenuPrice, setNewMenuPrice] = useState("");
  const [newMenuEmoji, setNewMenuEmoji] = useState("🍲");
  const [newMenuDesc, setNewMenuDesc] = useState("");
  const [menuSuccess, setMenuSuccess] = useState(false);

  const fetchTenantData = async () => {
    setLoading(true);
    try {
      const headers = { "x-organization-id": tenantId.toString() };

      const cRes = await fetch("/api/saas/tenant-config", { headers });
      const cData = await cRes.json();
      setTenantConfig(cData);
      if (cData) {
        setPrimaryColor(cData.primaryColor);
        setSecondaryColor(cData.secondaryColor);
        setFontFamily(cData.fontFamily);
        setBorderRadius(cData.borderRadius);
        setButtonStyle(cData.buttonStyle);
        setCardStyle(cData.cardStyle);
      }

      const aRes = await fetch("/api/analytics", { headers });
      const aData = await aRes.json();
      setAnalytics(aData);

      const tRes = await fetch("/api/tables", { headers });
      const tData = await tRes.json();
      setTables(tData);

      const mRes = await fetch("/api/menu", { headers });
      const mData = await mRes.json();
      setMenuItems(mData);

      const iRes = await fetch("/api/inventory", { headers });
      const iData = await iRes.json();
      setInventory(iData);

      const eRes = await fetch("/api/employees", { headers });
      const eData = await eRes.json();
      setEmployees(eData);

      const lRes = await fetch("/api/saas/audit-logs", { headers });
      const lData = await lRes.json();
      setLogs(lData);
    } catch (err) {
      console.error("Failed to load tenant dashboard context:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, [tenantId]);

  // Handle saving BRAND STYLING configuration
  const handleSaveTheme = async () => {
    try {
      const response = await fetch(`/api/saas/organizations/${tenantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": tenantId.toString(),
        },
        body: JSON.stringify({
          primaryColor,
          secondaryColor,
          fontFamily,
          borderRadius,
          buttonStyle,
          cardStyle,
        }),
      });

      if (response.ok) {
        setThemeSuccess(true);
        onRefreshTenantConfig(); // Trigger dynamic theme reload globally in App.tsx
        setTimeout(() => setThemeSuccess(false), 3000);
        await fetchTenantData();
      }
    } catch (err) {
      console.error("Theme save failed:", err);
    }
  };

  // Handle reconfiguring tables
  const handleSaveTables = async () => {
    try {
      const response = await fetch("/api/tables/configure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": tenantId.toString(),
        },
        body: JSON.stringify({
          tableCount,
          prefix: tablePrefix,
        }),
      });

      if (response.ok) {
        setTableSuccess(true);
        setTimeout(() => setTableSuccess(false), 3000);
        await fetchTenantData();
      }
    } catch (err) {
      console.error("Tables reconfiguration failed:", err);
    }
  };

  // Handle Toggle Availability of Menu Items
  const handleToggleMenuAvailability = async (itemId: string, currentVal: boolean) => {
    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": tenantId.toString(),
        },
        body: JSON.stringify({ available: !currentVal }),
      });
      if (response.ok) {
        await fetchTenantData();
      }
    } catch (err) {
      console.error("Failed to toggle item availability:", err);
    }
  };

  // Handle adding custom menu item
  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName || !newMenuPrice) return;
    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": tenantId.toString(),
        },
        body: JSON.stringify({
          name: newMenuName,
          category: newMenuCategory,
          price: parseFloat(newMenuPrice),
          emoji: newMenuEmoji,
          description: newMenuDesc,
        }),
      });

      if (response.ok) {
        setNewMenuName("");
        setNewMenuPrice("");
        setNewMenuDesc("");
        setMenuSuccess(true);
        setTimeout(() => setMenuSuccess(false), 3000);
        await fetchTenantData();
      }
    } catch (err) {
      console.error("Failed to create item:", err);
    }
  };

  // Replenish inventory stock
  const handleReplenishInventory = async (id: number, currentStock: number) => {
    const replenishAmount = 1000;
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": tenantId.toString(),
        },
        body: JSON.stringify({ stock: currentStock + replenishAmount }),
      });
      if (response.ok) {
        await fetchTenantData();
      }
    } catch (err) {
      console.error("Inventory replenish failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Syncing isolated tenant workspace databases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 select-none animate-in fade-in duration-300 pb-32">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white font-mono shadow-inner border border-slate-700/50" style={{ backgroundColor: primaryColor }}>
              {tenantConfig?.name?.substring(0, 2)?.toUpperCase() || "BF"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{tenantConfig?.name} Portal</h1>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold px-2 py-0.5 rounded font-mono uppercase">
                  {tenantConfig?.subscriptionStatus}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                <span>Head Office Delhi ↓ Main Branch</span>
                <span>•</span>
                <span>Plan: <b>Professional</b></span>
                <span>•</span>
                <span>Currency: <b>{tenantConfig?.currency || "INR"}</b></span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 border border-slate-700 align-self-start md:align-self-center"
          >
            <span className="material-symbols-outlined text-xs">restaurant_menu</span>
            Customer Storefront
          </button>
        </div>

        {/* Dynamic Warning Banners for low stock alert */}
        {inventory.some((i) => i.stock <= i.lowStockAlert) && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Warning: Raw Ingredient Low Stocks Detected!</h4>
              <p className="text-[11px] text-slate-400 mt-1">Some kitchen recipe ingredients fall below warning thresholds. Click "Inventory Manager" to replenish stock instantly.</p>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "analytics" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Live Analytics
          </button>

          <button
            onClick={() => setActiveTab("theme")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "theme" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            Theme Builder
          </button>

          <button
            onClick={() => setActiveTab("tables")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "tables" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Configure Tables
          </button>

          <button
            onClick={() => setActiveTab("menu")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "menu" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Menu Manager
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "inventory" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Inventory Stock
          </button>

          <button
            onClick={() => setActiveTab("staff")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "staff" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Staff Directory
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "logs" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Audit Logs Console
          </button>
        </div>

        {/* TAB 1: Isolated Analytics */}
        {activeTab === "analytics" && analytics && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Daily Sales */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative">
                <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Today's Isolated Revenue</div>
                <div className="text-2xl font-black text-white mt-1">₹{analytics.todaySales?.toLocaleString("en-IN")}</div>
                <div className="text-[10px] text-emerald-400 mt-2 font-bold font-sans">100% compliant GST reporting</div>
              </div>

              {/* Table Occupancy */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative">
                <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Table Occupancy Rate</div>
                <div className="text-2xl font-black text-white mt-1">{analytics.tableOccupancyRate}%</div>
                <div className="text-[10px] text-indigo-400 mt-2 font-bold">Active dining loop sessions: {analytics.occupiedTables}</div>
              </div>

              {/* Avg cook time */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative">
                <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Avg Kitchen Preparation</div>
                <div className="text-2xl font-black text-white mt-1">{analytics.avgCookingTime} mins</div>
                <div className="text-[10px] text-slate-400 mt-2">Chef performance optimized</div>
              </div>

              {/* Low stocks */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative">
                <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Critical Low Ingredients</div>
                <div className={`text-2xl font-black mt-1 ${analytics.lowStockItems > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                  {analytics.lowStockItems}
                </div>
                <div className="text-[10px] text-slate-400 mt-2">Check inventory thresholds</div>
              </div>
            </div>

            {/* Live active tables status dashboard */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4">Table Capacity & Bill Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {tables.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-2xl border flex flex-col justify-between text-center min-h-[90px] ${
                      t.status === "Available"
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : t.status === "Cleaning"
                        ? "bg-blue-500/5 border-blue-500/20"
                        : "bg-amber-500/5 border-amber-500/20"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-white">{t.tableNumber}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{t.status}</div>
                    </div>
                    {parseFloat(t.currentBill) > 0 && (
                      <div className="text-[10px] font-black text-amber-400">₹{parseFloat(t.currentBill)}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Visual Theme Builder */}
        {activeTab === "theme" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-1">Visual Theme Builder & Color Presets</h2>
              <p className="text-xs text-slate-400">Apply brand customization configurations across the digital menu layout immediately.</p>
            </div>

            {themeSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                White-label corporate theme written to PostgreSQL successfully. Web interface updated dynamically.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 rounded-xl bg-transparent border border-slate-700 cursor-pointer"
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
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option value="Inter">Inter (Classic / Clean)</option>
                    <option value="Outfit">Outfit (Tech / Modern)</option>
                    <option value="Space Grotesk">Space Grotesk (Bold / Retro)</option>
                    <option value="Playfair Display">Playfair Display (Serif / Regal)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Border Radius</label>
                  <select
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option value="4px">Sharp (4px)</option>
                    <option value="12px">Rounded (12px)</option>
                    <option value="16px">Cozy (16px)</option>
                    <option value="24px">Pill (24px)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSaveTheme}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save brand styling settings
                </button>
              </div>

              {/* Simulated theme preview */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center">
                <div className="p-4 bg-slate-900 border border-slate-800 shadow-2xl" style={{ borderRadius }}>
                  <h4 className="text-sm font-black text-white" style={{ fontFamily }}>{tenantConfig?.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Contactless Menu Panel Demo</p>
                  <div className="mt-4 p-3 bg-slate-950 border border-slate-800 text-xs rounded-xl flex items-center justify-between">
                    <span className="font-bold">Table 4 Menu Session</span>
                    <button
                      type="button"
                      className="text-[9px] font-black uppercase text-white px-3 py-1.5 shadow"
                      style={{
                        backgroundColor: primaryColor,
                        borderRadius: buttonStyle === "Sharp" ? "0px" : buttonStyle === "Pill" ? "999px" : "8px",
                      }}
                    >
                      Call Staff
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Configure Tables */}
        {activeTab === "tables" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-1">Dynamic Table Generator</h2>
              <p className="text-xs text-slate-400">Configure total active tables, capacity multipliers, and custom table categories dynamically.</p>
            </div>

            {tableSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Tables reconfigured, and secure table QR credentials generated successfully.
              </div>
            )}

            <div className="max-w-xl space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Configure Table Count</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="20"
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
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Custom Table Prefix / Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Patio A-, Garden-, VIP "
                  value={tablePrefix}
                  onChange={(e) => setTablePrefix(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveTables}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg"
              >
                Re-generate Tables & Active QR Codes
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Menu Manager */}
        {activeTab === "menu" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            
            {/* Create Item Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-indigo-400" />
                Add New Menu Item
              </h3>

              {menuSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-[11px] mb-4">
                  🍽️ Menu item successfully appended to tenant database record.
                </div>
              )}

              <form onSubmit={handleAddMenuItem} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Avocado Toast"
                    value={newMenuName}
                    onChange={(e) => setNewMenuName(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <select
                      value={newMenuCategory}
                      onChange={(e) => setNewMenuCategory(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Starters</option>
                      <option>Mains</option>
                      <option>Desserts</option>
                      <option>Beverages</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 290"
                      value={newMenuPrice}
                      onChange={(e) => setNewMenuPrice(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item Emoji</label>
                  <input
                    type="text"
                    placeholder="🍲"
                    value={newMenuEmoji}
                    onChange={(e) => setNewMenuEmoji(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Short Description</label>
                  <textarea
                    placeholder="Smooth spread, perfectly cooked sourdough base..."
                    value={newMenuDesc}
                    onChange={(e) => setNewMenuDesc(e.target.value)}
                    rows={2}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-xl transition"
                >
                  Create & Append Menu Item
                </button>
              </form>
            </div>

            {/* List and toggle item availability */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:col-span-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">
                Active Tenant Catalog ({menuItems.length})
              </h3>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{item.name}</span>
                          <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono font-bold uppercase">{item.category}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold font-mono text-indigo-400">₹{parseFloat(item.price)}</span>
                      <button
                        onClick={() => handleToggleMenuAvailability(item.itemId, item.available)}
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded ${
                          item.available
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {item.available ? "In Stock" : "Sold Out"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Inventory Stock */}
        {activeTab === "inventory" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-1">Raw Ingredient Recipes & Stock Levels</h2>
              <p className="text-xs text-slate-400">Track and replenish stocks. When consumers place orders, recipes consume inventory automatically.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-mono text-[10px] pb-3">
                    <th className="pb-2">Ingredient Name</th>
                    <th className="pb-2">Current Stock Balance</th>
                    <th className="pb-2">Minimum Warning Threshold</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action Quick-Supply</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {inventory.map((inv) => {
                    const isLow = inv.stock <= inv.lowStockAlert;
                    return (
                      <tr key={inv.id} className="hover:bg-slate-800/20 transition">
                        <td className="py-3 font-bold text-white">{inv.ingredient}</td>
                        <td className="py-3 font-mono">
                          {inv.stock} {inv.ingredient === "Limes" || inv.ingredient === "Beef Patty" ? "units" : "grams"}
                        </td>
                        <td className="py-3 font-mono text-slate-400">{inv.lowStockAlert}</td>
                        <td className="py-3">
                          <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded ${
                            isLow
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}>
                            {isLow ? "Low Stock Alert" : "Healthy Stock"}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleReplenishInventory(inv.id, inv.stock)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white px-3 py-1 rounded-lg transition"
                          >
                            Replenish +1,000
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: Staff Directory */}
        {activeTab === "staff" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-1">Culinary Team Staff Directory</h2>
              <p className="text-xs text-slate-400">Review shift schedules, salary metrics, and employee ratings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {employees.map((emp) => (
                <div key={emp.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">{emp.name}</span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                      {emp.role}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-400 border-t border-slate-900 pt-3">
                    <div className="flex justify-between">
                      <span>Monthly Salary:</span>
                      <span className="font-bold text-white">₹{emp.salary?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Shift:</span>
                      <span className="font-mono text-white">09:00 AM - 09:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance Rating:</span>
                      <span className="font-mono text-amber-400 font-bold">★ {emp.performanceRating || "5.0"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: Audit Logs */}
        {activeTab === "logs" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-1">Chronological Operation Audit Logs</h2>
              <p className="text-xs text-slate-400">Enterprise compliant logs monitoring configuration changes, dining sessions, and payments.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl max-h-[350px] overflow-y-auto p-4 space-y-2">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-slate-600 text-xs font-mono">No audit logs written to database block yet.</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="border-b border-slate-900 pb-2.5 last:border-0 text-xs flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono font-bold px-1.5 py-0.5 rounded">
                          {log.action}
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">by {log.userEmail}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
