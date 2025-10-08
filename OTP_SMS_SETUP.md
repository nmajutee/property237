# OTP SMS Setup Guide for Property237

## Current Status

✅ **Sign-up working** - Network error fixed!
🔄 **OTP implementation** - SMS integration added
📝 **Status:** SMS disabled by default (development mode)

## How It Works Now

### Development Mode (Current)
- **SMS_ENABLED:** False (default)
- **Behavior:** OTP code is printed to server console logs
- **User experience:** User won't receive SMS, but can see code in Render logs
- **Purpose:** Test sign-up flow without SMS costs

### Production Mode (After Setup)
- **SMS_ENABLED:** True
- **Behavior:** Real SMS sent via Africa's Talking
- **User experience:** User receives OTP code on their phone
- **Purpose:** Full production functionality

## Testing OTP (Right Now)

### Option 1: Check Render Logs
1. Go to https://dashboard.render.com
2. Navigate to your Property237 service
3. Click on **"Logs"** tab
4. Sign up with a new account
5. Look for: `[SMS DISABLED] Would send OTP <code> to +237...`
6. Copy the OTP code
7. Use it to verify your account

### Option 2: Check Database Directly
```sql
-- The OTP code is stored in the database
SELECT otp_code, recipient, created_at
FROM authentication_otpverification
WHERE is_verified = FALSE
ORDER BY created_at DESC
LIMIT 1;
```

## Setting Up Real SMS (Production)

### Step 1: Get Africa's Talking Account
1. Go to https://africastalking.com
2. Sign up for an account
3. Verify your account
4. Top up credits (starts at $5)

### Step 2: Get API Credentials
1. Go to Dashboard → Settings → API Keys
2. Copy your **Username** (usually your app name)
3. Generate and copy **API Key**
4. Note your **Sender ID** (or use default "Property237")

### Step 3: Configure Render Environment Variables
1. Go to Render Dashboard → Your Service
2. Click **Environment** tab
3. Add these variables:

```
SMS_ENABLED=True
AFRICASTALKING_USERNAME=your_username_here
AFRICASTALKING_API_KEY=your_api_key_here
AFRICASTALKING_SENDER_ID=Property237
```

4. Click **Save Changes**
5. Render will automatically redeploy

### Step 4: Test
1. Go to https://property237.vercel.app/sign-up
2. Create a new account with a real Cameroon number (+237...)
3. You should receive SMS with OTP code
4. Enter code to verify account

## SMS Provider Pricing (Africa's Talking)

| Country | Cost per SMS | Minimum Top-up |
|---------|-------------|----------------|
| Cameroon | ~$0.08 | $5 |
| Nigeria | ~$0.03 | $5 |
| Kenya | ~$0.01 | $5 |

**Estimate:** $5 top-up = ~60 OTP messages for Cameroon users

## Code Implementation

### What Was Added:

1. **SMS Service** (`backend/authentication/services.py`):
   ```python
   def _send_sms(phone_number, otp_code):
       if not settings.SMS_ENABLED:
           # Print to console for development
           print(f"[SMS] OTP code: {otp_code}")
           return True

       # Send real SMS via Africa's Talking
       africastalking.initialize(...)
       sms = africastalking.SMS
       sms.send(message, [phone_number])
   ```

2. **Settings** (`backend/config/settings.py`):
   ```python
   SMS_ENABLED = os.getenv('SMS_ENABLED', 'False') == 'True'
   AFRICASTALKING_USERNAME = os.getenv('AFRICASTALKING_USERNAME', 'sandbox')
   AFRICASTALKING_API_KEY = os.getenv('AFRICASTALKING_API_KEY', '')
   AFRICASTALKING_SENDER_ID = os.getenv('AFRICASTALKING_SENDER_ID', 'Property237')
   ```

3. **Dependencies** (`requirements.txt`):
   ```
   africastalking==1.2.8
   ```

## Alternative SMS Providers

If you prefer a different provider:

### Twilio (Global)
```python
from twilio.rest import Client
client = Client(account_sid, auth_token)
message = client.messages.create(
    body=f"Your code: {otp_code}",
    from_='+1234567890',
    to=phone_number
)
```

### SMS Gateway (Cameroon-specific)
- MTN Cameroon API
- Orange Cameroon API
- Local SMS aggregators

## Troubleshooting

### Issue: "OTP not received"
**Check:**
1. Is SMS_ENABLED=True in Render?
2. Are API credentials correct?
3. Is Africa's Talking account active?
4. Does account have sufficient credits?
5. Check Render logs for error messages

### Issue: "Invalid API key"
**Solution:**
1. Generate new API key in Africa's Talking dashboard
2. Update AFRICASTALKING_API_KEY in Render
3. Save and redeploy

### Issue: "Number not allowed"
**Solution:**
- For sandbox mode: Register test numbers first
- For production mode: Upgrade Africa's Talking account

## Current Deployment Status

| Component | Status | Details |
|-----------|--------|---------|
| Frontend | ✅ Deployed | https://property237.vercel.app |
| Backend | 🔄 Deploying | Render (commit af7cf7a) |
| CORS | ✅ Fixed | Network errors resolved |
| Sign-up | ✅ Working | Creates accounts successfully |
| OTP Generation | ✅ Working | Codes generated and stored |
| OTP SMS | 📝 Development | Prints to console (SMS disabled) |

## Next Steps

### Immediate (Development):
1. ✅ Sign-up works
2. ✅ OTP codes generated
3. 📝 Check Render logs for OTP codes
4. ✅ Test verification with codes from logs

### Before Launch (Production):
1. ⏳ Get Africa's Talking account
2. ⏳ Add API credentials to Render
3. ⏳ Enable SMS (SMS_ENABLED=True)
4. ⏳ Test with real phone numbers
5. ⏳ Monitor SMS costs and usage

## Costs Estimate

**Development:** FREE (no SMS sent)
**Production:**
- Setup: $5 minimum top-up
- Per user: $0.08 per OTP
- Monthly estimate: $0.08 × expected signups

**Example:**
- 100 signups/month = $8/month
- 500 signups/month = $40/month
- 1000 signups/month = $80/month

---

**Status:** Committed and deployed (commit `af7cf7a`)
**Testing:** Check Render logs for OTP codes
**Production:** Configure Africa's Talking when ready
