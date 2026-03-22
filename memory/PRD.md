# The Skill Circuit - Product Requirements Document

## Original Problem Statement
Build a modern, scalable EdTech platform with:
- A public marketing website
- A full-featured CMS
- A role-based LMS
- An admin board with complete control (no developer dependency)

## Brand Identity
- **Name:** The Skill Circuit
- **Colors:** Primary Accent: `#f16a2f`, Primary Base: `#053d6c`, Neutral: `#ffffff`

## Site Structure
- Home, About Us, Courses, Contact Us
- Login/Sign Up (with Google OAuth)
- Student Dashboard (LMS)
- Admin Dashboard (CMS)

## Course Categories
- **Nano:** 4-6 hours, quick skill exposure
- **Sprint:** 10-15 hours, hands-on projects
- **Pathway:** 30-40 hours, portfolio building
- **Launchpad:** 4 months, career transformation (flagship)

---

## What's Been Implemented

### Phase 1: Core Platform ✅
- Full-stack application (FastAPI + React + MongoDB)
- User Authentication (JWT + Google Social Login via Emergent)
- Complete UI/UX with Framer Motion animations
- All primary pages (Home, About, Courses, Contact)
- ScrollToTop component for navigation
- Course categories renamed from "Neo" to "Nano"

### Phase 2: Inline CMS ✅ (Completed Jan 26, 2026)
- **EditableText Component:** Shows pencil icon on hover for admins
- **EditableImage Component:** Allows image URL changes for admins
- **AdminEditBanner:** Visual indicator when in admin edit mode
- **CMS-enabled Pages:**
  - HomePage (hero, stats, testimonials, journey, USPs, benefits, CTA)
  - AboutPage (hero, problem, mission, values, stats, approach)
  - CoursesPage (hero, category descriptions, CTA section)
  - ContactPage (hero, contact info, FAQs)
  - Navbar (brand name, logo initials, nav links)
  - Footer (description, contact info, links, programs, legal)
- **Backend CMS Endpoints:**
  - `GET /api/cms/{page}` - Fetch page content
  - `PUT /api/admin/cms` - Update content (admin only)
- **Database:** Content stored in `cms_content` MongoDB collection

### Phase 3: Payments ✅
- Stripe integration (test mode) for course purchases
- Payment flow with checkout sessions
- Enrollment creation on successful payment

### Phase 4: Integrations Status
- **Stripe:** Integrated (test key)
- **Google Auth:** Integrated via Emergent
- **Resend:** API key configured (`re_2fBAyBQ1_BwpfLVsFNSABXHtpMFApUwWg`)

---

## Technical Architecture

### Backend (FastAPI)
```
/app/backend/
├── server.py          # All API endpoints
├── requirements.txt   # Python dependencies
└── .env              # Environment variables
```

### Frontend (React)
```
/app/frontend/src/
├── App.js                    # Main routes
├── components/
│   ├── EditableContent.js    # CMS components
│   ├── Navbar.js             # Editable navbar
│   ├── Footer.js             # Editable footer
│   └── ScrollToTop.js        # Navigation helper
├── context/
│   └── AuthContext.js        # Auth state management
└── pages/
    ├── HomePage.js           # Full CMS
    ├── AboutPage.js          # Full CMS
    ├── CoursesPage.js        # Full CMS
    ├── ContactPage.js        # Full CMS
    ├── AdminDashboard.js
    └── StudentDashboard.js
```

### Database Schema (MongoDB)
- `users`: {email, password_hash, name, role, google_id, picture}
- `courses`: {title, description, category, price, duration_hours, skills, outcomes}
- `cms_content`: {page, sections: {section_name: {field: value}}}
- `enrollments`: {user_id, course_id, payment_id, status, progress_percent}
- `contacts`: {name, email, phone, message, status}

---

## Test Credentials
- **Admin:** admin@skillcircuit.com / Chh@jer
- **Backend URL:** https://edtech-platform-30.preview.emergentagent.com

---

## Pending Tasks

### P0 - Critical
- [ ] Email integration for contact form (Resend API key ready)
- [ ] Forgot Password flow

### P1 - High Priority
- [ ] Full Admin Course Management (CRUD for courses)
- [ ] Course content uploads (videos, PDFs)
- [ ] Live class scheduling (Zoom/Google Meet)

### P2 - Medium Priority
- [ ] Student Dashboard functionality
- [ ] Progress tracking
- [ ] Certificate generation
- [ ] Stripe live mode integration

### Future/Backlog
- [ ] Analytics dashboard enhancements
- [ ] Student engagement features
- [ ] Mobile app considerations

---

## Known Issues
- Signup form name field test may have selector mismatch (needs verification)

---

## Testing Reports
- `/app/test_reports/iteration_1.json`
- `/app/test_reports/iteration_2.json`
- `/app/test_reports/iteration_3.json` - CMS feature (100% pass rate)

---

*Last Updated: January 26, 2026*
