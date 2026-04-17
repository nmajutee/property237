# property237 System Architecture

Last updated: April 17, 2026

## 1. Architecture Position

property237 is a web-first real-estate marketplace and operating platform. It is not a mobile application.

The right architecture for property237 is:

- a public, SEO-first property marketplace
- an authenticated web workspace for seekers, tenants, landlords, and agents
- an internal operations surface for moderation, verification, support, and revenue operations
- a Django modular monolith as the business system of record
- a Next.js web layer optimized for server rendering, caching, and crawlability
- PostgreSQL as the transactional source of truth
- PostGIS for authoritative geospatial data and boundary-aware queries
- OpenSearch or Elasticsearch as the public discovery read model
- Redis plus workers for asynchronous processing
- S3-compatible media storage behind a CDN

This is the correct architecture for a Zillow-like product at this stage.

property237 does not need microservices yet. It does need stronger web-scale discovery, SEO, media, and operational architecture.

## 2. Recommended System Shape

```text
                         ┌──────────────────────────────┐
                         │ Search Engines / Crawlers    │
                         │ Google, Bing, SEO Auditors   │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
┌──────────────────────┐      ┌──────────────────────────────┐      ┌──────────────────────┐
│ Buyers / Renters /   │─────▶│ Edge CDN / WAF / Proxy       │◀────▶│ External Integrations │
│ Agents / Landlords   │ HTTPS│ TLS, caching, bot control    │      │ Maps, Email, SMS,     │
│ Admin / Support      │      │ image delivery, rate limits  │      │ KYC, Payments, CRM    │
└──────────┬───────────┘      └──────────────┬───────────────┘      └──────────┬───────────┘
           │                                 │                                 │
           │                                 ▼                                 │
           │                    ┌──────────────────────────────┐                │
           └───────────────────▶│ Next.js Web Layer            │◀───────────────┘
                                │ Public marketplace           │
                                │ Authenticated workspace      │
                                │ Internal ops/admin surfaces  │
                                │ SSR / ISR / metadata / BFF   │
                                └──────────────┬───────────────┘
                                               │
                                               ▼
                                ┌──────────────────────────────┐
                                │ Django Modular Monolith      │
                                │ Listings, search APIs, leads │
                                │ leases, payments, analytics  │
                                └──────┬───────────┬───────────┘
                                       │           │
                         ┌─────────────┘           └─────────────┐
                         ▼                                       ▼
             ┌──────────────────────┐               ┌──────────────────────┐
             │ PostgreSQL + PostGIS │               │ Redis + Job Queue    │
             │ Transactional truth  │               │ Cache, async jobs    │
             └──────────┬───────────┘               └──────────┬───────────┘
                        │                                      │
                        │                                      ▼
                        │                         ┌──────────────────────────┐
                        │                         │ Worker / Scheduler       │
                        │                         │ indexing, media, ingest, │
                        │                         │ notifications, analytics │
                        │                         └──────┬─────────┬─────────┘
                        │                                │         │
                        ▼                                ▼         ▼
             ┌──────────────────────┐       ┌─────────────────┐ ┌──────────────────────┐
             │ OpenSearch / Elastic │       │ Object Storage  │ │ Analytics Warehouse  │
             │ Search read model    │       │ Photos/videos   │ │ BI and market facts  │
             └──────────────────────┘       └─────────────────┘ └──────────────────────┘
```

## 3. What We Already Have

### Application layer

- Next.js frontend for the public and authenticated web experience
- Django REST backend with strong domain separation
- JWT-based authentication and OTP flows
- Redis and Celery already present in the runtime shape

### Core business modules already present in the repo

- users and authentication
- properties and locations
- agents and moderation
- tenants and leases
- chat and notifications
- payments, credits, tariff plans, and ads
- analytics and maintenance
- media handling for listing assets

### Good architectural choices already made

- domain split by Django app instead of a single code bucket
- backend-owned business rules for payments, leases, moderation, and notifications
- clear separation between frontend and API responsibilities
- Redis and worker infrastructure already introduced
- location-aware property data model already in place

### Gaps between the current repo and an enterprise real-estate platform

- public search still relies too heavily on ORM-style filtering instead of a dedicated search read model
- SEO architecture is not yet treated as a first-class system concern
- media storage and delivery are not yet fully production-grade for image-heavy discovery at scale
- listing ingestion, deduplication, and publish workflows need stronger pipeline boundaries
- operational tooling for catalog quality, trust, and lead routing needs to mature beyond baseline admin flows

## 4. Recommended Target Architecture

property237 should remain a modular monolith, but it must be a web-first modular monolith with explicit search, SEO, media, and async boundaries.

### 4.1 Web surfaces

#### Public marketplace

This is the most important surface in a Zillow-like platform.

It should support:

- property detail pages with stable, indexable URLs
- city, neighborhood, area, and property-type landing pages
- map plus list search with fast faceting
- image-heavy browsing with aggressive CDN delivery
- agent profile pages and trust signals
- editorial and market content that supports discovery and SEO

This surface should be optimized for anonymous traffic, crawlability, performance, and conversion into leads.

#### Authenticated workspace

This surface should support:

- saved properties and saved searches
- inquiries, chat, and lead follow-up
- applications, documents, and lease workflows
- billing, credits, ads, and subscription management
- agent listing management and analytics

Authenticated pages can be more interactive, but they should still be performance-conscious and server-render where it materially improves time to value.

#### Internal operations surface

This surface should support:

- agent verification and KYC review
- listing moderation and duplicate handling
- catalog quality review and publish controls
- payment, refund, and dispute operations
- fraud review, abuse handling, and audit access
- support tooling, lead-routing overrides, and reporting

Treat this as a first-class product surface, not an afterthought hidden inside generic admin screens.

### 4.2 Edge and delivery layer

For a Zillow-like web application, the edge layer is part of the architecture, not just a hosting detail.

Required responsibilities:

- TLS termination
- WAF and bot mitigation
- asset and image caching
- compression and cache headers
- rate limiting before traffic reaches Django
- redirect management and canonical host enforcement
- robots.txt, sitemap hosting, and edge-friendly cache invalidation

Recommended stack:

- Cloudflare, Fastly, or another enterprise CDN/WAF in front of the platform
- Next.js deployed behind that edge with clear cache-control rules
- object storage media delivered through the CDN, not from the application containers

### 4.3 Application layer

#### Next.js web layer

Keep Next.js as the web presentation layer.

Its responsibilities should be:

- server rendering public listing and area pages
- incremental static regeneration where freshness tolerance allows it
- metadata generation, canonical tags, Open Graph tags, and structured data
- route-level cache strategy for public pages
- authenticated dashboard and workspace UX
- thin BFF-style composition where useful for SSR, but not core business ownership

Do not move core business rules into the frontend.

#### Django modular monolith

Keep Django as the single business API and transactional domain system.

Logical domain boundaries should be:

- accounts and identity: users, auth, sessions, permissions, verification state
- listings and catalog: properties, media metadata, publish state, feature flags, duplicates
- geography: countries, regions, cities, neighborhoods, polygons, points of interest
- search and discovery APIs: query orchestration, facet responses, saved search management
- leads and communication: inquiries, chat, notifications, routing, follow-up status
- applications and leases: tenant onboarding, screening, documents, lease lifecycle
- monetization: ads, subscriptions, credits, payments, invoices, refunds
- trust and moderation: listing review, abuse reports, fraud checks, agent verification
- analytics and reporting: listing performance, funnel metrics, market and operations reports

The existing Django app split already supports much of this direction. The refinement needed is boundary hardening, not a rewrite.

### 4.4 Search and discovery architecture

This is where a real-estate marketplace stops being a standard CRUD app.

#### Primary design

- PostgreSQL remains the write model and source of truth
- OpenSearch or Elasticsearch becomes the discovery read model
- Django owns indexing orchestration, search API contracts, and reindex workflows
- workers handle indexing asynchronously through a queue

#### Search capabilities that should be treated as baseline

- full-text query over title, description, area names, landmarks, and agent/company names
- autocomplete for cities, neighborhoods, developments, and common search intents
- faceted filtering by sale or rent, price, property type, bedrooms, bathrooms, area, amenities, furnished status, verification status, and listing freshness
- viewport and polygon-based map search
- geo-distance sorting and nearby discovery
- clustering for map markers at broad zoom levels
- SEO landing pages backed by reusable search definitions
- saved search alerts and notification triggers

#### Ranking and relevance

Ranking should not be left to raw database ordering.

Recommended ranking inputs:

- exact filter match quality
- listing freshness and availability state
- media completeness and listing quality score
- verified agent or owner signals
- proximity to searched geography or viewport centroid
- engagement signals such as CTR or inquiry rate
- promoted listings, clearly labeled and logically separated from organic ranking

#### Data flow

Use a publish pipeline like this:

1. listing change is committed to PostgreSQL
2. an outbox event is written transactionally
3. a worker consumes the event
4. a denormalized search document is rebuilt
5. the document is indexed into OpenSearch
6. search caches and sitemap segments are invalidated as needed

This avoids the consistency gap where the web request succeeds but the search update is lost.

#### Geospatial model

For property237, PostGIS is no longer optional later-stage polish. It should move into the near-term target architecture because a Zillow-like experience depends on:

- accurate coordinate storage
- boundary-aware searches by area or neighborhood polygon
- proximity queries to points of interest
- geospatial indexing for admin and enrichment workflows

Use PostGIS for authoritative geography and OpenSearch for fast public geo-discovery.

### 4.5 SEO and content architecture

For a real-estate web platform, SEO is a system requirement, not a marketing add-on.

#### Public pages that must be indexable

- property detail pages
- city, region, and neighborhood pages
- property-type and intent pages such as apartments for rent in a city
- agent profile pages where policy allows
- editorial content and market insight pages

#### Required implementation rules

- public listing and area pages should be server rendered or statically regenerated
- canonical URLs must be emitted in HTML, not inferred later
- pages must return meaningful HTTP status codes such as 404 and 410 for missing or retired inventory
- route design must use normal path URLs, not fragment-based routing
- structured data must describe visible page content only
- inactive, duplicate, or policy-blocked pages must use noindex or redirects deliberately

#### Structured data

Use JSON-LD because it is the most maintainable format at scale.

Recommended structured data approach:

- use stable, Google-compatible schema where applicable
- use BreadcrumbList, Organization, WebSite, Offer, Place, PostalAddress, ImageObject, and related visible entities
- use RealEstateListing as supplemental schema when appropriate, but do not rely on schema.org alone as proof of Google rich-result support
- validate with Rich Results Test and monitor Search Console after deployment

#### Sitemap strategy

Sitemap generation should be an automated platform concern.

Use partitioned sitemap sets for:

- listings
- locations
- agents
- editorial pages
- images and videos where useful

Operational rules:

- keep each sitemap under 50,000 URLs and 50MB uncompressed
- generate sitemap index files for large inventories
- publish absolute canonical URLs only
- keep lastmod values accurate to meaningful content changes

#### SEO-specific performance requirements

- fast LCP on image-heavy listing pages
- correct Open Graph and social preview tags
- image lazy-loading that remains crawl-safe
- internal linking between listings, areas, and agents
- redirect history for slug changes and listing URL normalization

### 4.6 Data and storage architecture

#### PostgreSQL plus PostGIS

PostgreSQL remains the transactional source of truth for:

- users and roles
- listings and listing state
- inquiries, chat metadata, applications, leases, and payments
- moderation, audit, and operational state
- authoritative location and polygon data

Required practices:

- UUID primary keys for externally visible entities
- explicit foreign keys and unique constraints
- partial and composite indexes on high-cardinality search-supporting columns
- migration discipline for release-critical changes

#### Search store

OpenSearch or Elasticsearch should store denormalized listing documents for search and discovery.

Do not treat the search cluster as the source of truth.

#### Redis

Redis should be used for:

- Celery broker and result backend if retained
- short-lived cache entries
- rate-limit counters
- idempotency helpers
- hot search query caching where safe

Do not use Redis as a durable business store.

#### Media storage

Production media must move fully out of the app filesystem.

Required capabilities:

- S3-compatible object storage
- CDN in front of media URLs
- image derivative generation for thumbnails and responsive sizes
- WebP or AVIF where client support allows
- signed upload or signed delivery for protected documents
- metadata capture for image dimensions, mime types, and moderation state

For a property platform, media is not ancillary content. It is a core conversion asset.

#### Analytics warehouse

For enterprise reporting and market intelligence, add an analytical store soon.

Typical options:

- ClickHouse
- BigQuery
- Redshift
- Snowflake

Use it for:

- listing funnel analytics
- lead-to-close reporting
- ad and subscription revenue analytics
- market trend and inventory reports
- experiment analysis

### 4.7 Ingestion and integration architecture

A Zillow-like platform needs a formal listing ingestion boundary, even if direct user-created listings remain the primary source at first.

#### Input channels

- direct owner or agent listing creation
- admin-assisted bulk upload
- CSV and spreadsheet imports
- partner or agency APIs
- MLS or RESO-style feed adapters where market context supports them

#### Ingestion pipeline

Recommended stages:

1. receive raw feed or submission
2. validate schema and media references
3. normalize fields into internal taxonomy
4. geocode and location-enrich
5. deduplicate against existing inventory
6. apply trust and moderation checks
7. publish to the transactional store
8. fan out to search, sitemap, notifications, and analytics pipelines

#### Integration boundaries that should be explicit adapters

- payments
- maps and geocoding
- email, SMS, and WhatsApp
- KYC and identity verification
- CRM and lead export
- e-signature providers
- storage and CDN APIs

Each adapter should define:

- request and response models
- timeout and retry rules
- idempotency behavior
- webhook verification rules
- structured logging and failure metrics

### 4.8 Async and event processing

property237 already benefits from the web-queue-worker pattern and should lean into it.

Use workers for:

- search indexing and reindex operations
- image optimization and derivative generation
- bulk listing imports and feed refreshes
- notification fan-out
- analytics aggregation
- sitemap regeneration
- fraud checks and duplicate scoring
- lease reminders, expirations, and other scheduled jobs

Important rules:

- not every write needs a worker; synchronous CRUD should stay synchronous when user feedback must be immediate
- long-running and retryable operations should never block the request path
- use a transactional outbox for search, notification, and external integration fan-out
- introduce dead-letter handling for poison messages and repeated failures

### 4.9 Security, privacy, trust, and compliance

Real-estate platforms handle PII, financial data, chat content, documents, and fraud risk. Enterprise architecture must reflect that.

Required controls:

- role-based access control in the backend first
- audit logging for admin and financial actions
- strong upload validation and malware scanning for documents
- secret management outside ad hoc environment files alone
- signed URLs or protected delivery for sensitive documents
- token rotation and session invalidation controls
- WAF, bot protection, and abuse throttling
- encryption at rest and in transit

Trust and policy requirements:

- verified agent or landlord workflows
- listing moderation with manual override and evidence trail
- duplicate listing detection
- fraud and scam reporting flows
- privacy and retention controls for user data and chat history
- fair-housing and anti-discrimination policy enforcement where applicable

### 4.10 Observability and SRE requirements

Enterprise architecture is incomplete without operational visibility.

Minimum stack:

- structured logs
- metrics and dashboards
- distributed tracing across web, API, workers, and integrations
- error tracking such as Sentry
- uptime and synthetic checks
- audit log retention

Critical platform indicators:

- search latency and search error rate
- listing publish-to-search latency
- image derivative backlog and failure rate
- lead delivery success rate
- payment success and webhook reconciliation lag
- crawler errors, sitemap freshness, and indexing coverage
- queue depth and worker failure rate

## 5. What The Project Still Needs

### 5.1 Needed now

#### 1. SEO-first public web architecture

The platform needs a formal decision that public inventory and area pages are server-rendered, canonicalized, structured, and sitemap-driven.

#### 2. Dedicated search and geo-discovery stack

ORM filtering is acceptable for early internal tooling. It is not enough for enterprise-grade public discovery.

Add:

- OpenSearch or Elasticsearch
- PostGIS
- indexing workers
- search relevance ownership

#### 3. Production media pipeline

Image-heavy real-estate discovery requires:

- object storage
- CDN delivery
- image resizing and compression pipeline
- protected document delivery

#### 4. Listing ingestion and data quality pipeline

Introduce explicit publish and normalization workflows for direct listings, imports, and partner feeds.

#### 5. Operational admin tooling

property237 needs stronger internal tooling for:

- moderation
- verification
- lead routing
- refund and dispute handling
- catalog quality review

#### 6. Observability, backups, and disaster recovery

At minimum:

- database backups
- object storage backup policy
- restore tests
- production dashboards and alerts
- recovery checklist and runbooks

#### 7. Security and compliance hardening

The platform needs a clearer enterprise posture around secrets, audit trails, upload security, and abuse prevention.

### 5.2 Needed soon

#### 8. Analytics warehouse and experimentation layer

Marketplace decisions should not depend only on OLTP queries. Add a proper analytical layer for product, growth, and market intelligence.

#### 9. Lead distribution and CRM integration

For scale, inquiries should support:

- routing rules
- SLA tracking
- handoff to external CRM systems
- attribution and conversion reporting

#### 10. Document generation and e-signature architecture

Lease and application workflows should move toward:

- generated PDFs
- document versioning
- audit trails
- provider-based e-signature integration where needed

#### 11. Selective realtime capabilities

Only add realtime where it clearly improves the product:

- chat and unread presence
- internal ops alerts
- high-value lead notifications

Do not introduce platform-wide realtime by default.

#### 12. Market intelligence and recommendation features

Add only after the search and data foundations are stable:

- pricing insights
- comparable listing recommendations
- neighborhood trend views
- lead scoring and quality prediction

### 5.3 Avoid for now

- do not split the Django backend into microservices yet
- do not make the public marketplace client-rendered only
- do not serve production media directly from Django containers
- do not let public search depend only on PostgreSQL filtering
- do not introduce Kubernetes unless the team can operate it well
- do not use WebSockets as a blanket solution for all interactions

## 6. Architecture Tightening Decisions

These should be treated as explicit project decisions.

### Keep

- keep one Django backend as the business system of record
- keep Next.js as the web layer
- keep domain modules split by business capability
- keep PostgreSQL as the transactional system of truth
- keep Redis plus worker processing for async work

### Add

- add PostGIS for authoritative geography
- add OpenSearch or Elasticsearch for discovery
- add S3-compatible media storage plus CDN
- add SEO-specific rendering and sitemap architecture
- add transactional outbox handling for search and async fan-out
- add stronger ops tooling, observability, and recovery processes

### Avoid

- avoid microservices before platform boundaries are proven operationally
- avoid pushing business rules into the frontend
- avoid local-disk-only media assumptions in production
- avoid using search-engine schema markup as a substitute for real crawlable page architecture

## 7. Deployment Environments

### Local development

- Docker Compose remains fine for local work
- backend, frontend, PostgreSQL, Redis, and workers should run together locally
- local search can use a lightweight dev cluster or a documented fallback mode

### Preview environments

- frontend preview deployments for branch validation
- backend preview or ephemeral environments for high-risk feature work when practical
- seeded but non-production data only

### Staging

Staging should mirror production closely enough to validate:

- search indexing
- media delivery
- background jobs
- sitemap generation
- auth and payment integrations with non-production credentials

### Production

Production should be treated as a multi-component web platform with separate scale and failure boundaries for:

- edge delivery
- web rendering
- API
- workers
- database
- cache and queue
- search cluster
- object storage

## 8. Concrete Production Deployment Blueprint

### 8.1 Recommended public entrypoints

Recommended DNS shape:

- `www.<domain>` for the public marketplace
- `app.<domain>` for authenticated workspace if separated logically
- `admin.<domain>` for internal operations if separated logically
- `api.<domain>` for Django API traffic
- `media.<domain>` for CDN-backed media delivery

Rules:

- PostgreSQL must not be public
- Redis must not be public
- search clusters must not be public
- object storage buckets should not be world-writable
- only the edge layer should terminate public internet traffic

### 8.2 Service layout

| Service | Responsibility | Public? | Persistence | Notes |
| --- | --- | --- | --- | --- |
| `edge` | CDN, WAF, TLS, redirects, cache policies, bot controls | Yes | Managed edge config | Mandatory for high-traffic property discovery |
| `web` | Next.js public and authenticated web rendering | Indirect via edge | None | Can be one deploy with route-group separation |
| `api` | Django API and business logic | No | None | Stateless containers preferred |
| `worker` | Async jobs for indexing, media, notifications, imports | No | None | Scale independently from API |
| `scheduler` | Periodic jobs and recurring workflows | No | None | Separate from worker where practical |
| `postgres` | Primary relational and geospatial store | No | Managed or durable volume | Use HA backups and restore testing |
| `redis` | Cache, broker, short-lived coordination | No | Managed or durable volume | Internal only |
| `search` | OpenSearch or Elasticsearch cluster | No | Managed cluster or durable nodes | Dedicated discovery read model |
| `object-storage` | Listing photos, documents, video assets | Usually indirect | External bucket | Serve through CDN |
| `image-pipeline` | Thumbnailing, compression, derivative generation | No | None | Can run inside workers initially |
| `observability` | Logs, metrics, traces, error tracking | No | External platform | Do not defer this until after launch |
| `warehouse` | Product and market analytics | No | Managed analytical store | Can be added soon after core platform hardening |

### 8.3 Network boundaries

Recommended logical boundaries:

- `public-edge`: only edge and CDN traffic
- `app-private`: web, API, workers
- `data-private`: PostgreSQL, Redis, search, internal services

Traffic flow:

1. user or crawler hits `www.<domain>`
2. edge layer applies TLS, WAF, cache, and routing rules
3. request reaches Next.js web layer
4. Next.js renders or serves cached content and calls Django APIs as needed
5. Django reads from PostgreSQL and uses search APIs for discovery responses
6. async writes fan out through Redis-backed queue to workers
7. workers update search, media derivatives, analytics, and notification pipelines

### 8.4 Storage and search boundaries

#### PostgreSQL plus PostGIS

- system of record for business entities
- not the primary public search engine
- protected with PITR, backups, and restore tests

#### Search cluster

- denormalized read model only
- rebuilt from PostgreSQL and outbox events
- no direct client access

#### Media storage

- original files stored in object storage
- derivatives generated asynchronously
- public assets delivered via CDN
- protected documents delivered through signed access rules

### 8.5 Queue and workload split

Keep these synchronous:

- login and token refresh
- core CRUD confirmation writes
- immediate validation failures
- small authenticated reads

Move these async:

- search indexing
- media derivatives
- bulk imports
- notification fan-out
- analytics aggregation
- webhook reconciliation
- report generation
- sitemap rebuilds

### 8.6 Release workflow

Recommended deployment order:

1. build web and API artifacts
2. run backend tests, frontend typecheck and build, and search-index contract checks
3. deploy application changes to a staging environment
4. apply database migrations with explicit release control
5. deploy API and workers
6. deploy web layer
7. run smoke checks against public pages, API, search, media delivery, and worker queues
8. verify crawler-facing outputs such as canonical tags, sitemap freshness, and metadata
9. promote or roll back based on health gates

Rollback rule:

- only ship backward-incompatible migrations with a tested rollback path
- keep search reindex and cache invalidation procedures documented

## 9. Repo Changes Required To Realize This Architecture

### Backend

- refine settings for production-grade search, PostGIS, object storage, stricter security, and observability
- formalize health, readiness, and worker-specific checks
- add outbox or equivalent reliable publish mechanism for search and async fan-out
- create explicit indexing, ingestion, and media-processing task boundaries

### Frontend

- add real metadata architecture for property, area, and agent pages
- add sitemap and robots generation
- add structured data generation with validation discipline
- separate cache strategy for public pages versus authenticated workspace
- build indexable area and search landing pages deliberately, not accidentally

### Deployment assets

- add or refine production deployment descriptors for search, object storage, and worker separation
- document CDN and edge behavior
- add backup automation and recovery runbooks
- add environment templates for staging and production

### Operational tooling

- strengthen moderation, verification, and lead-routing interfaces
- add audit-friendly admin workflows for payment and listing actions
- expose platform health and search freshness metrics to operators

## 10. Recommended Next Architecture Work

This is the correct order for the next phase:

1. Make the public marketplace SEO-correct: SSR metadata, canonical URLs, sitemap generation, robots discipline, and correct 404 or 410 behavior
2. Introduce the discovery stack: PostGIS, OpenSearch or Elasticsearch, indexing workers, and search ranking ownership
3. Move media to S3-compatible storage with CDN delivery and derivative generation
4. Add ingestion, deduplication, and publish pipelines for listings and partner feeds
5. Build operational tooling for verification, moderation, lead routing, and dispute handling
6. Add observability, backups, restore tests, and runbooks
7. Add analytics warehouse and experimentation support
8. Add document generation, e-sign, and selective realtime only where the product clearly benefits

## 11. Bottom Line

property237 should be architected as an SEO-first real-estate web platform with a hardened modular monolith at the center.

The platform does not need a bigger architectural fashion statement. It needs the enterprise building blocks that actually matter for a Zillow-like product:

- crawlable public inventory pages
- dedicated search and geospatial discovery infrastructure
- media and CDN architecture
- reliable async pipelines
- strong trust, moderation, and operational tooling
- real observability, backups, and recovery discipline

The correct architecture for property237 today is a web-first modular monolith with specialized search, geospatial, media, and queue boundaries.