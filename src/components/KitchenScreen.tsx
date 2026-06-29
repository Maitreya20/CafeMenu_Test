/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { OrderTicket } from "../types";
import { AlertCircle, CheckCircle, Bell, Settings, LogOut, Info, History, Shield, Play, RotateCcw, HelpCircle, Monitor, Smartphone } from "lucide-react";

interface KitchenScreenProps {
  tickets: OrderTicket[];
  onUpdateTicketStatus: (ticketId: string, status: OrderTicket["status"]) => void;
  onLogout: () => void;
  onNotifyWaiter?: (ticketId: string) => void;
}

export default function KitchenScreen({
  tickets,
  onUpdateTicketStatus,
  onLogout,
  onNotifyWaiter,
}: KitchenScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  // Keep a live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatClock = (date: Date) => {
    return date.toLocaleTimeString("en-GB", { hour12: false });
  };

  const formatSimpleClock = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  // Extract columns
  const newTickets = useMemo(() => tickets.filter((t) => t.status === "NEW"), [tickets]);
  const cookingTickets = useMemo(() => tickets.filter((t) => t.status === "COOKING"), [tickets]);
  const readyTickets = useMemo(() => tickets.filter((t) => t.status === "READY"), [tickets]);

  const activeOrdersCount = tickets.filter((t) => t.status !== "SERVED").length;

  return (
    <div className="w-full min-h-screen bg-background text-on-background relative overflow-x-hidden flex flex-col font-sans">
      
      {/* KDS Header */}
      <header className="h-20 shrink-0 border-b border-outline-variant/30 bg-background/85 backdrop-blur-md flex items-center justify-between px-6 z-40 fixed top-0 left-0 right-0 max-w-[430px] md:max-w-none mx-auto">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-1 text-primary hover:bg-surface-variant rounded-lg transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-3xl" style={{ fontSize: "28px" }}>menu</span>
          </button>
          <div className="flex flex-col">
            <h1 className="font-display text-lg md:text-xl font-bold text-primary tracking-tighter leading-none">BiteFlow Kitchen</h1>
            <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider mt-1 block md:hidden">Mobile Station K1</span>
          </div>
        </div>

        {/* Dashboard metrics (Only show on widescreen/desktop mode) */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-primary-container font-mono text-[10px] font-extrabold tracking-widest uppercase">Active Orders</span>
            <span className="font-mono text-2xl font-black text-on-surface leading-none mt-1">{activeOrdersCount}</span>
          </div>
          <div className="w-px h-8 bg-outline-variant/30"></div>
          <div className="flex flex-col items-end">
            <span className="text-tertiary font-mono text-[10px] font-extrabold tracking-widest uppercase">Avg Prep Time</span>
            <span className="font-mono text-2xl font-black text-on-surface leading-none mt-1">12<span className="text-sm font-sans font-medium ml-0.5">min</span></span>
          </div>
          <div className="w-px h-8 bg-outline-variant/30"></div>
          
          <div className="font-mono text-xl font-bold text-primary px-4 py-1.5 rounded-xl bg-surface-container border border-outline-variant/25 shadow-[0_0_15px_rgba(255,107,53,0.1)]">
            {formatClock(currentTime)}
          </div>

          {/* Toggle view control for development testing */}
          <div className="flex bg-surface-container-high rounded-lg p-0.5 border border-outline-variant/20">
            <button 
              onClick={() => setViewMode("desktop")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "desktop" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant"}`}
              title="Switch to Widescreen KDS Console"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode("mobile")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "mobile" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant"}`}
              title="Switch to Mobile Kanban view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Clock for mobile KDS */}
          <div className="block md:hidden font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-lg">
            {formatSimpleClock(currentTime)}
          </div>
          
          <div className="relative">
            <button className="p-2 hover:bg-surface-variant transition-colors rounded-full text-on-surface-variant active:scale-95">
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-container rounded-full ring-2 ring-background"></span>
          </div>
          <div className="w-9 h-9 rounded-full border border-primary overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJpKyJIeGG542oc9c19hH5ACiaZrY9OE_vNyOfzapirvT-WfDhbLhp-utDkGbD4cJR26YPUEZ2Bo9X2ik5G1N3tS1oCnKfu4D1L6rTYLBN1bVDmtaiHKW9fLdZtNUX04C1j-X0D736h-HcsVg-OpIoRlfzSufrLs4zxHR2XGU2-7XCW0vjGbEVFv18LE9NHJ6lDt5vjj6U5x0B6_kJKf_YUxMh84GWbdMKCKgITs3sLtTLwDt_lJyZwa3m8YCPuVS9xn0oaWM8nmY"
              alt="Kitchen Chef"
            />
          </div>
        </div>
      </header>

      {/* Main Kanban Content */}
      <main className="flex-1 pt-20 pb-4 h-screen max-w-[430px] md:max-w-none mx-auto w-full">
        {/* VIEW 1: Mobile Vertical Kanban Columns (Screen 2) */}
        {viewMode === "mobile" ? (
          <div className="h-full flex flex-col md:max-w-[430px] md:mx-auto">
            {/* Scrollable multi-columns snap view */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex custom-scrollbar pb-32">
              
              {/* Column: NEW */}
              <section className="min-w-[320px] w-full h-full snap-start flex flex-col border-r border-outline-variant/10">
                <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-outline-variant/10">
                  <div className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-lg" style={{ fontSize: "18px" }}>notifications_active</span>
                    <h2 className="text-xs font-sans font-black uppercase tracking-wider">New 🔔</h2>
                  </div>
                  <span className="bg-primary/20 text-primary text-[9px] px-2.5 py-0.5 rounded-full font-bold">
                    {newTickets.length} {newTickets.length === 1 ? "ORDER" : "ORDERS"}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-40">
                  {newTickets.length === 0 ? (
                    <div className="text-center py-16 opacity-50">
                      <CheckCircle className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
                      <p className="text-xs font-sans mt-2">All new orders prepped!</p>
                    </div>
                  ) : (
                    newTickets.map((ticket) => (
                      <div key={ticket.id} className="ticket-gradient border border-outline-variant/30 rounded-2xl p-4 glow-orange animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-display text-xl font-bold text-primary leading-none">{ticket.id}</span>
                          <span className="font-mono text-xs text-on-surface-variant">{ticket.orderNumber}</span>
                        </div>

                        {ticket.allergyNote && (
                          <div className="bg-error/10 text-error flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold mb-3 animate-pulse-red border border-error/25">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{ticket.allergyNote}</span>
                          </div>
                        )}

                        <ul className="space-y-2.5 mb-4 text-xs font-sans text-on-surface-variant">
                          {ticket.items.map((item, i) => (
                            <li key={i} className="flex justify-between border-b border-outline-variant/10 pb-2 items-center">
                              <span className="font-medium text-on-surface">
                                <span className="text-primary font-bold mr-2">{item.quantity}x</span>
                                {item.name}
                              </span>
                              {item.category && <span className="font-mono text-[10px] text-on-surface-variant/70 bg-surface-container px-2 py-0.5 rounded-md">{item.category}</span>}
                            </li>
                          ))}
                        </ul>

                        {ticket.kitchenNote && (
                          <div className="bg-primary-container/5 border border-primary-container/20 p-2.5 rounded-lg mb-4">
                            <p className="text-primary-container text-[11px] font-medium italic leading-normal">"{ticket.kitchenNote}"</p>
                          </div>
                        )}

                        <button
                          onClick={() => onUpdateTicketStatus(ticket.id, "COOKING")}
                          className="w-full h-11 bg-primary-container text-on-primary-container rounded-xl font-sans font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary-container/10"
                        >
                          Start cooking
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Column: COOKING / PREPARING */}
              <section className="min-w-[320px] w-full h-full snap-start flex flex-col border-r border-outline-variant/10 bg-surface-container-lowest/30">
                <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-outline-variant/10">
                  <div className="flex items-center gap-1.5 text-secondary">
                    <span className="material-symbols-outlined text-lg text-secondary" style={{ fontSize: "18px" }}>local_fire_department</span>
                    <h2 className="text-xs font-sans font-black uppercase tracking-wider text-secondary">Cooking 🔥</h2>
                  </div>
                  <span className="bg-secondary/20 text-secondary text-[9px] px-2.5 py-0.5 rounded-full font-bold">
                    {cookingTickets.length} {cookingTickets.length === 1 ? "ORDER" : "ORDERS"}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-40">
                  {cookingTickets.length === 0 ? (
                    <div className="text-center py-16 opacity-30">
                      <span className="material-symbols-outlined text-3xl">restaurant_menu</span>
                      <p className="text-xs font-sans mt-2">No tickets cooking currently.</p>
                    </div>
                  ) : (
                    cookingTickets.map((ticket) => (
                      <div key={ticket.id} className="ticket-gradient border border-secondary/35 rounded-2xl p-4 glow-orange animate-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-display text-xl font-bold text-secondary leading-none">{ticket.id}</span>
                          <span className="font-mono text-xs text-on-surface-variant">12m elapsed</span>
                        </div>

                        <ul className="space-y-2.5 mb-4 text-xs font-sans text-on-surface-variant">
                          {ticket.items.map((item, i) => (
                            <li key={i} className="flex justify-between border-b border-outline-variant/10 pb-2 items-center">
                              <span className="font-medium text-on-surface">
                                <span className="text-secondary font-bold mr-2">{item.quantity}x</span>
                                {item.name}
                              </span>
                              <span className="font-mono text-[9px] text-secondary font-bold uppercase tracking-wider bg-secondary/10 px-1.5 py-0.5 rounded">FIRE</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => {
                            onUpdateTicketStatus(ticket.id, "READY");
                            if (onNotifyWaiter) onNotifyWaiter(ticket.id);
                          }}
                          className="w-full h-11 border border-secondary text-secondary hover:bg-secondary/10 rounded-xl font-sans font-bold text-xs active:scale-95 transition-all"
                        >
                          Mark ready
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Column: READY */}
              <section className="min-w-[320px] w-full h-full snap-start flex flex-col">
                <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-outline-variant/10">
                  <div className="flex items-center gap-1.5 text-tertiary">
                    <span className="material-symbols-outlined text-lg text-tertiary" style={{ fontSize: "18px" }}>check_circle</span>
                    <h2 className="text-xs font-sans font-black uppercase tracking-wider text-tertiary">Ready ✅</h2>
                  </div>
                  <span className="bg-tertiary/20 text-tertiary text-[9px] px-2.5 py-0.5 rounded-full font-bold">
                    {readyTickets.length} {readyTickets.length === 1 ? "ORDER" : "ORDERS"}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-40">
                  {readyTickets.length === 0 ? (
                    <div className="text-center py-16 opacity-30">
                      <CheckCircle className="w-10 h-10 text-on-surface-variant/30 mx-auto" />
                      <p className="text-xs font-sans mt-2">No orders waiting for delivery.</p>
                    </div>
                  ) : (
                    readyTickets.map((ticket) => (
                      <div key={ticket.id} className="bg-surface-container border border-tertiary/25 rounded-2xl p-4 animate-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-display text-xl font-bold text-tertiary leading-none">{ticket.id}</span>
                          <span className="font-mono text-xs text-on-surface-variant">READY TO GO</span>
                        </div>

                        <ul className="space-y-2.5 mb-4 text-xs font-sans text-on-surface-variant opacity-60">
                          {ticket.items.map((item, i) => (
                            <li key={i} className="flex justify-between items-center">
                              <span className="font-medium text-on-surface line-through decoration-tertiary/55">
                                <span className="text-tertiary font-bold mr-2">{item.quantity}x</span>
                                {item.name}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => onUpdateTicketStatus(ticket.id, "SERVED")}
                          className="w-full h-11 bg-tertiary text-on-tertiary rounded-xl font-sans font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-tertiary/10"
                        >
                          Served
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>

            </div>
          </div>
        ) : (
          /* VIEW 2: Desktop Tablet Landscape Columns (Screen 6) */
          <div className="h-full grid grid-cols-3 gap-6 px-6 pb-24 max-h-[calc(100vh-120px)] overflow-hidden">
            
            {/* NEW ORDERS COLUMN */}
            <section className="flex flex-col h-full bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-lg shadow-black/40">
              <div className="p-4 bg-error/10 border-b border-error/20 flex justify-between items-center shrink-0">
                <h2 className="font-display text-base text-error flex items-center gap-2 font-bold leading-none">
                  <span className="material-symbols-outlined text-xl" style={{ fontSize: "20px" }}>fiber_new</span>
                  NEW
                </h2>
                <span className="bg-error text-on-error px-3 py-1 rounded-full font-mono text-xs font-bold shadow-sm">
                  {newTickets.length} TICKETS
                </span>
              </div>
              <div className="order-scroll flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {newTickets.length === 0 ? (
                  <div className="text-center py-20 opacity-30">
                    <CheckCircle className="w-12 h-12 text-on-surface-variant/40 mx-auto" />
                    <p className="text-sm font-sans mt-3">All new orders pushed to prep.</p>
                  </div>
                ) : (
                  newTickets.map((ticket) => (
                    <article key={ticket.id} className="bg-surface-container border border-outline-variant/30 rounded-2xl p-4 flex flex-col gap-4 relative animate-in zoom-in-95 duration-200 shadow-md">
                      <div className="flex justify-between items-start">
                        <div className="bg-primary text-on-primary font-mono text-xl font-black px-4 py-1.5 rounded-full leading-none">
                          {ticket.id}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-on-surface-variant text-[10px] font-sans font-extrabold tracking-widest uppercase">Received</span>
                          <span className="font-mono text-xs text-error font-bold mt-0.5">4m ago</span>
                        </div>
                      </div>

                      {ticket.allergyNote && (
                        <div className="bg-error/25 border border-error/40 p-2.5 rounded-xl flex items-center gap-2 animate-pulse-red shadow-sm">
                          <AlertCircle className="w-4 h-4 text-error shrink-0" />
                          <span className="text-error font-extrabold text-[10px] tracking-wider uppercase font-sans">⚠️ ALLERGY: SHELLFISH / PEANUTS</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        {ticket.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                            <span className="font-sans text-sm text-on-surface font-medium">
                              <span className="text-primary font-bold mr-3">{item.quantity}x</span>
                              {item.name}
                            </span>
                            {item.category && <span className="text-[10px] font-sans text-on-surface-variant font-bold bg-surface-container-high px-2 py-0.5 rounded-md">{item.category}</span>}
                          </div>
                        ))}
                      </div>

                      {ticket.kitchenNote && (
                        <div className="bg-primary-container/10 border border-primary-container/20 p-2.5 rounded-xl">
                          <p className="text-primary-container text-xs font-medium italic">"{ticket.kitchenNote}"</p>
                        </div>
                      )}

                      <button
                        onClick={() => onUpdateTicketStatus(ticket.id, "COOKING")}
                        className="w-full bg-primary-container text-on-primary-container font-display text-sm font-bold py-3 rounded-xl active:scale-95 transition-all shadow-md shadow-primary-container/15 hover:brightness-105"
                      >
                        START PREP
                      </button>
                    </article>
                  ))
                )}
              </div>
            </section>

            {/* PREPARING COLUMN */}
            <section className="flex flex-col h-full bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-lg shadow-black/40">
              <div className="p-4 bg-primary-container/10 border-b border-primary-container/20 flex justify-between items-center shrink-0">
                <h2 className="font-display text-base text-primary-container flex items-center gap-2 font-bold leading-none">
                  <span className="material-symbols-outlined text-xl text-primary-container" style={{ fontSize: "20px" }}>restaurant</span>
                  PREPARING
                </h2>
                <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-mono text-xs font-bold shadow-sm">
                  {cookingTickets.length} TICKETS
                </span>
              </div>
              <div className="order-scroll flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {cookingTickets.length === 0 ? (
                  <div className="text-center py-20 opacity-30">
                    <span className="material-symbols-outlined text-4xl">local_fire_department</span>
                    <p className="text-sm font-sans mt-3">No active plates cooking.</p>
                  </div>
                ) : (
                  cookingTickets.map((ticket) => (
                    <article key={ticket.id} className="bg-surface-container border-2 border-primary-container rounded-2xl p-4 flex flex-col gap-4 relative shadow-lg glow-active animate-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-start">
                        <div className="bg-primary-container text-on-primary-container font-mono text-xl font-black px-4 py-1.5 rounded-full leading-none">
                          {ticket.id}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-primary-container text-[10px] font-sans font-extrabold tracking-widest uppercase">Elapsed</span>
                          <span className="font-mono text-xs text-primary-container font-bold mt-0.5">12m 45s</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {ticket.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                            <span className="font-sans text-sm text-on-surface font-medium">
                              <span className="text-primary font-bold mr-3">{item.quantity}x</span>
                              {item.name}
                            </span>
                            {item.category && <span className="text-[10px] font-sans text-on-surface-variant font-bold bg-surface-container-high px-2 py-0.5 rounded-md">{item.category}</span>}
                          </div>
                        ))}
                      </div>

                      <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mt-1">
                        <div className="bg-primary-container h-full w-3/4 rounded-full"></div>
                      </div>

                      <button
                        onClick={() => {
                          onUpdateTicketStatus(ticket.id, "READY");
                          if (onNotifyWaiter) onNotifyWaiter(ticket.id);
                        }}
                        className="w-full bg-tertiary-container text-on-tertiary-container font-display text-sm font-bold py-3 rounded-xl active:scale-95 transition-all hover:brightness-105"
                      >
                        MARK READY
                      </button>
                    </article>
                  ))
                )}
              </div>
            </section>

            {/* READY COLUMN */}
            <section className="flex flex-col h-full bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-lg shadow-black/40">
              <div className="p-4 bg-tertiary/10 border-b border-tertiary/20 flex justify-between items-center shrink-0">
                <h2 className="font-display text-base text-tertiary flex items-center gap-2 font-bold leading-none">
                  <span className="material-symbols-outlined text-xl text-tertiary" style={{ fontSize: "20px" }}>check_circle</span>
                  READY
                </h2>
                <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full font-mono text-xs font-bold shadow-sm">
                  {readyTickets.length} TICKETS
                </span>
              </div>
              <div className="order-scroll flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {readyTickets.length === 0 ? (
                  <div className="text-center py-20 opacity-30">
                    <CheckCircle className="w-12 h-12 text-on-surface-variant/40 mx-auto" />
                    <p className="text-sm font-sans mt-3">All prep tables cleared.</p>
                  </div>
                ) : (
                  readyTickets.map((ticket) => (
                    <article key={ticket.id} className={`bg-surface-container border border-tertiary/40 rounded-2xl p-4 flex flex-col gap-4 relative animate-in zoom-in-95 duration-200 shadow-md ${ticket.waiterNotified ? "" : "grayscale"}`}>
                      <div className="flex justify-between items-start">
                        <div className="bg-tertiary text-on-tertiary font-mono text-xl font-black px-4 py-1.5 rounded-full leading-none">
                          {ticket.id}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-tertiary text-[10px] font-sans font-extrabold tracking-widest uppercase">Waiting</span>
                          <span className="font-mono text-xs text-tertiary font-bold mt-0.5">3m 20s</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {ticket.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                            <span className="font-sans text-sm text-on-surface line-through decoration-tertiary/50">
                              <span className="text-tertiary font-bold mr-3">{item.quantity}x</span>
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {ticket.waiterNotified && (
                        <div className="flex items-center justify-center p-3 bg-tertiary/5 rounded-xl border border-dashed border-tertiary/30 animate-pulse-red">
                          <span className="material-symbols-outlined text-tertiary mr-2" style={{ fontSize: "18px" }}>person</span>
                          <span className="text-on-surface-variant text-[10px] font-sans font-black uppercase tracking-wider">Waiter Notified</span>
                        </div>
                      )}

                      <button
                        onClick={() => onUpdateTicketStatus(ticket.id, "SERVED")}
                        className="w-full bg-surface-variant text-on-surface font-display text-sm font-bold py-3 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-surface-container-high border border-outline-variant/15"
                      >
                        <span className="material-symbols-outlined text-lg" style={{ fontSize: "16px" }}>done_all</span>
                        SERVED
                      </button>
                    </article>
                  ))
                )}
              </div>
            </section>

          </div>
        )}
      </main>

      {/* Station K1 Control Drawer settings overlay */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-surface-container-low border-l border-outline-variant shadow-2xl z-[60] transform transition-transform duration-300 flex flex-col ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full justify-between">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/10">
                <Settings className="w-6 h-6 text-on-primary" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-on-surface leading-tight">Station K1</h3>
                <p className="text-on-surface-variant text-xs mt-0.5">Table Management</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setDrawerOpen(false)}
                className="w-full flex items-center gap-3 p-3 bg-primary-container text-on-primary-container rounded-xl text-left text-sm font-sans font-bold"
              >
                <Info className="w-5 h-5 text-on-primary-container" />
                <span>Session Info</span>
              </button>
              <button 
                onClick={() => { setDrawerOpen(false); alert("Opening archived KDS tickets log"); }}
                className="w-full flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant/40 hover:text-on-surface rounded-xl text-left text-sm font-sans font-bold transition-all"
              >
                <History className="w-5 h-5" />
                <span>Order History</span>
              </button>
              <button 
                onClick={() => { setDrawerOpen(false); setViewMode(viewMode === "desktop" ? "mobile" : "desktop"); }}
                className="w-full flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant/40 hover:text-on-surface rounded-xl text-left text-sm font-sans font-bold transition-all"
              >
                <Monitor className="w-5 h-5" />
                <span>Toggle Layout Mode</span>
              </button>
              <button 
                onClick={() => { setDrawerOpen(false); onNotifyWaiter?.("General Call"); }}
                className="w-full flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant/40 hover:text-on-surface rounded-xl text-left text-sm font-sans font-bold transition-all animate-pulse"
              >
                <span className="material-symbols-outlined text-xl" style={{ fontSize: "20px" }}>notifications_active</span>
                <span>Call Floor Waiter</span>
              </button>
            </nav>
          </div>

          <button
            onClick={() => {
              setDrawerOpen(false);
              onLogout();
            }}
            className="w-full py-3.5 bg-error-container/10 border border-error-container/30 text-error hover:bg-error-container/20 rounded-xl font-sans font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout KDS Session
          </button>
        </div>
      </div>

      {/* Drawer Overlay backdrop screen shield */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        />
      )}

      {/* KDS Mobile bottom navigation bar matching custom system layout */}
      {viewMode === "mobile" && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-[72px] px-4 pb-safe max-w-[430px] mx-auto bg-surface-container/90 backdrop-blur-2xl border-t border-outline-variant/20 shadow-[0_-4px_20px_0_rgba(255,107,53,0.1)] rounded-t-[32px]">
          <div onClick={onLogout} className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-on-surface active:scale-90 transition-transform duration-150 cursor-pointer">
            <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px" }}>restaurant_menu</span>
            <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Menu</span>
          </div>
          <div onClick={onLogout} className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-on-surface active:scale-90 transition-transform duration-150 cursor-pointer">
            <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px" }}>shopping_cart</span>
            <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Cart</span>
          </div>
          <div onClick={onLogout} className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-on-surface active:scale-90 transition-transform duration-150 cursor-pointer">
            <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px" }}>receipt_long</span>
            <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Bill</span>
          </div>
          {/* Active: Kitchen */}
          <div className="flex flex-col items-center justify-center text-primary relative after:content-[''] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-primary after:rounded-full active:scale-90 transition-transform duration-150 cursor-pointer">
            <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px" }}>kitchen</span>
            <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Kitchen</span>
          </div>
          <div onClick={onLogout} className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-on-surface active:scale-90 transition-transform duration-150 cursor-pointer">
            <span className="material-symbols-outlined text-2xl" style={{ fontSize: "24px" }}>person</span>
            <span className="text-[10px] font-sans font-black uppercase tracking-wider mt-1 text-[8px]">Profile</span>
          </div>
        </nav>
      )}

    </div>
  );
}
