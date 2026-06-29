/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Lock, Check } from "lucide-react";

interface PINOverlayProps {
  onSuccess: () => void;
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
      // Default pin is 1234, but we can accept any 4 digit code for smooth testing
      if (pin.length === 4) {
        onSuccess();
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
        
        <h2 className="font-display text-2xl font-bold text-primary mb-2">Staff access only 🔐</h2>
        <p className="font-sans text-sm text-on-surface-variant mb-6">Enter secure kitchen code to continue</p>
        
        {/* Pin Dots */}
        <div className="flex justify-center gap-4 mb-8">
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

        <p className="mt-6 text-[11px] text-on-surface-variant/50">
          Hint: Enter any 4 numbers and click OK
        </p>
      </div>
    </div>
  );
}
