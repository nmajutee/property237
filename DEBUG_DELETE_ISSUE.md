# 🔍 Debugging Delete Property Issue

## 🎯 Problem
User (property owner) cannot delete their own property. Getting "Failed to delete property: Unknown error" message.

## 📊 What We Know
1. ✅ User is authenticated (can view, edit properties)
2. ✅ User created the property
3. ✅ Toggle availability works (PATCH request succeeds)
4. ❌ Delete fails (DELETE request fails)
5. ✅ Edit form works (PATCH request succeeds)

## 🔍 Investigation Steps Taken

### 1. Frontend Analysis ✅
- **Delete button**: Triggers confirmation modal ✅
- **API call**: Sends DELETE request to `/properties/{slug}/` ✅
- **Headers**: Includes Authorization bearer token ✅
- **Error handling**: Shows error notification ✅

### 2. Backend Analysis ✅
- **Endpoint**: `PropertyViewSet` handles DELETE ✅
- **URL pattern**: `/properties/{slug}/` configured ✅
- **Permission class**: `IsOwnerOrReadOnly` ✅
- **Ownership check**: Compares `request.user` with `instance.agent.user` ✅

### 3. Permission System ✅
```python
# backend/utils/permissions.py
class IsOwnerOrReadOnly:
    def has_permission(self, request, view):
        # Allows authenticated users to attempt write operations
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Checks if user owns the property
        return obj.agent.user == request.user
```

### 4. View Method ✅
```python
# backend/properties/views.py
def perform_destroy(self, instance):
    if (self.request.user == instance.agent.user or
        self.request.user.is_staff):
        instance.delete()
    else:
        raise PermissionDenied("You don't have permission...")
```

## 🛠️ Changes Made

### Frontend Enhancements
**File**: `frontend/src/app/my-properties/page.tsx`

Added detailed logging:
```typescript
console.log(`Delete response status: ${response.status}`)
console.log(`Delete response ok: ${response.ok}`)
console.log(`Delete response body: ${responseText}`)
console.log(`Delete failed - Headers:`, response.headers)
```

Added better error messages for each HTTP status:
- 403: "You do not have permission to delete this property"
- 404: "Property not found"
- 401: "Please log in again"
- Other: "Server error (status code)"

### Backend Enhancements
**File**: `backend/utils/permissions.py`

Added logging to `IsOwnerOrReadOnly`:
```python
logger.info(f"IsOwnerOrReadOnly check - User: {request.user}")
logger.info(f"Object type: {type(obj).__name__}")
logger.info(f"Has 'agent.user' - match: {result}")
```

**File**: `backend/properties/views.py`

Added logging to `perform_destroy`:
```python
logger.info(f"Delete attempt - User: {self.request.user}")
logger.info(f"Property agent: {instance.agent}")
logger.info(f"Agent user: {instance.agent.user}")
logger.info(f"Match: {self.request.user == instance.agent.user}")
```

## 🔎 Next Steps to Diagnose

### 1. Check Frontend Console Logs
After attempting to delete a property, check browser console for:
```
Delete response status: ???
Delete response ok: ???
Delete response body: ???
Delete failed - Status: ???
Delete failed - Error data: ???
Delete failed - Headers: ???
```

### 2. Check Backend Logs (Render)
Go to Render dashboard → property237-backend → Logs

Look for:
```
IsOwnerOrReadOnly check - User: <username>
Object type: Property
Has 'agent.user' - match: True/False
Delete attempt - User: <username>
Property agent: <agent>
Agent user: <user>
Match: True/False
```

## 🐛 Possible Issues & Solutions

### Issue 1: Agent Not Set
**Symptom**: `instance.agent` is None
**Solution**:
```python
# Ensure agent is set when creating properties
def perform_create(self, serializer):
    agent = AgentProfile.objects.get(user=self.request.user)
    serializer.save(agent=agent)
```

### Issue 2: Token Expired
**Symptom**: 401 status code
**Solution**: Frontend already handles token refresh
```typescript
if (response.status === 401) {
    // Try to refresh token
    const refreshResponse = await fetch(`${apiBaseUrl}/auth/token/refresh/`, ...)
}
```

### Issue 3: CORS or Network Issue
**Symptom**: Error in catch block, no response
**Solution**: Check network tab in browser DevTools

### Issue 4: Permission Check Failing
**Symptom**: 403 status code, logs show match: False
**Reasons**:
- Different user account
- Agent profile not linked
- User type mismatch

**Solution**: Verify in database:
```sql
SELECT p.id, p.title, p.agent_id, a.user_id, u.email
FROM properties_property p
JOIN agents_agentprofile a ON p.agent_id = a.id
JOIN users_customuser u ON a.user_id = u.id
WHERE p.slug = 'property-slug';
```

### Issue 5: Database Cascade Issues
**Symptom**: 500 error, database constraint error
**Solution**: Check foreign key relationships use CASCADE

## 📋 Checklist for Testing

After deployment, try to delete a property and verify:

- [ ] Browser console shows detailed logs
- [ ] Response status code is visible
- [ ] Response body/error message is visible
- [ ] Render backend logs show permission check
- [ ] Render backend logs show user matching
- [ ] If successful: Property deleted from UI
- [ ] If successful: Property deleted from database
- [ ] If failed: Clear error message displayed
- [ ] If failed: Logs show exact failure reason

## 🎯 Expected Behavior

### Success Flow:
1. User clicks delete button
2. Confirmation modal appears
3. User confirms deletion
4. Frontend sends: `DELETE /properties/{slug}/` with Bearer token
5. Backend receives request
6. `IsOwnerOrReadOnly.has_permission()` → True (user authenticated)
7. `IsOwnerOrReadOnly.has_object_permission()` → True (user owns property)
8. `perform_destroy()` executes
9. `instance.delete()` removes property from database
10. Backend returns: 204 No Content
11. Frontend removes property from UI
12. Success notification displays

### Failure Flow (Permission Denied):
1-6. Same as above
7. `has_object_permission()` → False (user doesn't own property)
8. Backend returns: 403 Forbidden with error message
9. Frontend displays error notification
10. Property remains in database and UI

### Failure Flow (Not Found):
1-5. Same as success flow
6. Backend can't find property with that slug
7. Backend returns: 404 Not Found
8. Frontend displays "Property not found" error

## 🔧 Quick Fixes to Try

### Fix 1: Ensure Agent Profile Exists
```python
# In Django shell
from users.models import CustomUser
from agents.models import AgentProfile

user = CustomUser.objects.get(email='your@email.com')
try:
    agent = user.agentprofile
    print(f"Agent exists: {agent.id}")
except:
    print("No agent profile - creating one...")
    agent = AgentProfile.objects.create(
        user=user,
        # ... other required fields
    )
```

### Fix 2: Check Property Agent Assignment
```python
# In Django shell
from properties.models import Property

prop = Property.objects.get(slug='property-slug')
print(f"Property agent: {prop.agent}")
print(f"Agent user: {prop.agent.user if prop.agent else 'None'}")
print(f"Your user: {your_user}")
print(f"Match: {prop.agent.user == your_user if prop.agent else False}")
```

### Fix 3: Manual Delete (Temporary)
```python
# In Django shell - ONLY FOR TESTING
from properties.models import Property

Property.objects.filter(slug='property-slug').delete()
```

## 📱 How to Access Logs

### Frontend (Browser):
1. Open property page
2. Press F12 to open DevTools
3. Go to Console tab
4. Click delete button
5. Look for log messages starting with "Delete"

### Backend (Render):
1. Go to https://dashboard.render.com
2. Select your backend service
3. Click "Logs" tab
4. Try deleting property
5. Look for "IsOwnerOrReadOnly" and "Delete attempt" messages

## ✅ Resolution Criteria

The issue will be resolved when:
1. ✅ User can delete their own properties
2. ✅ Property removed from UI immediately
3. ✅ Property deleted from database
4. ✅ Success notification displays
5. ✅ No errors in console or backend logs
6. ✅ Cannot delete other users' properties (403 error)
7. ✅ Clear error messages for all failure scenarios

## 📝 Current Status

**Deployed Changes**:
- ✅ Enhanced frontend error logging
- ✅ Enhanced backend permission logging
- ✅ Enhanced backend delete method logging
- ⏳ Waiting for user to test and check logs

**Next Action**:
Try to delete a property and report:
1. What the browser console shows
2. What error message appears
3. Screenshots if possible
4. Backend logs from Render (if accessible)

---

**Last Updated**: October 9, 2025
**Commits**:
- `9697cbc` - Enhanced frontend error logging
- `6d564be` - Enhanced backend permission logging
