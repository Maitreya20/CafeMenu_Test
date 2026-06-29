/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ActiveTab, CartItem, OrderTicket, TableSession, MenuItem } from "./types";
import { INITIAL_TICKETS, MENU_ITEMS } from "./data";

import MenuScreen from "./components/MenuScreen";
import CartScreen from "./components/CartScreen";
import BillScreen from "./components/BillScreen";
import ProfileScreen from "./components/ProfileScreen";
import KitchenScreen from "./components/KitchenScreen";
import PINOverlay from "./components/PINOverlay";

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
  const [showPinOverlay, setShowPinOverlay] = useState(false);

  // Load initial preloaded state so the app looks fully operational from the start
  useEffect(() => {
    // Pre-populate some tickets in the kitchen
    setTickets(INITIAL_TICKETS());

    // Pre-populate cart with Screen 3 items for a beautiful ready-to-use cart view
    const burger = MENU_ITEMS.find((item) => item.id === "m5") || MENU_ITEMS[4];
    const fries = MENU_ITEMS.find((item) => item.id === "m6") || MENU_ITEMS[5];
    const soda = MENU_ITEMS.find((item) => item.id === "m7") || MENU_ITEMS[6];

    setCart([
      { menuItem: burger, quantity: 1, customization: "Medium Rare" },
      { menuItem: fries, quantity: 1, customization: "With Garlic Aioli" },
      { menuItem: soda, quantity: 1, customization: "Sweetened" },
    ]);
  }, []);

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

  // Add from suggestions quickly
  const handleQuickAddSuggestion = (item: MenuItem) => {
    handleAddToCart(item);
  };

  // Place Order from Cart
  const handlePlaceOrder = (kitchenNote: string) => {
    if (cart.length === 0) return;

    // Create a new kitchen ticket based on the cart
    const newTicketId = `T${Math.floor(Math.random() * 90) + 10}`;
    const newOrderNum = `#BF-${Math.floor(Math.random() * 9000) + 1000}`;

    const newTicket: OrderTicket = {
      id: newTicketId,
      orderNumber: newOrderNum,
      status: "NEW",
      table: session.tableNumber,
      kitchenNote: kitchenNote || undefined,
      items: cart.map((item) => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        category: item.menuItem.category,
      })),
      receivedTime: new Date(),
      elapsedSeconds: 0,
    };

    setTickets((prev) => [newTicket, ...prev]);

    // Clear cart
    setCart([]);

    // Award loyalty points for ordering
    setSession((prev) => ({
      ...prev,
      points: Math.min(prev.totalPointsNeeded, prev.points + 50),
    }));
  };

  // KDS Status Transition Handler
  const handleUpdateTicketStatus = (ticketId: string, status: OrderTicket["status"]) => {
    setTickets((prev) => {
      if (status === "SERVED") {
        // Clear or archive
        return prev.filter((t) => t.id !== ticketId);
      }
      return prev.map((t) => (t.id === ticketId ? { ...t, status } : t));
    });
  };

  // Waiter notify simulation handler
  const handleNotifyWaiter = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, waiterNotified: true } : t))
    );
  };

  // General Call Waiter Handler
  const handleCallWaiter = (reason: string) => {
    console.log(`General floor call logged for ${session.tableNumber}: "${reason}"`);
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

  // Reset/Clear session after checkout
  const handleClearBillAndSession = () => {
    setCart([]);
    setTickets(INITIAL_TICKETS());
    setSession((prev) => ({
      ...prev,
      points: 150, // reset to starting tier
    }));
    setActiveTab("Menu");
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

  const handleKitchenLoginSuccess = () => {
    setKitchenAuthenticated(true);
    setShowPinOverlay(false);
    setActiveTab("Kitchen");
  };

  const handleKitchenLogout = () => {
    setKitchenAuthenticated(false);
    setActiveTab("Menu");
  };

  // If viewing active kitchen, use full widescreen container for maximum visibility
  const isWidescreenKDS = activeTab === "Kitchen" && kitchenAuthenticated;

  return (
    <div className="min-h-screen bg-black text-on-surface flex flex-col justify-between selection:bg-primary-container/30">
      
      {/* If Kitchen is fully active, render raw without the phone screen constraint */}
      {isWidescreenKDS ? (
        <KitchenScreen
          tickets={tickets}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          onLogout={handleKitchenLogout}
          onNotifyWaiter={handleNotifyWaiter}
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
              />
            )}

            {activeTab === "Cart" && (
              <CartScreen
                cart={cart}
                placedOrders={tickets}
                onUpdateQuantity={handleUpdateQuantity}
                onPlaceOrder={handlePlaceOrder}
                onQuickAddSuggestion={handleQuickAddSuggestion}
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
                activeTab === "Menu" ? "text-primary" : "text-on-surface-variant/70 hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px", fontVariationSettings: activeTab === "Menu" ? "'FILL' 1" : "'FILL' 0" }}>restaurant_menu</span>
              <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Menu</span>
              {activeTab === "Menu" && (
                <span className="absolute -bottom-1.5 w-1 h-1 bg-primary rounded-full"></span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => handleTabClick("Cart")}
              className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 focus:outline-none ${
                activeTab === "Cart" ? "text-primary" : "text-on-surface-variant/70 hover:text-on-surface"
              }`}
            >
              <div className="relative">
                <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px", fontVariationSettings: activeTab === "Cart" ? "'FILL' 1" : "'FILL' 0" }}>shopping_cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-primary-container text-on-primary-container text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-background">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Cart</span>
              {activeTab === "Cart" && (
                <span className="absolute -bottom-1.5 w-1 h-1 bg-primary rounded-full"></span>
              )}
            </button>

            {/* Bill */}
            <button
              onClick={() => handleTabClick("Bill")}
              className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 focus:outline-none ${
                activeTab === "Bill" ? "text-primary" : "text-on-surface-variant/70 hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px", fontVariationSettings: activeTab === "Bill" ? "'FILL' 1" : "'FILL' 0" }}>receipt_long</span>
              <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Bill</span>
              {activeTab === "Bill" && (
                <span className="absolute -bottom-1.5 w-1 h-1 bg-primary rounded-full"></span>
              )}
            </button>

            {/* Kitchen Staff Panel */}
            <button
              onClick={() => handleTabClick("Kitchen")}
              className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 focus:outline-none ${
                activeTab === "Kitchen" ? "text-primary" : "text-on-surface-variant/70 hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px", fontVariationSettings: activeTab === "Kitchen" ? "'FILL' 1" : "'FILL' 0" }}>kitchen</span>
              <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Kitchen</span>
              {activeTab === "Kitchen" && (
                <span className="absolute -bottom-1.5 w-1 h-1 bg-primary rounded-full"></span>
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
                <span className="absolute -bottom-1.5 w-1 h-1 bg-primary rounded-full"></span>
              )}
            </button>
          </nav>
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
