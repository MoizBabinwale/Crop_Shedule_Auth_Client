# Google OAuth & Calendar Sync - Frontend Implementation Restored

## Summary

Complete Google OAuth login and Google Calendar sync functionality has been restored to your frontend application. When users create quotations, the dates are automatically synced to their Gmail calendar account.

---

## ✅ Changes Made

### 1. **Package Dependencies Updated**

**File:** `package.json`

- Added: `@react-oauth/google: ^0.12.1` - For Google Sign-In button

```json
"@react-oauth/google": "^0.12.1"
```

### 2. **Google API Script Added**

**File:** `public/index.html`

- Added Google Sign-In SDK script:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### 3. **Authentication Context Enhanced**

**File:** `src/context/AuthContext.js`

- Added `googleAccessToken` to auth state
- New function: `loginUserWithGoogle()` - Handles Google OAuth login
- Persists Google access token to sessionStorage
- Logout clears Google token

```javascript
const loginUserWithGoogle = (token, user, googleAccessToken) => {
  setAuth({
    isLoggedIn: true,
    token,
    user,
    loading: false,
    googleAccessToken,
  });
  sessionStorage.setItem("googleAccessToken", googleAccessToken);
};
```

### 4. **Google Sign-In Button & Login Handler**

**File:** `src/pages/AuthPage.jsx`

- Integrated Google Sign-In button
- New function: `handleGoogleSignIn()` - Processes Google credential
- Backend call: `/auth/google-login` endpoint
- Automatically routes user after Google login
- Shows between email/password login and register form

```javascript
const handleGoogleSignIn = async (response) => {
  const res = await axios.post(`${BASE_URL}/auth/google-login`, {
    token: response.credential,
  });

  loginUserWithGoogle(res.data.token, res.data.user, res.data.googleAccessToken);
  // ... navigate based on role & approval
};
```

### 5. **Google Calendar Sync Utility**

**File:** `src/utils/googleCalendar.js` (NEW)

- Syncs quotation schedules to Google Calendar
- Functions available:
  - `syncQuotationToGoogleCalendar()` - Creates calendar events from quotation weeks
  - `getGoogleCalendarEvents()` - Retrieves user's calendar events
  - `deleteGoogleCalendarEvent()` - Removes calendar events
  - `updateGoogleCalendarEvent()` - Modifies calendar events

```javascript
export const syncQuotationToGoogleCalendar = async (quotationData) => {
  const events = quotationData.weeks.map((week) => ({
    summary: `Farm Schedule: ${quotationData.cropName}`,
    description: `Crop: ${quotationData.cropName}...,
    startDate: week.date,
    endDate: week.date,
  }));

  return axios.post(`${BASE_URL}/calendar/sync-events`, { events }, getAuthHeader());
};
```

### 6. **Quotation Creation with Calendar Sync**

**File:** `src/pages/CreateQuotation.js`

- Integrated Google Calendar sync when quotation is created
- Auto-sync only if user logged in via Google OAuth
- Handles graceful fallback if calendar sync fails
- Shows different success messages:
  - With calendar: "Quotation created & synced to Google Calendar!"
  - Without calendar: "Quotation created successfully"

```javascript
if (auth.googleAccessToken) {
  try {
    await syncQuotationToGoogleCalendar(quotationPayload);
    toast.success("Quotation created & synced to Google Calendar!");
  } catch (calendarError) {
    toast.success("Quotation created (Calendar sync skipped)");
  }
}
```

---

## 🔧 Backend Integration Points

Your backend needs these endpoints:

### 1. **POST** `/auth/google-login`

**Request Body:**

```json
{
  "token": "google_credential_token"
}
```

**Response:**

```json
{
  "token": "jwt_token",
  "user": { "id": "...", "name": "...", "email": "..." },
  "googleAccessToken": "google_access_token"
}
```

### 2. **POST** `/calendar/sync-events`

**Request Body:**

```json
{
  "events": [
    {
      "summary": "Farm Schedule: Wheat",
      "description": "...",
      "startDate": "2026-06-01",
      "endDate": "2026-06-01"
    }
  ]
}
```

**Response:** Success confirmation

### 3. **GET** `/calendar/events`

Returns user's calendar events

### 4. **DELETE** `/calendar/events/:eventId`

Removes a calendar event

### 5. **PUT** `/calendar/events/:eventId`

Updates a calendar event

---

## 📋 Configuration Required

### Environment Variables

Add to your `.env` file:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

To get Google Client ID:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Sign-In API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized origins: `http://localhost:3000`, `your_production_url`
6. Copy Client ID to .env

---

## 🚀 How It Works

### User Flow - Google OAuth Login:

1. User sees Google Sign-In button on login page
2. Clicks button → Google authentication dialog
3. User grants permissions → Backend receives credential
4. Backend validates with Google → Returns JWT + Google Access Token
5. User logged in → Redirected to dashboard

### Quotation Creation with Calendar Sync:

1. User fills farmer details & starts date
2. Clicks "Generate Quotation"
3. Quotation payload sent to backend → Saved to DB
4. Frontend checks for `auth.googleAccessToken`
5. If Google OAuth: Sends quotation dates to backend
6. Backend creates calendar events in user's Gmail calendar
7. Success message shows: "synced to Google Calendar!"
8. User can view events in their Gmail/Google Calendar

---

## 📦 Installation

After pulling these changes:

```bash
# Install new dependencies
npm install

# Start development server
npm start
```

---

## ✨ Features Added

✅ Google OAuth Sign-In button  
✅ Google account authentication  
✅ Automatic calendar event creation from quotations  
✅ Calendar date sync for all scheduled weeks  
✅ Graceful fallback if calendar sync fails  
✅ Google access token persistence  
✅ Logout clears Google token  
✅ Support for both Google & email/password login

---

## 🔐 Security Notes

- Google access token stored in sessionStorage (cleared on logout)
- All calendar operations require JWT authentication
- Backend must validate Google tokens with Google's servers
- Implement proper CORS for calendar API endpoints
- Use HTTPS in production for Google OAuth

---

## 📝 Notes for Backend

- Implement OAuth 2.0 flow with Google
- Use Google Calendar API to create events
- Store user's Google access tokens securely (consider encryption)
- Refresh tokens before expiry
- Handle calendar permission revocation
- Add error handling for calendar sync failures

---

**Status:** ✅ Frontend implementation complete & restored  
**Last Updated:** 2026-05-24  
**Next Step:** Backend implementation of calendar endpoints
