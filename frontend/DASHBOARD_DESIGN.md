# Property237 Dashboard Design System

## Overview

Modern, professional dashboard layouts inspired by leading real estate platforms. Each role (Agent, Tenant, Admin) has a customized experience tailored to their specific needs.

---

## 🎨 Design Principles

### Layout Structure
- **Fixed Sidebar Navigation** (264px width)
- **Main Content Area** with 32px padding
- **Responsive Grid System** (1, 2, 3, 4 columns)
- **Card-Based Components** with shadows and borders
- **Consistent Spacing** (6-8px gaps)

### Color Usage
- **Primary Blue (#2563EB)**: Main actions, highlights, active states
- **Gold (#F59E0B)**: Revenue, premium features, CTAs
- **Neutral Grays**: Backgrounds and secondary text
- **Success Green (#10B981)**: Positive metrics
- **Alert Colors**: Red (urgent), Purple (messages), etc.

### Typography
- **Headings**: Bold, 3xl/2xl/lg sizes
- **Body Text**: Medium weight, gray-600 color
- **Numbers**: Bold, larger sizes for metrics
- **Labels**: Small, uppercase, muted colors

---

## 👨‍💼 Agent Dashboard

### Purpose
Empower real estate agents to manage properties, track performance, and engage with clients.

### Key Sections

#### 1. **Top Metrics (4 Cards)**
- **Total Properties**: Count with active/inactive breakdown
- **Total Views**: 30-day property view count
- **Applications**: Number of tenant applications received
- **Monthly Earnings**: Revenue in XAF with percentage change

Each card includes:
- Large number display
- Trend indicator (up/down arrow)
- Percentage change vs last month
- Colored icon representing the metric

#### 2. **Charts Section (2 Charts)**
- **Property Views Chart**: 30-day bar chart showing daily views
- **Monthly Revenue Chart**: 12-month bar chart showing earnings

Features:
- Hover tooltips with exact values
- Time period selectors (dropdown)
- Responsive height (h-64)
- Interactive bars with hover states

#### 3. **Active Properties List**
- Horizontal property cards with:
  - Thumbnail image (128x96px)
  - Property title and location
  - Status badge (Active/Pending/Sold)
  - Key stats (views, saves, applications)
  - Price display
- "View all" link to full property list

#### 4. **Performance Section (3 Cards)**
- **Rating Widget**: Star rating with review count
- **Quick Actions**: Buttons for common tasks
- **Recent Activity**: Timeline of recent events

#### Sidebar Navigation
- Dashboard (active)
- My Properties
- Applications
- Analytics
- Credits
- Messages
- Settings

---

## 🏠 Tenant Dashboard

### Purpose
Help tenants find properties, track applications, and manage their housing search.

### Key Sections

#### 1. **Top Metrics (4 Cards)**
- **Saved Properties**: Favorited listings count
- **Applications**: Active application status
- **Scheduled Visits**: Upcoming viewings
- **Messages**: Unread message count

All cards are clickable and navigate to relevant sections.

#### 2. **Application Status (2 Columns)**
- **Active Applications**:
  - List of properties applied to
  - Status badges (Under Review, Approved, etc.)
  - Status icons (clock, checkmark, calendar)
  - Quick "View" action

- **Upcoming Viewings**:
  - Scheduled property visits
  - Date, time, and agent name
  - Calendar integration
  - "Details" action button

#### 3. **Saved Properties Grid**
- 3-column grid of favorite properties
- Property cards with:
  - Image thumbnail
  - Property title
  - Location with map pin icon
  - Filled heart icon (indicates saved)
  - Price per month
- Hover effects for interactivity

#### 4. **Call-to-Action Banner**
- Gradient background (blue to dark blue)
- "Discover Your Perfect Home" message
- "Start Searching" button
- Decorative icon (hidden on mobile)

#### Sidebar Navigation
- Dashboard (active)
- Search Properties
- My Favorites (with badge count)
- My Applications (with badge count)
- Messages (with unread count)
- Settings

---

## 👨‍💻 Admin Dashboard (Coming Soon)

### Purpose
Provide system-wide oversight, user management, and platform analytics.

### Planned Sections

#### 1. **System Overview (4 Cards)**
- Total Users (Agents + Tenants)
- Total Properties Listed
- Platform Revenue
- Active Transactions

#### 2. **User Analytics**
- User growth chart (monthly)
- User type breakdown (pie chart)
- Registration funnel
- Activity heatmap

#### 3. **Property Analytics**
- Property listings over time
- Property types distribution
- Price range analysis
- Location distribution map

#### 4. **Financial Dashboard**
- Revenue trends
- Payment processing stats
- Commission tracking
- Payout management

#### 5. **Management Tools**
- User list with actions (approve, suspend, delete)
- Property moderation queue
- Support ticket system
- System settings

#### Sidebar Navigation
- Dashboard
- Users Management
- Properties Management
- Analytics
- Financials
- Support Tickets
- Reports
- Settings
- System Logs

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3-4 columns)

### Mobile Adjustments
- Sidebar collapses to hamburger menu
- Stats grid: 1-2 columns
- Charts: Full width
- Property cards: Stack vertically
- Reduced padding/margins

---

## 🎯 Common Components

### Stat Card
```tsx
<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
  <div className="flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">Label</p>
      <h3 className="text-3xl font-bold text-gray-900">Value</h3>
      <p className="text-xs text-gray-500">Subtext</p>
      <div className="flex items-center gap-1 mt-2">
        <Icon className="h-4 w-4 text-green-500" />
        <span className="text-xs font-medium text-green-600">Change</span>
      </div>
    </div>
    <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
      <Icon className="h-6 w-6" />
    </div>
  </div>
</div>
```

### Property Card
```tsx
<div className="flex gap-4 p-6 hover:bg-gray-50">
  <img className="h-24 w-32 rounded-lg object-cover" />
  <div className="flex-1">
    <div className="flex items-start justify-between">
      <div>
        <h4 className="text-base font-semibold">Title</h4>
        <p className="text-sm text-gray-500">Location • Details</p>
      </div>
      <span className="px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
        Status
      </span>
    </div>
    <div className="flex items-center gap-6 mt-4">
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4" />
        <span>Metric</span>
      </div>
      <p className="text-lg font-bold text-primary">Price</p>
    </div>
  </div>
</div>
```

### Chart Container
```tsx
<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h3 className="text-lg font-semibold">Chart Title</h3>
      <p className="text-sm text-gray-500">Subtitle</p>
    </div>
    <select className="px-3 py-2 bg-gray-50 border rounded-lg text-sm">
      <option>Filter Option</option>
    </select>
  </div>
  <div className="h-64">
    {/* Chart content */}
  </div>
</div>
```

---

## 🔄 Implementation Steps

### Phase 1: Core Layout
1. ✅ Create sidebar navigation component
2. ✅ Setup grid system for stats cards
3. ✅ Implement responsive breakpoints
4. ✅ Add dark mode support

### Phase 2: Data Integration
1. ⏳ Connect to real API endpoints
2. ⏳ Fetch user statistics
3. ⏳ Load property data
4. ⏳ Implement real-time updates

### Phase 3: Advanced Features
1. ⏳ Add interactive charts (Chart.js/Recharts)
2. ⏳ Implement search and filters
3. ⏳ Add notification system
4. ⏳ Create export functionality

### Phase 4: Admin Dashboard
1. ⏳ Build user management interface
2. ⏳ Create moderation tools
3. ⏳ Add financial reporting
4. ⏳ Implement system settings

---

## 📊 Data Requirements

### Agent Dashboard APIs Needed
- `GET /api/agent/stats` - Dashboard statistics
- `GET /api/properties/my-properties?recent=true` - Recent properties
- `GET /api/analytics/views` - View analytics
- `GET /api/analytics/revenue` - Revenue data
- `GET /api/agent/rating` - Agent rating and reviews

### Tenant Dashboard APIs Needed
- `GET /api/tenant/stats` - Dashboard statistics
- `GET /api/favorites` - Saved properties
- `GET /api/applications/my-applications` - Application status
- `GET /api/viewings/upcoming` - Scheduled viewings
- `GET /api/messages/unread-count` - Unread messages

### Admin Dashboard APIs Needed
- `GET /api/admin/stats` - System-wide statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/properties` - Property management
- `GET /api/admin/analytics` - Platform analytics
- `GET /api/admin/financials` - Financial data

---

## 🎨 Color Coding by Role

### Agent Dashboard
- **Primary**: Blue (#2563EB) - Professional, trustworthy
- **Accent**: Gold (#F59E0B) - Earnings, premium
- **Success**: Green - Positive metrics

### Tenant Dashboard
- **Primary**: Blue (#2563EB) - Trust, stability
- **Accent**: Red (Hearts) - Favorites
- **Info**: Purple - Messages, notifications

### Admin Dashboard
- **Primary**: Blue (#2563EB) - Authority
- **Warning**: Amber - Moderation needed
- **Danger**: Red - Critical actions

---

## 🚀 Next Steps

1. Review the new dashboard files:
   - `page.new.tsx` for Agent Dashboard
   - `page.new.tsx` for Tenant Dashboard

2. Test responsiveness on different screen sizes

3. Replace existing dashboard files after approval

4. Implement real API integrations

5. Add chart library (Recharts or Chart.js)

6. Build Admin Dashboard

7. Add animations and micro-interactions

8. Performance optimization
