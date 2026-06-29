/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Users, LayoutGrid, UtensilsCrossed, ClipboardList, TrendingUp, BarChart3, 
  Settings, LogOut, Check, X, AlertTriangle, Plus, Edit, Trash2, Shield, Clock, 
  RefreshCw, DollarSign, Calendar, Landmark, Coffee, FileText, Gift, Award
} from "lucide-react";

interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  status: string;
  assignedWaiter: string | null;
  currentBill: string;
  occupiedTime: string | null;
  qrCodeUrl: string | null;
}

interface MenuItem {
  id: number;
  itemId: string;
  name: string;
  category: string;
  price: string;
  emoji: string;
  description: string;
  image: string;
  isChefPick: boolean;
  isTrending: boolean;
  available: boolean;
  preparationTime: number;
  calories: number;
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  customization: string | null;
  price: string;
  category: string | null;
}

interface Order {
  id: number;
  orderNumber: string;
  tableNumber: string;
  status: string;
  allergyNote: string | null;
  kitchenNote: string | null;
  waiterNotified: boolean;
  createdAt: string;
  items: OrderItem[];
}

interface ServiceRequest {
  id: number;
  tableNumber: string;
  requestType: string;
  status: string;
  createdAt: string;
}

interface Reservation {
  id: number;
  customerName: string;
  customerEmail: string | null;
  date: string;
  time: string;
  guests: number;
  specialRequests: string | null;
  status: string;
}

interface InventoryItem {
  id: number;
  ingredient: string;
  stock: number;
  lowStockAlert: number;
  expiryDate: string | null;
  supplier: string | null;
}

interface Employee {
  id: number;
  name: string;
  role: string;
  shiftStart: string | null;
  shiftEnd: string | null;
  salary: number | null;
  performanceRating: string | null;
}

interface Analytics {
  todaySales: number;
  occupiedTables: number;
  tableOccupancyRate: number;
  avgServingTime: number;
  avgCookingTime: number;
  lowStockItems: number;
  recentOrdersCount: number;
}

interface StaffPortalProps {
  role: string; // Admin, Manager, Cashier, Waiter, Chef
  onLogout: () => void;
}

export default function StaffPortal({ role, onLogout }: StaffPortalProps) {
  const [activeTab, setActiveTab] = useState<string>("");
  
  // Data State
  const [tables, setTables] = useState<Table[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    todaySales: 15430,
    occupiedTables: 3,
    tableOccupancyRate: 38,
    avgServingTime: 12,
    avgCookingTime: 10,
    lowStockItems: 1,
    recentOrdersCount: 5
  });

  // UI state for creating/editing menu item modal
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuItemForm, setMenuItemForm] = useState({
    itemId: "",
    name: "",
    category: "Mains",
    price: "",
    emoji: "🍔",
    description: "",
    image: "",
    isChefPick: false,
    isTrending: false,
    available: true,
    preparationTime: 15,
    calories: 350
  });

  // Toast notifications
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Determine starting tab based on role
  useEffect(() => {
    if (role === "Admin" || role === "Manager") {
      setActiveTab("Analytics");
    } else if (role === "Waiter") {
      setActiveTab("FloorPlan");
    } else if (role === "Cashier") {
      setActiveTab("POSCheckout");
    } else {
      setActiveTab("FloorPlan");
    }
    fetchData();
  }, [role]);

  // General Fetch Data helper to connect real DB tables
  const fetchData = async () => {
    try {
      const [
        tablesRes, menuRes, ordersRes, requestsRes,
        reservationsRes, inventoryRes, employeesRes, analyticsRes
      ] = await Promise.all([
        fetch("/api/tables").then(r => r.json()),
        fetch("/api/menu").then(r => r.json()),
        fetch("/api/orders").then(r => r.json()),
        fetch("/api/requests").then(r => r.json()),
        fetch("/api/reservations").then(r => r.json()),
        fetch("/api/inventory").then(r => r.json()),
        fetch("/api/employees").then(r => r.json()),
        fetch("/api/analytics").then(r => r.json())
      ]);

      setTables(tablesRes || []);
      setMenu(menuRes || []);
      setOrders(ordersRes || []);
      setRequests(requestsRes || []);
      setReservations(reservationsRes || []);
      setInventory(inventoryRes || []);
      setEmployees(employeesRes || []);
      setAnalytics(analyticsRes || {
        todaySales: 15430,
        occupiedTables: 3,
        tableOccupancyRate: 38,
        avgServingTime: 12,
        avgCookingTime: 10,
        lowStockItems: 1,
        recentOrdersCount: 5
      });
    } catch (err) {
      console.error("Failed to load staff data", err);
      triggerToast("Network error loading dashboard data", "error");
    }
  };

  // 1. Table status update handler
  const handleUpdateTableStatus = async (tableId: number, status: string, waiter?: string) => {
    try {
      const res = await fetch(`/api/tables/${tableId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, waiter })
      });
      if (res.ok) {
        const updated = await res.json();
        setTables(prev => prev.map(t => t.id === tableId ? updated : t));
        triggerToast(`Table status changed to ${status}`);
        fetchData();
      }
    } catch (err) {
      triggerToast("Failed to update status", "error");
    }
  };

  // 2. Clear table and checkout
  const handleCheckoutTable = async (tableNumber: string, paymentMethod: string = "UPI") => {
    try {
      const res = await fetch(`/api/tables/${tableNumber}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod })
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast(data.msg);
        fetchData();
      }
    } catch (err) {
      triggerToast("Checkout request failed", "error");
    }
  };

  // 3. Service Request resolver
  const handleResolveRequest = async (requestId: number) => {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" })
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests(prev => prev.map(r => r.id === requestId ? updated : r));
        triggerToast("Request marked completed!");
      }
    } catch (err) {
      triggerToast("Action failed", "error");
    }
  };

  // 4. Menu manager submissions
  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...menuItemForm,
          price: parseFloat(menuItemForm.price) || 100
        })
      });
      if (res.ok) {
        const newItem = await res.json();
        setMenu(prev => [...prev, newItem]);
        setShowMenuModal(false);
        triggerToast("New menu item created!");
        setMenuItemForm({
          itemId: "",
          name: "",
          category: "Mains",
          price: "",
          emoji: "🍔",
          description: "",
          image: "",
          isChefPick: false,
          isTrending: false,
          available: true,
          preparationTime: 15,
          calories: 350
        });
      }
    } catch (err) {
      triggerToast("Failed to add menu item", "error");
    }
  };

  const handleToggleMenuAvailability = async (itemId: string, currentVal: boolean) => {
    try {
      const res = await fetch(`/api/menu/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !currentVal })
      });
      if (res.ok) {
        const updated = await res.json();
        setMenu(prev => prev.map(m => m.itemId === itemId ? updated : m));
        triggerToast(`Item status set to ${!currentVal ? "Available" : "Unavailable"}`);
      }
    } catch (err) {
      triggerToast("Failed to update availability", "error");
    }
  };

  // 5. Stock Level adjustments
  const handleUpdateStock = async (id: number, newStock: string) => {
    try {
      const val = parseInt(newStock);
      if (isNaN(val)) return;
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: val })
      });
      if (res.ok) {
        const updated = await res.json();
        setInventory(prev => prev.map(i => i.id === id ? updated : i));
        triggerToast("Stock updated successfully");
        fetchData();
      }
    } catch (err) {
      triggerToast("Update failed", "error");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0d0e12] text-slate-100 flex flex-col md:flex-row font-sans overflow-x-hidden selection:bg-orange-500/20">
      
      {/* Toast Banner Overlay */}
      {toast && (
        <div className="fixed top-6 right-6 z-[100] bg-slate-900 border border-emerald-500/30 shadow-emerald-500/10 shadow-2xl p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === "error" ? "bg-rose-500" : toast.type === "info" ? "bg-sky-500" : "bg-emerald-500"}`}></div>
          <span className="text-xs font-semibold text-slate-200">{toast.msg}</span>
        </div>
      )}

      {/* Modern POS Side Navigation Panel */}
      <aside className="w-full md:w-72 shrink-0 bg-[#12131a] border-b md:border-b-0 md:border-r border-slate-800/60 p-6 flex flex-col justify-between z-40">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">BiteFlow Staff</h2>
              <span className="text-[10px] font-mono text-orange-500 font-black uppercase tracking-widest">{role} Station</span>
            </div>
          </div>

          <div className="w-full h-px bg-slate-800/50"></div>

          {/* Role Aware Navigation Options */}
          <nav className="space-y-1.5">
            {(role === "Admin" || role === "Manager") && (
              <button 
                onClick={() => setActiveTab("Analytics")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-all ${activeTab === "Analytics" ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"}`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Advanced Analytics</span>
              </button>
            )}

            <button 
              onClick={() => setActiveTab("FloorPlan")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-all ${activeTab === "FloorPlan" ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"}`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Tables Floor Plan</span>
            </button>

            <button 
              onClick={() => setActiveTab("MenuManager")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-all ${activeTab === "MenuManager" ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"}`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Digital Menu Builder</span>
            </button>

            <button 
              onClick={() => setActiveTab("RequestsCalls")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-all relative ${activeTab === "RequestsCalls" ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"}`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Live Support Calls</span>
              {requests.filter(r => r.status === "PENDING").length > 0 && (
                <span className="absolute right-3 bg-rose-500 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {requests.filter(r => r.status === "PENDING").length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab("ReservationsBook")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-all ${activeTab === "ReservationsBook" ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"}`}
            >
              <Calendar className="w-4 h-4" />
              <span>Table Reservations</span>
            </button>

            <button 
              onClick={() => setActiveTab("InventoryRecipes")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-all relative ${activeTab === "InventoryRecipes" ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"}`}
            >
              <Coffee className="w-4 h-4" />
              <span>Smart Stock Control</span>
              {inventory.filter(i => i.stock <= i.lowStockAlert).length > 0 && (
                <span className="absolute right-3 bg-amber-500 text-slate-950 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {inventory.filter(i => i.stock <= i.lowStockAlert).length}
                </span>
              )}
            </button>

            {(role === "Admin" || role === "Manager") && (
              <button 
                onClick={() => setActiveTab("EmployeeShifts")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-all ${activeTab === "EmployeeShifts" ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"}`}
              >
                <Users className="w-4 h-4" />
                <span>Employee & Shifts</span>
              </button>
            )}
          </nav>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-slate-800/30 border border-slate-800/60 p-3 rounded-xl flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md shadow-orange-500/10">
              {role.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-300">Station {role.slice(0, 3)}1</span>
              <span className="text-[10px] font-mono text-slate-500">Live DB Active</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 rounded-xl font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-8 bg-[#09090d] overflow-y-auto max-h-screen">
        
        {/* ====================================
            VIEW: ADVANCED ANALYTICS (Admin/Manager)
            ==================================== */}
        {activeTab === "Analytics" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-black text-white leading-none">Command Center Analytics</h1>
                <p className="text-slate-400 text-xs mt-2 font-medium">BiteFlow real-time system performance monitor</p>
              </div>
              <button onClick={fetchData} className="px-4 py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-xs font-bold flex items-center gap-2 self-start active:scale-95 transition-all">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Stats</span>
              </button>
            </div>

            {/* Micro KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#12131a] border border-slate-800/60 p-5 rounded-2xl flex flex-col gap-1 shadow-md shadow-black/20">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Today's Total Sales</span>
                <span className="font-mono text-xl md:text-2xl font-black text-emerald-400 mt-1">₹{analytics.todaySales}</span>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% from yesterday</span>
                </div>
              </div>

              <div className="bg-[#12131a] border border-slate-800/60 p-5 rounded-2xl flex flex-col gap-1 shadow-md shadow-black/20">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Table Occupancy</span>
                <span className="font-mono text-xl md:text-2xl font-black text-orange-400 mt-1">{analytics.tableOccupancyRate}%</span>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2 font-medium">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>{analytics.occupiedTables} Active dining tables</span>
                </div>
              </div>

              <div className="bg-[#12131a] border border-slate-800/60 p-5 rounded-2xl flex flex-col gap-1 shadow-md shadow-black/20">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Avg Preparation Time</span>
                <span className="font-mono text-xl md:text-2xl font-black text-amber-400 mt-1">{analytics.avgCookingTime} <span className="text-xs font-sans font-medium text-slate-400">mins</span></span>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>-2.1% faster flow</span>
                </div>
              </div>

              <div className="bg-[#12131a] border border-slate-800/60 p-5 rounded-2xl flex flex-col gap-1 shadow-md shadow-black/20">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Low Stock Ingredients</span>
                <span className={`font-mono text-xl md:text-2xl font-black mt-1 ${analytics.lowStockItems > 0 ? "text-rose-400" : "text-emerald-400"}`}>{analytics.lowStockItems} Items</span>
                <div className="flex items-center gap-1.5 text-[10px] mt-2 font-bold">
                  <AlertTriangle className={`w-3.5 h-3.5 ${analytics.lowStockItems > 0 ? "text-rose-500 animate-pulse" : "text-emerald-500"}`} />
                  <span className={analytics.lowStockItems > 0 ? "text-rose-500" : "text-emerald-500"}>{analytics.lowStockItems > 0 ? "Needs immediate restock" : "Inventory optimal"}</span>
                </div>
              </div>
            </div>

            {/* Advanced Visual Charts Section (Pure custom-styled SVGs) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Daily Revenue Trend */}
              <div className="bg-[#12131a] border border-slate-800/60 p-6 rounded-3xl shadow-lg shadow-black/40">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Weekly Revenue Flow</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">₹ Amounts in thousands</p>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase">Weekly Trend</span>
                </div>

                {/* Vector Area Chart */}
                <div className="w-full h-44 flex items-end relative px-2">
                  <div className="absolute inset-0 flex flex-col justify-between py-1 border-b border-dashed border-slate-800">
                    {[1, 2, 3, 4].map((_, idx) => (
                      <div key={idx} className="w-full border-t border-dashed border-slate-800/40 h-px"></div>
                    ))}
                  </div>

                  {/* SVG Line & Area */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,150 L0,120 L50,90 L100,110 L150,60 L200,45 L250,70 L300,30 L350,55 L400,15 L400,150 Z" fill="url(#grad)" />
                    <path d="M0,120 L50,90 L100,110 L150,60 L200,45 L250,70 L300,30 L350,55 L400,15" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                  </svg>

                  {/* Days labels */}
                  <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2 text-[9px] font-mono text-slate-500">
                    <span>MON</span>
                    <span>TUE</span>
                    <span>WED</span>
                    <span>THU</span>
                    <span>FRI</span>
                    <span>SAT</span>
                    <span>SUN</span>
                  </div>
                </div>
              </div>

              {/* Chart 2: Category Popularity Distribution */}
              <div className="bg-[#12131a] border border-slate-800/60 p-6 rounded-3xl shadow-lg shadow-black/40">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Category Share Distribution</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Based on volume of placed orders</p>
                  </div>
                  <span className="bg-orange-500/10 text-orange-400 border border-orange-500/10 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase">Sales Share</span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-around gap-6 h-44">
                  {/* Circular Pie representation in SVG */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      {/* Base Background Circle */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1e293b" strokeWidth="3" />
                      {/* Mains Segment (50%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="50 50" strokeDashoffset="0" />
                      {/* Starters Segment (30%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="-50" />
                      {/* Desserts Segment (12%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="12 88" strokeDashoffset="-80" />
                      {/* Beverages Segment (8%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="8 92" strokeDashoffset="-92" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-mono text-lg font-black text-white">100%</span>
                      <span className="text-[8px] font-sans text-slate-500 uppercase font-black tracking-wider">Covered</span>
                    </div>
                  </div>

                  {/* Legend list */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                      <span className="text-slate-300">Mains</span>
                      <span className="text-slate-500 font-mono text-[10px] ml-auto">50%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                      <span className="text-slate-300">Starters</span>
                      <span className="text-slate-500 font-mono text-[10px] ml-auto">30%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-300">Desserts</span>
                      <span className="text-slate-500 font-mono text-[10px] ml-auto">12%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-300">Beverages</span>
                      <span className="text-slate-500 font-mono text-[10px] ml-auto">8%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ====================================
            VIEW: TABLES FLOOR PLAN
            ==================================== */}
        {activeTab === "FloorPlan" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-black text-white leading-none">Restaurant Layout Floor Plan</h1>
              <p className="text-slate-400 text-xs mt-2 font-medium">Manage tables seating, assignments and checkouts in real-time</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tables.map(table => {
                const isOccupied = table.status !== "Available" && table.status !== "Cleaning";
                const isReady = table.status === "Ready";
                const isBillReq = table.status === "Bill Requested";
                const isCleaning = table.status === "Cleaning";

                return (
                  <div 
                    key={table.id} 
                    className={`bg-[#12131a] border rounded-3xl p-5 flex flex-col justify-between transition-all relative ${
                      isBillReq 
                        ? "border-rose-500/60 shadow-lg shadow-rose-500/5" 
                        : isCleaning 
                        ? "border-amber-500/50" 
                        : isOccupied 
                        ? "border-orange-500/45 shadow-md" 
                        : "border-slate-800/60"
                    }`}
                  >
                    {/* Header line of the table */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="font-display text-lg font-black text-white leading-none">{table.tableNumber}</span>
                        <span className="text-[9px] text-slate-500 font-mono mt-1 font-bold">CAPACITY: {table.capacity} GUESTS</span>
                      </div>
                      
                      <span className={`text-[9px] font-mono font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isBillReq 
                          ? "bg-rose-500/20 text-rose-400 animate-pulse" 
                          : isCleaning 
                          ? "bg-amber-500/20 text-amber-400" 
                          : isOccupied 
                          ? "bg-orange-500/20 text-orange-400" 
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {table.status}
                      </span>
                    </div>

                    {/* Table metrics or info */}
                    <div className="space-y-3 mb-5 text-xs font-medium text-slate-400">
                      {isOccupied ? (
                        <>
                          <div className="flex justify-between items-center py-1 border-b border-slate-800/30">
                            <span>Assigned:</span>
                            <span className="text-slate-200 font-bold">{table.assignedWaiter || "Floor Waiter"}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-800/30">
                            <span>Current Bill:</span>
                            <span className="text-emerald-400 font-bold font-mono">₹{table.currentBill}</span>
                          </div>
                          {table.occupiedTime && (
                            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                              <span>Occupied Since:</span>
                              <span>{new Date(table.occupiedTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-6 text-slate-600 italic">
                          <span>Ready for guest placement</span>
                        </div>
                      )}
                    </div>

                    {/* Table control actions */}
                    <div className="space-y-2">
                      {isOccupied ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleUpdateTableStatus(table.id, "Available")}
                            className="flex-1 py-2 border border-slate-800 hover:bg-slate-800 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all"
                          >
                            Vacate
                          </button>
                          <button 
                            onClick={() => handleCheckoutTable(table.tableNumber)}
                            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all"
                          >
                            Pay & Clear
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleUpdateTableStatus(table.id, "Ordering", "Sanjay Mehta")}
                          className="w-full py-2.5 bg-orange-500 text-slate-950 hover:bg-orange-600 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all"
                        >
                          Seat Guests
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================
            VIEW: DIGITAL MENU BUILDER (Admin/Manager)
            ==================================== */}
        {activeTab === "MenuManager" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-black text-white leading-none">Digital Menu Builder</h1>
                <p className="text-slate-400 text-xs mt-2 font-medium">Add new dishes, schedule pricing, and manage availability</p>
              </div>
              <button 
                onClick={() => setShowMenuModal(true)}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 self-start shadow-lg shadow-orange-500/10 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Item</span>
              </button>
            </div>

            {/* Categorized Grid of Menu Items */}
            <div className="space-y-12">
              {["Starters", "Mains", "Desserts", "Beverages"].map(category => {
                const categoryItems = menu.filter(m => m.category === category);
                return (
                  <section key={category} className="space-y-4">
                    <h2 className="text-sm font-black font-display text-orange-400 tracking-wider uppercase border-l-2 border-orange-500 pl-3">
                      {category} ({categoryItems.length})
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryItems.map(item => (
                        <article 
                          key={item.id} 
                          className={`bg-[#12131a] border border-slate-800/60 rounded-3xl overflow-hidden flex flex-col ${!item.available ? "opacity-60 grayscale" : ""}`}
                        >
                          <div className="h-44 w-full relative bg-slate-800/40">
                            <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md w-9 h-9 rounded-full flex items-center justify-center text-lg">
                              {item.emoji}
                            </div>
                            
                            {item.isChefPick && (
                              <span className="absolute top-3 right-3 bg-orange-500 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest font-mono shadow-md">
                                Chef Choice
                              </span>
                            )}
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-start">
                                <h3 className="font-sans text-sm font-bold text-slate-200">{item.name}</h3>
                                <span className="font-mono text-sm font-black text-emerald-400">₹{item.price}</span>
                              </div>
                              <p className="text-slate-400 text-xs font-medium leading-relaxed italic">"{item.description}"</p>
                              
                              <div className="flex gap-4 text-[10px] font-mono text-slate-500">
                                <span>Prep: {item.preparationTime}m</span>
                                <span>•</span>
                                <span>{item.calories} Calories</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center gap-4 pt-3 border-t border-slate-800/50">
                              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Availability</span>
                              
                              <button 
                                onClick={() => handleToggleMenuAvailability(item.itemId, item.available)}
                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                                  item.available 
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                                    : "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                                }`}
                              >
                                {item.available ? "ACTIVE" : "OUT OF STOCK"}
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================
            VIEW: LIVE SUPPORT CALLS (Requests)
            ==================================== */}
        {activeTab === "RequestsCalls" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-black text-white leading-none">Live Support Calls</h1>
              <p className="text-slate-400 text-xs mt-2 font-medium">Active table alerts, customer service calls and checkouts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map(req => {
                const isPending = req.status === "PENDING";
                const isBill = req.requestType === "Need Bill";

                return (
                  <div 
                    key={req.id} 
                    className={`bg-[#12131a] border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                      isPending 
                        ? isBill 
                          ? "border-rose-500/60 shadow-lg glow-rose" 
                          : "border-orange-500/50" 
                        : "border-slate-800/30 opacity-60"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                          isPending 
                            ? isBill 
                              ? "bg-rose-500/15 text-rose-400" 
                              : "bg-orange-500/15 text-orange-400" 
                            : "bg-slate-800 text-slate-500"
                        }`}>
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-sans text-xs font-bold text-slate-200">{req.requestType}</span>
                          <span className="font-display text-[15px] font-black text-slate-100">{req.tableNumber}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        isPending ? "bg-orange-500/20 text-orange-400 animate-pulse" : "bg-slate-800 text-slate-500"
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 font-mono mb-5">
                      Logged at {new Date(req.createdAt).toLocaleTimeString()}
                    </p>

                    {isPending ? (
                      <button 
                        onClick={() => handleResolveRequest(req.id)}
                        className="w-full py-2.5 bg-orange-500 text-slate-950 hover:bg-orange-600 rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
                      >
                        Resolve Call
                      </button>
                    ) : (
                      <div className="py-2 bg-slate-800/30 border border-slate-800/60 rounded-xl text-center text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                        RESOLVED
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================
            VIEW: TABLE RESERVATIONS
            ==================================== */}
        {activeTab === "ReservationsBook" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-black text-white leading-none">Table Reservations</h1>
              <p className="text-slate-400 text-xs mt-2 font-medium">Real-time table booking directory</p>
            </div>

            <div className="bg-[#12131a] border border-slate-800/60 rounded-3xl overflow-hidden shadow-lg shadow-black/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#171922] border-b border-slate-800/60 text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
                      <th className="p-4 pl-6">Guest Name</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Guests</th>
                      <th className="p-4">Special Request</th>
                      <th className="p-4 pr-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-xs font-semibold text-slate-300">
                    {reservations.map(res => (
                      <tr key={res.id} className="hover:bg-slate-800/10">
                        <td className="p-4 pl-6 font-bold text-slate-200">{res.customerName}</td>
                        <td className="p-4 font-mono text-slate-400 text-[11px]">{res.customerEmail || "N/A"}</td>
                        <td className="p-4 font-mono text-slate-300">{res.date} • {res.time}</td>
                        <td className="p-4 font-bold text-orange-400">{res.guests} Pax</td>
                        <td className="p-4 max-w-[200px] truncate text-slate-400 italic">"{res.specialRequests || "None"}"</td>
                        <td className="p-4 pr-6">
                          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/10 px-2.5 py-1 rounded-full text-[9px] font-mono font-black uppercase">
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====================================
            VIEW: SMART INVENTORY (Stock levels)
            ==================================== */}
        {activeTab === "InventoryRecipes" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-black text-white leading-none">Smart Stock Control</h1>
              <p className="text-slate-400 text-xs mt-2 font-medium">Automatic stock consumption tracking and direct adjustments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.map(item => {
                const isLow = item.stock <= item.lowStockAlert;
                return (
                  <div 
                    key={item.id} 
                    className={`bg-[#12131a] border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                      isLow ? "border-rose-500/60 shadow-lg shadow-rose-500/5 animate-pulse-red" : "border-slate-800/60"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="font-sans text-xs font-bold text-slate-200">{item.ingredient}</span>
                        <span className="text-[10px] text-slate-500 font-mono mt-1 font-semibold">SUPPLIER: {item.supplier || "N/A"}</span>
                      </div>
                      
                      {isLow && (
                        <div className="flex items-center gap-1.5 bg-rose-500/15 text-rose-400 border border-rose-500/10 px-2.5 py-1 rounded-full text-[8px] font-mono font-black uppercase">
                          <AlertTriangle className="w-3 h-3" />
                          <span>LOW STOCK</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 mb-5">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Stock level</span>
                        <span className={`font-mono text-lg font-black ${isLow ? "text-rose-400" : "text-slate-100"}`}>
                          {item.stock} <span className="text-xs font-sans text-slate-400 font-medium">units</span>
                        </span>
                      </div>

                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isLow ? "bg-rose-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min(100, (item.stock / (item.lowStockAlert * 3)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/40 flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="New qty..." 
                        defaultValue={item.stock}
                        onBlur={(e) => handleUpdateStock(item.id, e.target.value)}
                        className="w-20 bg-[#171922] border border-slate-800/60 rounded-lg p-1.5 font-mono text-xs text-center text-slate-300 focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-[10px] font-sans text-slate-500">Edit and blur to save</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================
            VIEW: EMPLOYEE SHIFTS & ATTENDANCE
            ==================================== */}
        {activeTab === "EmployeeShifts" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-black text-white leading-none">Employee & Shifts Directory</h1>
              <p className="text-slate-400 text-xs mt-2 font-medium">Track personnel shifts, salaries, and performance reviews</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {employees.map(emp => (
                <div key={emp.id} className="bg-[#12131a] border border-slate-800/60 rounded-3xl p-5 flex flex-col gap-4 shadow-md shadow-black/20">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-sans text-sm font-black text-slate-200">{emp.name}</span>
                      <span className="text-[10px] text-orange-500 font-mono font-bold uppercase tracking-wider mt-1">{emp.role}</span>
                    </div>
                    
                    <div className="bg-slate-800 px-2 py-0.5 rounded font-mono text-[9px] text-slate-400 font-bold uppercase">
                      ID: #{emp.id}0
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-semibold text-slate-400">
                    <div className="flex justify-between py-1 border-b border-slate-800/30">
                      <span>Shift Timings:</span>
                      <span className="text-slate-300 font-mono">{emp.shiftStart} - {emp.shiftEnd}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/30">
                      <span>Monthly Salary:</span>
                      <span className="text-emerald-400 font-mono">₹{emp.salary}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/30">
                      <span>Performance:</span>
                      <span className="text-amber-400 font-mono">⭐ {emp.performanceRating || "5.0"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* CREATE NEW MENU ITEM MODAL DIALOG */}
      {showMenuModal && (
        <div className="fixed inset-0 z-[80] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12131a] border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-4">
              <h3 className="font-display text-lg font-black text-white">Create New Menu Item</h3>
              <button onClick={() => setShowMenuModal(false)} className="p-1 text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMenuItem} className="space-y-4 text-xs font-semibold text-slate-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Item Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g., Spicy Momos" 
                    value={menuItemForm.name}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#171922] border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-orange-500 font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Category</label>
                  <select 
                    value={menuItemForm.category}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#171922] border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-orange-500 font-sans"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Price (₹)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="350" 
                    value={menuItemForm.price}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full bg-[#171922] border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Emoji Icon</label>
                  <input 
                    type="text" 
                    placeholder="🍢" 
                    value={menuItemForm.emoji}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, emoji: e.target.value }))}
                    className="w-full bg-[#171922] border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label>Description</label>
                <textarea 
                  placeholder="Describe the dish taste and style..." 
                  rows={2}
                  value={menuItemForm.description}
                  onChange={(e) => setMenuItemForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#171922] border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label>Unsplash Image URL</label>
                <input 
                  type="text" 
                  placeholder="https://images.unsplash.com/photo-..." 
                  value={menuItemForm.image}
                  onChange={(e) => setMenuItemForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full bg-[#171922] border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={menuItemForm.isChefPick}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, isChefPick: e.target.checked }))}
                    className="accent-orange-500"
                  />
                  <span>Chef's Choice</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={menuItemForm.isTrending}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, isTrending: e.target.checked }))}
                    className="accent-orange-500"
                  />
                  <span>Trending Item</span>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-slate-950 rounded-xl font-display font-black text-xs uppercase tracking-widest transition-all"
              >
                Insert to Live Database
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
