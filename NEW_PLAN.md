# Property237 Enterprise Implementation Roadmap

Last updated: April 17, 2026

This plan replaces the earlier gap-focused delivery plan.

The old plan was useful for tracking unfinished pages and services, but it was still organized like a normal CRUD product. property237 is not just a dashboard app. It is a public real-estate marketplace, which means the implementation order must prioritize:

- crawlable public inventory pages
- canonical route discipline
- search and geospatial discovery
- media and CDN architecture
- listing ingestion and quality controls
- lead routing, trust, moderation, and operations tooling

The plan below is tied to the current repo and starts from what already exists today.

## 1. What Was Started In This Pass

These foundations are now in the codebase:

### Frontend SEO architecture

- root metadata was upgraded in [frontend/src/app/layout.tsx](/home/ngs/property237-1/frontend/src/app/layout.tsx)
- site URL and API URL helpers were added in [frontend/src/lib/site.ts](/home/ngs/property237-1/frontend/src/lib/site.ts)
- server-side property metadata and JSON-LD now exist in [frontend/src/app/properties/[id]/layout.tsx](/home/ngs/property237-1/frontend/src/app/properties/[id]/layout.tsx)
- property listing metadata was added in [frontend/src/app/properties/layout.tsx](/home/ngs/property237-1/frontend/src/app/properties/layout.tsx)
- robots and sitemap routes now exist in [frontend/src/app/robots.ts](/home/ngs/property237-1/frontend/src/app/robots.ts) and [frontend/src/app/sitemap.ts](/home/ngs/property237-1/frontend/src/app/sitemap.ts)
- reusable SEO helpers were added in [frontend/src/lib/seo.ts](/home/ngs/property237-1/frontend/src/lib/seo.ts)
- home page WebSite structured data was added in [frontend/src/app/page.tsx](/home/ngs/property237-1/frontend/src/app/page.tsx)
- public property links now prefer slug paths in [frontend/src/components/properties/PropertyCard.tsx](/home/ngs/property237-1/frontend/src/components/properties/PropertyCard.tsx) and related routes

### Backend search and crawl boundaries

- a search-sync queue model was added in [backend/properties/models.py](/home/ngs/property237-1/backend/properties/models.py)
- search document building was added in [backend/properties/search_documents.py](/home/ngs/property237-1/backend/properties/search_documents.py)
- queue orchestration and backend abstraction were added in [backend/properties/search_index.py](/home/ngs/property237-1/backend/properties/search_index.py)
- Celery processing was added in [backend/properties/tasks.py](/home/ngs/property237-1/backend/properties/tasks.py)
- property and image signals now enqueue search sync events through [backend/properties/signals.py](/home/ngs/property237-1/backend/properties/signals.py) and [backend/media/signals.py](/home/ngs/property237-1/backend/media/signals.py)
- a sitemap feed endpoint was added through [backend/properties/views.py](/home/ngs/property237-1/backend/properties/views.py) and [backend/properties/urls.py](/home/ngs/property237-1/backend/properties/urls.py)
- public property detail access is now restricted to active, non-draft listings unless the requesting user owns the listing or is staff

### Validation

- targeted tests were added in [backend/properties/tests/test_api.py](/home/ngs/property237-1/backend/properties/tests/test_api.py) and [backend/properties/tests/test_search_sync.py](/home/ngs/property237-1/backend/properties/tests/test_search_sync.py)

## 2. Strategic Delivery Order

The correct order is:

1. public web SEO and route correctness
2. discovery engine and search indexing boundaries
3. geospatial and area-based browsing
4. media and CDN hardening
5. trust, moderation, lead routing, and operator tooling
6. analytics, monetization, and market intelligence
7. infrastructure hardening and launch discipline

Do not invert this order. A Zillow-like product does not win by finishing every dashboard page before it can be discovered, indexed, searched, and trusted.

## 3. Phase Roadmap

## Phase 1: Public Web SEO Foundation
Status: in progress
Duration: 1 to 2 weeks

### Objective

Make the public marketplace crawlable, canonical, and structurally correct for search engines and social previews.

### Repo touchpoints

- [frontend/src/app/layout.tsx](/home/ngs/property237-1/frontend/src/app/layout.tsx)
- [frontend/src/app/page.tsx](/home/ngs/property237-1/frontend/src/app/page.tsx)
- [frontend/src/app/robots.ts](/home/ngs/property237-1/frontend/src/app/robots.ts)
- [frontend/src/app/sitemap.ts](/home/ngs/property237-1/frontend/src/app/sitemap.ts)
- [frontend/src/app/properties/layout.tsx](/home/ngs/property237-1/frontend/src/app/properties/layout.tsx)
- [frontend/src/app/properties/[id]/layout.tsx](/home/ngs/property237-1/frontend/src/app/properties/[id]/layout.tsx)
- [frontend/src/lib/site.ts](/home/ngs/property237-1/frontend/src/lib/site.ts)
- [frontend/src/lib/seo.ts](/home/ngs/property237-1/frontend/src/lib/seo.ts)
- [backend/properties/views.py](/home/ngs/property237-1/backend/properties/views.py)

### Done now

- root metadata and metadataBase
- robots route
- sitemap route
- property-detail metadata and JSON-LD
- home page WebSite structured data
- slug-first route linking on core listing surfaces
- backend sitemap feed
- public detail hiding for inactive and draft listings

### Remaining work

- add agent profile metadata and structured data to [frontend/src/app/agents/[id]/page.tsx](/home/ngs/property237-1/frontend/src/app/agents/[id]/page.tsx) via a route layout
- add area and city landing pages under indexable route groups
- add stronger Open Graph imagery strategy for listing pages
- return deliberate 410 responses for retired listings when policy calls for it
- split sitemap generation into listing, location, and agent partitions once inventory volume grows
- connect Search Console, sitemap submission, and crawl monitoring to release operations

### Exit criteria

- all public listing links resolve to canonical slug URLs
- property detail pages emit server-side metadata and structured data
- sitemap and robots endpoints are live and generated by application code
- inactive inventory is not publicly retrievable by slug

## Phase 2: Search Index Boundary And Discovery Engine
Status: started
Duration: 2 to 4 weeks

### Objective

Move public discovery away from database-only filtering toward a proper search read model.

### Repo touchpoints

- [backend/properties/search_documents.py](/home/ngs/property237-1/backend/properties/search_documents.py)
- [backend/properties/search_index.py](/home/ngs/property237-1/backend/properties/search_index.py)
- [backend/properties/tasks.py](/home/ngs/property237-1/backend/properties/tasks.py)
- [backend/properties/models.py](/home/ngs/property237-1/backend/properties/models.py)
- [backend/properties/views.py](/home/ngs/property237-1/backend/properties/views.py)
- [backend/config/settings.py](/home/ngs/property237-1/backend/config/settings.py)
- [frontend/src/app/properties/page.tsx](/home/ngs/property237-1/frontend/src/app/properties/page.tsx)
- [frontend/src/components/properties/FilterSidebar.tsx](/home/ngs/property237-1/frontend/src/components/properties/FilterSidebar.tsx)

### Done now

- property search document builder
- queue-backed sync model
- property and image signals to enqueue updates
- Celery task boundary for sync processing
- admin sync-status endpoint scaffold
- configuration knobs for future search backend integration

### Remaining work

- integrate a real backend: Elastic Cloud, OpenSearch, Algolia, or Typesense based on deployment choice
- add autocomplete and suggestion indices for city, neighborhood, and search-intent phrases
- add promoted listing ranking rules and explicit ad labeling in search responses
- move map clustering and filter faceting onto the search read model
- add backfill and reindex management commands
- expose operational metrics for publish-to-search latency and failed sync events

### Exit criteria

- new or updated listings reach the search read model asynchronously through the queue boundary
- autocomplete and faceted search are backed by the search engine instead of only ORM filters
- search ranking is owned explicitly and is testable

## Phase 3: Geospatial Upgrade And Area Pages
Status: not started
Duration: 2 to 3 weeks

### Objective

Upgrade location handling from flat coordinates to a real geospatial model that supports area pages, map browsing, and proximity search at scale.

### Repo touchpoints

- [backend/locations/models.py](/home/ngs/property237-1/backend/locations/models.py)
- [backend/locations/serializers.py](/home/ngs/property237-1/backend/locations/serializers.py)
- [backend/properties/views.py](/home/ngs/property237-1/backend/properties/views.py)
- [backend/properties/filters.py](/home/ngs/property237-1/backend/properties/filters.py)
- [frontend/src/components/properties/MapView.tsx](/home/ngs/property237-1/frontend/src/components/properties/MapView.tsx)
- [frontend/src/app/properties/page.tsx](/home/ngs/property237-1/frontend/src/app/properties/page.tsx)

### Work

- introduce PostGIS and geospatial indexes
- define authoritative property point logic instead of fallback-only latitude and longitude heuristics
- add neighborhood polygon storage where data exists
- add viewport search and bounding-box query contracts
- add area landing pages and location-specific sitemap segments
- add nearby transit, landmark, and school enrichment where relevant data is available

### Exit criteria

- map browsing uses spatial queries rather than Python-side distance loops for primary discovery paths
- location pages are indexable and can be generated from authoritative area data

## Phase 4: Media And CDN Hardening
Status: not started
Duration: 2 weeks

### Objective

Treat listing media as a conversion pipeline, not as generic uploaded files.

### Repo touchpoints

- [backend/media/models.py](/home/ngs/property237-1/backend/media/models.py)
- [backend/media/views.py](/home/ngs/property237-1/backend/media/views.py)
- [backend/config/settings.py](/home/ngs/property237-1/backend/config/settings.py)
- [frontend/next.config.js](/home/ngs/property237-1/frontend/next.config.js)

### Work

- move originals to S3-compatible object storage
- introduce CDN-backed derivative delivery
- generate thumbnails and responsive image sizes asynchronously
- add document protection and signed access where required
- formalize alt text, image order, and media completeness scoring

### Exit criteria

- listing cards and detail pages no longer depend on origin-served media from Django in production
- search documents and SEO pages reference stable media URLs

## Phase 5: Trust, Moderation, Lead Routing, And Ops Tooling
Status: not started
Duration: 2 to 3 weeks

### Objective

Make the marketplace trustworthy and operable.

### Repo touchpoints

- [backend/agents](/home/ngs/property237-1/backend/agents)
- [backend/moderation](/home/ngs/property237-1/backend/moderation)
- [backend/notifications](/home/ngs/property237-1/backend/notifications)
- [backend/chat](/home/ngs/property237-1/backend/chat)
- [frontend/src/app/moderation/page.tsx](/home/ngs/property237-1/frontend/src/app/moderation/page.tsx)
- [frontend/src/app/dashboard/admin/page.tsx](/home/ngs/property237-1/frontend/src/app/dashboard/admin/page.tsx)

### Work

- finish agent verification workflows and badges
- add duplicate listing detection and review tooling
- add lead routing rules and response SLA visibility
- add refund, dispute, and listing quality workflows
- strengthen audit visibility for staff actions

### Exit criteria

- the platform can reliably verify agents, suppress bad listings, and monitor response quality

## Phase 6: Analytics, Monetization, And Experimentation
Status: not started
Duration: 2 to 4 weeks

### Objective

Turn the platform into an instrumented marketplace rather than a set of transactional screens.

### Repo touchpoints

- [backend/analytics](/home/ngs/property237-1/backend/analytics)
- [backend/ad](/home/ngs/property237-1/backend/ad)
- [backend/tariffplans](/home/ngs/property237-1/backend/tariffplans)
- [backend/credits](/home/ngs/property237-1/backend/credits)
- [frontend/src/app/dashboard/agent/analytics/page.tsx](/home/ngs/property237-1/frontend/src/app/dashboard/agent/analytics/page.tsx)
- [frontend/src/app/pricing/page.tsx](/home/ngs/property237-1/frontend/src/app/pricing/page.tsx)

### Work

- implement promoted search ranking rules
- build listing funnel metrics from view to inquiry to lease
- add subscription enforcement tied to real limits
- add experimentation support for search ranking and conversion surfaces
- start warehouse-ready event export patterns

### Exit criteria

- monetization decisions and ranking adjustments are driven by tracked marketplace outcomes

## Phase 7: Production Hardening And Release Discipline
Status: not started
Duration: 2 weeks

### Objective

Make the system operationally safe for real production load.

### Repo touchpoints

- [render.yaml](/home/ngs/property237-1/render.yaml)
- [docker-compose.yml](/home/ngs/property237-1/docker-compose.yml)
- [backend/config/settings.py](/home/ngs/property237-1/backend/config/settings.py)
- [backend/config/urls.py](/home/ngs/property237-1/backend/config/urls.py)
- [frontend/vercel.json](/home/ngs/property237-1/frontend/vercel.json)

### Work

- add structured logging and alerting
- add queue, search, and sitemap health checks to smoke tests
- verify backups and restore drills
- lock CORS, CSRF, cookie, and host settings for final domains
- load test public search and property detail paths
- define rollback steps for search schema changes and migrations

### Exit criteria

- release process includes migration control, smoke checks, and rollback readiness
- critical marketplace paths are observable and alert-backed

## Phase 8: Launch And Post-Launch Iteration
Status: not started
Duration: ongoing

### Objective

Ship safely, measure early usage, and iterate on discovery, trust, and conversion.

### Work

- monitor search latency, error rate, queue depth, and page performance
- tune ranking and lead routing based on early user behavior
- add document generation and e-signature only after real leasing workflow pressure appears
- add push and realtime selectively where it improves conversion or operations

## 4. Recommended Working Sequence For The Team

Use this execution order:

1. finish the remaining Phase 1 SEO tasks
2. complete real search backend integration in Phase 2
3. move directly into Phase 3 and Phase 4 in parallel
4. run Phase 5 once search and media are stable enough for operator workflows
5. do not delay Phase 7 until the very end; start hardening while Phases 4 to 6 are in motion

## 5. Delivery Principles

- public discovery work has priority over low-traffic internal polish
- every new listing-facing feature must answer how it affects canonical URLs, sitemap coverage, structured data, and search freshness
- every async fan-out must move through a durable queue or outbox boundary
- no new public inventory surface should depend entirely on client-side rendering
- no production media strategy should depend on Django local disk

## 6. Success Metrics

- property detail pages serve correct metadata, canonical tags, and structured data
- sitemap freshness is measurable and monitored
- listing publish-to-search latency is under 5 minutes in steady state
- public search p95 stays under 500ms once the dedicated search backend is in place
- inactive or draft listings are not publicly crawlable
- media delivery moves to CDN-backed URLs with responsive derivatives
- operator workflows exist for verification, moderation, and lead routing