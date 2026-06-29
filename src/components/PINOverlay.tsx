/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Lock, Check } from "lucide-react";

interface PINOverlayProps {
  onSuccess: (role: string) => void;
  onClose?: () => void;
}

export default function PINOverlay({ onSuccess, onClose }: PINOverlayProps) {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleKeyPress = (num: string) => {
    setError("");
    if (num === "X") {
      setPin("");
    } else if (num === "OK") {
      if (pin.length === 4) {
        // Map PINs to specific Smart Café user roles
        let detectedRole = "Chef";
        if (pin === "8888") {
          detectedRole = "Admin";
        } else if (pin === "5555") {
          detectedRole = "Manager";
        } else if (pin === "3333") {
          detectedRole = "Waiter";
        } else if (pin === "2222") {
          detectedRole = "Cashier";
        } else if (pin === "1111") {
          detectedRole = "Chef";
        } else {
          // Default fallback
          detectedRole = "Chef";
        }
        onSuccess(detectedRole);
      } else {
        setError("Please enter a 4-digit code");
      }
    } else if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "X", "0", "OK"];

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fade-in">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}

      <div className="w-full max-w-[320px] text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-primary-container/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-5xl" style={{ fontSize: "48px" }}>lock</span>
        </div>
        
        <h2 className="font-display text-2xl font-bold text-primary mb-2">Smart Café Terminal 🔐</h2>
        <p className="font-sans text-xs text-on-surface-variant mb-6">Enter role-specific PIN code to log in</p>
        
        {/* Pin Dots */}
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                index < pin.length
                  ? "bg-primary border-primary scale-110 shadow-[0_0_10px_#ffb59d]"
                  : "border-outline-variant"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-primary-container font-semibold mb-4 animate-bounce">
            {error}
          </p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {keys.map((key) => {
            const isOk = key === "OK";
            const isClear = key === "X";
            return (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`h-16 rounded-xl flex items-center justify-center font-display text-xl border transition-all active:scale-95 ${
                  isOk
                    ? "bg-primary-container text-on-primary-container border-none font-bold hover:brightness-110 shadow-[0_4px_12px_rgba(255,107,53,0.2)]"
                    : "border-outline-variant/30 hover:bg-surface-container-high text-on-surface hover:border-primary/50"
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-surface-container rounded-2xl border border-outline-variant/10 text-left w-full space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase font-mono tracking-widest block mb-1">Terminal Shortcuts:</span>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-on-surface-variant font-mono">
            <span>• Chef/KDS: <b>1111</b></span>
            <span>• Cashier: <b>2222</b></span>
            <span>• Waiter: <b>3333</b></span>
            <span>• Manager: <b>5555</b></span>
            <span>• Admin: <b>8888</b></span>
          </div>
        </div>
      </div>
    </div>
  );
}
