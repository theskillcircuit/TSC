# The Skill Circuit

Modern EdTech platform with inline CMS, course management, and payments.

## Quick Start

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for complete deployment instructions.

## Tech Stack

- **Backend:** FastAPI (Python)
- **Frontend:** React
- **Database:** MongoDB
- **Payments:** Stripe

## Features

- ✅ User Authentication (Email + Google OAuth)
- ✅ Course Catalog with Categories (Nano, Sprint, Pathway, Launchpad)
- ✅ Inline CMS - Edit any content by hovering (Admin only)
- ✅ Stripe Payment Integration
- ✅ Student Dashboard
- ✅ Admin Dashboard

## Project Structure

```
├── backend/          # FastAPI Python backend
│   ├── server.py     # Main API server
│   ├── requirements.txt
│   └── Procfile      # Railway deployment
│
├── frontend/         # React frontend
│   ├── src/
│   │   ├── pages/    # Page components
│   │   └── components/
│   └── package.json
│
└── DEPLOYMENT_GUIDE.md  # Deployment instructions
```

## Default Credentials

After running `/api/seed`:
- **Admin:** admin@skillcircuit.com / admin123

## Environment Variables

### Backend (.env)
```
MONGO_URL=your_mongodb_connection_string
DB_NAME=skillcircuit
JWT_SECRET=your_secret_key
STRIPE_API_KEY=your_stripe_key
RESEND_API_KEY=your_resend_key
CORS_ORIGINS=*
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://your-backend-url.com
```
