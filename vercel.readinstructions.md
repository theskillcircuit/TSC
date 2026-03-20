# Vercel Deployment Instructions for The Skill Circuit Backend

## Overview
Deploy your FastAPI backend as serverless functions on Vercel.

---

## Step 1: Create MongoDB Atlas Database (Free)

1. Go to **[mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)**
2. Create a free account
3. Click **"Build a Database"** → Select **"FREE" (M0)**
4. Create a username and password (save these!)
5. Go to **"Network Access"** → **"Add IP Address"** → **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Go to **"Connect"** → **"Connect your application"** → Copy the connection string

Your connection string looks like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## Step 2: Deploy Backend to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Set **Root Directory** to: `backend`
5. Vercel will auto-detect the Python project
6. Click **"Deploy"**

### Option B: Deploy via CLI

```bash
cd backend
npm install -g vercel
vercel login
vercel
```

---

## Step 3: Set Environment Variables

In Vercel Dashboard:
1. Go to your project → **"Settings"** → **"Environment Variables"**
2. Add these variables:

| Name | Value |
|------|-------|
| MONGO_URL | mongodb+srv://username:password@cluster.mongodb.net/... |
| DB_NAME | skillcircuit |
| JWT_SECRET | your-secure-secret-key-change-this |
| STRIPE_API_KEY | sk_test_your_stripe_key |

3. Click **"Save"**
4. Go to **"Deployments"** → Click **"Redeploy"**

---

## Step 4: Get Your API URL

After deployment, your backend URL will be:
```
https://your-project-name.vercel.app
```

---

## Step 5: Seed the Database

Visit this URL in your browser:
```
https://your-project-name.vercel.app/api/seed
```

This creates:
- Admin account (admin@skillcircuit.com / Chh@jer)
- Sample courses

---

## Step 6: Deploy Frontend

For the frontend, you can also use Vercel:

1. Create another Vercel project for the frontend
2. Set **Root Directory** to: `frontend`
3. Add environment variable:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-project.vercel.app
   ```
4. Deploy

---

## Project Structure for Vercel

```
backend/
├── api/
│   └── index.py      # Main FastAPI app (Vercel entry point)
├── requirements.txt  # Python dependencies
└── vercel.json       # Vercel configuration
```

---

## Troubleshooting

### "Function crashed" or Import Errors
- Make sure all imports are at the top of the file
- Check that all packages are in requirements.txt
- View logs in Vercel Dashboard → "Functions" tab

### "CORS errors"
- The API already has CORS enabled for all origins
- Make sure you're using the correct backend URL

### "Database connection failed"
- Check MONGO_URL is correctly set in Environment Variables
- Make sure MongoDB Atlas allows access from 0.0.0.0/0
- Check username/password in connection string

### "Login not working"
- Did you seed the database? Visit /api/seed
- Check browser console for errors

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/seed | GET | Initialize database |
| /api/auth/login | POST | User login |
| /api/auth/register | POST | User registration |
| /api/auth/me | GET | Get current user |
| /api/courses | GET | Get all courses |
| /api/courses/{id} | GET | Get course details |
| /api/enrollments | GET | Get user enrollments |
| /api/contact | POST | Submit contact form |

---

## Admin Credentials

After seeding:
- **Email:** admin@skillcircuit.com
- **Password:** Chh@jer

---

## Costs

Vercel Serverless Functions:
- **Free Tier:** 100 GB-hours/month (plenty for small apps)
- Functions timeout: 10 seconds (free) / 60 seconds (pro)

MongoDB Atlas:
- **Free Tier:** 512 MB storage (enough for thousands of users)
