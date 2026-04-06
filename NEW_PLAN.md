Property237 — Updated Delivery Plan
======================================
Last updated: April 5, 2026

This plan reflects the actual state of the codebase as audited today. It replaces the original plan with a gap-focused execution document. Work already complete is summarized; remaining phases target what is missing.

---

## Current State Summary

### What Is Already Built

**Backend (Django 5.1 + DRF) — 16 apps, 50+ models, fully structured:**

| Area | Status | Details |
|------|--------|---------|
| User Auth (JWT + OTP) | ✅ Done | Registration, login, token rotation/blacklist, OTP via Africa's Talking, KYC uploads |
| User Roles | ✅ Done | tenant / agent / admin with role-based permissions |
| Property CRUD | ✅ Done | 14+ property types, Cameroon-specific fields (land_type, caution_months, electricity, water) |
| Property Search & Filters | ✅ Done | DjangoFilter + SearchFilter + OrderingFilter, pagination (20/page) |
| Agent Profiles | ✅ Done | Experience, specialization, license, mobile money, ratings, certifications, service areas |
| Tenant Profiles | ✅ Done | Income, employment, rental history, documents, credit score, guarantor |
| Lease Management | ✅ Done | Agreements, digital signatures, auto-renewal, termination tracking |
| Payments & Transactions | ✅ Done | 3 gateways (MTN Mobile Money, Orange Money, Flutterwave) |
| Credit System | ✅ Done | Packages, balance, purchase/spend/earn tracking |
| Chat/Messaging | ✅ Done | Conversations, message types (text, image, doc, location, payment_proof), read/edit/delete |
| Notifications | ✅ Done | Multi-channel (email, SMS, push, in-app, WhatsApp), templates (EN/FR), priority levels |
| Analytics | ✅ Done | System metrics + property-level (views, inquiries, days on market, revenue) |
| Maintenance | ✅ Done | Categories, service providers with ratings, emergency flags |
| Ads & Promotions | ✅ Done | Packages, placements, budget/billing, approval workflow |
| Tariff Plans | ✅ Done | Free/Basic/Standard/Premium/Enterprise with feature limits |
| Locations | ✅ Done | Country → Region (10) → City (lat/long) → Area (quarters, local names) |
| Media | ✅ Done | 12 image types, video, documents, virtual tour file support |
| Admin/Moderation | ✅ Done | Django admin, verification flags, suspension system |

**Frontend (Next.js 15 + TypeScript + Tailwind) — Structure in place:**

| Area | Status | Details |
|------|--------|---------|
| App Router structure | ✅ Done | Routes for auth, properties, dashboard, profile, settings, analytics, credits, etc. |
| Auth UI | ✅ Done | Login, register, OTP, password reset, agent onboarding wizard, tenant profile form |
| Design system foundation | ✅ Done | Tailwind tokens, green color scheme (Emerald 600), dark mode, custom fonts |
| Component library | ✅ Done | auth/, properties/, navigation/, layouts/, primitives/, ui/ (shadcn), design-system/ |
| Map support | ✅ Done | Leaflet + react-leaflet installed and typed |
| i18n | ✅ Done | next-intl installed |

**Infrastructure:**

| Area | Status | Details |
|------|--------|---------|
| Docker (dev) | ✅ Done | PostgreSQL 15 + Django in docker-compose |
| Backend deploy | ✅ Done | Render (Gunicorn, 3 workers) |
| Frontend deploy | ✅ Done | Vercel with API rewrites to Render |
| Redis config | ✅ Done | Production cache + session backend |
| Rate limiting | ✅ Done | anonymous 100/hr, auth 1000/hr, premium 5000/hr |
| Static files | ✅ Done | WhiteNoise compression |

### What Is Missing or Incomplete

| Gap | Priority | Impact |
|-----|----------|--------|
| Frontend API service layer | P0 | Only api.ts + authService.ts exist — properties, leases, agents, chat, payments, credits, notifications not wired |
| Frontend page implementations | P0 | Routes exist but many pages are stubs or incomplete |
| Celery / async task queue | P1 | No background tasks — notifications, rent reminders, analytics aggregation all synchronous |
| Production email | P1 | EMAIL_BACKEND is console — no SMTP/SendGrid configured |
| WebSocket chat backend | P1 | socket.io-client installed but no Django Channels — chat is polling or unimplemented |
| PostGIS / geo-queries | P2 | Lat/long stored but no proximity search, area-based filtering, or spatial indexes |
| Elasticsearch | P2 | Search is ORM-only — no full-text, autocomplete, or relevance ranking |
| Push notification service | P2 | Model supports push type but no Firebase/APNs integration |
| PDF lease documents | P2 | Lease model has file field but no generation library |
| E-signature integration | P3 | Model tracks signed status but no signing service |
| Automated tenant credit scoring | P3 | Field exists, no scoring algorithm |
| Referral system logic | P3 | credit type exists, no referral flow |

---

## Execution Phases

### Phase 1: Frontend Service Layer & API Wiring
**Duration: 2 weeks | Priority: P0**

Complete the data layer connecting frontend to every backend API.

Tasks:
- [ ] Create propertyService.ts — CRUD, search, filters, favorites, status changes
- [ ] Create agentService.ts — profiles, certifications, verification status
- [ ] Create tenantService.ts — profiles, applications, documents
- [ ] Create leaseService.ts — agreements, signatures, templates
- [ ] Create paymentService.ts — transactions, payment methods
- [ ] Create creditService.ts — packages, balance, purchases
- [ ] Create chatService.ts — conversations, messages, read receipts
- [ ] Create notificationService.ts — list, mark read, preferences
- [ ] Create analyticsService.ts — metrics, property stats
- [ ] Create locationService.ts — regions, cities, areas (for dropdowns/filters)
- [ ] Create maintenanceService.ts — requests, service providers
- [ ] Create adService.ts — packages, campaigns
- [ ] Create tariffService.ts — plans, subscriptions
- [ ] Add proper error handling, token refresh, and request/response interceptors to api.ts
- [ ] Add React Query hooks for each service (queries + mutations)

Exit criteria: Every backend endpoint has a typed frontend function. React Query hooks exist for all major data flows.

---

### Phase 2: Frontend Page Completion
**Duration: 3–4 weeks | Priority: P0**

Build out every page with real data, not placeholder content.

**Property Discovery (Week 1):**
- [ ] Property search page — filters panel (price, location, type, bedrooms, amenities), list/grid toggle, pagination
- [ ] Map-based browse — Leaflet map with property markers, click-to-detail, map/list split view
- [ ] Property detail page — image gallery, specs, location map, agent contact, inquiry form, similar listings
- [ ] Saved properties / favorites page

**Listings Management (Week 1–2):**
- [ ] Add property form — multi-step with image upload, location picker, Cameroon-specific fields
- [ ] Edit property form — pre-populated, image management
- [ ] My properties page — status indicators, quick actions (publish, withdraw, edit, delete)

**Agent & Tenant Flows (Week 2–3):**
- [ ] Agent dashboard — listing stats, inquiry inbox, performance metrics, subscription status
- [ ] Agent public profile page — listings, reviews, verification badges, contact
- [ ] Tenant dashboard — applications, active leases, payment history, maintenance requests
- [ ] Lease detail page — terms display, signature status, document download

**Communication & Transactions (Week 3):**
- [ ] Chat interface — conversation list, message thread, send text/image/document, real-time updates
- [ ] Notifications center — list with filters, mark read, link to source
- [ ] Payment flow — select method, confirm, receipt
- [ ] Credit purchase flow — package selection, payment, balance display

**Admin & Moderation (Week 3–4):**
- [ ] Moderation dashboard — pending listings queue, agent verification queue, reported content
- [ ] Analytics dashboard — system metrics charts, property performance, user growth
- [ ] User management — search users, view profiles, suspend/activate

Exit criteria: All routes render functional pages with real API data. Core user journeys (search → view → inquire → lease → pay) work end-to-end.

---

### Phase 3: Background Tasks & Real-Time
**Duration: 1–2 weeks | Priority: P1**

Tasks:
- [ ] Add Celery + Redis to requirements and settings
- [ ] Create celery.py app config and __init__.py setup
- [ ] Move notification dispatch to async tasks (email, SMS, WhatsApp)
- [ ] Add periodic tasks: lease expiry reminders, rent due reminders, analytics aggregation
- [ ] Configure production email backend (SendGrid or AWS SES)
- [ ] Add Django Channels for WebSocket chat (or implement polling fallback with 5s interval)
- [ ] Update docker-compose with Celery worker + beat services
- [ ] Add Celery health check endpoint

Exit criteria: Notifications send asynchronously. Chat updates in near-real-time. Periodic reminders run on schedule.

---

### Phase 4: Search & Geospatial Upgrade
**Duration: 2 weeks | Priority: P2**

Tasks:
- [ ] Add PostGIS extension to PostgreSQL
- [ ] Add django.contrib.gis to installed apps
- [ ] Convert lat/long fields to PointField on City and Area models
- [ ] Add spatial index on property locations
- [ ] Implement proximity search endpoint (properties within X km of a point)
- [ ] Implement area-based search (properties within a polygon/boundary)
- [ ] Evaluate Elasticsearch — if listing count > 10k, add it; otherwise keep ORM search
- [ ] If adding Elasticsearch: set up index, sync pipeline, search endpoint, autocomplete
- [ ] Frontend: add "near me" button, radius filter, autocomplete on location inputs

Exit criteria: Users can search by proximity. Location search is fast and accurate.

---

### Phase 5: Trust, Verification & Moderation
**Duration: 2 weeks | Priority: P1**

Tasks:
- [ ] Build agent verification end-to-end flow: submit docs → admin review → approve/reject → badge
- [ ] Build listing approval workflow: submit → auto-check (duplicates, banned words) → manual review → publish
- [ ] Implement duplicate listing detection (title similarity + location + price range)
- [ ] Build user reporting flow: flag listing/agent → moderation queue → action (warn, remove, suspend)
- [ ] Add audit log for moderation actions (who did what, when)
- [ ] Display verification badges on agent profiles and property cards
- [ ] Add trust indicators on listings (verified agent, verified photos, etc.)

Exit criteria: Agents go through verification before being badged. Listings can be moderated. Users can report bad content.

---

### Phase 6: Analytics & Monetization
**Duration: 2 weeks | Priority: P2**

Tasks:
- [ ] Implement property view tracking (record view events, deduplicate by session/user)
- [ ] Implement inquiry tracking (count inquiries per listing per timeframe)
- [ ] Build analytics API aggregation endpoints (daily/weekly/monthly rollups)
- [ ] Frontend: agent dashboard charts (views, inquiries, conversion) using a charting library
- [ ] Implement promoted listing logic: payment → boost in search ranking for duration
- [ ] Implement subscription enforcement: check tariff limits on property creation, photo upload, etc.
- [ ] Build subscription management UI: current plan, upgrade, billing history
- [ ] Wire ad placement: homepage featured, search results promoted, sidebar ads

Exit criteria: Agents see meaningful analytics. Subscriptions limit/unlock features. Promoted listings appear in search.

---

### Phase 7: Hardening & Security
**Duration: 1–2 weeks | Priority: P1**

Tasks:
- [ ] Add database indexes on: property search fields, location lookups, user email/phone, transaction status
- [ ] Optimize N+1 queries with select_related/prefetch_related on list endpoints
- [ ] Review every API endpoint for proper permission checks (IsAuthenticated, IsOwner, IsAdmin)
- [ ] Validate all file uploads: type checking, size limits, malware scan consideration
- [ ] Add CSRF protection review, secure cookie settings, HSTS headers
- [ ] Rate limit sensitive endpoints (login, OTP, password reset) more aggressively
- [ ] Add request logging for audit trail
- [ ] Configure production error tracking (Sentry)
- [ ] Review CORS settings — remove wildcard/debug patterns
- [ ] Load test critical paths (search, property detail, auth)
- [ ] Verify backup and restore procedures
- [ ] Add health check endpoints for all services (db, redis, celery)

Exit criteria: No critical security vulnerabilities. P95 response times under 500ms for search. Backups verified.

---

### Phase 8: QA & Launch Prep
**Duration: 1–2 weeks | Priority: P0 (at this stage)**

Tasks:
- [ ] Test all core flows manually across Chrome, Firefox, Safari, mobile
- [ ] Test responsive design on phone, tablet, desktop breakpoints
- [ ] Write integration tests for critical API flows (auth, property CRUD, payment)
- [ ] Write E2E tests for critical user journeys (Playwright)
- [ ] Fix all critical and high-severity bugs
- [ ] Verify production environment variables, SSL, DNS
- [ ] Prepare rollback plan
- [ ] Staging smoke test with production-like data
- [ ] Performance baseline: document response times, page load times

Exit criteria: No critical bugs. All core journeys work on all devices. Staging is stable.

---

### Phase 9: Production Launch
**Duration: 1 week**

Tasks:
- [ ] Deploy backend to production (Render)
- [ ] Deploy frontend to production (Vercel)
- [ ] Verify SSL, DNS, environment variables, database connectivity
- [ ] Run production smoke tests
- [ ] Monitor logs, error rates, response times for 48 hours
- [ ] Enable alerting on error spikes and downtime

Exit criteria: Production is live and stable for 48+ hours.

---

### Phase 10: Post-Launch Iteration
**Duration: Ongoing**

Tasks:
- [ ] Gather user feedback (first 2 weeks)
- [ ] Fix issues reported by real users
- [ ] Add PDF lease document generation (WeasyPrint)
- [ ] Add push notifications (Firebase Cloud Messaging)
- [ ] Build referral system (invite link → credit bonus on signup)
- [ ] Implement tenant credit scoring algorithm
- [ ] Add e-signature integration if needed
- [ ] Evaluate and add virtual tour viewer
- [ ] i18n completion (English + French for all UI strings)
- [ ] Mobile app evaluation (React Native or PWA)

---

## Priority Summary

| Phase | What | Duration | Start After |
|-------|------|----------|-------------|
| 1 | Frontend API services | 2 weeks | Now |
| 2 | Frontend pages | 3–4 weeks | Phase 1 (overlap OK) |
| 3 | Background tasks & real-time | 1–2 weeks | Phase 1 |
| 4 | Search & geo upgrade | 2 weeks | Phase 2 |
| 5 | Trust & verification | 2 weeks | Phase 2 |
| 6 | Analytics & monetization | 2 weeks | Phase 5 |
| 7 | Hardening & security | 1–2 weeks | Phase 6 |
| 8 | QA & launch prep | 1–2 weeks | Phase 7 |
| 9 | Production launch | 1 week | Phase 8 |
| 10 | Post-launch | Ongoing | Phase 9 |

**Total estimated timeline: 12–16 weeks to production launch.**

Phases 1 + 3 can run in parallel. Phases 4 + 5 can run in parallel after Phase 2 starts.

---

## Success Metrics

- Search response time < 500ms (P95)
- Property detail page load < 2s
- Zero unhandled API errors in core flows
- All listings from verified agents display trust badges
- Mobile Lighthouse score > 80
- Chat message delivery < 3s
- 99.5% uptime in first month
- Zero critical security findings in audit

