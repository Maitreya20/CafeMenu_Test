/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { OrderTicket } from "../types";
import { Check, CreditCard, HelpCircle, BellRing, Sparkles } from "lucide-react";

interface BillScreenProps {
  placedOrders: OrderTicket[];
  onCallWaiter: (reason: string) => void;
  onClearBillAndSession: () => void;
}

export default function BillScreen({
  placedOrders,
  onCallWaiter,
  onClearBillAndSession,
}: BillScreenProps) {
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [calledCheck, setCalledCheck] = useState(false);

  // Extract all ordered items across tickets
  const aggregatedItems = useMemo(() => {
    const itemsMap = new Map<string, { quantity: number; price: number }>();
    
    // Fallback static items if no actual placed orders to make the screen rich
    if (placedOrders.length === 0) {
      return [
        { name: "Truffle Beef Burger", quantity: 1, price: 520 },
        { name: "Cajun Spiced Fries", quantity: 1, price: 170 },
        { name: "Fresh Lime Soda", quantity: 1, price: 130 },
      ];
    }

    placedOrders.forEach((ticket) => {
      ticket.items.forEach((item) => {
        const existing = itemsMap.get(item.name);
        // Estimate prices based on name matching or fallback to standard price
        let estimatePrice = 180; // default sweet or side
        if (item.name.includes("Burger")) estimatePrice = 520;
        else if (item.name.includes("Fries")) estimatePrice = 170;
        else if (item.name.includes("Soda")) estimatePrice = 130;
        else if (item.name.includes("Paneer")) estimatePrice = 340;
        else if (item.name.includes("Chicken")) estimatePrice = 480;
        else if (item.name.includes("Naan")) estimatePrice = 95;
        else if (item.name.includes("Pasta")) estimatePrice = 390;
        else if (item.name.includes("Salad")) estimatePrice = 220;
        else if (item.name.includes("Steak")) estimatePrice = 850;
        else if (item.name.includes("Lassi")) estimatePrice = 240;
        else if (item.name.includes("Corn")) estimatePrice = 270;
        else if (item.name.includes("Blast")) estimatePrice = 180;

        if (existing) {
          itemsMap.set(item.name, {
            quantity: existing.quantity + item.quantity,
            price: estimatePrice,
          });
        } else {
          itemsMap.set(item.name, {
            quantity: item.quantity,
            price: estimatePrice,
          });
        }
      });
    });

    return Array.from(itemsMap.entries()).map(([name, detail]) => ({
      name,
      quantity: detail.quantity,
      price: detail.price,
    }));
  }, [placedOrders]);

  const subtotal = useMemo(() => {
    return aggregatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [aggregatedItems]);

  const gst = Math.round(subtotal * 0.05 * 100) / 100;
  const serviceCharge = Math.round(subtotal * 0.10 * 100) / 100;
  const total = Math.round((subtotal + gst + serviceCharge) * 100) / 100;

  const handleRequestCheck = () => {
    onCallWaiter("Request Check");
    setCalledCheck(true);
    setTimeout(() => {
      setCalledCheck(false);
    }, 4000);
  };

  const handlePayBill = () => {
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setCheckoutComplete(true);
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setCheckoutComplete(false);
    onClearBillAndSession();
  };

  return (
    <div className="w-full pb-32 px-4 animate-in fade-in duration-300 pt-20">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 h-16 max-w-[430px] mx-auto bg-background/90 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform" style={{ fontSize: "24px" }}>menu</span>
          <div className="flex flex-col">
            <h1 className="font-display text-xl text-primary tracking-tighter leading-none">BiteFlow</h1>
            <span className="text-[9px] font-mono text-on-surface-variant uppercase tracking-widest mt-0.5">Session Summary • Bill</span>
          </div>
        </div>
        <div className="bg-primary/20 text-primary text-[10px] px-2.5 py-0.5 rounded-full font-bold">
          TABLE 4 ACTIVE
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Bill Receipt Card */}
        <div className="bg-surface-container border border-outline-variant/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-primary-container to-secondary"></div>
          
          <div className="text-center pb-4 border-b border-outline-variant/20">
            <h3 className="font-display text-lg font-black text-on-surface tracking-tighter">BITEFLOW BISTRO</h3>
            <p className="text-[10px] font-mono text-on-surface-variant/70 uppercase tracking-widest mt-0.5">Table 4 Session Bill</p>
            <p className="text-[10px] font-mono text-on-surface-variant/50 mt-1">Date: {new Date().toLocaleDateString()} • QR ID: #BF-4821</p>
          </div>

          {/* Aggregated Orders List */}
          <div className="py-4 space-y-3 max-h-56 overflow-y-auto custom-scrollbar">
            {aggregatedItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-primary font-bold">{item.quantity}x</span>
                  <span className="font-sans font-medium text-on-surface">{item.name}</span>
                </div>
                <span className="font-mono text-on-surface-variant">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-outline-variant/20 space-y-2">
            <div className="flex justify-between text-xs font-sans text-on-surface-variant">
              <span>Subtotal</span>
              <span className="font-mono">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-sans text-on-surface-variant">
              <span>GST (5%)</span>
              <span className="font-mono">₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-sans text-on-surface-variant">
              <span>Service Charge (10%)</span>
              <span className="font-mono">₹{serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-outline-variant/30 text-sm">
              <span className="font-display font-black text-on-surface">GRAND TOTAL</span>
              <span className="font-display font-extrabold text-primary text-base">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Serrated serrations bottom visual decor */}
          <div className="flex justify-between gap-1 mt-6 h-2 overflow-hidden -mx-5 select-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-background rounded-full rotate-45 shrink-0 transform -translate-y-1.5"></div>
            ))}
          </div>
        </div>

        {/* Action options */}
        <div className="space-y-3">
          {calledCheck && (
            <div className="bg-primary-container/10 border border-primary-container/30 rounded-xl p-3 text-center">
              <p className="text-xs font-sans font-bold text-primary animate-pulse">
                🔔 Waiter has been notified to bring the print check to Table 4.
              </p>
            </div>
          )}

          <button
            onClick={handleRequestCheck}
            disabled={checkingOut || checkoutComplete}
            className="w-full h-14 bg-surface-container border border-outline-variant/30 rounded-xl flex items-center justify-between px-5 hover:bg-surface-container-high transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 text-on-surface">
              <BellRing className="w-5 h-5 text-primary" />
              <span className="text-sm font-sans font-bold">Request Physical Bill</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant/50">chevron_right</span>
          </button>

          <button
            onClick={handlePayBill}
            disabled={checkingOut || checkoutComplete}
            className="w-full h-14 bg-gradient-to-r from-primary-container to-[#FF9E7A] rounded-xl text-on-primary-container font-display text-sm font-bold flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all shadow-md shadow-primary-container/10"
          >
            {checkingOut ? (
              <div className="w-5 h-5 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <CreditCard className="w-5 h-5 text-on-primary-container" />
            )}
            Pay Digital Bill (UPI / Card)
          </button>
        </div>

        {/* Checkout Modal overlay */}
        {checkoutComplete && (
          <div className="fixed inset-0 z-[110] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="w-full max-w-[340px] text-center bg-surface-container border border-outline-variant/40 rounded-[28px] p-6 flex flex-col items-center shadow-2xl">
              <div className="w-16 h-16 bg-tertiary/10 border border-tertiary/20 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-tertiary" />
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface">Payment Successful!</h3>
              <p className="text-xs font-sans text-on-surface-variant/80 mt-1 leading-relaxed">
                Thank you for dining with us! Your payment of <span className="text-primary font-bold">₹{total.toFixed(2)}</span> has been securely processed.
              </p>

              <div className="bg-primary/5 rounded-xl border border-dashed border-primary/25 p-3 w-full my-4 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0" />
                <p className="text-[10px] text-left font-sans text-on-surface-variant leading-normal">
                  You earned <span className="text-primary font-bold">+{Math.round(total / 10)} BiteFlow Points</span> for this transaction! Enjoy a free dessert on your next visit.
                </p>
              </div>

              <button
                onClick={handleCloseSuccess}
                className="w-full h-12 bg-primary text-on-primary-container font-sans font-bold rounded-xl active:scale-[0.98] transition-all hover:brightness-105"
              >
                Close & Restart Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
