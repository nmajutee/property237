# Property237 Production Deployment Blueprint

Last updated: April 17, 2026

This document translates the target architecture into a concrete production deployment design with vendor recommendations and cost or complexity tradeoffs.

## 1. Decision Summary

For the next 12 months, the recommended deployment profile is:

- Cloudflare for DNS, WAF, CDN, bot controls, and cache policy
- Vercel for the Next.js web layer
- Render for the Django API and Celery workers in the short term
- managed PostgreSQL with PostGIS support for the system of record
- managed Redis for cache and queue
- Elastic Cloud or managed OpenSearch for search and autocomplete
- Cloudflare R2 or AWS S3 for media storage
- Postmark or Resend for email
- Africa's Talking for SMS and phone verification in Cameroon
- Sentry plus Better Stack or Datadog for observability

That is the best balance of:

- enterprise-grade controls
- low implementation friction against the current repo
- reasonable operational complexity for a small to mid-sized team

## 2. Deployment Profiles

## Option A: Lowest Change Managed Stack
Recommendation: use now

### Stack

- Edge: Cloudflare Pro
- Frontend: Vercel Pro
- Backend web and workers: Render
- PostgreSQL: Render PostgreSQL if PostGIS support satisfies needs, otherwise move to a managed Postgres provider with PostGIS
- Redis: Render Redis or Upstash
- Search: Elastic Cloud or Bonsai-backed Elasticsearch
- Media: Cloudflare R2
- Email: Postmark or Resend
- SMS: Africa's Talking
- Monitoring: Sentry and Better Stack

### Why this is the recommended near-term choice

- it preserves the current Vercel plus Render deployment shape
- it introduces enterprise controls where they matter most first
- it avoids a high-ops container orchestration move before search and discovery are mature
- it gives a clear path to dedicated search, media, and edge hardening without rewriting deployment from scratch

### Ballpark monthly cost

- low traffic: about $250 to $600
- moderate marketplace traffic: about $600 to $1,500

### Complexity

- low to medium

### Main tradeoff

- best time-to-value, but not the cleanest single-vendor enterprise platform

## Option B: AWS Enterprise Baseline
Recommendation: adopt later if scale, compliance, or platform control demands it

### Stack

- Edge: CloudFront plus AWS WAF plus Route 53
- Frontend: Next.js on Vercel or self-hosted on ECS depending control requirements
- Backend: ECS Fargate services for web, worker, and scheduler
- PostgreSQL: RDS PostgreSQL with PostGIS
- Redis: ElastiCache Redis
- Search: OpenSearch Service
- Media: S3 plus CloudFront
- Queue: SQS for non-Celery fan-out patterns where needed
- Observability: CloudWatch plus Datadog or New Relic

### Why it is not the first move

- significantly higher operational complexity
- more infrastructure decisions to own immediately
- slower product iteration unless the team already operates AWS deeply

### Ballpark monthly cost

- about $900 to $2,500 before serious search or traffic growth

### Complexity

- high

### Main tradeoff

- strongest control and enterprise posture, but a worse speed-to-delivery profile for the current stage

## Option C: Search-As-A-Service Shortcut
Recommendation: acceptable only if search speed matters more than search ownership

### Stack difference

- replace Elastic Cloud or OpenSearch with Algolia or Typesense Cloud

### Upside

- fastest autocomplete and ranking rollout
- lower search operations burden

### Downside

- pricing can become expensive as listing count, query volume, and facets grow
- less control over search document model and ranking internals than self-managed or managed Elastic-style systems

### Recommendation

- use only if the team needs search quality immediately and cannot staff Elastic-style search ownership yet

## 3. Recommended Service Mapping For This Repo

## Frontend

- source: [frontend](/home/ngs/property237-1/frontend)
- platform: Vercel
- runtime shape: one production web deployment plus preview deployments
- domain mapping:
  - `www.property237.com`
  - optional `app.property237.com` if authenticated workspace separation becomes useful later

### Required runtime variables

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`

## Backend API

- source: [backend](/home/ngs/property237-1/backend)
- platform: Render web service now
- domain mapping:
  - `api.property237.com`

### Required runtime variables

- `SECRET_KEY`
- `DATABASE_URL`
- `REDIS_URL`
- `PUBLIC_APP_URL`
- `PUBLIC_API_ORIGIN`
- `MEDIA_PUBLIC_BASE_URL`
- `PROPERTY_SEARCH_INDEX_BACKEND`
- `PROPERTY_SEARCH_INDEX_NAME`
- `PROPERTY_SEARCH_AUTO_DISPATCH`
- provider credentials for email, SMS, storage, and monitoring

## Workers

- platform: Render workers now
- processes:
  - Celery worker
  - Celery beat or scheduler

### Responsibilities

- property search sync processing
- media derivative generation
- notifications
- analytics aggregation
- imports and future reindex jobs

## Database

- required capability: PostgreSQL plus PostGIS
- recommendation now: stay managed and avoid self-hosted database operations

### Hard requirements

- daily automated backups
- point-in-time recovery if available
- tested restore procedure
- connection pooling strategy

## Search cluster

- recommendation now: Elastic Cloud or managed OpenSearch
- domain: internal only
- public access: never direct from browser

### Responsibilities

- listing search
- autocomplete
- faceting
- geo queries and ranking inputs

## Media storage

- recommendation now: Cloudflare R2 if cost and egress efficiency matter most
- alternative: AWS S3 if you expect a future AWS move and want the least migration later

### Required behavior

- originals stored in object storage
- delivery through Cloudflare CDN
- signed URLs for protected documents
- derivatives generated by workers

## 4. Recommended Public Topology

```text
Users / Crawlers
    |
    v
Cloudflare
- DNS
- WAF
- Bot controls
- CDN cache
- TLS
    |
    +--> Vercel (Next.js web)
    |
    +--> Render (Django API)
                |
                +--> Managed PostgreSQL + PostGIS
                +--> Managed Redis
                +--> Elastic Cloud / OpenSearch
                +--> Object storage (R2 or S3)
                +--> External email / SMS / monitoring providers
                +--> Render worker + scheduler
```

## 5. Environment Strategy

Use four environments:

- local
- preview
- staging
- production

### Rules

- preview is for UI and integration validation, not for load assumptions
- staging mirrors production search, media, and worker shape closely enough to validate publish-to-search and crawl behavior
- production domains are only fronted by Cloudflare

## 6. Network And Security Rules

- only Cloudflare should handle public internet traffic
- search, Redis, and PostgreSQL must remain private
- Django admin should not be public on a guessed path without access controls
- uploads should be validated and scanned before long-term acceptance where sensitive documents are involved
- all secrets must be managed through platform secret stores, not committed files

## 7. Cost And Complexity Tradeoff Table

| Area | Cheapest acceptable choice | Recommended choice now | Highest-control choice later | Tradeoff |
| --- | --- | --- | --- | --- |
| Edge | Vercel-only edge | Cloudflare Pro | Cloudflare Enterprise or AWS CloudFront + WAF | Cloudflare adds better bot control and cache policy ownership |
| Frontend | Vercel Hobby | Vercel Pro | Self-hosted on ECS | Vercel is simplest for Next.js SSR and preview workflows |
| Backend compute | Render Starter | Render Standard web + workers | ECS Fargate | Render is lower ops; ECS gives more control |
| Database | Render Postgres starter | Managed Postgres with PostGIS and real backups | RDS PostgreSQL | Enterprise requirement is PostGIS plus reliable restore capability |
| Search | ORM only | Elastic Cloud / managed OpenSearch | Self-managed cluster | ORM is not enough for marketplace discovery |
| Media | local disk | R2 or S3 + CDN | S3 + CloudFront + advanced pipeline | Object storage is mandatory for listing-heavy production |
| Monitoring | logs only | Sentry + Better Stack | Datadog / New Relic | Better Stack is simpler; Datadog is deeper and more expensive |

## 8. Immediate Repo Changes To Support This Blueprint

## Already started in this pass

- frontend metadata, robots, sitemap, and structured data foundation
- backend sitemap feed
- backend search sync queue and search document boundary
- public property visibility tightening

## Next deployment-facing changes

- add `NEXT_PUBLIC_SITE_URL` to frontend environments
- add `PUBLIC_APP_URL`, `PUBLIC_API_ORIGIN`, and `MEDIA_PUBLIC_BASE_URL` to backend environments
- decide the actual search provider and set `PROPERTY_SEARCH_INDEX_BACKEND`
- move media off local persistent disk to object storage
- place Cloudflare in front of Vercel and Render
- split production smoke tests into web, API, search, queue, and sitemap checks

## 9. Recommendation

Use Option A now.

That means:

- keep Vercel for the web layer
- keep Render for Django web and workers for now
- add Cloudflare in front of everything
- add a managed search service now instead of delaying it
- move media to R2 or S3 before serious traffic growth
- keep the AWS full-platform move as a later step, not a prerequisite for becoming enterprise-safe

That is the most defensible balance of delivery speed, technical quality, and operational risk for property237 today.