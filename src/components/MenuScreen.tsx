/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { MenuItem, CartItem } from "../types";
import { MENU_ITEMS } from "../data";
import { Search, Mic, Plus, Minus, Star, ArrowRight, Menu } from "lucide-react";

interface MenuScreenProps {
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (menuItemId: string, change: number) => void;
  onNavigateToCart: () => void;
}

export default function MenuScreen({
  cart,
  onAddToCart,
  onUpdateQuantity,
  onNavigateToCart,
}: MenuScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Trending", "Starters", "Mains", "Desserts", "Beverages"];

  // Filter items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeCategory === "All") {
        return matchesSearch;
      } else if (activeCategory === "Trending") {
        return matchesSearch && item.isTrending;
      } else {
        return matchesSearch && item.category === activeCategory;
      }
    });
  }, [searchQuery, activeCategory]);

  // Compute stats for bottom floating cart bar
  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cart]);

  const cartTotalPrice = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);
  }, [cart]);

  const firstThreeItemsNames = useMemo(() => {
    if (cart.length === 0) return "";
    const names = cart.map((item) => item.menuItem.name);
    if (names.length <= 1) return names[0];
    return `${names[0]} + ${names.length - 1} more`;
  }, [cart]);

  return (
    <div className="w-full pb-32 animate-in fade-in duration-300">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 h-16 max-w-[430px] mx-auto bg-background/90 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform" style={{ fontSize: "24px" }}>menu</span>
          <div className="flex flex-col">
            <h1 className="font-display text-xl text-primary tracking-tighter leading-none">BiteFlow</h1>
            <span className="text-[9px] font-mono text-on-surface-variant uppercase tracking-widest mt-0.5">Table 4 • QR #T04</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/50">
            <span className="text-[10px] font-sans font-bold tracking-widest text-primary">TABLE 4</span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBbzRdJg8q4a_5dhdAyMSQYfLkoEuQaxt5NYJGLWffoHUMvS4FVePialuU25RPt2WUHSkfZJiC8H6a5Iux3ZUBEpZ2-4xuFRlDByoqXZNDz_vv_HEFE4MrxguZJ617ZbbrAncNFeVnSbfP3GDVvqF13Q9zeuQbqEMsvZFEYxbT4YY4cg-Xb1kNjRXnKDHte1a0Z5TMW1aQIS4kskrZifYK1m8gURR3OVMwd5vPYpytsV_hMBHbJ1RAnNMp_br3jiwrdB49ZhhCif0"
              alt="Waiter Staff"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 px-4">
        {/* Hero Section */}
        <div className="relative w-full h-40 rounded-[24px] overflow-hidden mb-6 flex flex-col justify-end p-5 group shadow-[0_8px_30px_rgba(255,107,53,0.15)] border border-primary-container/20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#A855F7] opacity-90 transition-all duration-500 group-hover:scale-105" />
          <div className="relative z-10">
            <p className="text-[10px] font-sans font-extrabold text-white/80 uppercase tracking-widest mb-1">Evening Special</p>
            <h2 className="font-display text-2xl font-black text-white leading-none">Craving Spices?</h2>
            <p className="text-xs text-white/95 mt-1.5 leading-relaxed font-sans font-medium">Authentic flavors delivered to Table 4 in under 15 mins.</p>
          </div>
        </div>

        {/* Promo Ticker */}
        <div className="w-full bg-surface-container-low py-2.5 mb-6 overflow-hidden whitespace-nowrap rounded-xl border border-outline-variant/20">
          <div className="promo-scroll inline-block font-sans font-bold text-xs uppercase tracking-wider">
            <span className="text-primary mx-4">🔥 20% OFF ON COMBOS TODAY</span>
            <span className="text-secondary mx-4">🍹 HAPPY HOURS START AT 6 PM</span>
            <span className="text-tertiary mx-4">🌟 CHEF'S SPECIAL PANEER TIKKA</span>
            <span className="text-primary mx-4">🔥 20% OFF ON COMBOS TODAY</span>
            <span className="text-secondary mx-4">🍹 HAPPY HOURS START AT 6 PM</span>
            <span className="text-tertiary mx-4">🌟 CHEF'S SPECIAL PANEER TIKKA</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="flex items-center bg-surface-container-high rounded-xl border border-outline-variant/30 px-4 h-14 orange-glow-focus transition-all duration-300">
            <Search className="text-on-surface-variant w-5 h-5 mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none focus:ring-0 w-full font-sans text-sm text-on-surface placeholder:text-on-surface-variant/40"
              placeholder="Search for delicacies..."
            />
            <button className="text-primary cursor-pointer shrink-0 active:scale-95 transition-transform">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex overflow-x-auto gap-2 mb-8 hide-scrollbar">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-none px-6 h-10 rounded-full font-sans text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(255,107,53,0.3)]"
                    : "bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-primary/50"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">search_off</span>
            <p className="text-on-surface-variant text-sm mt-2">No delicacies found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const cartItem = cart.find((ci) => ci.menuItem.id === item.id);
              const hasQuantity = cartItem && cartItem.quantity > 0;

              return (
                <div
                  key={item.id}
                  className={`bg-surface-container-low rounded-[20px] border p-3 flex flex-col group active:scale-[0.98] transition-all duration-300 ${
                    hasQuantity ? "border-primary glow-orange" : "border-outline-variant/20"
                  }`}
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md">
                      <span className="font-mono text-xs font-bold text-primary">₹{item.price}</span>
                    </div>
                    {item.isTrending && (
                      <div className="absolute top-2 left-2 bg-primary px-2 py-0.5 rounded-md shadow-sm">
                        <span className="text-[8px] font-sans font-extrabold text-on-primary uppercase tracking-widest">Trending</span>
                      </div>
                    )}
                    {item.isChefPick && (
                      <div className="absolute top-2 left-2 bg-secondary-container px-2 py-0.5 rounded-md shadow-sm">
                        <span className="text-[8px] font-sans font-extrabold text-on-secondary-container uppercase tracking-widest">Chef's Pick</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-sans font-bold text-sm text-on-surface line-clamp-1 mb-0.5">{item.name}</h3>
                  <p className="font-sans text-[11px] text-on-surface-variant/70 mb-3 truncate leading-normal">{item.description}</p>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-mono font-bold text-on-surface-variant">{item.rating || 4.8}</span>
                    </div>

                    {hasQuantity ? (
                      <div className="flex items-center bg-surface-container-high border border-primary/30 rounded-xl h-10 px-1 transition-all">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1.5 text-primary active:scale-95 transition-transform"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-1.5 font-mono text-xs font-bold text-on-surface">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1.5 text-primary active:scale-95 transition-transform"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAddToCart(item)}
                        className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-lg active:scale-90 transition-all hover:brightness-105"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Cart Bar */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-24 left-4 right-4 z-40 max-w-[398px] mx-auto animate-bounce-subtle">
          <button
            onClick={onNavigateToCart}
            className="w-full bg-primary-container h-14 rounded-full flex items-center justify-between px-6 shadow-[0_8px_30px_rgba(255,107,53,0.4)] border border-white/20 hover:brightness-115 active:scale-[0.98] transition-all"
          >
            <div className="flex flex-col items-start">
              <span className="text-[9px] font-sans font-black text-on-primary-container uppercase tracking-widest">{cartItemCount} items added</span>
              <span className="text-xs font-sans font-bold text-on-primary-container truncate w-40 text-left">{firstThreeItemsNames}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black text-on-primary-container">₹{cartTotalPrice}</span>
              <ArrowRight className="w-4 h-4 text-on-primary-container shrink-0" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
