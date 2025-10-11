# Property Categories, States & Tags - Implementation Guide

## Overview

This document provides comprehensive guidance for implementing and using the Property237 category system with hierarchical categories, tags, and states.

## Table of Contents

1. [Architecture](#architecture)
2. [Models](#models)
3. [API Endpoints](#api-endpoints)
4. [Admin Setup](#admin-setup)
5. [Frontend Integration](#frontend-integration)
6. [Seed Data](#seed-data)
7. [Migration Strategy](#migration-strategy)

---

## Architecture

### Hierarchical Structure

```
Parent Categories (Level 1)
├── RESIDENTIAL
│   ├── Apartments
│   ├── Studio Apartments
│   ├── Single Rooms / Bedsitters
│   ├── Self-Contained Rooms
│   ├── Duplexes
│   ├── Bungalows
│   ├── Villas / Mansions
│   ├── Hostels / Student Rooms
│   └── Guest Houses
├── COMMERCIAL
│   ├── Office Spaces
│   ├── Shops & Boutiques
│   ├── Warehouses
│   ├── Hotels
│   ├── Event Halls / Conference Centers
│   └── Restaurants / Bars
├── LAND_PLOT
│   ├── Residential Land
│   ├── Commercial Land
│   ├── Agricultural Land / Farms
│   └── Industrial Plots
└── INVESTMENT
    ├── Estates / Housing Schemes
    ├── Apartment Buildings
    ├── Mixed-Use Developments
    └── Industrial Facilities
```

### Relationships

```
Property → Category (FK)
Property → PropertyState (FK or CharField with choices)
Property → PropertyTag (M2M)

PropertyTag → Category (M2M, optional - "applies_to")
PropertyState → Category (M2M, optional - "applies_to")
```

---

## Models

### 1. Category Model

**File**: `backend/properties/category_models.py`

```python
class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=120)
    code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE,
                              null=True, blank=True,
                              related_name='subcategories')
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    def is_parent(self):
        return self.parent is None

    def get_all_subcategories(self):
        if self.is_parent():
            return self.subcategories.filter(is_active=True)
        return Category.objects.none()
```

**Key Features**:
- Self-referencing FK for parent-child relationship
- Auto-generated slugs from names
- Optional codes for easy reference
- Ordering support

### 2. PropertyTag Model

```python
class PropertyTag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, max_length=120)
    description = models.TextField(blank=True)
    applies_to = models.ManyToManyField(Category, blank=True,
                                       related_name='tags')
    color = models.CharField(max_length=7, default='#3B82F6')
    icon = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
```

**Key Features**:
- Applies to specific categories OR all (if `applies_to` is empty)
- Color coding for UI display
- Icon support

**Example Tags**:
- For Sale (all categories)
- For Rent (Residential, Commercial)
- Furnished (Residential only)
- Title Ready (Land & Plots, Investment)

### 3. PropertyState Model

```python
class PropertyState(models.Model):
    code = models.CharField(max_length=50, unique=True, choices=STATUS_CHOICES)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    applies_to = models.ManyToManyField(Category, blank=True,
                                       related_name='states')
    color = models.CharField(max_length=7, default='#10B981')
    allows_inquiries = models.BooleanField(default=True)
    is_publicly_visible = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
```

**Status Codes**:
- `draft` - Not yet published
- `pending_approval` - Awaiting verification
- `available` - Ready for sale/rent
- `newly_listed` - Recently published
- `under_offer` - Transaction pending
- `reserved` - Temporarily booked
- `rented` - Rented out
- `sold` - Sale completed
- `under_construction` - Being built
- `off_plan` - Pre-construction sales
- `inactive` - Hidden
- `expired` - Listing ended

---

## API Endpoints

### Base URL
```
https://property237.onrender.com/api/properties/
```

### 1. Categories API

#### Get All Parent Categories
```http
GET /categories/parents/
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "Residential Property",
    "slug": "residential",
    "code": "RESIDENTIAL",
    "description": "Properties for residential use",
    "icon": "home",
    "is_parent": true,
    "subcategories": [
      {
        "id": 5,
        "name": "Apartments",
        "slug": "residential-apartments",
        "description": "Multi-unit residential buildings",
        "parent": 1,
        "parent_name": "Residential Property",
        "parent_code": "RESIDENTIAL",
        "order": 1
      },
      // ... more subcategories
    ]
  },
  // ... more parent categories
]
```

#### Get Subcategories for a Parent
```http
GET /categories/{slug}/subcategories/
```

Example:
```http
GET /categories/residential/subcategories/
```

#### Get Category with Filters
```http
GET /categories/{slug}/with_filters/
```

Returns category with all applicable tags and states:
```json
{
  "id": 1,
  "name": "Residential Property",
  "slug": "residential",
  "code": "RESIDENTIAL",
  "subcategories": [...],
  "applicable_tags": [
    {
      "id": 1,
      "name": "For Sale",
      "slug": "for-sale",
      "color": "#10B981",
      "applies_to_categories": "all"
    },
    {
      "id": 2,
      "name": "For Rent",
      "slug": "for-rent",
      "color": "#3B82F6",
      "applies_to_categories": [1, 2]
    }
  ],
  "applicable_states": [
    {
      "code": "available",
      "name": "Available",
      "color": "#10B981",
      "allows_inquiries": true,
      "is_publicly_visible": true
    }
  ]
}
```

### 2. Tags API

#### Get All Tags
```http
GET /tags/
```

#### Get Tags for Specific Category
```http
GET /tags/for_category/{category_id}/
```

Example:
```http
GET /tags/for_category/1/
```

### 3. States API

#### Get All States
```http
GET /states/
```

#### Get Public States Only
```http
GET /states/public/
```

#### Get States for Specific Category
```http
GET /states/for_category/{category_id}/
```

### 4. Form Data API (Optimized)

#### Get All Form Data
```http
GET /form-data/
```

Returns everything in one request:
```json
{
  "categories": [...],
  "tags": [...],
  "states": [...]
}
```

#### Get Form Data for Specific Category
```http
GET /form-data/for_category/{category_id}/
```

Returns filtered data:
```json
{
  "category": {...},
  "subcategories": [...],
  "tags": [...],  // Only applicable tags
  "states": [...]  // Only applicable states
}
```

---

## Admin Setup

### 1. Register Models in Admin

**File**: `backend/properties/admin.py`

```python
from django.contrib import admin
from .category_models import Category, PropertyTag, PropertyState


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'code', 'is_active', 'order']
    list_filter = ['parent', 'is_active']
    search_fields = ['name', 'code', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['parent', 'order', 'name']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('parent')


@admin.register(PropertyTag)
class PropertyTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'is_active', 'order']
    list_filter = ['is_active', 'applies_to']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['applies_to']
    ordering = ['order', 'name']


@admin.register(PropertyState)
class PropertyStateAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'color', 'allows_inquiries',
                   'is_publicly_visible', 'is_active']
    list_filter = ['allows_inquiries', 'is_publicly_visible',
                  'is_active', 'applies_to']
    search_fields = ['name', 'code', 'description']
    filter_horizontal = ['applies_to']
    ordering = ['order', 'name']
```

### 2. Admin Dashboard Flow

**Adding a New Subcategory**:
1. Go to Categories
2. Click "Add Category"
3. Enter name (e.g., "Penthouses")
4. Select parent (e.g., "Residential Property")
5. Optionally set icon, description, order
6. Save

**Managing Tags**:
1. Go to Property Tags
2. Create tag (e.g., "Smart Home")
3. Select applicable categories (or leave empty for all)
4. Set color for UI display
5. Save

---

## Frontend Integration

### 1. React Dynamic Form Component

**File**: `frontend/src/components/properties/PropertyForm.tsx`

```typescript
import React, { useState, useEffect } from 'react'

interface PropertyFormProps {
  mode: 'create' | 'edit'
  initialData?: Property
}

export default function PropertyForm({ mode, initialData }: PropertyFormProps) {
  const [parentCategory, setParentCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [availableSubcategories, setAvailableSubcategories] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  const [availableStates, setAvailableStates] = useState([])
  const [loading, setLoading] = useState(false)

  // Load parent categories on mount
  useEffect(() => {
    loadParentCategories()
  }, [])

  // Load subcategories when parent changes
  useEffect(() => {
    if (parentCategory) {
      loadSubcategories(parentCategory)
      loadFiltersForCategory(parentCategory)
    }
  }, [parentCategory])

  const loadParentCategories = async () => {
    const response = await fetch('/api/properties/categories/parents/')
    const data = await response.json()
    setParentCategories(data)
  }

  const loadSubcategories = async (categoryId: string) => {
    const response = await fetch(
      `/api/properties/categories/${categoryId}/subcategories/`
    )
    const data = await response.json()
    setAvailableSubcategories(data)
  }

  const loadFiltersForCategory = async (categoryId: string) => {
    const response = await fetch(
      `/api/properties/form-data/for_category/${categoryId}/`
    )
    const data = await response.json()
    setAvailableTags(data.tags)
    setAvailableStates(data.states)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Step 1: Parent Category */}
      <div>
        <label>Property Category</label>
        <select
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {parentCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Subcategory (appears after parent selected) */}
      {parentCategory && (
        <div>
          <label>Property Type</label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            {availableSubcategories.map((subcat) => (
              <option key={subcat.id} value={subcat.id}>
                {subcat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Step 3: Status (filtered based on category) */}
      {subcategory && (
        <div>
          <label>Status</label>
          <select name="status" required>
            {availableStates.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Step 4: Tags (filtered based on category) */}
      {subcategory && (
        <div>
          <label>Tags</label>
          <div className="grid grid-cols-2 gap-2">
            {availableTags.map((tag) => (
              <label key={tag.id} className="flex items-center">
                <input
                  type="checkbox"
                  name="tags"
                  value={tag.id}
                  className="mr-2"
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rest of form fields... */}

      <button type="submit">
        {mode === 'create' ? 'Create Property' : 'Update Property'}
      </button>
    </form>
  )
}
```

### 2. Custom Hooks

**File**: `frontend/src/hooks/usePropertyCategories.ts`

```typescript
import { useState, useEffect } from 'react'

export function usePropertyCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/properties/categories/parents/')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
        setLoading(false)
      })
  }, [])

  return { categories, loading }
}

export function useSubcategories(parentId: string | null) {
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!parentId) return

    setLoading(true)
    fetch(`/api/properties/categories/${parentId}/subcategories/`)
      .then((res) => res.json())
      .then((data) => {
        setSubcategories(data)
        setLoading(false)
      })
  }, [parentId])

  return { subcategories, loading }
}

export function useCategoryFilters(categoryId: string | null) {
  const [tags, setTags] = useState([])
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!categoryId) return

    setLoading(true)
    fetch(`/api/properties/form-data/for_category/${categoryId}/`)
      .then((res) => res.json())
      .then((data) => {
        setTags(data.tags)
        setStates(data.states)
        setLoading(false)
      })
  }, [categoryId])

  return { tags, states, loading }
}
```

---

## Seed Data

### Running the Seed Command

```bash
# Seed categories, states, and tags
python manage.py seed_property_categories

# Clear existing and re-seed
python manage.py seed_property_categories --clear
```

### What Gets Seeded

**4 Parent Categories:**
- RESIDENTIAL (9 subcategories)
- COMMERCIAL (6 subcategories)
- LAND_PLOT (4 subcategories)
- INVESTMENT (4 subcategories)

**12 Property States:**
- Draft, Pending Approval, Available, Newly Listed, Under Offer, Reserved,
  Rented, Sold, Under Construction, Off Plan, Inactive, Expired

**14 Property Tags:**
- For Sale, For Rent, Lease, Negotiable, Furnished, Unfurnished,
  Newly Built, Renovated, Pet Friendly, With Parking, Gated Community,
  Waterfront, Corner Plot, Title Ready

---

## Migration Strategy

### Step 1: Add New Models (Parallel to Old)

Keep old `PropertyType` and `PropertyStatus` models while adding new ones.

```python
# properties/models.py
from .category_models import Category, PropertyTag, PropertyState

class Property(models.Model):
    # Old fields (keep for now)
    property_type = models.ForeignKey(PropertyType, ...)  # Keep
    status = models.ForeignKey(PropertyStatus, ...)  # Keep

    # New fields
    category = models.ForeignKey(Category, null=True, blank=True, ...)
    state = models.CharField(
        max_length=50,
        choices=PropertyState.STATUS_CHOICES,
        null=True,
        blank=True
    )
    tags = models.ManyToManyField(PropertyTag, blank=True)
```

### Step 2: Data Migration

```python
# Create migration: python manage.py makemigrations properties --empty --name migrate_to_categories

from django.db import migrations
from properties.category_models import CATEGORY_MIGRATION_MAP, STATUS_MIGRATION_MAP

def migrate_data_forward(apps, schema_editor):
    Property = apps.get_model('properties', 'Property')
    Category = apps.get_model('properties', 'Category')
    PropertyState = apps.get_model('properties', 'PropertyState')

    for prop in Property.objects.all():
        # Migrate property_type to category
        old_type = prop.property_type.subtype
        if old_type in CATEGORY_MIGRATION_MAP:
            parent_code, subcat_name = CATEGORY_MIGRATION_MAP[old_type]
            parent = Category.objects.get(code=parent_code)
            subcategory = Category.objects.get(name=subcat_name, parent=parent)
            prop.category = subcategory

        # Migrate status to state
        old_status = prop.status.name
        if old_status in STATUS_MIGRATION_MAP:
            new_state_code = STATUS_MIGRATION_MAP[old_status]
            prop.state = new_state_code

        prop.save()

def migrate_data_backward(apps, schema_editor):
    pass  # Optional: implement reverse migration

class Migration(migrations.Migration):
    dependencies = [
        ('properties', '0XXX_previous_migration'),
    ]

    operations = [
        migrations.RunPython(migrate_data_forward, migrate_data_backward),
    ]
```

### Step 3: Remove Old Models

After verifying data migration:

```python
class Property(models.Model):
    # Remove old fields
    # property_type = ...  # DELETE
    # status = ...  # DELETE

    # Keep new fields
    category = models.ForeignKey(Category, ...)
    state = models.CharField(...)
    tags = models.ManyToManyField(PropertyTag, ...)
```

---

## Testing

### Backend Tests

```python
from django.test import TestCase
from properties.category_models import Category, PropertyTag, PropertyState

class CategoryTestCase(TestCase):
    def setUp(self):
        self.parent = Category.objects.create(
            name='Residential',
            code='RESIDENTIAL'
        )
        self.subcat = Category.objects.create(
            name='Apartments',
            parent=self.parent
        )

    def test_is_parent(self):
        self.assertTrue(self.parent.is_parent())
        self.assertFalse(self.subcat.is_parent())

    def test_get_subcategories(self):
        subcats = self.parent.get_all_subcategories()
        self.assertEqual(subcats.count(), 1)
        self.assertEqual(subcats.first().name, 'Apartments')

class PropertyTagTestCase(TestCase):
    def test_applies_to_all(self):
        tag = PropertyTag.objects.create(name='For Sale')
        # No applies_to set = applies to all
        self.assertEqual(tag.applies_to.count(), 0)

    def test_applies_to_category(self):
        category = Category.objects.create(name='Residential', code='RESIDENTIAL')
        tag = PropertyTag.objects.create(name='Furnished')
        tag.applies_to.add(category)

        self.assertTrue(tag.applies_to_category(category))
```

### API Tests

```python
from rest_framework.test import APITestCase
from django.urls import reverse

class CategoryAPITestCase(APITestCase):
    def test_get_parent_categories(self):
        url = reverse('category-parents')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('Residential', str(response.data))

    def test_get_subcategories(self):
        parent = Category.objects.create(name='Residential', code='RESIDENTIAL', slug='residential')
        Category.objects.create(name='Apartments', parent=parent)

        url = reverse('category-subcategories', kwargs={'slug': 'residential'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
```

---

## Best Practices

### 1. Always Use Slugs for Frontend
```typescript
// ✅ Good
const category = categories.find(c => c.slug === 'residential')

// ❌ Bad
const category = categories.find(c => c.id === 1)
```

### 2. Cache Form Data
```typescript
// Cache categories, tags, states in Redux/Context
// Fetch once on app load, not per form
```

### 3. Validate Category-State Combinations
```python
# In Property model clean() method
def clean(self):
    if self.state and self.category:
        state_obj = PropertyState.objects.get(code=self.state)
        if not state_obj.applies_to_category(self.category):
            raise ValidationError(
                f"State '{state_obj.name}' is not valid for category '{self.category.name}'"
            )
```

### 4. Use Bulk Operations
```python
# ✅ Good
tags = PropertyTag.objects.filter(id__in=tag_ids)
property.tags.set(tags)

# ❌ Bad
for tag_id in tag_ids:
    property.tags.add(tag_id)
```

---

## Troubleshooting

### Issue: Subcategories Not Showing

**Solution**: Check that parent category is selected first and that the category has `is_active=True`.

```typescript
if (!parentCategory) {
  return null // Don't render subcategory dropdown yet
}
```

### Issue: Tags Not Filtering

**Solution**: Verify the tag's `applies_to` field is set correctly.

```python
# In Django shell
tag = PropertyTag.objects.get(name='Furnished')
print(tag.applies_to.all())  # Should show categories
```

### Issue: State Not Valid Error

**Solution**: Check PropertyState's `applies_to` relationship.

```python
state = PropertyState.objects.get(code='sold')
category = Category.objects.get(id=category_id)
print(state.applies_to_category(category))  # Should return True
```

---

## Support

For questions or issues:
1. Check this documentation
2. Review API responses in browser DevTools
3. Run `python manage.py seed_property_categories` to reset data
4. Check Django admin for data integrity

---

**Version**: 1.0.0
**Last Updated**: October 2024
**Maintainer**: Property237 Development Team
