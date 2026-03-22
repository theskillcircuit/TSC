# Railway Deployment Instructions for The Skill Circuit

## Overview
Railway will host your **Backend (FastAPI)** and **MongoDB Database**.

---

## Step 1: Create Railway Account

1. Go to **[railway.app](https://railway.app)**
2. Click **"Login"** and sign in with your **GitHub account**

---

## Step 2: Create New Project

1. Click **"New Project"** on your Railway dashboard
2. Select **"Deploy from GitHub repo"**
3. Choose your repository containing The Skill Circuit code
4. Click **"Deploy Now"**

---

## Step 3: Configure Backend Service

1. Click on the deployed service
2. Go to **"Settings"** tab
3. Set **Root Directory** to: `backend`
4. Set **Start Command** to: `uvicorn server:app --host 0.0.0.0 --port $PORT`

---

## Step 4: Add MongoDB Database

1. In your project, click **"New"** → **"Database"** → **"MongoDB"**
2. Railway will create a MongoDB instance
3. Click on the MongoDB service → **"Connect"** tab
4. Copy the **"Mongo Connection URL"**

---

## Step 5: Set Environment Variables

1. Click on your **Backend service**
2. Go to **"Variables"** tab
3. Add these variables:

```
MONGO_URL=<paste MongoDB connection URL from Step 4>
DB_NAME=skillcircuit
JWT_SECRET=your-secure-secret-key-change-this
STRIPE_API_KEY=sk_test_your_stripe_key
RESEND_API_KEY=re_2fBAyBQ1_BwpfLVsFNSABXHtpMFApUwWg
CORS_ORIGINS=*
```

---

## Step 6: Generate Public URL

1. Go to your Backend service → **"Settings"**
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://your-app.up.railway.app`)

---

## Step 7: Initialize Database

After deployment, open your browser and visit:
```
https://your-railway-url.up.railway.app/api/seed
```

This creates the initial courses and admin account.

---

## Step 8: Deploy Frontend

For frontend, use **Firebase Hosting** (see firebase.readinstructions.md)

Set the frontend environment variable:
```
REACT_APP_BACKEND_URL=https://your-railway-url.up.railway.app
```

---

## Troubleshooting

### Build Failed?
- Check Railway logs for errors
- Ensure `requirements.txt` is in the `backend` folder
- Verify Python version compatibility

### Database Connection Error?
- Check MONGO_URL is correctly set
- Ensure MongoDB service is running in Railway

### CORS Errors?
- Set `CORS_ORIGINS=*` or specify your frontend domain
- Example: `CORS_ORIGINS=https://your-app.web.app`

---

## Admin Login

After seeding:
- **Email:** admin@skillcircuit.com
- **Password:** Chh@jer

---

## Costs

Railway offers:
- **Free Tier:** $5 credit/month (enough for small apps)
- **Pro Tier:** $20/month for production apps

---

## Support

Railway Documentation: https://docs.railway.app
