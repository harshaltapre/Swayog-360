# Backend Integration Quick Start Guide

## 🚀 What's Ready

Your Swayog Energy authentication system now includes:

✅ **Professional Login Page** - Split-screen design with solar imagery  
✅ **Signup Page** - Password strength indicator, role selection  
✅ **Forgot Password Page** - Email recovery flow  
✅ **API Layer** - Ready for backend integration  
✅ **Zustand Store** - State management with persistence  
✅ **Role-Based Access** - 5 user roles pre-configured  

---

## 📋 Demo Credentials (Current Build)

All pages are **fully functional** with mock authentication. Test with:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@swayog.energy | admin123 |
| Admin | amit.verma@swayog.energy | admin123 |
| Employee | ravi.kumar@swayog.energy | emp123 |
| Partner | rajesh@energysolutions.com | partner123 |
| Customer | vikram@example.com | customer123 |

---

## 🔌 Quick Backend Integration (3 Steps)

### Step 1: Create Node.js Backend

```bash
mkdir swayog-backend
cd swayog-backend
npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken pg
```

### Step 2: Basic Express Server

Create `server.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Auth routes here
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Query database for user
    // 2. Compare password with bcrypt
    // 3. Generate JWT token
    // 4. Return token + user data
    
    res.json({ 
      success: true,
      token: 'generated_jwt_token',
      user: { id: 1, email, role: 'admin' }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.listen(5000, () => console.log('Backend running on port 5000'));
```

### Step 3: Update Frontend API URL

In `app/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

Then uncomment the real API calls in `src/utils/api.ts` and remove mock implementations.

---

## 🗄️ Database Setup (PostgreSQL)

Quick setup script:

```sql
-- Create database
CREATE DATABASE swayog_energy;

-- Connect to database
\c swayog_energy;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Insert demo users
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@swayog.energy', '$2b$10$...hashed...', 'Admin User', 'super_admin'),
('amit.verma@swayog.energy', '$2b$10$...hashed...', 'Amit Verma', 'admin'),
('ravi.kumar@swayog.energy', '$2b$10$...hashed...', 'Ravi Kumar', 'employee'),
('rajesh@energysolutions.com', '$2b$10$...hashed...', 'Rajesh Patel', 'partner'),
('vikram@example.com', '$2b$10$...hashed...', 'Vikram Singh', 'customer');
```

---

## 🔐 Required Backend Endpoints

Implement these 7 endpoints:

1. **POST /api/auth/login** - User authentication
2. **POST /api/auth/signup** - New account registration
3. **POST /api/auth/forgot-password** - Password recovery
4. **POST /api/auth/verify** - Token validation
5. **POST /api/auth/logout** - Session termination
6. **GET /api/user/profile** - Fetch user data
7. **PUT /api/user/profile** - Update user data

See `AUTH_SYSTEM_DOCUMENTATION.md` for full endpoint specifications.

---

## 📱 Current Frontend Status

| Route | Status | Responsive |
|-------|--------|-----------|
| `/login` | ✅ Ready | Yes |
| `/signup` | ✅ Ready | Yes |
| `/forgot-password` | ✅ Ready | Yes |
| `/dashboard/*` | ✅ Ready | Yes |
| `/employee/schedule` | ✅ Ready | Yes |

---

## 🎨 Design System Already Applied

- **Primary Color**: #1A365D (Deep Navy)
- **Tertiary Color**: #48BB78 (Growth Green)
- **Neutral Color**: #64748B (Slate)
- **Fonts**: Inter (300-900 weights)
- **Responsive**: Mobile-first, fully responsive

---

## 📂 Key Files to Modify

1. **`src/utils/api.ts`** - Replace mock functions with real API calls
2. **`src/store/index.ts`** - Update auth store if needed
3. **`app/.env.local`** - Set backend URL

---

## ✅ Testing Checklist

- [ ] Login page loads and displays correctly
- [ ] Can login with demo credentials
- [ ] Error message shows for invalid credentials
- [ ] Signup form validates password strength
- [ ] Forgot password flow completes
- [ ] Mobile responsive on all pages
- [ ] Password visibility toggle works
- [ ] Remember me functionality works
- [ ] Quick role login buttons work
- [ ] Redirects to correct role dashboard

---

## 🚀 Next: Create Backend Service

Your backend should:
1. Accept login/signup requests
2. Hash passwords with bcrypt
3. Generate JWT tokens
4. Validate tokens on each request
5. Return user data with correct role
6. Persist all data to PostgreSQL

Once backend is ready, uncomment the fetch calls in `src/utils/api.ts` and your app will be **fully database-connected**.

---

## 🆘 Common Issues

**Issue**: "Invalid email or password" always shows  
**Solution**: Verify backend is returning correct response format

**Issue**: Token not persisting  
**Solution**: Check Zustand persist middleware in `src/store/index.ts`

**Issue**: CORS errors  
**Solution**: Configure CORS in backend: `app.use(cors())`

---

## 📚 Additional Resources

- Full documentation: `AUTH_SYSTEM_DOCUMENTATION.md`
- API specs: `src/utils/api.ts`
- Auth store: `src/store/index.ts`
- Login component: `src/pages/public/LoginPage.tsx`

---

**Ready to connect your backend?** Start with the 3-step guide above! 🎉
