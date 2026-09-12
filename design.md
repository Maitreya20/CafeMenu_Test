# BiteFlow — Design Specification

## 1. Design vision
BiteFlow should feel like a premium restaurant operating system rather than a generic admin panel. The product has two distinct experiences:

1. **Owner/SaaS experience:** polished, data-rich, trustworthy, subscription-oriented.
2. **Customer experience:** fast, visual, minimal, mobile-first, restaurant-branded.

Web3 must be progressive enhancement. The customer should never need to understand wallets, chains, gas, or tokens to order food.

## 2. Brand principles
- Premium but approachable
- Fast and operational
- Strong food imagery
- Clear hierarchy
- Minimal cognitive load
- Trustworthy payments
- White-label by default
- Mobile-first for diners
- Dense but readable for operators

## 3. Information architecture
### Marketing site
- Hero
- Product demo
- How it works
- Features
- Integrations
- Pricing
- Security
- Web3/loyalty optional section
- FAQ
- CTA

### Restaurant owner application
Persistent sidebar:
- Overview
- Orders
- Kitchen
- Tables
- Menu
- Reservations
- Inventory
- Staff
- Customers/Loyalty
- Analytics
- Branding
- Integrations
- Billing
- Settings

Top bar:
- Restaurant/branch selector
- Search
- Notifications
- Help
- User menu

### Super Admin
- Platform overview
- Tenants
- Subscriptions
- Revenue
- Usage
- Feature flags
- Audit logs
- Support
- System health

## 4. Subscription conversion flow
The design should make the subscription journey feel simple:

**Landing → Explore demo → Pricing → Select plan → Create account → Restaurant setup → Brand → Menu → Tables → QR preview → Publish → Dashboard.**

Never make the owner fill unnecessary technical fields.

## 5. Pricing page
Use three primary cards:

### Starter
For a single cafe.
- QR menu
- Table ordering
- Basic analytics
- Branding
- Limited tables/staff

### Professional — Recommended
For growing restaurants.
- Everything in Starter
- Inventory
- Loyalty
- Advanced analytics
- Multiple branches
- More staff/tables

### Enterprise
For restaurant groups.
- Everything in Professional
- Multi-branch control
- Advanced permissions
- AI analytics
- API/webhooks
- Priority support
- Optional Web3 modules

Include:
- Monthly/yearly toggle
- Feature comparison
- Usage limits
- Trial CTA
- Contact sales CTA
- “No technical setup required” reassurance

## 6. Onboarding design
Use a 6-step progress indicator:

1. Business
2. Plan
3. Branding
4. Menu
5. Tables
6. Launch

### Business screen
Fields:
- Restaurant name
- Business type
- Address
- GST
- Currency
- Timezone
- Logo

### Branding screen
Live split-screen preview:
- Left: controls
- Right: phone preview

Controls:
- Primary color
- Secondary color
- Accent
- Font
- Button style
- Card style
- Border radius
- Logo
- Menu layout

Use presets:
- Cafe
- Minimal
- Luxury
- Street Food
- Modern Indian
- Bakery

### Menu setup
- Add item
- Upload image
- Category
- Price
- Dietary labels
- Availability
- Preparation time
- Description

Provide CSV import for fast onboarding.

### Tables
Visual table map/grid.
- Add table
- Set capacity
- Assign section
- Generate QR
- Download QR sheet
- Print labels

### Launch
Show a pre-launch checklist:
- Branding complete
- Menu complete
- At least one table
- Payment configured
- Staff invited

Then a large **Publish Restaurant** action.

## 7. Owner dashboard
The dashboard should answer five questions immediately:
1. How much did I sell?
2. How many orders are active?
3. What is happening in the kitchen?
4. Which items are performing?
5. Is anything requiring attention?

### KPI cards
- Today's sales
- Orders
- Average order value
- Occupied tables
- Low-stock items

### Main visualizations
- Revenue trend
- Orders by hour
- Best sellers
- Table utilization
- Kitchen performance

### Action center
Use actionable alerts:
- 3 items low on stock
- 2 tables waiting for service
- 4 orders delayed
- Subscription renews in 7 days

## 8. Order/KDS design
Kitchen UI should be full-screen and high contrast.

Columns:
- New
- Preparing
- Ready
- Served

Each ticket:
- Order number
- Table
- elapsed timer
- item list
- modifiers
- allergy warning
- kitchen note
- action button

Timers should become visually prominent when SLA is exceeded.

## 9. Table management
Use a floor/table grid.

Status system:
- Available
- Reserved
- Ordering
- Preparing
- Ready
- Served
- Eating
- Bill requested
- Paid
- Cleaning

Each table card shows:
- Number
- Guests
- Current bill
- elapsed time
- waiter
- order status

## 10. Customer menu design
The customer experience should resemble a premium food ordering app, not a SaaS dashboard.

### Header
- Restaurant logo
- Name
- Table identifier
- Search
- Cart

### Hero
- Featured item or restaurant image
- Short brand statement

### Categories
Horizontal scrolling chips.

### Menu cards
- Large image
- Name
- Description
- Price
- Dietary indicator
- Chef/trending badge
- Add button

### Cart
Use a bottom-sheet pattern on mobile.
- Items
- Quantity
- Customization
- Notes
- Subtotal
- Taxes/service charges
- Total
- Place order

### Order tracking
Visual stepper:
**Received → Preparing → Ready → Served**

## 11. Restaurant theme engine
Every tenant should control a design-token layer:

```text
--primary
--secondary
--accent
--surface
--background
--text
--muted
--border-radius
--font-family
--button-style
--card-style
```

The existing application already maps tenant colors, radius and font variables dynamically. fileciteturn7file0

Do not allow arbitrary CSS from tenants. Store approved token values/presets and sanitize custom inputs.

## 12. Web3 UX design
Web3 should be hidden by default.

### Owner billing
Add an optional “Pay with USDC” method beside normal payment.

Display:
- Network
- Token
- Amount
- Estimated transaction fee
- Wallet/account
- Transaction status

Never show blockchain jargon unless the owner expands advanced details.

### Wallet connection
Button states:
- Connect wallet
- Connected
- Wrong network
- Transaction pending
- Confirmed
- Failed

### Loyalty
Prefer an abstract “Digital Rewards” experience.

Customer sees:
- Points
- Rewards
- Membership tier
- Redeem button

If Web3 is enabled, wallet/pass details live under an optional “Digital Wallet” section.

## 13. Recommended Web3 visual language
Do not use the typical dark crypto-dashboard aesthetic for the restaurant customer.

For the platform/admin layer, use subtle Web3 signals:
- Network badge
- Verified transaction indicator
- Wallet identity chip
- On-chain receipt icon

Avoid:
- Huge coin logos
- Token price charts
- Speculative language
- NFT-first terminology

## 14. Design system
### Typography
Recommended:
- Inter for application UI
- Manrope as alternative modern SaaS font
- Playfair Display as optional restaurant-brand heading font

The repository already stores per-tenant font choices, including Inter, Outfit and Playfair Display. fileciteturn4file0

### Spacing
Use 4px base grid.
- 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Radius
- Small: 8px
- Medium: 12px
- Large: 16px
- Brand/custom: 24px

### Components
Build reusable:
- Buttons
- Inputs
- Selects
- Tabs
- Badges
- Cards
- Tables
- Data charts
- Modals
- Drawers
- Toasts
- Empty states
- Skeletons
- QR preview
- Order tickets
- Menu cards
- Pricing cards
- Subscription status
- Wallet status

## 15. Responsive behavior
### Customer
Mobile-first. Optimize for one-hand operation.

### Staff
Tablet-first; kitchen can use widescreen desktop/TV.

### Owner
Desktop-first but fully responsive.

## 16. Accessibility
- WCAG AA contrast target
- Keyboard navigation
- Focus states
- Screen-reader labels
- Reduced-motion support
- Do not rely on color alone for order/table status
- Large touch targets for kitchen actions

## 17. States to design
Every screen must have:
- Loading
- Empty
- Success
- Error
- Offline/retry
- Permission denied
- Subscription limit reached
- Subscription expired

## 18. Billing UX
Billing screen sections:
1. Current plan
2. Usage
3. Renewal date
4. Payment method
5. Invoice history
6. Upgrade/downgrade
7. Cancel subscription
8. Optional crypto payment

Use a usage meter:
`23 / 30 tables used`

When near limit, show a contextual upgrade CTA rather than blocking unexpectedly.

## 19. Plan gating
Feature-locked controls should show:
- Current plan
- Feature benefit
- Usage requirement
- Upgrade CTA

Example:
> Inventory forecasting is available on Professional.
> Upgrade to unlock demand prediction and low-stock alerts.

## 20. Demo mode
Create a visible **Demo Mode** switch for presentations.

Demo mode should:
- Use seeded tenants
- Provide fake payment success
- Simulate kitchen timing
- Reset orders
- Show analytics with realistic data
- Avoid requiring real blockchain transactions

For Web3 demo, use testnet or a simulated transaction adapter. Never use real funds in a public demo.

## 21. Recommended prototype stack
### Frontend
- React + TypeScript + Vite
- Tailwind CSS
- shadcn/ui-style component architecture
- Lucide
- Motion

### Backend
- Node.js + Express initially
- Drizzle ORM
- PostgreSQL

### Auth
- Firebase Auth for fastest continuation of the current project
- Alternative: Supabase Auth if consolidating database/auth infrastructure

### Database
- PostgreSQL
- Row Level Security in production
- Redis/Upstash later for queues/rate limiting/caching

### Storage
- Cloudflare R2 or Supabase Storage for restaurant/menu images

### Hosting
- Vercel for frontend where suitable
- Render/Fly.io/Railway or equivalent for the long-running Express API
- Managed PostgreSQL

### Payments
- Razorpay for Indian INR SaaS billing
- Stripe for international SaaS billing
- USDC on Base as optional Web3 payment

### Web3
- Base
- viem
- wagmi
- Privy or thirdweb for wallet onboarding/account abstraction
- OpenZeppelin contracts
- USDC

### Observability
- Sentry
- PostHog or equivalent product analytics
- Structured server logs

## 22. Best Web3 stack choices
### Option A — Recommended
**Base + Privy + wagmi/viem + OpenZeppelin + USDC**

Best for a SaaS prototype because it keeps wallet UX simple while retaining EVM interoperability.

### Option B — Developer platform emphasis
**Base + thirdweb + viem + OpenZeppelin**

Best when you want faster contract/deployment abstractions and a broader Web3 developer toolkit.

### Option C — EVM alternative
**Polygon + Privy/thirdweb + viem/wagmi**

Good alternative if a partner or integration specifically prefers Polygon.

### Option D — Non-EVM experiment
**Solana + wallet adapter + SPL tokens**

Use only if there is a clear reason to prioritize Solana. Do not mix EVM and Solana into the first prototype.

## 23. Smart contract scope
Do not create a large protocol.

Prototype only:
- Merchant subscription receipt contract OR payment reference contract
- Optional rewards/pass contract later

Contract requirements:
- Ownable/admin controls
- Pausable emergency mechanism
- Events for important state changes
- No PII
- Auditable source
- Testnet first
- Unit tests

## 24. Data architecture
```text
Customer
   ↓
QR / Restaurant URL
   ↓
React Customer App
   ↓
API
   ↓
Tenant Auth + Authorization
   ↓
PostgreSQL
   ├── Organizations
   ├── Menus
   ├── Tables
   ├── Orders
   ├── Staff
   ├── Inventory
   ├── Reservations
   └── Audit Logs

Optional payment path
API → Razorpay/Stripe

Optional Web3 path
API → wallet/payment provider → Base/USDC
```

## 25. Required prototype screens
### Public
1. Landing page
2. Product demo
3. Pricing
4. Login/signup

### SaaS
5. Onboarding
6. Branding editor
7. Dashboard
8. Menu manager
9. Table manager
10. Orders
11. Kitchen
12. Staff
13. Inventory
14. Reservations
15. Analytics
16. Loyalty
17. Billing
18. Settings

### Customer
19. Restaurant menu
20. Item detail
21. Cart
22. Order tracking
23. Bill/payment

### Admin
24. Super Admin
25. Tenant details
26. Plan management
27. Audit logs

## 26. Prototype acceptance checklist
- [ ] New tenant creation works
- [ ] Plan selection works
- [ ] Plan limits are enforced
- [ ] Theme changes appear instantly
- [ ] QR code opens the correct tenant/table
- [ ] Customer can place order
- [ ] Kitchen receives order
- [ ] Staff can update order/table state
- [ ] Bill can be completed in demo mode
- [ ] Owner analytics update
- [ ] Tenant switching does not leak data
- [ ] Subscription state affects entitlements
- [ ] Audit log records sensitive actions
- [ ] Web3 test flow can be demonstrated without real money

## 27. Visual prototype priority
If time is limited, polish these five screens first:
1. **Restaurant onboarding + live brand preview**
2. **Owner dashboard**
3. **Customer QR menu**
4. **Kitchen display**
5. **Pricing/billing**

These five screens communicate the product, revenue model, and operational value most effectively.
