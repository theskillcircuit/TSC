# Local Development Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org)
2. **Python** (v3.9 or higher) - [Download](https://python.org)
3. **MongoDB** - Either:
   - Local installation: [Download](https://www.mongodb.com/try/download/community)
   - OR MongoDB Atlas (free cloud): [Sign up](https://www.mongodb.com/atlas)

---

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
```

Create `backend/.env` with:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=skillcircuit
JWT_SECRET=skill-circuit-secret-key-2025
STRIPE_API_KEY=sk_test_your_stripe_key
RESEND_API_KEY=your_resend_key
CORS_ORIGINS=http://localhost:3000
```

**For MongoDB Atlas (Cloud):**
Replace MONGO_URL with your Atlas connection string:
```
MONGO_URL=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Start the backend:
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 2. Seed the Database (IMPORTANT!)

Open your browser and visit:
```
http://localhost:8001/api/seed
```

This creates:
- ✅ Admin account
- ✅ Sample courses
- ✅ Initial data

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
```

Create `frontend/.env` with:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

Start the frontend:
```bash
npm start
```

---

## Login Credentials

After seeding the database:

**Admin Account:**
- Email: `admin@skillcircuit.com`
- Password: `Chh@jer`

**Test Student Account:**
- Email: `student@test.com`
- Password: `student123`

---

## Common Issues

### "Cannot connect to MongoDB"
- Make sure MongoDB is running
- Check MONGO_URL in backend/.env
- For local: `mongodb://localhost:27017`
- For Atlas: Use your connection string with correct username/password

### "Login not working"
- Did you seed the database? Visit `http://localhost:8001/api/seed`
- Check browser console for errors
- Make sure CORS_ORIGINS includes your frontend URL

### "CORS errors"
- Set `CORS_ORIGINS=http://localhost:3000` in backend/.env
- Restart the backend after changing .env

### "API calls failing"
- Check `REACT_APP_BACKEND_URL` in frontend/.env
- Make sure backend is running on port 8001
- Restart frontend after changing .env

---

## Project Structure

```
/
├── backend/
│   ├── server.py          # Main FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables (create this)
│
├── frontend/
│   ├── src/              # React source code
│   ├── public/           # Static files
│   ├── package.json      # Node dependencies
│   └── .env             # Environment variables (create this)
│
├── railway.readinstructions.md    # Railway deployment guide
├── firebase.readinstructions.md   # Firebase deployment guide
└── LOCAL_SETUP.md                 # This file
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/seed` | GET | Initialize database with sample data |
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/courses` | GET | Get all courses |
| `/api/courses/{id}` | GET | Get course details |

---

## Need Help?

1. Check the browser console (F12) for errors
2. Check the backend terminal for error logs
3. Verify all .env files are correctly set up
4. Make sure MongoDB is running and accessible
