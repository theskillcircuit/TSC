from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from fastapi.security import HTTPBearer
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient
import os
import jwt
import bcrypt
import uuid

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'skillcircuit')
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'skill-circuit-secret-key-2025')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# Create the main app
app = FastAPI(title="The Skill Circuit API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer(auto_error=False)

# ========================
# PYDANTIC MODELS
# ========================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    user_id: str
    email: str
    name: str
    role: str
    picture: Optional[str] = None

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class CheckoutRequest(BaseModel):
    course_id: str
    origin_url: str

# ========================
# AUTH HELPERS
# ========================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request, credentials = Depends(security)):
    token = None
    if credentials:
        token = credentials.credentials
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = db.users.find_one({"user_id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# ========================
# AUTH ENDPOINTS
# ========================

@app.post("/api/auth/register")
async def register(user: UserCreate):
    existing = db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    user_doc = {
        "user_id": user_id,
        "email": user.email,
        "password_hash": hash_password(user.password),
        "name": user.name,
        "role": user.role,
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    db.users.insert_one(user_doc)
    
    token = create_token(user_id, user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"user_id": user_id, "email": user.email, "name": user.name, "role": user.role, "picture": None}
    }

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    user = db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["user_id"], user["role"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "user_id": user["user_id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "picture": user.get("picture")
        }
    }

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@app.post("/api/auth/logout")
async def logout():
    return {"message": "Logged out successfully"}

# ========================
# COURSES ENDPOINTS
# ========================

@app.get("/api/courses")
async def get_courses(category: Optional[str] = None, published_only: bool = True):
    query = {}
    if category:
        query["category"] = category
    if published_only:
        query["is_published"] = True
    
    courses = list(db.courses.find(query, {"_id": 0}))
    return courses

@app.get("/api/courses/{course_id}")
async def get_course(course_id: str):
    course = db.courses.find_one({"course_id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Get weeks/modules if any
    weeks = list(db.weeks.find({"course_id": course_id}, {"_id": 0}).sort("week_number", 1))
    course["weeks"] = weeks
    return course

# ========================
# ENROLLMENTS ENDPOINTS
# ========================

@app.get("/api/enrollments")
async def get_enrollments(current_user: dict = Depends(get_current_user)):
    enrollments = list(db.enrollments.find({"user_id": current_user["user_id"]}, {"_id": 0}))
    
    for enrollment in enrollments:
        course = db.courses.find_one({"course_id": enrollment["course_id"]}, {"_id": 0})
        enrollment["course"] = course
    
    return enrollments

@app.get("/api/enrollments/{course_id}/check")
async def check_enrollment(course_id: str, current_user: dict = Depends(get_current_user)):
    enrollment = db.enrollments.find_one({
        "user_id": current_user["user_id"],
        "course_id": course_id
    }, {"_id": 0})
    return {"enrolled": enrollment is not None, "enrollment": enrollment}

# ========================
# LIVE CLASSES ENDPOINTS
# ========================

@app.get("/api/live-classes")
async def get_live_classes():
    classes = list(db.live_classes.find({}, {"_id": 0}))
    return classes

@app.get("/api/certificates")
async def get_certificates(current_user: dict = Depends(get_current_user)):
    certs = list(db.certificates.find({"user_id": current_user["user_id"]}, {"_id": 0}))
    return certs

# ========================
# CMS ENDPOINTS
# ========================

@app.get("/api/cms/{page}")
async def get_cms_content(page: str):
    content = db.cms_content.find_one({"page": page}, {"_id": 0})
    if not content:
        return {"page": page, "sections": {}}
    return content

@app.put("/api/admin/cms")
async def update_cms_content(data: dict, current_user: dict = Depends(get_admin_user)):
    page = data.get("page")
    section = data.get("section")
    content = data.get("content", {})
    
    existing = db.cms_content.find_one({"page": page})
    
    if existing:
        db.cms_content.update_one(
            {"page": page},
            {"$set": {
                f"sections.{section}": content,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": current_user["user_id"]
            }}
        )
    else:
        db.cms_content.insert_one({
            "page": page,
            "sections": {section: content},
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_by": current_user["user_id"]
        })
    
    return {"success": True, "message": "Content updated"}

# ========================
# CONTACT ENDPOINTS
# ========================

@app.post("/api/contact")
async def submit_contact(contact: ContactCreate):
    contact_id = f"contact_{uuid.uuid4().hex[:12]}"
    contact_doc = {
        "contact_id": contact_id,
        "name": contact.name,
        "email": contact.email,
        "phone": contact.phone,
        "message": contact.message,
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    db.contacts.insert_one(contact_doc)
    return {"success": True, "message": "Message sent successfully"}

# ========================
# PAYMENTS ENDPOINTS
# ========================

@app.post("/api/payments/checkout")
async def create_checkout(checkout: CheckoutRequest, current_user: dict = Depends(get_current_user)):
    import stripe
    
    course = db.courses.find_one({"course_id": checkout.course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    existing = db.enrollments.find_one({
        "user_id": current_user['user_id'],
        "course_id": checkout.course_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled")
    
    stripe.api_key = os.environ.get('STRIPE_API_KEY')
    
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': course['title'],
                    'description': course.get('description', '')[:500],
                },
                'unit_amount': int(float(course['price']) * 100),
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=f"{checkout.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{checkout.origin_url}/courses/{checkout.course_id}",
        metadata={
            "user_id": current_user['user_id'],
            "course_id": checkout.course_id
        }
    )
    
    return {"url": session.url, "session_id": session.id}

@app.get("/api/payments/status/{session_id}")
async def get_payment_status(session_id: str, current_user: dict = Depends(get_current_user)):
    import stripe
    stripe.api_key = os.environ.get('STRIPE_API_KEY')
    
    session = stripe.checkout.Session.retrieve(session_id)
    
    if session.payment_status == "paid":
        # Create enrollment if not exists
        existing = db.enrollments.find_one({
            "user_id": current_user['user_id'],
            "course_id": session.metadata.get('course_id')
        })
        
        if not existing:
            enrollment_id = f"enroll_{uuid.uuid4().hex[:12]}"
            db.enrollments.insert_one({
                "enrollment_id": enrollment_id,
                "user_id": current_user['user_id'],
                "course_id": session.metadata.get('course_id'),
                "status": "active",
                "progress_percent": 0,
                "enrolled_at": datetime.now(timezone.utc).isoformat()
            })
    
    return {
        "status": session.status,
        "payment_status": session.payment_status
    }

# ========================
# ADMIN ENDPOINTS
# ========================

@app.get("/api/admin/analytics")
async def get_analytics(current_user: dict = Depends(get_admin_user)):
    return {
        "total_students": db.users.count_documents({"role": "student"}),
        "total_courses": db.courses.count_documents({}),
        "total_enrollments": db.enrollments.count_documents({}),
        "total_revenue": 0,
        "recent_enrollments": []
    }

@app.get("/api/admin/students")
async def get_students(current_user: dict = Depends(get_admin_user)):
    students = list(db.users.find({"role": "student"}, {"_id": 0, "password_hash": 0}))
    return students

@app.get("/api/admin/contacts")
async def get_contacts(current_user: dict = Depends(get_admin_user)):
    contacts = list(db.contacts.find({}, {"_id": 0}).sort("created_at", -1))
    return contacts

# ========================
# SEED ENDPOINT
# ========================

@app.get("/api/seed")
async def seed_database():
    # Check if already seeded
    if db.users.find_one({"email": "admin@skillcircuit.com"}):
        return {"message": "Database already seeded"}
    
    # Create admin user
    admin_id = f"user_{uuid.uuid4().hex[:12]}"
    db.users.insert_one({
        "user_id": admin_id,
        "email": "admin@skillcircuit.com",
        "password_hash": hash_password("Chh@jer"),
        "name": "Admin",
        "role": "admin",
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Create sample courses
    courses = [
        {
            "course_id": f"course_{uuid.uuid4().hex[:8]}",
            "title": "Python for Data Science",
            "description": "Learn Python programming for data analysis and machine learning.",
            "category": "pathway",
            "price": 299,
            "duration_hours": 40,
            "instructor": "Dr. Sarah Johnson",
            "skills": ["Python", "Pandas", "NumPy", "Machine Learning"],
            "outcomes": ["Build data pipelines", "Create ML models", "Analyze datasets"],
            "image_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
            "is_published": True,
            "lms_access": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "course_id": f"course_{uuid.uuid4().hex[:8]}",
            "title": "Full Stack Web Development",
            "description": "Master modern web development with React, Node.js, and databases.",
            "category": "launchpad",
            "price": 999,
            "duration_hours": 200,
            "instructor": "John Smith",
            "skills": ["React", "Node.js", "MongoDB", "REST APIs"],
            "outcomes": ["Build full-stack apps", "Deploy to cloud", "Work in teams"],
            "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
            "is_published": True,
            "lms_access": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "course_id": f"course_{uuid.uuid4().hex[:8]}",
            "title": "UI/UX Design Fundamentals",
            "description": "Learn design principles and create stunning user interfaces.",
            "category": "sprint",
            "price": 149,
            "duration_hours": 15,
            "instructor": "Emily Chen",
            "skills": ["Figma", "Design Systems", "Prototyping", "User Research"],
            "outcomes": ["Create wireframes", "Design mobile apps", "Build portfolios"],
            "image_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
            "is_published": True,
            "lms_access": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "course_id": f"course_{uuid.uuid4().hex[:8]}",
            "title": "Git & GitHub Essentials",
            "description": "Master version control and collaboration with Git.",
            "category": "nano",
            "price": 49,
            "duration_hours": 6,
            "instructor": "Mike Wilson",
            "skills": ["Git", "GitHub", "Version Control", "Collaboration"],
            "outcomes": ["Manage code versions", "Collaborate on projects", "Use branches"],
            "image_url": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800",
            "is_published": True,
            "lms_access": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    db.courses.insert_many(courses)
    
    return {"message": "Database seeded successfully", "admin_email": "admin@skillcircuit.com", "admin_password": "Chh@jer"}

# Root endpoint
@app.get("/")
async def root():
    return {"message": "The Skill Circuit API", "status": "running"}

@app.get("/api")
async def api_root():
    return {"message": "The Skill Circuit API", "status": "running"}
