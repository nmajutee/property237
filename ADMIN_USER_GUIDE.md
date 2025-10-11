# Property237 Admin Guide - Managing Categories, Tags & States

**For**: Property237 Administrators & Managers
**Purpose**: Learn how to manage property categories, tags, and states through the Django admin panel

---

## Table of Contents

1. [Accessing the Admin Panel](#accessing-the-admin-panel)
2. [Understanding the System](#understanding-the-system)
3. [Managing Categories](#managing-categories)
4. [Managing Property Tags](#managing-property-tags)
5. [Managing Property States](#managing-property-states)
6. [Common Tasks](#common-tasks)
7. [Best Practices](#best-practices)

---

## Accessing the Admin Panel

### Step 1: Log In

1. Go to: `https://property237.onrender.com/admin/`
2. Enter your admin username and password
3. Click "Log in"

### Step 2: Navigate to Properties Section

In the admin homepage, you'll see:
- **Categories** - Property types (Residential, Commercial, etc.)
- **Property Tags** - Labels like "For Sale", "Furnished"
- **Property States** - Status like "Available", "Sold"

---

## Understanding the System

### The Three Components

```
┌─────────────────────────────────────────┐
│ 1. CATEGORIES (What type of property?)  │
│    • Residential → Apartments           │
│    • Commercial → Office Spaces         │
│    • Land & Plots → Residential Land    │
│    • Investment → Estates               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 2. TAGS (Property features/filters)     │
│    • For Sale                           │
│    • Furnished                          │
│    • Pet Friendly                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 3. STATES (Current status)              │
│    • Available                          │
│    • Rented                             │
│    • Under Construction                 │
└─────────────────────────────────────────┘
```

### How They Work Together

When an agent creates a property listing:

1. **Step 1**: Choose Category (e.g., "Residential")
2. **Step 2**: Choose Subcategory (e.g., "Apartments")
3. **Step 3**: Choose State (e.g., "Available")
4. **Step 4**: Add Tags (e.g., "For Sale", "Furnished")

---

## Managing Categories

### What Are Categories?

Categories organize properties into types. There are two levels:

- **Parent Categories**: Main groups (Residential, Commercial, Land, Investment)
- **Subcategories**: Specific types (Apartments, Villas, Office Spaces, etc.)

### Viewing Categories

1. Click **"Categories"** in the admin panel
2. You'll see a list with columns:
   - **Name**: Category name
   - **Parent**: Shows if it's a subcategory
   - **Code**: Unique identifier (e.g., RESIDENTIAL)
   - **Is active**: Whether it's in use
   - **Order**: Display order (lower numbers appear first)

### Adding a New Subcategory

**Example**: Adding "Penthouses" under Residential

1. Click **"Add Category"** button (top right)
2. Fill in the form:
   ```
   Name: Penthouses
   Parent: Residential Property (select from dropdown)
   Description: Luxury top-floor apartments with premium features
   Icon: (optional) building
   Is active: ✓ (checked)
   Order: 10 (controls display order)
   ```
3. Click **"Save"**

**Result**: Agents can now select "Penthouses" when listing Residential properties.

### Editing a Category

1. Click on the category name in the list
2. Update the fields
3. Click **"Save"**

### Important Rules

- ⚠️ **Don't delete categories** with existing properties
- ⚠️ **Don't change parent categories** of existing subcategories
- ✅ **Do mark as inactive** instead of deleting (`Is active` = unchecked)
- ✅ **Do use Order field** to control how categories appear in dropdowns

### Parent Categories (Usually Don't Touch)

These are the main 4 categories:
- RESIDENTIAL
- COMMERCIAL
- LAND_PLOT
- INVESTMENT

**⚠️ Warning**: Changing these affects the entire system. Consult with developers first.

---

## Managing Property Tags

### What Are Tags?

Tags are labels that help filter and describe properties.

**Examples**:
- "For Sale" / "For Rent" (transaction type)
- "Furnished" / "Unfurnished" (furnishing)
- "Pet Friendly" (features)
- "Newly Built" (condition)

### Viewing Tags

1. Click **"Property Tags"** in the admin panel
2. You'll see:
   - **Name**: Tag name
   - **Color**: Badge color (hex code)
   - **Is active**: Whether it's available
   - **Order**: Display order

### Adding a New Tag

**Example**: Adding "Ocean View" tag

1. Click **"Add Property Tag"**
2. Fill in the form:
   ```
   Name: Ocean View
   Description: Property with ocean/sea view
   Applies to: (select categories or leave blank for all)
     ☐ Residential Property
     ☐ Commercial Property
     ☐ Land & Plots
     ☐ Investment
   Color: #06B6D4 (turquoise blue)
   Icon: (optional) eye
   Is active: ✓
   Order: 20
   ```
3. Click **"Save"**

### Understanding "Applies To"

This controls which categories can use the tag:

- **Left blank**: Tag applies to ALL categories
- **Selected categories**: Tag only available for those categories

**Examples**:
```
Tag: "Furnished"
Applies to: Residential Property only
→ Only shows for residential properties

Tag: "For Sale"
Applies to: (blank)
→ Shows for all property types
```

### Color Codes

Tags use hex color codes for badges:

| Color       | Hex Code | When to Use               |
|-------------|----------|---------------------------|
| Green       | #10B981  | Positive (Available, New) |
| Blue        | #3B82F6  | Neutral (For Rent)        |
| Orange      | #F59E0B  | Attention (Negotiable)    |
| Purple      | #8B5CF6  | Premium (Luxury)          |
| Pink        | #EC4899  | Special (Featured)        |
| Gray        | #6B7280  | Inactive                  |

**Tip**: Use an online color picker to get hex codes: `https://htmlcolorcodes.com/color-picker/`

### Common Tags to Add

Here are useful tags you might want to add:

1. **Smart Home** - Properties with smart home features
2. **Near School** - Close to educational institutions
3. **Near Hospital** - Close to medical facilities
4. **Mountain View** - Mountain views
5. **City Center** - Located in city center
6. **Quiet Area** - Peaceful neighborhood

---

## Managing Property States

### What Are States?

States represent a property's current status in the listing lifecycle.

**Lifecycle Example**:
```
Draft → Pending Approval → Available → Under Offer → Sold
```

### Viewing States

1. Click **"Property States"** in the admin panel
2. You'll see:
   - **Name**: State display name
   - **Code**: Technical identifier
   - **Color**: Badge color
   - **Allows inquiries**: Can users contact about this property?
   - **Is publicly visible**: Show on public listings?
   - **Is active**: Currently in use?

### Default States

These are the standard states (don't delete these):

| State              | When to Use                              | Public? | Inquiries? |
|--------------------|------------------------------------------|---------|------------|
| Draft              | Agent is still creating listing          | No      | No         |
| Pending Approval   | Waiting for admin review                 | No      | No         |
| Available          | Ready to rent/sell                       | Yes     | Yes        |
| Newly Listed       | Just published (auto-set for 7 days)     | Yes     | Yes        |
| Under Offer        | Offer received, negotiating              | Yes     | Yes        |
| Reserved           | Temporarily held                         | Yes     | No         |
| Rented             | Successfully rented                      | No      | No         |
| Sold               | Successfully sold                        | No      | No         |
| Under Construction | Being built                              | Yes     | Yes        |
| Off Plan           | Pre-construction sales                   | Yes     | Yes        |
| Inactive           | Hidden by agent/admin                    | No      | No         |
| Expired            | Listing period ended                     | No      | No         |

### Adding a Custom State

**Example**: Adding "Renovation Required" state

1. Click **"Add Property State"**
2. Fill in the form:
   ```
   Code: renovation_required (use underscore, lowercase)
   Name: Renovation Required
   Description: Property needs repairs before occupancy
   Applies to: Residential Property, Commercial Property
   Color: #F59E0B (orange)
   Allows inquiries: ✓ (Yes, people can still ask)
   Is publicly visible: ✓ (Yes, show on listings)
   Is active: ✓
   Order: 15
   ```
3. Click **"Save"**

### Important State Settings

#### Allows Inquiries
- ✅ **Checked**: Users can send messages about this property
- ❌ **Unchecked**: Contact button hidden

**Use Cases**:
- Available, Under Offer: ✅ Allow inquiries
- Sold, Rented: ❌ Don't allow inquiries

#### Is Publicly Visible
- ✅ **Checked**: Property appears in search results
- ❌ **Unchecked**: Only visible to agent/admin

**Use Cases**:
- Available, Newly Listed: ✅ Show publicly
- Draft, Pending Approval: ❌ Hide from public

---

## Common Tasks

### Task 1: Add a New Property Type

**Scenario**: You want to add "Lofts" as a new residential type.

**Steps**:
1. Go to **Categories**
2. Click **"Add Category"**
3. Fill in:
   ```
   Name: Lofts
   Parent: Residential Property
   Description: Open-plan converted industrial spaces
   Order: 6
   Is active: ✓
   ```
4. Click **"Save"**

**Result**: Agents can now select "Lofts" when creating residential listings.

### Task 2: Create a Seasonal Tag

**Scenario**: Add "Summer Special" tag for seasonal promotions.

**Steps**:
1. Go to **Property Tags**
2. Click **"Add Property Tag"**
3. Fill in:
   ```
   Name: Summer Special
   Description: Special offer for summer season
   Color: #F59E0B (orange for attention)
   Applies to: (leave blank for all categories)
   Is active: ✓
   Order: 50
   ```
4. Click **"Save"**

**To Remove Later**:
- Don't delete it
- Just uncheck **"Is active"**

### Task 3: Temporarily Hide a Category

**Scenario**: Stop agents from listing "Hotels" temporarily.

**Steps**:
1. Go to **Categories**
2. Find "Hotels" in the list
3. Click on it
4. Uncheck **"Is active"**
5. Click **"Save"**

**Result**: "Hotels" won't appear in agent forms, but existing hotel listings stay visible.

### Task 4: Change Tag Color

**Scenario**: Make "Featured" tag more visible.

**Steps**:
1. Go to **Property Tags**
2. Click on "Featured"
3. Change **Color** from `#3B82F6` to `#EC4899` (bright pink)
4. Click **"Save"**

**Result**: Featured badges now appear in pink across the site.

### Task 5: Reorder Categories

**Scenario**: Make "Villas" appear before "Apartments" in dropdowns.

**Steps**:
1. Go to **Categories**
2. Find "Villas" → Note its current **Order** (e.g., 5)
3. Find "Apartments" → Note its current **Order** (e.g., 1)
4. Click on "Villas"
5. Change **Order** to `0` (lower than Apartments' 1)
6. Click **"Save"**

**Result**: "Villas" now appears first in the residential subcategories list.

---

## Best Practices

### Do's ✅

1. **Use descriptive names**
   - ✅ "Single Rooms / Bedsitters"
   - ❌ "Type 3"

2. **Keep descriptions clear**
   - ✅ "Luxury top-floor apartments with panoramic views"
   - ❌ "Fancy places on top"

3. **Test changes**
   - After adding a category, check the property creation form
   - Verify it appears in the correct dropdown

4. **Use consistent colors**
   - Same colors for similar tags (all "For Sale" tags use green)
   - Don't use too many different colors

5. **Deactivate instead of delete**
   - Uncheck "Is active" rather than deleting
   - Preserves data integrity

6. **Document changes**
   - Keep notes of what you changed and why
   - Helps if you need to revert later

### Don'ts ❌

1. **Don't delete categories with properties**
   - Check if any properties use it first
   - Use "Is active" = No instead

2. **Don't change parent category codes**
   - RESIDENTIAL, COMMERCIAL, etc.
   - These are used in the code

3. **Don't use special characters in codes**
   - ❌ "self contained"
   - ✅ "self_contained"

4. **Don't make too many subcategories**
   - Keep it simple (5-10 per parent)
   - Too many = confusing for agents

5. **Don't change state codes**
   - Codes like "available", "sold" are used in automation
   - Only admin can change these

---

## Troubleshooting

### Problem: New category doesn't appear in form

**Solutions**:
1. Check **"Is active"** is checked ✅
2. If it's a subcategory, verify **Parent** is set correctly
3. Clear browser cache (Ctrl+F5)
4. Wait 1-2 minutes for cache to update

### Problem: Tag shows for wrong category

**Solutions**:
1. Go to the tag in admin
2. Check **"Applies to"** field
3. Select correct categories
4. Click **"Save"**

### Problem: Can't delete a category

**Reason**: Properties are using it.

**Solutions**:
1. Don't delete - mark as inactive instead
2. Or reassign those properties to another category first
3. Then delete

### Problem: Colors not showing

**Solutions**:
1. Verify hex code starts with `#`
2. Use 6-character hex (e.g., `#10B981` not `#1B9`)
3. Clear browser cache

### Problem: Order not working

**Solutions**:
1. Lower numbers = appears first
2. Check all items have different orders
3. If two have same order, system uses alphabetical

---

## Quick Reference

### Color Palette

Copy-paste these hex codes:

```
Green:   #10B981  (success, available, positive)
Blue:    #3B82F6  (neutral, information)
Orange:  #F59E0B  (warning, attention)
Red:     #EF4444  (error, sold, unavailable)
Purple:  #8B5CF6  (premium, special)
Pink:    #EC4899  (featured, highlighted)
Gray:    #6B7280  (inactive, neutral)
Cyan:    #06B6D4  (water, ocean related)
```

### State Visibility Guide

| State              | Public | Inquiries | When to Use                |
|--------------------|--------|-----------|----------------------------|
| Available          | ✅     | ✅        | Ready to rent/sell         |
| Newly Listed       | ✅     | ✅        | Just published             |
| Under Offer        | ✅     | ✅        | Negotiating                |
| Under Construction | ✅     | ✅        | Being built                |
| Reserved           | ✅     | ❌        | Temporarily held           |
| Draft              | ❌     | ❌        | Not ready                  |
| Pending Approval   | ❌     | ❌        | Awaiting review            |
| Sold               | ❌     | ❌        | Transaction complete       |
| Rented             | ❌     | ❌        | Lease active               |
| Inactive           | ❌     | ❌        | Hidden                     |

---

## Getting Help

If you need assistance:

1. **Check this guide first** - Most questions are answered here
2. **Try in test mode** - Create a test property to verify changes
3. **Take screenshots** - Helpful when asking for help
4. **Contact tech team** - For issues not covered here

**Contact**: support@property237.com

---

**Document Version**: 1.0
**Last Updated**: October 2024
**For**: Property237 Admin Panel Users
