# BiteFlow — Product Requirements Document

## 1. Product
BiteFlow is a multi-tenant SaaS platform for cafes and restaurants. It combines QR/table ordering, branded digital menus, kitchen display, staff operations, reservations, inventory, loyalty, analytics, and subscription-based white-label management.

The current repository already demonstrates the core tenant model: organizations have plans, branded themes, tables, menu items, orders, service requests, reservations, inventory, employees, and audit logs. The UI contains consumer ordering, cart/bill, kitchen, staff portal, tenant dashboard, setup wizard, and super-admin views. fileciteturn6file0 fileciteturn5file0

## 2. Problem
Small and mid-sized food businesses often depend on disconnected QR menus, POS tools, WhatsApp, spreadsheets, and manual kitchen workflows. BiteFlow should provide one configurable system without requiring a custom app for every restaurant.

## 3. Target customers
- Independent cafes and QSRs
- Restaurants and fine-dining venues
- Food courts and cloud kitchens
- Multi-branch restaurant groups
- Hospitality operators

## 4. Product goals
1. Launch a restaurant in minutes.
2. Give each tenant a fully branded customer ordering experience.
3. Isolate tenant data and configuration.
4. Reduce waiter/order-entry workload.
5. Give kitchen staff a live order queue.
6. Provide owners with operational and sales visibility.
7. Monetize through recurring subscriptions.
8. Keep Web3 optional and invisible to customers unless the restaurant enables it.

## 5. Current repository baseline
### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Lucide icons
- Motion

### Backend
- Express + TypeScript
- Drizzle ORM
- PostgreSQL
- Firebase Auth/Admin
- Google GenAI SDK

The package manifest confirms this current stack. fileciteturn3file0

### Existing product areas
- Consumer menu
- Cart and checkout/billing
- Kitchen display system
- Staff portal
- SaaS platform header
- Tenant setup wizard
- Super-admin console
- Tenant dashboard

These are wired through the main application controller. fileciteturn7file0

### Existing tenant data model
- Subscription plans
- Organizations/tenants
- Users and roles
- Tables
- Menu items
- Orders and order items
- Service requests
- Reservations
- Inventory
- Employees
- Audit logs

All core operational entities are organization-scoped. fileciteturn6file0

## 6. Core user journeys

### A. Platform owner
1. Sign in as Super Admin.
2. View all restaurants/tenants.
3. Create or suspend a tenant.
4. Assign subscription plan.
5. Inspect usage and audit activity.
6. Manage global plans/features.

### B. Restaurant owner onboarding
1. Start setup wizard.
2. Enter restaurant name, business type, GST, timezone, currency.
3. Select subscription plan/trial.
4. Upload logo.
5. Choose brand colors, typography, button/card styles.
6. Configure branches and tables.
7. Add/import menu.
8. Generate table QR codes.
9. Invite staff.
10. Preview the customer menu.
11. Publish restaurant.

### C. Customer ordering
1. Scan table QR.
2. Open restaurant-branded web menu.
3. Browse categories/search/filter.
4. Add items and customizations.
5. Add allergy/kitchen notes.
6. Submit order.
7. Track order state.
8. Call waiter/service.
9. Request bill.
10. Pay.
11. Earn loyalty/rewards if enabled.

The current consumer controller already posts orders with tenant context and syncs menus, orders, and tables. fileciteturn7file0

### D. Kitchen
1. Receive new order.
2. Accept/start cooking.
3. Mark ready.
4. Notify waiter.
5. Complete/serve order.

### E. Staff
1. Authenticate using role/PIN or account.
2. See role-specific work queue.
3. Manage assigned tasks.
4. Update table/order/service state.

### F. Owner dashboard
1. View revenue/orders/table activity.
2. Manage menu and availability.
3. Manage tables and QR codes.
4. Manage staff.
5. Manage reservations.
6. Monitor inventory.
7. Configure loyalty.
8. Customize theme.
9. Manage subscription and billing.
10. Review audit logs.

## 7. Subscription model
Current seeded plans are Starter ₹4,999/month, Professional ₹9,999/month, and Enterprise ₹24,999/month, with limits for branches, employees, tables, and menu items plus feature flags. fileciteturn4file0

For production, expose plan comparison in the onboarding and billing screens. Recommended packaging:

| Plan | Suggested positioning | Core limits/features |
|---|---|---|
| Starter | Single cafe | 1 branch, 5 staff, 10 tables, QR menu, ordering, basic analytics |
| Professional | Growing restaurant | 3 branches, 15 staff, 30 tables, inventory, loyalty, advanced analytics |
| Enterprise | Restaurant group | 10+ branches, 50+ staff, multi-branch analytics, AI, priority support, API/Web3 options |

Pricing should be configurable by platform admin rather than hard-coded.

## 8. Web3 strategy
Web3 is an optional platform capability, not a requirement for basic restaurant ordering.

### Recommended architecture
**Primary chain:** Base.

Use an EVM-compatible chain with low-cost transactions and stablecoin support. Keep the blockchain behind a payment/rewards abstraction so restaurants can use Web2 checkout while Web3 is enabled only for relevant features.

### Web3 features for prototype
- Wallet connection for owners, not mandatory customers.
- USDC subscription/payment option where commercially appropriate.
- On-chain subscription receipt/reference, while authoritative billing remains in the SaaS database.
- NFT-free loyalty points initially; store loyalty balances off-chain and optionally anchor reward events on-chain.
- Optional membership/pass NFT later.
- Wallet-based customer loyalty as an opt-in advanced feature.
- Verifiable restaurant membership/campaign passes.

### Web3 stack options
**Recommended:** Base + wagmi + viem + Privy/thirdweb + OpenZeppelin + USDC.

**Alternative:** Polygon for broader EVM ecosystem compatibility.

**Alternative for high-throughput experiments:** Solana with Solana Wallet Adapter/SDK, but this would require a separate non-EVM integration path.

Do not put orders, menu data, customer PII, inventory, or operational records on-chain.

## 9. Payments and billing
### Web2
- Razorpay for INR subscriptions and Indian restaurant billing.
- Stripe can be added for international SaaS billing.

### Web3
- USDC on Base as an optional crypto rail.
- Wallet transaction verification on the server.
- Never trust a frontend wallet balance or transaction alone; verify chain, recipient, token contract, amount, nonce/reference, and finality.

Billing source of truth remains PostgreSQL.

## 10. Multi-tenancy requirements
- Every business record must contain organization/tenant ID.
- Never accept tenant ID as an authorization decision from a browser header alone in production.
- Derive tenant identity from authenticated claims/session.
- Enforce server-side authorization on every tenant-scoped route.
- Add PostgreSQL Row Level Security for defense in depth.
- Prevent cross-tenant cache/storage leakage.
- Tenant-specific rate limits and usage quotas.

The current prototype resolves tenant context using `x-organization-id`; this is useful for a demo but must be replaced or protected with authenticated tenant claims before production. fileciteturn4file0

## 11. Authentication and roles
Roles:
- Super Admin
- Organization Owner
- Manager
- Cashier
- Chef
- Kitchen Staff
- Waiter
- Customer

Use Firebase/Auth or a modern auth provider for prototype speed. For production, implement tenant-aware RBAC/ABAC and server-side authorization.

## 12. Functional requirements
### Menu
- CRUD categories/items
- Images
- Prices
- Availability
- Veg/non-veg metadata
- Allergens
- Preparation time
- Chef pick/trending flags
- Scheduling
- Bulk import

### QR/table ordering
- Unique QR per table
- Restaurant/branch/table encoded in signed token
- Customer can order without account
- Session tied to table
- Multiple orders per session

### Orders
- New → Cooking → Ready → Served → Completed
- Kitchen notes
- Allergy notes
- Customizations
- Waiter notifications
- Order history

### Tables
- Availability
- Occupancy
- Current bill
- Assigned waiter
- QR regeneration
- Checkout/reset

### Reservations
- Date/time/guest count
- Special requests
- Confirmation/cancellation/seated states

### Inventory
- Ingredient stock
- Threshold alerts
- Expiry
- Supplier
- Consumption linkage to menu items in a later phase

### Staff
- Role
- Shift
- Performance
- Branch assignment
- Access permissions

### Analytics
- Revenue
- Orders
- Average order value
- Best-selling items
- Peak hours
- Table turnover
- Cancellation/refund metrics
- Inventory alerts
- Customer retention

## 13. AI roadmap
- Menu description generation
- Item recommendations
- Demand forecasting
- Low-stock prediction
- Sales anomaly detection
- Natural-language analytics assistant
- Automated promotional suggestions

Google GenAI is already present in the current dependency set. fileciteturn3file0

## 14. Non-functional requirements
- Mobile-first customer UI.
- Desktop/tablet-first staff UI.
- Fast QR-to-menu load.
- Accessible controls.
- Secure API authorization.
- Auditability.
- Automated backups.
- Error monitoring.
- Rate limiting.
- Idempotent payment/order APIs.
- Responsive design from 320px upward.

## 15. Prototype demo scope
For a convincing demo, implement only one complete golden path:

**Super Admin → Create Restaurant → Select Plan → Brand Restaurant → Add Tables/Menu → Generate QR → Customer Scans → Orders → Kitchen → Ready → Waiter → Bill → Payment → Dashboard analytics.**

Then demonstrate tenant isolation by switching between three seeded restaurant brands.

## 16. Prototype data
Use three demo tenants similar to the current repository:
- BiteFlow Café — Professional
- Green Garden Bistro — Starter
- Royal Tandoor House — Enterprise

The repository currently seeds these tenants with different branding and operational data. fileciteturn4file0

## 17. Suggested routes
### Public
- `/`
- `/pricing`
- `/demo`
- `/login`
- `/signup`

### SaaS
- `/app`
- `/app/onboarding`
- `/app/dashboard`
- `/app/menu`
- `/app/tables`
- `/app/orders`
- `/app/kitchen`
- `/app/staff`
- `/app/reservations`
- `/app/inventory`
- `/app/analytics`
- `/app/loyalty`
- `/app/branding`
- `/app/billing`
- `/app/settings`

### Restaurant customer
- `/r/:tenantSlug`
- `/r/:tenantSlug/t/:tableToken`
- `/r/:tenantSlug/order/:orderId`

### Platform admin
- `/admin`
- `/admin/tenants`
- `/admin/plans`
- `/admin/billing`
- `/admin/audit`

## 18. API groups
- `/api/auth/*`
- `/api/organizations/*`
- `/api/subscriptions/*`
- `/api/menu/*`
- `/api/tables/*`
- `/api/orders/*`
- `/api/requests/*`
- `/api/reservations/*`
- `/api/inventory/*`
- `/api/employees/*`
- `/api/analytics/*`
- `/api/payments/*`
- `/api/web3/*`
- `/api/audit/*`

## 19. Security requirements
- Server-side tenant authorization.
- Firebase token verification or equivalent.
- HttpOnly secure session/cookie strategy where applicable.
- CSRF protection where cookie auth is used.
- Zod/schema validation.
- SQL parameterization through Drizzle.
- Rate limiting.
- Audit logs.
- Secret management.
- Webhook signature verification.
- Payment idempotency keys.
- Web3 transaction verification.
- No private keys in browser or source control.
- No PII or operational data on-chain.

## 20. Prototype success criteria
A demo is successful when a new restaurant owner can be onboarded in under 5 minutes, publish a branded QR menu, place a real test order, see it in the kitchen, complete checkout, and view the resulting analytics without manually editing database records.

## 21. Future phases
### Phase 1 — SaaS core
Tenant onboarding, auth, menu, QR ordering, tables, orders, KDS, staff, billing.

### Phase 2 — Operations
Inventory, reservations, loyalty, analytics, notifications.

### Phase 3 — Intelligence
AI analytics, forecasting, recommendations, automated marketing.

### Phase 4 — Web3
Base wallet support, USDC option, verifiable subscriptions, loyalty wallet/pass, optional NFT membership.

### Phase 5 — Enterprise
Multi-location governance, SSO, API, webhooks, advanced permissions, integrations with POS/accounting platforms.

## 22. Definition of done
- Tenant can self-onboard.
- Tenant can customize branding.
- Customer can order by QR.
- Kitchen receives and updates order.
- Bill/payment completes safely.
- Owner sees analytics.
- Subscription entitlements are enforced.
- Tenant data cannot cross boundaries.
- Demo can be reset with seed data.
- Production secrets are not committed.
