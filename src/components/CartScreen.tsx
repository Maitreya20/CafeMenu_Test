/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { MenuItem, CartItem } from "../types";
import { SUGGESTIONS } from "../data";
import { Trash2, Edit3, Timer, Plus, Minus, ThumbsUp } from "lucide-react";

interface CartScreenProps {
  cart: CartItem[];
  placedOrders: any[];
  onUpdateQuantity: (menuItemId: string, change: number) => void;
  onPlaceOrder: (kitchenNote: string) => void;
  onQuickAddSuggestion: (item: MenuItem) => void;
}

export default function CartScreen({
  cart,
  placedOrders,
  onUpdateQuantity,
  onPlaceOrder,
  onQuickAddSuggestion,
}: CartScreenProps) {
  const [kitchenNote, setKitchenNote] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(2); // Default to 😊
  const [placedStatus, setPlacedStatus] = useState(false);

  // Compute prices
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [cart]);

  const gst = useMemo(() => {
    return Math.round(subtotal * 0.05 * 100) / 100;
  }, [subtotal]);

  const serviceCharge = useMemo(() => {
    return Math.round(subtotal * 0.10 * 100) / 100;
  }, [subtotal]);

  const total = useMemo(() => {
    return Math.round((subtotal + gst + serviceCharge) * 100) / 100;
  }, [subtotal, gst, serviceCharge]);

  const handlePlaceOrderClick = () => {
    if (cart.length === 0) return;
    onPlaceOrder(kitchenNote);
    setPlacedStatus(true);
    setKitchenNote("");
    setTimeout(() => {
      setPlacedStatus(false);
    }, 4000);
  };

  const feedbackEmojis = [
    { emoji: "😡", label: "Angry" },
    { emoji: "😕", label: "Confused" },
    { emoji: "😊", label: "Happy" },
    { emoji: "😋", label: "Yummy" },
    { emoji: "🔥", label: "Excellent" },
  ];

  // Check if we have active cooking orders to show live timers
  const activeOrders = placedOrders.filter(order => order.status !== "SERVED");
  const hasActiveOrder = activeOrders.length > 0;

  return (
    <div className="w-full pb-36 px-4 animate-in fade-in duration-300 pt-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 h-16 max-w-[430px] mx-auto bg-background/90 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform" style={{ fontSize: "24px" }}>menu</span>
          <div className="flex flex-col">
            <h1 className="font-display text-xl text-primary tracking-tighter leading-none">BiteFlow</h1>
            <span className="text-[9px] font-mono text-on-surface-variant uppercase tracking-widest mt-0.5">Your Order • Cart</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqbPPZpceAAiXohGonhBX8tVJ-IPHWUA8TlFTZ_yh29wzHC4nRR5Gxj_NFZkQl7vMvDKEb-3g4Su1w4ID7o5jT9K908p9rP2JDLXVC6c7_fESm7IVud6kOrc_nkz_PnRsRW1W1XYU753MjfkPTek7-5QqCni5Nk_3ZFRrCzXMCjxLr5wI5z6F_W9wmXFd3gBzHoqNX8K8mrseSk9YMMzKm2mieDnLJDo9BxpOHy8LgSP1EWy3l9aWEXjt9c7O_a0KgemrU0UBQNAw"
            alt="Customer Portrait"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Cart Items Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="font-display text-xl font-bold text-on-surface">Your order</h2>
            <span className="font-mono text-xs text-primary font-bold">
              {cart.length} {cart.length === 1 ? "ITEM" : "ITEMS"}
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="bg-surface-container border border-outline-variant/20 rounded-[20px] p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">shopping_cart</span>
              <p className="text-on-surface-variant text-sm mt-3 font-sans">Your dining cart is empty.</p>
              <p className="text-xs text-on-surface-variant/50 mt-1 font-sans">Browse the digital menu and add delicious meals!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.menuItem.id}
                  className="bg-surface-container border border-outline-variant/30 rounded-2xl p-3 flex items-center gap-4 transition-all active:scale-[0.99] hover:border-primary/30"
                >
                  <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center text-3xl shrink-0">
                    {item.menuItem.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-sans font-bold text-sm text-on-surface truncate">
                      {item.menuItem.name}
                    </h3>
                    <p className="text-on-surface-variant text-[11px] truncate leading-normal">
                      {item.menuItem.description}
                    </p>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center bg-background rounded-full border border-outline-variant/40 px-1 h-8">
                        <button
                          onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                          className="p-1 text-on-surface-variant active:text-primary transition-all active:scale-95"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 font-mono text-xs font-bold text-on-surface">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                          className="p-1 text-on-surface-variant active:text-primary transition-all active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-mono text-sm font-bold text-primary">
                        ₹{item.menuItem.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Kitchen Note */}
        {cart.length > 0 && (
          <section className="space-y-3">
            <label className="text-xs font-sans font-extrabold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontSize: "16px" }}>edit_note</span>
              Kitchen Note
            </label>
            <div className="relative group">
              <textarea
                value={kitchenNote}
                onChange={(e) => setKitchenNote(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container orange-glow-focus transition-all resize-none font-sans"
                placeholder="Add special requests (e.g. no onions, extra ice...)"
                rows={2}
              />
            </div>
          </section>
        )}

        {/* Success Alert */}
        {placedStatus && (
          <div className="bg-tertiary-container/10 border border-tertiary-container/30 rounded-2xl p-4 text-center animate-bounce-subtle">
            <p className="text-sm font-sans font-bold text-tertiary">
              🎉 Order received! Sent directly to the kitchen display.
            </p>
          </div>
        )}

        {/* Wait Timer Card (Progress State) */}
        {(hasActiveOrder || placedStatus) && (
          <section className="bg-surface-container-high border border-outline-variant rounded-2xl p-6 glow-orange relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-surface-variant">
              <div className="h-full w-[65%] progress-shimmer"></div>
            </div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-sans font-black text-primary tracking-widest uppercase">Preparing your feast</p>
                <h3 className="font-display text-2xl font-extrabold text-on-surface leading-tight mt-1">~18 mins</h3>
              </div>
              <div className="w-12 h-12 rounded-full border border-primary/25 flex items-center justify-center animate-pulse">
                <Timer className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
                <span className="text-[10px] font-sans font-black text-on-surface uppercase tracking-wide">Accepted</span>
              </div>
              <div className="h-[1px] flex-1 bg-primary/30 mx-2"></div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#ffb59d]"></div>
                <span className="text-[10px] font-sans font-black text-on-surface uppercase tracking-wide">Cooking</span>
              </div>
              <div className="h-[1px] flex-1 bg-outline-variant mx-2"></div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
                <span className="text-[10px] font-sans font-black text-on-surface-variant uppercase tracking-wide">Serving</span>
              </div>
            </div>
          </section>
        )}

        {/* While You Wait Suggestions */}
        <section className="space-y-4">
          <h4 className="font-display text-base font-extrabold text-on-surface px-1">While you wait...</h4>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
            {SUGGESTIONS.map((item) => (
              <div
                key={item.id}
                className="min-w-[160px] bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden active:scale-[0.97] transition-all"
              >
                <div
                  className="h-24 bg-cover bg-center"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="p-3 flex flex-col justify-between h-24">
                  <h5 className="text-xs font-sans font-bold text-on-surface leading-tight line-clamp-2">
                    {item.name}
                  </h5>
                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-outline-variant/15">
                    <span className="font-mono text-xs font-black text-primary">₹{item.price}</span>
                    <button
                      onClick={() => onQuickAddSuggestion(item)}
                      className="text-primary hover:text-primary-container active:scale-90 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xl" style={{ fontSize: "22px" }}>add_circle</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feedback Section */}
        <section className="bg-surface-container border border-outline-variant/20 rounded-2xl p-6 text-center space-y-4">
          <h4 className="text-[10px] font-sans font-black text-on-surface-variant tracking-widest uppercase">
            How's the service so far?
          </h4>
          <div className="flex justify-around items-center">
            {feedbackEmojis.map((item, index) => {
              const isSelected = selectedEmoji === index;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedEmoji(index)}
                  className={`text-3xl transition-all duration-300 active:scale-125 focus:outline-none ${
                    isSelected ? "scale-125 filter-none" : "grayscale opacity-60 hover:opacity-100"
                  }`}
                  title={item.label}
                >
                  {item.emoji}
                </button>
              );
            })}
          </div>
        </section>

        {/* Summary & Place Order */}
        {cart.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-outline-variant/30">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-sans font-medium text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-mono">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-sans font-medium text-on-surface-variant">
                <span>GST (5%)</span>
                <span className="font-mono">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-sans font-medium text-on-surface-variant">
                <span>Service Charge (10%)</span>
                <span className="font-mono">₹{serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-outline-variant/15">
                <span className="font-display text-sm font-bold text-on-surface">Total</span>
                <span className="font-display text-xl font-extrabold text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrderClick}
              className="w-full h-14 bg-gradient-to-r from-primary-container to-[#FF9E7A] rounded-xl text-on-primary-container font-display text-base font-bold flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-lg shadow-primary-container/20"
            >
              Place Order
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>restaurant</span>
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
