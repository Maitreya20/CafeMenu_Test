/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Star, BellRing, Droplet, FileText, CheckCircle, Flame, Leaf } from "lucide-react";
import { TableSession } from "../types";

interface ProfileScreenProps {
  session: TableSession;
  onUpdatePreferences: (prefKey: "showVegOnly" | "showSpiceLevel", value: boolean) => void;
  onCallWaiter: (reason: string) => void;
}

export default function ProfileScreen({
  session,
  onUpdatePreferences,
  onCallWaiter,
}: ProfileScreenProps) {
  const [rating, setRating] = useState(4);
  const [feedback, setFeedback] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [waiterNote, setWaiterNote] = useState<string | null>(null);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) return;
    setSubmittedFeedback(true);
    setFeedback("");
    setTimeout(() => {
      setSubmittedFeedback(false);
    }, 4000);
  };

  const handleQuickAction = (reason: string) => {
    onCallWaiter(reason);
    setWaiterNote(`Waiter called: "${reason}"`);
    setTimeout(() => {
      setWaiterNote(null);
    }, 4000);
  };

  return (
    <div className="w-full pb-32 px-4 animate-in fade-in duration-300 pt-20">
      {/* Top AppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 h-16 max-w-[430px] mx-auto bg-background/90 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform" style={{ fontSize: "24px" }}>menu</span>
          <h1 className="font-display text-xl text-primary tracking-tighter">BiteFlow</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-U9PurOsqTSU9UIPv6CP1eSXzT6zJhj4gTIajPADOemCjGSWKKW2TQz93eCm62TF9LxDUfPI7U8oDSoSV09V69py-vCWa-gbH72HTKHVVsXGWr5PMv6LDvtFgVdiO-qWafCn7XFa-yzIQeaq6UDfG3-9VmZM1Iv_dgSdrV314QUU97491w5WnyuGyWsmW9acB6LEtcNfEOpe89dkocGnEULubS_zpxMTDH12I_f36k5zke_0GhsYleHE-yhUQ5IQ1kHhIVVaWZp4"
            alt="Staff / Chef Portrait"
          />
        </div>
      </header>

      {/* Main Container */}
      <div className="space-y-6">
        {/* Session Card Section */}
        <section className="relative overflow-hidden bg-surface-container/80 backdrop-blur-md border border-outline-variant/60 rounded-[24px] p-6 flex flex-col gap-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-sans font-black text-on-surface-variant/60 uppercase tracking-widest">Active Table</p>
              <h2 className="font-display text-2xl font-black text-on-surface">Table 4 🪑</h2>
              <p className="text-xs text-primary font-bold">Started 7:32 PM</p>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-lg shadow-primary/10 select-none">
              <img
                className="w-16 h-16"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjrPkaAzLsBNzqcrnZ2MolnzgmzL38IEGVGwyFo1Z6yYZCN2ZBAzbNomxadq2yZf0NO5f4ukKZB9Tl9PMGRX3vXctbbFiJEV4GH_uPBFNVeqkl392DupsP8TFTUWaNC_cc7kAjQN7pClf1vUD35hf0uVymZuwgtxlKG0zSv5bKovQDmvn6SkJBy_VqG7L8WQuguVrv6Hr-HzhbY3N9N_MkG2_DB8nGE-26j9PYnBzUlhDs_6FQH6-l1sns7Cjj0coQ20XdpBOfDrs"
                alt="QR Code Table Link"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-outline-variant/30">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-sans font-black text-on-surface-variant/70 uppercase tracking-wide">BiteFlow Points</span>
              <span className="text-[10px] font-mono font-bold text-primary">
                {session.points} / {session.totalPointsNeeded} pts
              </span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div
                style={{ width: `${(session.points / session.totalPointsNeeded) * 100}%` }}
                className="h-full bg-primary rounded-full shadow-[0_0_10px_#FF6B35] transition-all duration-500"
              />
            </div>
            <p className="text-xs text-on-surface-variant/70 mt-2 font-sans">
              Almost there! 150 points to a <span className="text-secondary font-bold">Free Dessert</span>.
            </p>
          </div>
        </section>

        {/* Live Waiter Note Alert */}
        {waiterNote && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center text-xs font-sans text-primary animate-bounce-subtle">
            🔔 {waiterNote}
          </div>
        )}

        {/* Quick Actions Bento Grid */}
        <section className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleQuickAction("General Waiter Request")}
            className="col-span-2 bg-surface-container/80 backdrop-blur-md border border-outline-variant/60 h-14 rounded-xl flex items-center justify-between px-4 active:scale-[0.98] transition-transform hover:border-primary/50"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">notifications_active</span>
              <span className="text-sm font-sans font-bold text-on-surface">Call a waiter</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant/40" style={{ fontSize: "20px" }}>chevron_right</span>
          </button>

          <button
            onClick={() => handleQuickAction("Ask for water")}
            className="bg-surface-container/80 backdrop-blur-md border border-outline-variant/60 h-24 rounded-xl flex flex-col justify-center items-center gap-2 active:scale-[0.97] transition-all hover:border-primary/50"
          >
            <Droplet className="w-6 h-6 text-primary" />
            <span className="text-[10px] font-sans font-black text-on-surface-variant uppercase tracking-wider">Ask for water</span>
          </button>

          <button
            onClick={() => handleQuickAction("Request check")}
            className="bg-surface-container/80 backdrop-blur-md border border-outline-variant/60 h-24 rounded-xl flex flex-col justify-center items-center gap-2 active:scale-[0.97] transition-all hover:border-primary/50"
          >
            <FileText className="w-6 h-6 text-tertiary" />
            <span className="text-[10px] font-sans font-black text-on-surface-variant uppercase tracking-wider">Request Check</span>
          </button>
        </section>

        {/* Order History (Timeline) */}
        <section className="space-y-3">
          <h3 className="font-display text-base font-extrabold text-on-surface">Order History</h3>
          <div className="space-y-2">
            {/* Item 1 */}
            <div className="bg-surface-container/80 backdrop-blur-md border border-outline-variant/60 rounded-xl p-3 flex gap-3 items-center">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "24px" }}>lunch_dining</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <h4 className="text-xs font-sans font-bold text-on-surface truncate">Wagyu Truffle Burger</h4>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-tertiary/20 text-tertiary border border-tertiary/30 shrink-0 uppercase tracking-widest">Served</span>
                </div>
                <p className="text-[10px] text-on-surface-variant/60 font-sans mt-0.5">Ordered 7:45 PM • 1 unit</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="bg-surface-container/80 backdrop-blur-md border border-outline-variant/60 rounded-xl p-3 flex gap-3 items-center opacity-80">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "24px" }}>local_bar</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <h4 className="text-xs font-sans font-bold text-on-surface truncate">Old Fashioned</h4>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 shrink-0 uppercase tracking-widest">Preparing</span>
                </div>
                <p className="text-[10px] text-on-surface-variant/60 font-sans mt-0.5">Ordered 8:12 PM • 2 units</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dietary Preferences (Toggles) */}
        <section className="bg-surface-container/80 backdrop-blur-md border border-outline-variant/60 rounded-[24px] p-6 space-y-4">
          <h3 className="font-display text-base font-extrabold text-on-surface">Dietary Preferences</h3>
          <div className="space-y-4">
            {/* Show veg only */}
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-tertiary" />
                <span className="text-xs font-sans font-bold text-on-surface">Show veg only</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={session.dietaryPreferences.showVegOnly}
                  onChange={(e) => onUpdatePreferences("showVegOnly", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </div>
            </label>

            {/* Show spice level */}
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-error" />
                <span className="text-xs font-sans font-bold text-on-surface">Show spice level</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={session.dietaryPreferences.showSpiceLevel}
                  onChange={(e) => onUpdatePreferences("showSpiceLevel", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </div>
            </label>
          </div>
        </section>

        {/* Feedback Experience Rating */}
        <section className="bg-surface-container/80 backdrop-blur-md border border-outline-variant/60 rounded-[24px] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-extrabold text-on-surface">Rate Experience</h3>
            <span className="text-[10px] text-primary bg-primary/10 px-2.5 py-0.5 rounded font-sans font-bold">+50 pts</span>
          </div>

          <div className="flex justify-center gap-2 py-1">
            {[0, 1, 2, 3, 4].map((starIndex) => {
              const isSelected = starIndex < rating;
              return (
                <button
                  key={starIndex}
                  onClick={() => handleStarClick(starIndex)}
                  className="focus:outline-none focus:ring-0 active:scale-125 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      isSelected ? "text-primary fill-primary" : "text-on-surface-variant/30"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {submittedFeedback && (
            <div className="bg-tertiary-container/10 border border-tertiary-container/30 rounded-xl p-3 text-center">
              <p className="text-xs font-sans font-bold text-tertiary">
                💖 Feedback sent! Your BiteFlow points balance has been updated.
              </p>
            </div>
          )}

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full h-24 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 font-sans text-xs text-on-surface focus:border-primary focus:ring-0 transition-colors placeholder:text-on-surface-variant/30"
            placeholder="Share your thoughts with the chef..."
          />

          <button
            onClick={handleSubmitFeedback}
            disabled={!feedback.trim()}
            className="w-full h-12 bg-primary text-on-primary-container font-sans font-black rounded-xl active:scale-[0.98] hover:brightness-105 transition-all disabled:opacity-40"
          >
            Submit Feedback
          </button>
        </section>
      </div>
    </div>
  );
}
