/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  emoji: string;
  description: string;
  image: string;
  rating?: number;
  isChefPick?: boolean;
  isTrending?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customization?: string;
}

export type TicketStatus = "NEW" | "COOKING" | "READY" | "SERVED";

export interface OrderTicket {
  id: string; // T12, T04, etc.
  orderNumber: string; // #BF-4821
  status: TicketStatus;
  table: string; // Table 4
  allergyNote?: string;
  kitchenNote?: string;
  items: {
    name: string;
    quantity: number;
    customization?: string;
    category?: string; // Main, Side, Lrg, Reg
  }[];
  receivedTime: Date;
  elapsedSeconds: number; // for cooking duration simulation
  waiterNotified?: boolean;
}

export interface TableSession {
  tableNumber: string;
  startTime: string;
  points: number;
  totalPointsNeeded: number;
  dietaryPreferences: {
    showVegOnly: boolean;
    showSpiceLevel: boolean;
  };
}

export type ActiveTab = "Menu" | "Cart" | "Bill" | "Kitchen" | "Profile";
