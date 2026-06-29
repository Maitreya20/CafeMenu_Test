/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp, boolean, numeric } from "drizzle-orm/pg-core";

// SaaS Platform Subscription Plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Starter, Professional, Enterprise
  price: numeric("price").notNull(), // Monthly pricing in INR
  maxBranches: integer("max_branches").default(1).notNull(),
  maxEmployees: integer("max_employees").default(5).notNull(),
  maxTables: integer("max_tables").default(10).notNull(),
  maxMenuItems: integer("max_menu_items").default(30).notNull(),
  features: text("features").notNull(), // JSON string representing supported modules
});

// SaaS Tenant Organizations (Cafés)
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // subdomain or route slug
  logoUrl: text("logo_url"),
  businessType: text("business_type").default("Fine Dining").notNull(),
  gstNumber: text("gst_number"),
  timezone: text("timezone").default("Asia/Kolkata").notNull(),
  currency: text("currency").default("INR").notNull(),
  language: text("language").default("en").notNull(),
  
  // Custom theme colors for white-labeling
  primaryColor: text("primary_color").default("#ff6b35").notNull(),
  secondaryColor: text("secondary_color").default("#f7b05b").notNull(),
  accentColor: text("accent_color").default("#10b981").notNull(),
  fontFamily: text("font_family").default("Inter").notNull(),
  borderRadius: text("border_radius").default("16px").notNull(),
  buttonStyle: text("button_style").default("Rounded").notNull(), // Rounded, Pill, Sharp
  cardStyle: text("card_style").default("Glass").notNull(), // Glass, Flat, Elevated
  
  // Subscription management
  planId: integer("plan_id").references(() => subscriptionPlans.id),
  subscriptionStatus: text("subscription_status").default("Trial").notNull(), // Active, Trial, Expired, Suspended
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Users table (Tenant-Aware and Role-Based Auth)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  email: text("email").notNull(),
  role: text("role").default("Customer").notNull(), // Super Admin, Organization Owner, Manager, Cashier, Chef, Kitchen Staff, Waiter, Customer
  organizationId: integer("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tables metadata (Linked to Organization)
export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  tableNumber: text("table_number").notNull(),
  capacity: integer("capacity").default(4).notNull(),
  status: text("status").default("Available").notNull(), // Available, Reserved, Ordering, Preparing, Ready, Served, Eating, Bill Requested, Paid, Cleaning, Available Again
  assignedWaiter: text("assigned_waiter"),
  currentBill: numeric("current_bill").default("0").notNull(),
  occupiedTime: timestamp("occupied_time"),
  qrCodeUrl: text("qr_code_url"),
});

// Menu items (Linked to Organization)
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  itemId: text("item_id").notNull(), // e.g. "m1", "m2"
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: numeric("price").notNull(),
  emoji: text("emoji").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  isChefPick: boolean("is_chef_pick").default(false).notNull(),
  isTrending: boolean("is_trending").default(false).notNull(),
  available: boolean("available").default(true).notNull(),
  preparationTime: integer("prep_time").default(15).notNull(), // in minutes
  calories: integer("calories"),
});

// Orders placement (Linked to Organization)
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  orderNumber: text("order_number").notNull(), // e.g., #BF-4821
  tableNumber: text("table_number").notNull(),
  status: text("status").default("NEW").notNull(), // NEW, COOKING, READY, SERVED, COMPLETED
  allergyNote: text("allergy_note"),
  kitchenNote: text("kitchen_note"),
  waiterNotified: boolean("waiter_notified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: text("user_id"), // uid of ordering user (if logged in)
});

// Order items detailed connection
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  menuItemId: text("menu_item_id").notNull(), // references menu_items.itemId
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  customization: text("customization"),
  category: text("category"), // Main, Side, Lrg, Reg
  price: numeric("price").notNull(),
});

// Customer service requests (Linked to Organization)
export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  tableNumber: text("table_number").notNull(),
  requestType: text("request_type").notNull(), // Need Water, Need Tissue, Need Waiter, Need Bill, Need Cleaning, Need Assistance
  status: text("status").default("PENDING").notNull(), // PENDING, RESPONDED, COMPLETED
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reservations module (Linked to Organization)
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  date: text("date").notNull(), // YYYY-MM-DD
  time: text("time").notNull(), // HH:MM
  guests: integer("guests").notNull(),
  specialRequests: text("special_requests"),
  status: text("status").default("CONFIRMED").notNull(), // CONFIRMED, CANCELLED, SEATED
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Inventory stock records (Linked to Organization)
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  ingredient: text("ingredient").notNull(),
  stock: integer("stock").notNull(), // in appropriate units (g, ml, count)
  lowStockAlert: integer("low_stock_alert").default(10).notNull(),
  expiryDate: text("expiry_date"),
  supplier: text("supplier"),
});

// Employee shifts & tracking records (Linked to Organization)
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // Chef, Waiter, Cashier, Chef, Kitchen Staff, Manager
  shiftStart: text("shift_start"), // e.g., "08:00"
  shiftEnd: text("shift_end"), // e.g., "16:00"
  salary: integer("salary"),
  performanceRating: numeric("performance_rating").default("5.0"),
});

// System Audit Logs (Platform-wide auditability)
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
  userId: text("user_id"),
  userEmail: text("user_email"),
  action: text("action").notNull(), // e.g., "UPDATE_THEME", "ADD_MENU_ITEM", "CANCEL_ORDER"
  details: text("details"), // JSON meta details
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Drizzle relationships
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
