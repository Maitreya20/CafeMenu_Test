/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ActiveTab, CartItem, OrderTicket, TableSession, MenuItem } from "./types";
import { INITIAL_TICKETS } from "./data";

import MenuScreen from "./components/MenuScreen";
import CartScreen from "./components/CartScreen";
import BillScreen from "./components/BillScreen";
import ProfileScreen from "./components/ProfileScreen";
import KitchenScreen from "./components/KitchenScreen";
import PINOverlay from "./components/PINOverlay";
import StaffPortal from "./components/StaffPortal";

// SaaS Platform Specific Components
import SaaSPlatformHeader from "./components/SaaSPlatformHeader";
import SaaSSetupWizard from "./components/SaaSSetupWizard";
import SaaSSuperAdmin from "./components/SaaSSuperAdmin";
import SaaSTenantDashboard from "./components/SaaSTenantDashboard";

import { Utensils, ShoppingCart, Receipt, ShieldAlert, User, ChefHat } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("Menu");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tickets, setTickets] = useState<OrderTicket[]>([]);
  const [session, setSession] = useState<TableSession>({
    tableNumber: "Table 4",
    startTime: "7:32 PM",
    points: 850,
    totalPointsNeeded: 1000,
    dietaryPreferences: {
      showVegOnly: false,
      showSpiceLevel: true,
    },
  });

  const [kitchenAuthenticated, setKitchenAuthenticated] = useState(false);
  const [staffRole, setStaffRole] = useState<string>("");
  const [showPinOverlay, setShowPinOverlay] = useState(false);

  // ==========================================
  // MULTI-TENANT SAAS CONTROLLER STATES
  // ==========================================
  const [activeSaaSView, setActiveSaaSView] = useState<string>("Consumer");
  const [tenants, setTenants] = useState<any[]>([]);
  const [activeTenantId, setActiveTenantId] = useState<number>(1);
  const [activeTenantConfig, setActiveTenantConfig] = useState<any>(null);
  const [dynamicMenu, setDynamicMenu] = useState<MenuItem[]>([]);

  // 1. Fetch Tenants list from SaaS backend API
  const fetchSaaSTenants = async (selectId?: number) => {
    try {
      const response = await fetch("/api/saas/organizations");
      if (response.ok) {
        const data = await response.json();
        setTenants(data);

        // Resolve current active tenant configurations
        const currentId = selectId !== undefined ? selectId : activeTenantId;
        const currentT = data.find((t: any) => t.id === currentId) || data[0];
        if (currentT) {
          setActiveTenantId(currentT.id);
          setActiveTenantConfig(currentT);
          applyTenantThemeVariables(currentT);
          await syncTenantData(currentT.id);
        }
      }
    } catch (err) {
      console.error("Failed to load SaaS tenants list:", err);
    }
  };

  // 2. Synchronize active isolated tenant menu items, tickets, and tables
  const syncTenantData = async (tenantIdToSync: number) => {
    try {
      const headers = { "x-organization-id": tenantIdToSync.toString() };

      // A. Fetch isolated active menu items
      const menuRes = await fetch("/api/menu", { headers });
      if (menuRes.ok) {
        const mData = await menuRes.json();
        const formattedMenu = mData.map((item: any) => ({
          id: item.itemId,
          name: item.name,
          category: item.category,
          price: parseFloat(item.price),
          emoji: item.emoji,
          description: item.description,
          image: item.image,
          isChefPick: item.isChefPick,
          isTrending: item.isTrending,
        }));
        setDynamicMenu(formattedMenu);
      }

      // B. Fetch isolated tickets/orders
      const ordersRes = await fetch("/api/orders", { headers });
      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        const formattedTickets = oData.map((order: any) => ({
          id: `T${order.id}`,
          orderNumber: order.orderNumber,
          status: order.status,
          table: order.tableNumber,
          allergyNote: order.allergyNote || undefined,
          kitchenNote: order.kitchenNote || undefined,
          items: order.items.map((it: any) => ({
            name: it.name,
            quantity: it.quantity,
            customization: it.customization || undefined,
            category: it.category || undefined,
          })),
          receivedTime: new Date(order.createdAt),
          elapsedSeconds: Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 1000),
          waiterNotified: order.waiterNotified,
        }));
        setTickets(formattedTickets);
      }

      // C. Get first active table number dynamically
      const tableRes = await fetch("/api/tables", { headers });
      if (tableRes.ok) {
        const tableData = await tableRes.json();
        const defaultTable = tableData[0]?.tableNumber || "Table 4";
        setSession((prev) => ({
          ...prev,
          tableNumber: defaultTable,
        }));
      }
    } catch (err) {
      console.error("Failed to sync isolated tenant business streams:", err);
    }
  };

  // 3. Apply brand customizations directly into document root styles dynamically (White-Label theme mapping)
  const applyTenantThemeVariables = (tenant: any) => {
    if (!tenant) return;
    const root = document.documentElement;
    root.style.setProperty("--primary", tenant.primaryColor || "#ff6b35");
    root.style.setProperty("--secondary", tenant.secondaryColor || "#f7b05b");
    root.style.setProperty("--accent", tenant.accentColor || "#10b981");
    root.style.setProperty("--border-radius", tenant.borderRadius || "16px");
    root.style.setProperty("--font-family", tenant.fontFamily || "Inter");
  };

  useEffect(() => {
    fetchSaaSTenants();
  }, []);

  // When active tenant is selected
  const handleSelectTenant = (id: number) => {
    setActiveTenantId(id);
    setCart([]); // Clear cart to prevent item leakage between isolated tenants
    const selectedT = tenants.find((t) => t.id === id);
    if (selectedT) {
      setActiveTenantConfig(selectedT);
      applyTenantThemeVariables(selectedT);
      syncTenantData(id);
    }
  };

  // Update quantities in cart
  const handleUpdateQuantity = (menuItemId: string, change: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.menuItem.id === menuItemId);
      if (!existing) return prevCart;

      const newQty = existing.quantity + change;
      if (newQty <= 0) {
        return prevCart.filter((item) => item.menuItem.id !== menuItemId);
      } else {
        return prevCart.map((item) =>
          item.menuItem.id === menuItemId ? { ...item, quantity: newQty } : item
        );
      }
    });
  };

  // Add to cart from listing
  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prevCart.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        return [...prevCart, { menuItem: item, quantity: 1 }];
      }
    });
  };

  // Place Order to real Isolated API route
  const handlePlaceOrder = async (kitchenNote: string) => {
    if (cart.length === 0) return;

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": activeTenantId.toString(),
        },
        body: JSON.stringify({
          orderNumber: `#BF-${Math.floor(Math.random() * 9000) + 1000}`,
          tableNumber: session.tableNumber,
          allergyNote: session.dietaryPreferences.showVegOnly ? "VEGETARIAN ONLY" : undefined,
          kitchenNote: kitchenNote || undefined,
          items: cart.map((item) => ({
            itemId: item.menuItem.id,
            name: item.menuItem.name,
            quantity: item.quantity,
            customization: item.customization,
            category: item.menuItem.category,
            price: item.menuItem.price,
          })),
        }),
      });

      if (response.ok) {
        setCart([]); // Clear cart
        await syncTenantData(activeTenantId); // Re-sync order tickets & table states from server

        // Award loyalty points
        setSession((prev) => ({
          ...prev,
          points: Math.min(prev.totalPointsNeeded, prev.points + 50),
        }));
      }
    } catch (err) {
      console.error("Failed to place multi-tenant order:", err);
    }
  };

  // KDS Status Transition Handler
  const handleUpdateTicketStatus = async (ticketId: string, status: OrderTicket["status"]) => {
    const numericId = parseInt(ticketId.replace("T", ""), 10);
    try {
      const response = await fetch(`/api/orders/${numericId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": activeTenantId.toString(),
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        await syncTenantData(activeTenantId);
      }
    } catch (err) {
      console.error("Failed to update ticket status:", err);
    }
  };

  // Waiter notify simulation handler
  const handleNotifyWaiter = async (ticketId: string) => {
    const numericId = parseInt(ticketId.replace("T", ""), 10);
    try {
      const response = await fetch(`/api/orders/${numericId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": activeTenantId.toString(),
        },
        body: JSON.stringify({ waiterNotified: true }),
      });
      if (response.ok) {
        await syncTenantData(activeTenantId);
      }
    } catch (err) {
      console.error("Failed to notify waiter:", err);
    }
  };

  // General Call Waiter Handler (Service Request)
  const handleCallWaiter = async (reason: string) => {
    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": activeTenantId.toString(),
        },
        body: JSON.stringify({
          tableNumber: session.tableNumber,
          requestType: reason,
        }),
      });
    } catch (err) {
      console.error("Call waiter failed:", err);
    }
  };

  // Dietary Toggle Preference Updates
  const handleUpdatePreferences = (prefKey: "showVegOnly" | "showSpiceLevel", value: boolean) => {
    setSession((prev) => ({
      ...prev,
      dietaryPreferences: {
        ...prev.dietaryPreferences,
        [prefKey]: value,
      },
    }));
  };

  // Reset/Clear session after checkout (Table checkout)
  const handleClearBillAndSession = async (paymentMethod?: string) => {
    try {
      const response = await fetch(`/api/tables/${session.tableNumber}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": activeTenantId.toString(),
        },
        body: JSON.stringify({ paymentMethod: paymentMethod || "UPI" }),
      });

      if (response.ok) {
        setCart([]);
        await syncTenantData(activeTenantId);
        setSession((prev) => ({
          ...prev,
          points: 150, // reset to starting tier
        }));
        setActiveTab("Menu");
      }
    } catch (err) {
      console.error("Table checkout settlement failed:", err);
    }
  };

  const handleTabClick = (tab: ActiveTab) => {
    if (tab === "Kitchen") {
      if (!kitchenAuthenticated) {
        setShowPinOverlay(true);
      } else {
        setActiveTab("Kitchen");
      }
    } else {
      setActiveTab(tab);
    }
  };

  const handleKitchenLoginSuccess = (role: string) => {
    setStaffRole(role);
    setKitchenAuthenticated(true);
    setShowPinOverlay(false);
    if (role === "Chef") {
      setActiveTab("Kitchen");
    }
  };

  const handleKitchenLogout = () => {
    setKitchenAuthenticated(false);
    setStaffRole("");
    setActiveTab("Menu");
  };

  // If viewing active kitchen, use full widescreen container for maximum visibility
  const isWidescreenKDS = activeTab === "Kitchen" && kitchenAuthenticated && staffRole === "Chef";
  const isStaffPortalActive = kitchenAuthenticated && staffRole !== "" && staffRole !== "Chef";

  // New onboarding wizard callback
  const handleWizardSuccess = async (newOrgId: number) => {
    await fetchSaaSTenants(newOrgId);
    setActiveSaaSView("TenantDashboard");
  };

  return (
    <div className="min-h-screen bg-[#070707] text-on-surface flex flex-col justify-between selection:bg-primary-container/30">
      
      {/* 1. Global Interactive SaaS platform selector rail */}
      <SaaSPlatformHeader
        tenants={tenants}
        activeTenantId={activeTenantId}
        onSelectTenant={handleSelectTenant}
        onOpenWizard={() => setActiveSaaSView("SetupWizard")}
        onOpenSuperAdmin={() => setActiveSaaSView("SuperAdmin")}
        onOpenTenantDashboard={() => setActiveSaaSView("TenantDashboard")}
        activeView={activeSaaSView}
        onCloseSpecialView={() => setActiveSaaSView("Consumer")}
      />

      {/* 2. SaaS Special Views router */}
      {activeSaaSView === "SetupWizard" ? (
        <SaaSSetupWizard
          onSuccess={handleWizardSuccess}
          onClose={() => setActiveSaaSView("Consumer")}
        />
      ) : activeSaaSView === "SuperAdmin" ? (
        <SaaSSuperAdmin
          onClose={() => setActiveSaaSView("Consumer")}
          activeTenantId={activeTenantId}
          onSelectTenant={(id) => {
            handleSelectTenant(id);
            setActiveSaaSView("Consumer");
          }}
        />
      ) : activeSaaSView === "TenantDashboard" ? (
        <SaaSTenantDashboard
          tenantId={activeTenantId}
          onClose={() => setActiveSaaSView("Consumer")}
          onRefreshTenantConfig={() => fetchSaaSTenants(activeTenantId)}
        />
      ) : (
        /* ==========================================
           STANDARD CONSUMER / KITCHEN WORKFLOW BLOCK
           ========================================== */
        <div className="flex-1 flex flex-col justify-between">
          {isWidescreenKDS ? (
            <KitchenScreen
              tickets={tickets}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onLogout={handleKitchenLogout}
              onNotifyWaiter={handleNotifyWaiter}
            />
          ) : isStaffPortalActive ? (
            <StaffPortal
              role={staffRole}
              onLogout={handleKitchenLogout}
            />
          ) : (
            /* Render centered phone mock for all other consumer tabs */
            <div className="w-full max-w-[430px] mx-auto min-h-screen flex flex-col justify-between bg-background relative border-x border-outline-variant/10 shadow-2xl overflow-x-hidden">
              
              {/* Active Screen Renderer */}
              <div className="flex-1">
                {activeTab === "Menu" && (
                  <MenuScreen
                    cart={cart}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onNavigateToCart={() => setActiveTab("Cart")}
                    // We feed the dynamically styled menu from our PostgreSQL database here!
                    menuItems={dynamicMenu.length > 0 ? dynamicMenu : undefined}
                  />
                )}

                {activeTab === "Cart" && (
                  <CartScreen
                    cart={cart}
                    placedOrders={tickets}
                    onUpdateQuantity={handleUpdateQuantity}
                    onPlaceOrder={handlePlaceOrder}
                    onQuickAddSuggestion={handleAddToCart}
                  />
                )}

                {activeTab === "Bill" && (
                  <BillScreen
                    placedOrders={tickets}
                    onCallWaiter={handleCallWaiter}
                    onClearBillAndSession={handleClearBillAndSession}
                  />
                )}

                {activeTab === "Profile" && (
                  <ProfileScreen
                    session={session}
                    onUpdatePreferences={handleUpdatePreferences}
                    onCallWaiter={handleCallWaiter}
                  />
                )}
              </div>

              {/* Persistent Premium Bottom Tab Navigation Bar */}
              <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-[72px] px-4 pb-safe max-w-[430px] mx-auto bg-surface-container/80 backdrop-blur-2xl border-t border-outline-variant/20 rounded-t-[32px] shadow-[0_-4px_20px_0_rgba(255,107,53,0.1)]">
                {/* Menu */}
                <button
                  onClick={() => handleTabClick("Menu")}
                  className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 focus:outline-none ${
                    activeTab === "Menu" ? "text-primary font-black" : "text-on-surface-variant/70 hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px", fontVariationSettings: activeTab === "Menu" ? "'FILL' 1" : "'FILL' 0" }}>restaurant_menu</span>
                  <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Menu</span>
                  {activeTab === "Menu" && (
                    <span className="absolute -bottom-1.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
                  )}
                </button>

                {/* Cart */}
                <button
                  onClick={() => handleTabClick("Cart")}
                  className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 focus:outline-none ${
                    activeTab === "Cart" ? "text-primary font-black" : "text-on-surface-variant/70 hover:text-on-surface"
                  }`}
                >
                  <div className="relative">
                    <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px", fontVariationSettings: activeTab === "Cart" ? "'FILL' 1" : "'FILL' 0" }}>shopping_cart</span>
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1.5 bg-primary-container text-on-primary text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-background">
                        {cart.reduce((s, i) => s + i.quantity, 0)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Cart</span>
                  {activeTab === "Cart" && (
                    <span className="absolute -bottom-1.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
                  )}
                </button>

                {/* Bill */}
                <button
                  onClick={() => handleTabClick("Bill")}
                  className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 focus:outline-none ${
                    activeTab === "Bill" ? "text-primary font-black" : "text-on-surface-variant/70 hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px", fontVariationSettings: activeTab === "Bill" ? "'FILL' 1" : "'FILL' 0" }}>receipt_long</span>
                  <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Bill</span>
                  {activeTab === "Bill" && (
                    <span className="absolute -bottom-1.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
                  )}
                </button>

                {/* Kitchen Staff Panel */}
                <button
                  onClick={() => handleTabClick("Kitchen")}
                  className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 focus:outline-none ${
                    activeTab === "Kitchen" ? "text-primary font-black" : "text-on-surface-variant/70 hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px", fontVariationSettings: activeTab === "Kitchen" ? "'FILL' 1" : "'FILL' 0" }}>kitchen</span>
                  <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Kitchen</span>
                  {activeTab === "Kitchen" && (
                    <span className="absolute -bottom-1.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
                  )}
                </button>

                {/* Profile */}
                <button
                  onClick={() => handleTabClick("Profile")}
                  className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 focus:outline-none ${
                    activeTab === "Profile" ? "text-primary" : "text-on-surface-variant/70 hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px", fontVariationSettings: activeTab === "Profile" ? "'FILL' 1" : "'FILL' 0" }}>person</span>
                  <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Profile</span>
                  {activeTab === "Profile" && (
                    <span className="absolute -bottom-1.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
                  )}
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Staff Pin lock overlay */}
      {showPinOverlay && (
        <PINOverlay
          onSuccess={handleKitchenLoginSuccess}
          onClose={() => setShowPinOverlay(false)}
        />
      )}
    </div>
  );
}
