from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, UploadFile, File
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
import jwt
import bcrypt
import httpx
from datetime import datetime, timezone, timedelta
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'skill-circuit-secret-key-2025')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# Create the main app
app = FastAPI(title="The Skill Circuit API")

# Create routers
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class CourseCreate(BaseModel):
    title: str
    description: str
    category: str  # neo, sprint, pathway, launchpad
    duration_hours: float
    price: float
    image_url: Optional[str] = None
    lms_access: bool = False
    skills: List[str] = []
    outcomes: List[str] = []
    is_published: bool = False

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    duration_hours: Optional[float] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    lms_access: Optional[bool] = None
    skills: Optional[List[str]] = None
    outcomes: Optional[List[str]] = None
    is_published: Optional[bool] = None

class WeekCreate(BaseModel):
    course_id: str
    week_number: int
    title: str
    description: Optional[str] = None

class ModuleCreate(BaseModel):
    week_id: str
    title: str
    module_type: str  # video, pdf, quiz, assignment
    content_url: Optional[str] = None
    duration_minutes: Optional[int] = None
    order: int = 0

class LiveClassCreate(BaseModel):
    course_id: str
    title: str
    description: Optional[str] = None
    scheduled_at: str
    duration_minutes: int = 60
    meeting_url: Optional[str] = None
    platform: str = "zoom"  # zoom, google_meet, custom

class EnrollmentCreate(BaseModel):
    course_id: str

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class CMSContentUpdate(BaseModel):
    page: str
    section: str
    content: Dict[str, Any]

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

def create_jwt_token(user_id: str, email: str, role: str) -> str:
    payload = {
        'sub': user_id,
        'email': email,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(request: Request, credentials = Depends(security)):
    token = None
    
    # Check cookie first
    session_token = request.cookies.get('session_token')
    if session_token:
        session = await db.user_sessions.find_one(
            {"session_token": session_token},
            {"_id": 0}
        )
        if session:
            expires_at = session.get('expires_at')
            if isinstance(expires_at, str):
                expires_at = datetime.fromisoformat(expires_at)
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            if expires_at > datetime.now(timezone.utc):
                user = await db.users.find_one(
                    {"user_id": session['user_id']},
                    {"_id": 0}
                )
                if user:
                    return user
    
    # Check Authorization header
    if credentials:
        token = credentials.credentials
    
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = decode_jwt_token(token)
    user = await db.users.find_one({"user_id": payload['sub']}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

async def get_optional_user(request: Request, credentials = Depends(security)):
    try:
        return await get_current_user(request, credentials)
    except Exception:
        return None

# ========================
# AUTH ENDPOINTS
# ========================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "name": user_data.name,
        "role": user_data.role if user_data.role in ["student", "admin"] else "student",
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    token = create_jwt_token(user_id, user_data.email, user_doc['role'])
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            user_id=user_id,
            email=user_data.email,
            name=user_data.name,
            role=user_doc['role'],
            picture=None,
            created_at=user_doc['created_at']
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.get('password_hash') or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token(user['user_id'], user['email'], user['role'])
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            user_id=user['user_id'],
            email=user['email'],
            name=user['name'],
            role=user['role'],
            picture=user.get('picture'),
            created_at=user['created_at']
        )
    )

# REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
@api_router.post("/auth/session")
async def process_google_session(request: Request, response: Response):
    body = await request.json()
    session_id = body.get('session_id')
    
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    # Get session data from Emergent Auth
    async with httpx.AsyncClient() as client:
        auth_response = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if auth_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        session_data = auth_response.json()
    
    email = session_data.get('email')
    name = session_data.get('name')
    picture = session_data.get('picture')
    session_token = session_data.get('session_token')
    
    # Find or create user
    user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if not user:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "role": "student",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user)
    else:
        user_id = user['user_id']
        # Update user info if needed
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "picture": picture}}
        )
        user['name'] = name
        user['picture'] = picture
    
    # Store session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "user_id": user_id,
                "session_token": session_token,
                "expires_at": expires_at.isoformat(),
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        },
        upsert=True
    )
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    return {
        "user_id": user['user_id'],
        "email": user['email'],
        "name": user['name'],
        "role": user['role'],
        "picture": user.get('picture'),
        "created_at": user['created_at']
    }

@api_router.get("/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {
        "user_id": current_user['user_id'],
        "email": current_user['email'],
        "name": current_user['name'],
        "role": current_user['role'],
        "picture": current_user.get('picture'),
        "created_at": current_user['created_at']
    }

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get('session_token')
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

# ========================
# COURSES ENDPOINTS
# ========================

@api_router.get("/courses")
async def get_courses(category: Optional[str] = None, published_only: bool = True):
    query = {}
    if category:
        query["category"] = category
    if published_only:
        query["is_published"] = True
    
    courses = await db.courses.find(query, {"_id": 0}).to_list(100)
    return courses

@api_router.get("/courses/{course_id}")
async def get_course(course_id: str):
    course = await db.courses.find_one({"course_id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Get weeks and modules
    weeks = await db.weeks.find({"course_id": course_id}, {"_id": 0}).sort("week_number", 1).to_list(50)
    for week in weeks:
        modules = await db.modules.find({"week_id": week['week_id']}, {"_id": 0}).sort("order", 1).to_list(50)
        week['modules'] = modules
    
    course['weeks'] = weeks
    return course

@api_router.post("/admin/courses")
async def create_course(course: CourseCreate, admin: dict = Depends(get_admin_user)):
    course_id = f"course_{uuid.uuid4().hex[:12]}"
    course_doc = {
        "course_id": course_id,
        **course.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by": admin['user_id']
    }
    
    await db.courses.insert_one(course_doc)
    course_doc.pop('_id', None)
    return course_doc

@api_router.put("/admin/courses/{course_id}")
async def update_course(course_id: str, course: CourseUpdate, admin: dict = Depends(get_admin_user)):
    update_data = {k: v for k, v in course.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.courses.update_one(
        {"course_id": course_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return await db.courses.find_one({"course_id": course_id}, {"_id": 0})

@api_router.delete("/admin/courses/{course_id}")
async def delete_course(course_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.courses.delete_one({"course_id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Also delete related weeks and modules
    weeks = await db.weeks.find({"course_id": course_id}).to_list(100)
    for week in weeks:
        await db.modules.delete_many({"week_id": week['week_id']})
    await db.weeks.delete_many({"course_id": course_id})
    
    return {"message": "Course deleted successfully"}

# ========================
# WEEKS & MODULES ENDPOINTS
# ========================

@api_router.post("/admin/weeks")
async def create_week(week: WeekCreate, admin: dict = Depends(get_admin_user)):
    week_id = f"week_{uuid.uuid4().hex[:12]}"
    week_doc = {
        "week_id": week_id,
        **week.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.weeks.insert_one(week_doc)
    week_doc.pop('_id', None)
    return week_doc

@api_router.put("/admin/weeks/{week_id}")
async def update_week(week_id: str, week: WeekCreate, admin: dict = Depends(get_admin_user)):
    update_data = week.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.weeks.update_one(
        {"week_id": week_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Week not found")
    
    return await db.weeks.find_one({"week_id": week_id}, {"_id": 0})

@api_router.delete("/admin/weeks/{week_id}")
async def delete_week(week_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.weeks.delete_one({"week_id": week_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Week not found")
    
    await db.modules.delete_many({"week_id": week_id})
    return {"message": "Week deleted successfully"}

@api_router.post("/admin/modules")
async def create_module(module: ModuleCreate, admin: dict = Depends(get_admin_user)):
    module_id = f"module_{uuid.uuid4().hex[:12]}"
    module_doc = {
        "module_id": module_id,
        **module.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.modules.insert_one(module_doc)
    module_doc.pop('_id', None)
    return module_doc

@api_router.put("/admin/modules/{module_id}")
async def update_module(module_id: str, module: ModuleCreate, admin: dict = Depends(get_admin_user)):
    update_data = module.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.modules.update_one(
        {"module_id": module_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Module not found")
    
    return await db.modules.find_one({"module_id": module_id}, {"_id": 0})

@api_router.delete("/admin/modules/{module_id}")
async def delete_module(module_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.modules.delete_one({"module_id": module_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Module not found")
    return {"message": "Module deleted successfully"}

# ========================
# LIVE CLASSES ENDPOINTS
# ========================

@api_router.get("/live-classes")
async def get_live_classes(course_id: Optional[str] = None):
    query = {}
    if course_id:
        query["course_id"] = course_id
    
    classes = await db.live_classes.find(query, {"_id": 0}).sort("scheduled_at", 1).to_list(100)
    return classes

@api_router.post("/admin/live-classes")
async def create_live_class(live_class: LiveClassCreate, admin: dict = Depends(get_admin_user)):
    class_id = f"class_{uuid.uuid4().hex[:12]}"
    class_doc = {
        "class_id": class_id,
        **live_class.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by": admin['user_id']
    }
    
    await db.live_classes.insert_one(class_doc)
    class_doc.pop('_id', None)
    return class_doc

@api_router.put("/admin/live-classes/{class_id}")
async def update_live_class(class_id: str, live_class: LiveClassCreate, admin: dict = Depends(get_admin_user)):
    update_data = live_class.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.live_classes.update_one(
        {"class_id": class_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Live class not found")
    
    return await db.live_classes.find_one({"class_id": class_id}, {"_id": 0})

@api_router.delete("/admin/live-classes/{class_id}")
async def delete_live_class(class_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.live_classes.delete_one({"class_id": class_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Live class not found")
    return {"message": "Live class deleted successfully"}

# ========================
# ENROLLMENTS ENDPOINTS
# ========================

@api_router.get("/enrollments")
async def get_user_enrollments(current_user: dict = Depends(get_current_user)):
    enrollments = await db.enrollments.find(
        {"user_id": current_user['user_id']},
        {"_id": 0}
    ).to_list(100)
    
    # Enrich with course data
    for enrollment in enrollments:
        course = await db.courses.find_one(
            {"course_id": enrollment['course_id']},
            {"_id": 0}
        )
        enrollment['course'] = course
    
    return enrollments

@api_router.get("/enrollments/{course_id}/progress")
async def get_enrollment_progress(course_id: str, current_user: dict = Depends(get_current_user)):
    enrollment = await db.enrollments.find_one(
        {"user_id": current_user['user_id'], "course_id": course_id},
        {"_id": 0}
    )
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    # Get progress data
    progress = await db.progress.find(
        {"enrollment_id": enrollment['enrollment_id']},
        {"_id": 0}
    ).to_list(500)
    
    return {
        "enrollment": enrollment,
        "progress": progress
    }

@api_router.post("/enrollments/{course_id}/progress/{module_id}")
async def update_module_progress(
    course_id: str,
    module_id: str,
    current_user: dict = Depends(get_current_user)
):
    enrollment = await db.enrollments.find_one(
        {"user_id": current_user['user_id'], "course_id": course_id},
        {"_id": 0}
    )
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    await db.progress.update_one(
        {"enrollment_id": enrollment['enrollment_id'], "module_id": module_id},
        {
            "$set": {
                "enrollment_id": enrollment['enrollment_id'],
                "module_id": module_id,
                "completed": True,
                "completed_at": datetime.now(timezone.utc).isoformat()
            }
        },
        upsert=True
    )
    
    # Update enrollment progress percentage
    weeks = await db.weeks.find({"course_id": course_id}).to_list(100)
    total_modules = 0
    for week in weeks:
        modules = await db.modules.find({"week_id": week['week_id']}).to_list(100)
        total_modules += len(modules)
    
    completed = await db.progress.count_documents({
        "enrollment_id": enrollment['enrollment_id'],
        "completed": True
    })
    
    progress_percent = (completed / total_modules * 100) if total_modules > 0 else 0
    
    await db.enrollments.update_one(
        {"enrollment_id": enrollment['enrollment_id']},
        {"$set": {"progress_percent": progress_percent}}
    )
    
    return {"message": "Progress updated", "progress_percent": progress_percent}

# ========================
# PAYMENT ENDPOINTS (Stripe)
# ========================

@api_router.post("/payments/checkout")
async def create_checkout(checkout: CheckoutRequest, current_user: dict = Depends(get_current_user)):
    import stripe
    
    course = await db.courses.find_one({"course_id": checkout.course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if already enrolled
    existing = await db.enrollments.find_one({
        "user_id": current_user['user_id'],
        "course_id": checkout.course_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    
    stripe.api_key = os.environ.get('STRIPE_API_KEY')
    
    success_url = f"{checkout.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{checkout.origin_url}/courses/{checkout.course_id}"
    
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
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": current_user['user_id'],
            "course_id": checkout.course_id,
            "course_title": course['title']
        }
    )
    
    # Create payment transaction record
    transaction_id = f"txn_{uuid.uuid4().hex[:12]}"
    await db.payment_transactions.insert_one({
        "transaction_id": transaction_id,
        "session_id": session.id,
        "user_id": current_user['user_id'],
        "course_id": checkout.course_id,
        "amount": float(course['price']),
        "currency": "usd",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {"url": session.url, "session_id": session.id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, current_user: dict = Depends(get_current_user)):
    import stripe
    stripe.api_key = os.environ.get('STRIPE_API_KEY')
    
    session = stripe.checkout.Session.retrieve(session_id)
    
    # Update transaction and create enrollment if paid
    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    
    if transaction and session.payment_status == "paid" and transaction.get('payment_status') != 'paid':
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "payment_status": "paid",
                "paid_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        # Create enrollment
        enrollment_id = f"enroll_{uuid.uuid4().hex[:12]}"
        await db.enrollments.insert_one({
            "enrollment_id": enrollment_id,
            "user_id": transaction['user_id'],
            "course_id": transaction['course_id'],
            "payment_id": transaction['transaction_id'],
            "status": "active",
            "progress_percent": 0,
            "enrolled_at": datetime.now(timezone.utc).isoformat()
        })
    
    return {
        "status": session.status,
        "payment_status": session.payment_status,
        "amount_total": session.amount_total,
        "currency": session.currency
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    import stripe
    stripe.api_key = os.environ.get('STRIPE_API_KEY')
    
    body = await request.body()
    
    try:
        event = stripe.Event.construct_from(
            stripe.util.json.loads(body), stripe.api_key
        )
        
        if event.type == 'checkout.session.completed':
            session = event.data.object
            session_id = session.id
            
            if session.payment_status == "paid":
                transaction = await db.payment_transactions.find_one({"session_id": session_id})
                
                if transaction and transaction.get('payment_status') != 'paid':
                    await db.payment_transactions.update_one(
                        {"session_id": session_id},
                        {"$set": {
                            "payment_status": "paid",
                            "paid_at": datetime.now(timezone.utc).isoformat()
                        }}
                    )
                    
                    # Create enrollment if not exists
                    existing = await db.enrollments.find_one({
                        "user_id": transaction['user_id'],
                        "course_id": transaction['course_id']
                    })
                    
                    if not existing:
                        enrollment_id = f"enroll_{uuid.uuid4().hex[:12]}"
                        await db.enrollments.insert_one({
                            "enrollment_id": enrollment_id,
                            "user_id": transaction['user_id'],
                            "course_id": transaction['course_id'],
                            "payment_id": transaction['transaction_id'],
                            "status": "active",
                            "progress_percent": 0,
                            "enrolled_at": datetime.now(timezone.utc).isoformat()
                        })
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}

# ========================
# CONTACT ENDPOINTS
# ========================

@api_router.post("/contact")
async def submit_contact(contact: ContactCreate):
    contact_id = f"contact_{uuid.uuid4().hex[:12]}"
    contact_doc = {
        "contact_id": contact_id,
        **contact.model_dump(),
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.contacts.insert_one(contact_doc)
    return {"message": "Thank you for contacting us! We'll get back to you soon."}

@api_router.get("/admin/contacts")
async def get_contacts(admin: dict = Depends(get_admin_user)):
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return contacts

# ========================
# CMS ENDPOINTS
# ========================

@api_router.get("/cms/{page}")
async def get_cms_content(page: str):
    content = await db.cms_content.find_one({"page": page}, {"_id": 0})
    return content or {"page": page, "sections": {}}

@api_router.put("/admin/cms")
async def update_cms_content(cms: CMSContentUpdate, admin: dict = Depends(get_admin_user)):
    await db.cms_content.update_one(
        {"page": cms.page},
        {
            "$set": {
                f"sections.{cms.section}": cms.content,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": admin['user_id']
            }
        },
        upsert=True
    )
    
    return await db.cms_content.find_one({"page": cms.page}, {"_id": 0})

# ========================
# ADMIN ANALYTICS ENDPOINTS
# ========================

@api_router.get("/admin/analytics")
async def get_analytics(admin: dict = Depends(get_admin_user)):
    total_users = await db.users.count_documents({})
    total_students = await db.users.count_documents({"role": "student"})
    total_courses = await db.courses.count_documents({})
    total_enrollments = await db.enrollments.count_documents({})
    
    # Revenue calculation
    paid_transactions = await db.payment_transactions.find(
        {"payment_status": "paid"},
        {"_id": 0, "amount": 1}
    ).to_list(1000)
    total_revenue = sum(t.get('amount', 0) for t in paid_transactions)
    
    # Category breakdown
    category_counts = {}
    for cat in ['neo', 'sprint', 'pathway', 'launchpad']:
        category_counts[cat] = await db.courses.count_documents({"category": cat})
    
    # Recent enrollments
    recent_enrollments = await db.enrollments.find(
        {},
        {"_id": 0}
    ).sort("enrolled_at", -1).limit(10).to_list(10)
    
    for enrollment in recent_enrollments:
        user = await db.users.find_one({"user_id": enrollment['user_id']}, {"_id": 0, "name": 1, "email": 1})
        course = await db.courses.find_one({"course_id": enrollment['course_id']}, {"_id": 0, "title": 1})
        enrollment['user'] = user
        enrollment['course'] = course
    
    return {
        "total_users": total_users,
        "total_students": total_students,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments,
        "total_revenue": total_revenue,
        "category_counts": category_counts,
        "recent_enrollments": recent_enrollments
    }

@api_router.get("/admin/students")
async def get_students(admin: dict = Depends(get_admin_user)):
    students = await db.users.find(
        {"role": "student"},
        {"_id": 0, "password_hash": 0}
    ).to_list(500)
    
    for student in students:
        enrollments = await db.enrollments.find(
            {"user_id": student['user_id']},
            {"_id": 0}
        ).to_list(50)
        student['enrollments'] = enrollments
    
    return students

@api_router.post("/admin/students/{user_id}/upgrade")
async def upgrade_student_enrollment(
    user_id: str,
    body: dict,
    admin: dict = Depends(get_admin_user)
):
    from_course_id = body.get('from_course_id')
    to_course_id = body.get('to_course_id')
    
    # Verify both courses exist
    from_course = await db.courses.find_one({"course_id": from_course_id})
    to_course = await db.courses.find_one({"course_id": to_course_id})
    
    if not from_course or not to_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Update enrollment
    result = await db.enrollments.update_one(
        {"user_id": user_id, "course_id": from_course_id},
        {"$set": {
            "course_id": to_course_id,
            "upgraded_at": datetime.now(timezone.utc).isoformat(),
            "upgraded_by": admin['user_id']
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    return {"message": "Student upgraded successfully"}

# ========================
# CERTIFICATES ENDPOINTS
# ========================

@api_router.get("/certificates")
async def get_user_certificates(current_user: dict = Depends(get_current_user)):
    certificates = await db.certificates.find(
        {"user_id": current_user['user_id']},
        {"_id": 0}
    ).to_list(50)
    
    for cert in certificates:
        course = await db.courses.find_one({"course_id": cert['course_id']}, {"_id": 0, "title": 1})
        cert['course'] = course
    
    return certificates

@api_router.post("/admin/certificates")
async def issue_certificate(body: dict, admin: dict = Depends(get_admin_user)):
    user_id = body.get('user_id')
    course_id = body.get('course_id')
    
    cert_id = f"cert_{uuid.uuid4().hex[:12]}"
    cert_doc = {
        "certificate_id": cert_id,
        "user_id": user_id,
        "course_id": course_id,
        "issued_at": datetime.now(timezone.utc).isoformat(),
        "issued_by": admin['user_id']
    }
    
    await db.certificates.insert_one(cert_doc)
    cert_doc.pop('_id', None)
    return cert_doc

# ========================
# SEED DATA ENDPOINT
# ========================

@api_router.post("/seed")
async def seed_database():
    """Seed the database with sample courses"""
    
    # Check if courses already exist
    existing = await db.courses.count_documents({})
    if existing > 0:
        return {"message": "Database already seeded", "course_count": existing}
    
    courses = [
        # Nano Courses (4-6 hours, no LMS)
        {
            "course_id": f"course_{uuid.uuid4().hex[:12]}",
            "title": "Python Fundamentals",
            "description": "Quick introduction to Python programming basics. Perfect for absolute beginners looking to start their coding journey.",
            "category": "nano",
            "duration_hours": 5,
            "price": 29.00,
            "image_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
            "lms_access": False,
            "skills": ["Python Basics", "Variables", "Loops", "Functions"],
            "outcomes": ["Write basic Python programs", "Understand programming logic"],
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "course_id": f"course_{uuid.uuid4().hex[:12]}",
            "title": "Excel for Business",
            "description": "Master essential Excel skills for business analysis and reporting.",
            "category": "nano",
            "duration_hours": 4,
            "price": 19.00,
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
            "lms_access": False,
            "skills": ["Formulas", "Pivot Tables", "Charts", "Data Analysis"],
            "outcomes": ["Create professional spreadsheets", "Analyze business data"],
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "course_id": f"course_{uuid.uuid4().hex[:12]}",
            "title": "Communication Skills",
            "description": "Develop professional communication skills for workplace success.",
            "category": "nano",
            "duration_hours": 6,
            "price": 25.00,
            "image_url": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
            "lms_access": False,
            "skills": ["Presentation", "Email Writing", "Active Listening"],
            "outcomes": ["Communicate effectively", "Present with confidence"],
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # Sprint Courses (10-15 hours, with LMS)
        {
            "course_id": f"course_{uuid.uuid4().hex[:12]}",
            "title": "Web Development Bootcamp",
            "description": "Intensive 2-day bootcamp covering HTML, CSS, and JavaScript fundamentals with hands-on projects.",
            "category": "sprint",
            "duration_hours": 15,
            "price": 99.00,
            "image_url": "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800",
            "lms_access": True,
            "skills": ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
            "outcomes": ["Build responsive websites", "Deploy to production"],
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "course_id": f"course_{uuid.uuid4().hex[:12]}",
            "title": "Data Analytics with SQL",
            "description": "Learn to query databases and derive insights from data using SQL.",
            "category": "sprint",
            "duration_hours": 12,
            "price": 79.00,
            "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            "lms_access": True,
            "skills": ["SQL Queries", "Joins", "Aggregations", "Data Modeling"],
            "outcomes": ["Write complex SQL queries", "Analyze large datasets"],
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # Pathway Courses (30-40 hours, portfolio-driven)
        {
            "course_id": f"course_{uuid.uuid4().hex[:12]}",
            "title": "Full Stack Development",
            "description": "Comprehensive program covering frontend and backend development with portfolio projects.",
            "category": "pathway",
            "duration_hours": 40,
            "price": 299.00,
            "image_url": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
            "lms_access": True,
            "skills": ["React", "Node.js", "MongoDB", "REST APIs", "Git"],
            "outcomes": ["Build full-stack applications", "Create professional portfolio"],
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "course_id": f"course_{uuid.uuid4().hex[:12]}",
            "title": "Digital Marketing Mastery",
            "description": "Master digital marketing strategies including SEO, SEM, and social media marketing.",
            "category": "pathway",
            "duration_hours": 35,
            "price": 249.00,
            "image_url": "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800",
            "lms_access": True,
            "skills": ["SEO", "Google Ads", "Social Media", "Analytics", "Content Strategy"],
            "outcomes": ["Run marketing campaigns", "Optimize for conversions"],
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # Launchpad Courses (4 months, flagship)
        {
            "course_id": f"course_{uuid.uuid4().hex[:12]}",
            "title": "Software Engineering Career Launchpad",
            "description": "4-month intensive program with guaranteed interview opportunities. Includes internship placement, behavioral transformation coaching, and career support.",
            "category": "launchpad",
            "duration_hours": 480,
            "price": 2999.00,
            "image_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
            "lms_access": True,
            "skills": ["Full Stack Development", "System Design", "DSA", "Interview Prep", "Soft Skills"],
            "outcomes": ["Guaranteed interviews at top companies", "Internship placement", "Career mentorship"],
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "course_id": f"course_{uuid.uuid4().hex[:12]}",
            "title": "Product Management Career Launchpad",
            "description": "Transform into a product manager with our comprehensive 4-month program. Industry mentors, real projects, and guaranteed interviews.",
            "category": "launchpad",
            "duration_hours": 400,
            "price": 2499.00,
            "image_url": "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800",
            "lms_access": True,
            "skills": ["Product Strategy", "User Research", "Analytics", "Agile", "Leadership"],
            "outcomes": ["Transition to PM role", "Build product portfolio", "Interview at top firms"],
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.courses.insert_many(courses)
    
    # Create admin user
    admin_exists = await db.users.find_one({"email": "admin@skillcircuit.com"})
    if not admin_exists:
        admin_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": admin_id,
            "email": "admin@skillcircuit.com",
            "password_hash": hash_password("admin123"),
            "name": "Admin User",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    
    # Seed CMS content
    await db.cms_content.update_one(
        {"page": "home"},
        {"$set": {
            "page": "home",
            "sections": {
                "hero": {
                    "title": "Master the Circuit of Success",
                    "subtitle": "Transform your career with industry-ready skills, behavioral excellence, and guaranteed outcomes.",
                    "cta_primary": "Explore Courses",
                    "cta_secondary": "Learn More"
                },
                "stats": {
                    "placements": "500+",
                    "companies": "100+",
                    "rating": "4.9"
                }
            }
        }},
        upsert=True
    )
    
    await db.cms_content.update_one(
        {"page": "about"},
        {"$set": {
            "page": "about",
            "sections": {
                "hero": {
                    "title": "Redefining Employability",
                    "subtitle": "We believe skills alone aren't enough. True career success comes from combining technical expertise with behavioral transformation."
                },
                "mission": {
                    "text": "To embed behavioral change and industry co-creation at the core of graduate transformation — shaping professionals, strengthening education, and serving industry with talent that delivers and endures."
                }
            }
        }},
        upsert=True
    )
    
    return {"message": "Database seeded successfully", "course_count": len(courses)}

# Include the router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
