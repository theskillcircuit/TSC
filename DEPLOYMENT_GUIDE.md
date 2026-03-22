# The Skill Circuit - Deployment Guide

## 📦 What's Included

```
/backend     → FastAPI Python backend
/frontend    → React frontend
```

---

## 🚀 DEPLOYMENT INSTRUCTIONS

### Step 1: Set Up MongoDB Atlas (Free Database)

1. Go to **[mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)** and create a free account
2. Click **"Build a Database"** → Select **"FREE" (M0)** → Click **"Create"**
3. Set up database access:
   - Create a username and password (save these!)
   - Example: `skillcircuit_user` / `YourSecurePassword123`
4. Set up network access:
   - Click **"Network Access"** → **"Add IP Address"** → **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Get your connection string:
   - Click **"Connect"** → **"Connect your application"**
   - Copy the connection string (looks like): 
   ```
   mongodb+srv://skillcircuit_user:YourSecurePassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### Step 2: Deploy Backend on Railway

1. Go to **[railway.app](https://railway.app)** and sign in with GitHub

2. Click **"New Project"** → **"Deploy from GitHub repo"**

3. Select your repository

4. **IMPORTANT:** Click on your service → **"Settings"** tab:
   - Set **"Root Directory"** to: `backend`
   - Set **"Watch Paths"** to: `/backend/**`

5. Go to **"Variables"** tab and add these environment variables:
   ```
   MONGO_URL=mongodb+srv://skillcircuit_user:YourSecurePassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=skillcircuit
   JWT_SECRET=skill-circuit-secret-key-2025-production
   STRIPE_API_KEY=sk_test_your_stripe_key
   RESEND_API_KEY=re_2fBAyBQ1_BwpfLVsFNSABXHtpMFApUwWg
   CORS_ORIGINS=*
   ```

6. Railway will auto-deploy. Wait for it to show **"Success"**

7. Click **"Settings"** → **"Networking"** → **"Generate Domain"**
   - Copy your backend URL (e.g., `https://your-app.up.railway.app`)

---

### Step 3: Deploy Frontend on Vercel

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub

2. Click **"Add New..."** → **"Project"**

3. Select your repository

4. Configure the project:
   - **Framework Preset:** Create React App
   - **Root Directory:** Click "Edit" → type `frontend`
   
5. Expand **"Environment Variables"** and add:
   ```
   REACT_APP_BACKEND_URL=https://your-railway-backend-url.up.railway.app
   ```
   (Use the Railway URL from Step 2)

6. Click **"Deploy"**

7. Wait for deployment → Your frontend URL will be shown (e.g., `https://your-app.vercel.app`)

---

### Step 4: Initialize Database

After both are deployed, open your browser and go to:
```
https://your-railway-backend-url.up.railway.app/api/seed
```

This creates the initial courses and admin account.

---

## 🔑 Login Credentials

**Admin Account:**
- Email: `admin@skillcircuit.com`
- Password: `admin123`

---

## ✅ Verify Everything Works

1. Open your Vercel frontend URL
2. You should see the homepage
3. Try logging in with admin credentials
4. Check the Admin Dashboard

---

## 🛠️ Troubleshooting

### Backend not starting?
- Check Railway logs for errors
- Verify all environment variables are set correctly
- Make sure MONGO_URL is correct

### Frontend shows "Network Error"?
- Check REACT_APP_BACKEND_URL is correct
- Make sure it includes `https://`
- Redeploy frontend after changing env vars

### Database connection failed?
- Check MongoDB Atlas "Network Access" allows 0.0.0.0/0
- Verify username/password in connection string
- Make sure there are no special characters issues in password

---

## 📧 Support

For technical issues, contact the developer.
