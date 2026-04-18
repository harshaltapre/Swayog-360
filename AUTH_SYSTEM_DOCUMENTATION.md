# Swayog Energy - Authentication System Documentation

## Overview
This document explains the professional login, signup, and password recovery system implemented for the Swayog Energy Solar Dashboard application.

## ✅ Implementation Complete

### Pages Created

#### 1. **Login Page** (`/login`)
- **File**: `src/pages/public/LoginPage.tsx`
- **Features**:
  - Split-screen design with solar farm imagery (hidden on mobile)
  - Email and password authentication
  - Password visibility toggle
  - Remember me checkbox (1-30 days session persistence)
  - Google and Microsoft SSO integration ready
  - Role-based quick login buttons (5 roles)
  - Error handling and validation
  - Responsive design (mobile, tablet, desktop)

#### 2. **Signup Page** (`/signup`)
- **File**: `src/pages/public/SignupPage.tsx`
- **Features**:
  - Full registration form
  - Real-time password strength indicator (4 levels)
  - Role selection dropdown
  - Email validation
  - Password confirmation
  - Terms & privacy acceptance
  - Responsive design

#### 3. **Forgot Password Page** (`/forgot-password`)
- **File**: `src/pages/public/ForgotPasswordPage.tsx`
- **Features**:
  - Email recovery flow
  - Success/error messaging
  - Auto-redirect to login after successful submission
  - Security tips and information
  - Fully responsive layout

---

## Demo Credentials

For testing all 5 user roles:

```
Super Admin:
  Email: admin@swayog.energy
  Password: admin123

Admin:
  Email: amit.verma@swayog.energy
  Password: admin123

Employee:
  Email: ravi.kumar@swayog.energy
  Password: emp123

Partner:
  Email: rajesh@energysolutions.com
  Password: partner123

Customer:
  Email: vikram@example.com
  Password: customer123
```

---

## Database Authentication System

### Current Implementation (Mock Database)
The system uses a mock database for demonstration purposes. Users can:
- Login with valid credentials
- Signup for new accounts
- Request password recovery
- Remember login credentials (localStorage)

### API Layer (`src/utils/api.ts`)

The API utilities file contains all authentication functions with placeholders for backend integration:

#### Functions Available:

1. **`login(credentials: LoginCredentials)`**
   - Authenticates user with email and password
   - Returns: `LoginResponse` with token and user data
   - Mock: Validates against DEMO_USERS database

2. **`signup(data: SignupData)`**
   - Creates new user account
   - Returns: `SignupResponse` with confirmation
   - Mock: Adds user to DEMO_USERS database

3. **`forgotPassword(email: string)`**
   - Initiates password recovery process
   - Returns: Success confirmation
   - Mock: Simulates email sending

4. **`verifyToken(token: string)`**
   - Validates JWT token authenticity
   - Returns: User data if valid
   - Mock: Checks token format

5. **`logout(token: string)`**
   - Logs out user and invalidates session
   - Returns: Success confirmation
   - Mock: Simulates server logout

6. **`fetchUserProfile(token: string)`**
   - Retrieves current user profile data
   - Returns: User profile object
   - Mock: Returns sample profile

7. **`updateUserProfile(token: string, userData: Record<string, any>)`**
   - Updates user profile information
   - Returns: Updated user data
   - Mock: Applies updates to sample profile

---

## Backend Integration Setup

### Step 1: Replace Mock API Calls

In `src/utils/api.ts`, replace mock implementations with real backend calls:

```typescript
// Example: login function
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
}
```

### Step 2: Configure Backend URL

Set environment variable in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Required Backend Endpoints

Your backend should provide these endpoints:

#### Authentication Endpoints

**POST /auth/login**
```json
Request:
{
  "email": "user@swayog.energy",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@swayog.energy",
    "name": "John Doe",
    "role": "admin",
    "avatar": "avatar_url"
  }
}
```

**POST /auth/signup**
```json
Request:
{
  "email": "newuser@swayog.energy",
  "password": "password123",
  "fullName": "John Doe",
  "role": "employee"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... },
  "message": "Account created successfully"
}
```

**POST /auth/forgot-password**
```json
Request:
{
  "email": "user@swayog.energy"
}

Response:
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

**POST /auth/verify**
```json
Request Headers:
{
  "Authorization": "Bearer jwt_token_here"
}

Response:
{
  "success": true,
  "user": { ... }
}
```

#### User Profile Endpoints

**GET /user/profile**
- Headers: `Authorization: Bearer token`
- Response: User profile object

**PUT /user/profile**
- Headers: `Authorization: Bearer token`
- Body: Updated user data
- Response: Updated user object

---

## Database Schema (PostgreSQL Example)

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password Recovery Tokens
CREATE TABLE password_recovery_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_recovery_tokens_user_id ON password_recovery_tokens(user_id);
```

---

## Authentication Flow Diagram

```
1. User visits /login
   ↓
2. Enters email & password
   ↓
3. Frontend validates locally
   ↓
4. Sends credentials to backend via API
   ↓
5. Backend validates against database
   ↓
6. Backend returns JWT token
   ↓
7. Frontend stores token in Zustand + localStorage
   ↓
8. User redirected to role-based dashboard
   ↓
9. All subsequent requests include JWT in headers
```

---

## State Management (Zustand)

### useAuthStore
Located in `src/store/index.ts`

**State:**
```typescript
{
  user: User | null;           // Current authenticated user
  isAuthenticated: boolean;     // Authentication status
  token: string | null;         // JWT token
}
```

**Methods:**
```typescript
login(role: Role)              // Set user as authenticated
logout()                       // Clear user and token
setUser(user: User)           // Update user data
updateProfile(data: any)      // Update user profile
```

---

## Security Considerations

### ✅ Already Implemented
- Password visibility toggle (prevents shoulder surfing)
- Remember me (optional session persistence)
- Error messages don't reveal user existence
- Responsive design prevents mobile-specific attacks
- Token-based authentication ready

### 🔒 Backend Requirements
1. **Password Storage**: Hash passwords using bcrypt or similar
2. **JWT Tokens**: Use RS256 or HS256 encryption
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS for frontend domain
5. **Rate Limiting**: Implement rate limiting on auth endpoints
6. **Token Expiration**: Set appropriate expiration times (15-60 min)
7. **Refresh Tokens**: Implement refresh token rotation
8. **2FA**: Consider adding two-factor authentication

---

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials (shows error)
- [ ] Signup with new account
- [ ] Signup with existing email (shows error)
- [ ] Forgot password flow
- [ ] Password visibility toggle
- [ ] Remember me persistence
- [ ] Role-based quick login buttons
- [ ] SSO buttons (Google/Microsoft) - not yet implemented
- [ ] Mobile responsive layout
- [ ] Tab switching between login/signup/forgot-password

---

## Environment Configuration

### `.env.local` (Development)
```env
VITE_API_URL=http://localhost:5000/api
VITE_LOG_LEVEL=debug
```

### `.env.production`
```env
VITE_API_URL=https://api.swayog.energy/api
VITE_LOG_LEVEL=error
```

---

## Next Steps

1. **Create Node.js/Express Backend**
   - Set up authentication routes
   - Implement database connection
   - Add password hashing and JWT generation

2. **Replace Mock API Calls**
   - Update `src/utils/api.ts` with real endpoints
   - Add error handling and retries
   - Implement request interceptors

3. **Add OAuth Integration**
   - Google OAuth 2.0
   - Microsoft Azure AD

4. **Implement 2FA**
   - SMS-based OTP
   - Authenticator app support

5. **Add User Onboarding**
   - Welcome email
   - Profile completion wizard
   - Role-specific tutorials

---

## File Structure

```
app/src/
├── pages/public/
│   ├── LoginPage.tsx ..................... Main login interface
│   ├── SignupPage.tsx .................... Registration form
│   ├── ForgotPasswordPage.tsx ............ Password recovery
│   └── NotFoundPage.tsx .................. 404 page
├── utils/
│   └── api.ts ............................ API utilities & mock DB
├── store/
│   └── index.ts .......................... Zustand auth store
├── components/
│   └── ProtectedRoute.tsx ................ Route protection wrapper
└── App.tsx .............................. Main routing setup
```

---

## Color Scheme (Professional Trust)

- **Primary**: `#1A365D` (Deep Navy) - Buttons, accents, focus states
- **Tertiary**: `#48BB78` (Growth Green) - Success, positive actions
- **Neutral**: `#64748B` (Slate) - Text, borders, secondary elements

---

## Support & Documentation

For more information:
- **Backend API Docs**: Create in `docs/api.md`
- **Database Schema**: Create in `docs/database.md`
- **Security Guide**: Create in `docs/security.md`
- **Deployment**: Create in `docs/deployment.md`

---

**Version**: 1.0  
**Last Updated**: 2025-04-18  
**Status**: Ready for Backend Integration
