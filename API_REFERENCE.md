# Property237 - Complete API Reference

## 🔌 ALL BACKEND ENDPOINTS

### Authentication
```
POST   /api/auth/signup/                    - User registration
POST   /api/auth/login/                     - User login (JWT)
POST   /api/auth/logout/                    - User logout
GET    /api/auth/profile/                   - Get user profile
PUT    /api/auth/profile/update/            - Update user profile
POST   /api/auth/otp/request/               - Request OTP
POST   /api/auth/otp/verify/                - Verify OTP
POST   /api/auth/token/refresh/             - Refresh JWT token
POST   /api/auth/password/reset/request/    - Request password reset
POST   /api/auth/password/reset/confirm/    - Confirm password reset
```

### Properties
```
GET    /api/properties/                     - List properties (with filters)
POST   /api/properties/                     - Create property (agent only)
GET    /api/properties/search/              - Advanced search
GET    /api/properties/types/               - List property types
GET    /api/properties/statuses/            - List property statuses
GET    /api/properties/<slug>/              - Property detail
PUT    /api/properties/<slug>/              - Update property (owner only)
PATCH  /api/properties/<slug>/              - Partial update (toggle availability)
DELETE /api/properties/<slug>/              - Soft delete property
POST   /api/properties/viewings/            - Schedule property viewing
GET    /api/properties/favorites/           - List user favorites ⭐ NEW
POST   /api/properties/<slug>/favorite/     - Add to favorites ⭐ NEW
DELETE /api/properties/<slug>/favorite/     - Remove from favorites ⭐ NEW
```

### Applications
```
GET    /api/applications/                   - List tenant applications ⭐ NEW
POST   /api/applications/                   - Submit application ⭐ NEW
GET    /api/applications/<id>/              - Application detail
POST   /api/applications/<id>/withdraw/     - Withdraw application ⭐ NEW
GET    /api/applications/<id>/contract/     - View contract ⭐ NEW
POST   /api/applications/<id>/sign-contract/ - Sign contract ⭐ NEW
```

### Tenants
```
GET    /api/tenants/tenants/                - List tenants
POST   /api/tenants/tenants/                - Create tenant profile
GET    /api/tenants/tenants/<id>/           - Tenant detail
PUT    /api/tenants/tenants/<id>/           - Update tenant
DELETE /api/tenants/tenants/<id>/           - Delete tenant
GET    /api/tenants/tenant-documents/       - List tenant documents
POST   /api/tenants/tenant-documents/       - Upload document
```

### Agents
```
POST   /api/agents/register/                - Agent registration
GET    /api/agents/profile/                 - Agent profile
PUT    /api/agents/profile/                 - Update profile
POST   /api/agents/onboard/                 - Agent onboarding
GET    /api/agents/profile/enhanced/        - Enhanced profile
GET    /api/agents/verification-status/     - Verification status
POST   /api/agents/documents/               - Upload documents
GET    /api/agents/                         - List agents
GET    /api/agents/<id>/                    - Agent detail
GET    /api/agents/<id>/enhanced/           - Enhanced agent detail
GET    /api/agents/<id>/reviews/            - Agent reviews
POST   /api/agents/<id>/reviews/            - Add review
GET    /api/agents/certifications/          - List certifications
POST   /api/agents/certifications/          - Add certification
GET    /api/agents/mobile-money/            - Mobile money accounts
POST   /api/agents/mobile-money/            - Add mobile money account
```

### Credits
```
GET    /api/credits/balance/                - Credit balance
GET    /api/credits/statistics/             - Credit statistics
GET    /api/credits/packages/               - Available packages
GET    /api/credits/pricing/                - Credit pricing
POST   /api/credits/purchase/               - Purchase credits
POST   /api/credits/use/                    - Use credits
GET    /api/credits/check-access/<id>/      - Check property access
GET    /api/credits/property-views/         - Property view history
GET    /api/credits/transactions/           - Transaction history
POST   /api/credits/payment/momo/initiate/  - Initiate Mobile Money payment
POST   /api/credits/payment/momo/verify/    - Verify Mobile Money payment
```

### Analytics ⭐ NEW
```
GET    /api/analytics/agent/dashboard/      - Agent dashboard stats
GET    /api/analytics/tenant/dashboard/     - Tenant dashboard stats
GET    /api/analytics/property/<id>/        - Property-specific stats
```

### Locations
```
GET    /api/locations/countries/            - List countries
GET    /api/locations/regions/              - List regions
GET    /api/locations/cities/               - List cities
GET    /api/locations/areas/                - List areas
GET    /api/locations/tree/                 - Location tree hierarchy
GET    /api/locations/popular/              - Popular locations
```

### Media
```
POST   /api/media/upload/                   - Upload media file
GET    /api/media/property/<id>/            - List property media
DELETE /api/media/<id>/delete/              - Delete media file
```

### Users
```
POST   /api/users/register/                 - User registration
POST   /api/users/login/                    - User login
POST   /api/users/logout/                   - User logout
GET    /api/users/profile/                  - User profile
PUT    /api/users/profile/                  - Update profile
GET    /api/users/preferences/              - User preferences
PUT    /api/users/preferences/              - Update preferences
```

---

## 🔍 Query Parameters for Property Search

### GET /api/properties/ and /api/properties/search/

#### Text Search:
```
?search=<query>                 - Search in title, description, area, city
```

#### Property Characteristics:
```
?property_type=<id>             - Filter by property type
?listing_type=rent|sale|guest_house
?status=<id>                    - Filter by status
```

#### Price Filters:
```
?price_min=<amount>             - Minimum price
?price_max=<amount>             - Maximum price
?price=<exact>                  - Exact price
```

#### Location Filters:
```
?city=<name>                    - Filter by city name
?region=<name>                  - Filter by region name
?area=<name>                    - Filter by area name
```

#### Room Filters:
```
?bedrooms_min=<num>             - Minimum bedrooms
?bedrooms_max=<num>             - Maximum bedrooms
?bathrooms_min=<num>            - Minimum bathrooms
?no_of_bedrooms=<exact>         - Exact bedrooms
?no_of_bathrooms=<exact>        - Exact bathrooms
```

#### Size Filters:
```
?land_size_min=<sqm>            - Minimum land size
?land_size_max=<sqm>            - Maximum land size
?land_size_sqm=<exact>          - Exact land size
```

#### Amenities:
```
?has_parking=true|false
?has_pool=true|false
?has_gym=true|false
?has_security=true|false
?has_elevator=true|false
?has_generator=true|false
?has_hot_water=true|false
?has_ac_preinstalled=true|false
```

#### Utilities:
```
?water_type=camwater|forage
?electricity_type=private_meter|shared_meter
?vehicle_access=tarred|untarred|foot_only
```

#### Special Filters:
```
?featured=true|false            - Featured properties
?is_active=true|false           - Active/inactive
?road_is_tarred=true|false      - Tarred road
?has_land_title=true|false      - Has land title
```

#### Agent & Date:
```
?agent=<username>               - Filter by agent username
?created_after=<date>           - Created after date (YYYY-MM-DD)
?created_before=<date>          - Created before date (YYYY-MM-DD)
```

#### Ordering:
```
?ordering=price                 - Order by price (ascending)
?ordering=-price                - Order by price (descending)
?ordering=created_at            - Order by creation date
?ordering=-created_at           - Order by creation date (newest first)
?ordering=views_count           - Order by views
```

---

## 📝 Request Examples

### 1. Search Properties
```bash
GET /api/properties/?search=douala&property_type=1&price_min=50000&price_max=200000
```

### 2. Create Property
```bash
POST /api/properties/
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Beautiful Apartment",
  "description": "...",
  "property_type": 1,
  "listing_type": "rent",
  "price": 150000,
  "area": 5,
  ... (50+ fields)
}
```

### 3. Add to Favorites
```bash
POST /api/properties/beautiful-apartment-douala/favorite/
Authorization: Bearer <token>
```

### 4. Submit Application
```bash
POST /api/applications/
Authorization: Bearer <token>

{
  "property_id": 123,
  "desired_move_in_date": "2025-11-01",
  "lease_duration_months": 12,
  "offered_rent": 150000,
  "cover_letter": "..."
}
```

### 5. Get Analytics
```bash
GET /api/analytics/agent/dashboard/
Authorization: Bearer <token>
```

---

## 🔐 Authentication

All authenticated endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

Get token from:
```bash
POST /api/auth/login/
{
  "username": "testagent2025",
  "password": "AgentPass123!"
}

Response:
{
  "access": "eyJ0eXAi...",
  "refresh": "eyJ0eXAi...",
  "user": {
    "id": 1,
    "username": "testagent2025",
    "email": "agent@property237.com",
    "user_type": "agent"
  }
}
```

---

## ✅ API Testing Status

All endpoints have been tested and are working:
- ✅ Authentication flows
- ✅ Property CRUD operations
- ✅ Advanced search with all filters
- ✅ Favorites system
- ✅ Applications workflow
- ✅ Analytics dashboards
- ✅ File uploads (images, documents)
- ✅ Credits management
- ✅ Agent & tenant profiles

---

**Property237 API v1 - Complete & Production Ready! 🚀**
