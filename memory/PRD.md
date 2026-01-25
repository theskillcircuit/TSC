# The Skill Circuit - Product Requirements Document

## Project Overview
**Brand Name:** The Skill Circuit  
**Type:** EdTech Platform (Marketing Website + CMS + LMS + Admin Dashboard)  
**Tech Stack:** React + FastAPI + MongoDB  
**Date Started:** January 25, 2025

## Brand Identity
- **Primary Base:** #053d6c (headers, navigation, trust sections)
- **Primary Accent:** #f16a2f (CTAs, highlights, progress)
- **Neutral:** #ffffff (backgrounds)
- **Typography:** Outfit (headings), Plus Jakarta Sans (body)

## Core USPs
1. **Skill Mastery** - Industry-relevant curriculum in tech, management, business
2. **Behavioral Transformation** - Daily nudges, accountability, mentor guidance
3. **Career Outcomes** - Guaranteed interviews, internships, alumni support

## User Personas
1. **Students** - College graduates seeking employability skills
2. **Career Changers** - Professionals wanting to upskill
3. **Institutions** - Partners for student transformation
4. **Admin** - Platform managers with full CMS control

## What's Been Implemented ✅

### UI Redesign (January 25, 2025)
- [x] Modern hero with animated background blobs, floating cards, image grid
- [x] Partners marquee with company logos (Google, Microsoft, Amazon, etc.)
- [x] Animated stats counter section
- [x] USP cards with gradient icons and hover effects
- [x] Journey section with dark background and step cards
- [x] Featured courses showcase
- [x] Testimonials section with graduate photos and ratings
- [x] Benefits section with floating achievement card
- [x] Bold CTA section with gradient background
- [x] Newsletter signup in footer
- [x] Framer-motion animations throughout
- [x] Enhanced course cards with hover effects
- [x] Pill-shaped category tabs with active states
- [x] Polished navbar with scroll effects
- [x] Enhanced footer with social links

### MVP Features (January 25, 2025)

#### Public Pages
- [x] Home Page - Hero section, USPs, journey visualization, stats, CTA
- [x] About Page - Mission, values, approach, stats
- [x] Courses Page - Category tabs (Neo/Sprint/Pathway/Launchpad), course cards with pricing
- [x] Course Detail Page - Full course info, enrollment CTA, curriculum preview
- [x] Contact Page - Form with validation, FAQ section, quick connect

#### Authentication
- [x] JWT-based email/password authentication
- [x] Emergent-managed Google OAuth integration
- [x] Role-based access (Student, Admin)
- [x] Protected routes

#### Student Dashboard (LMS)
- [x] Enrolled courses list with progress tracking
- [x] Progress bar visualization
- [x] Upcoming live classes widget
- [x] Certificates section
- [x] Upgrade prompts (Sprint → Pathway → Launchpad)

#### Admin Dashboard (CMS)
- [x] Analytics overview (users, courses, enrollments, revenue)
- [x] Course management (CRUD operations)
- [x] Student management
- [x] Live class scheduling (Zoom/Google Meet)
- [x] Contact submissions viewer
- [x] CMS content editing (Home, About pages)

#### Payment Integration
- [x] Stripe checkout integration
- [x] Course enrollment on successful payment
- [x] Payment status tracking
- [x] Transaction records in database

#### Database
- [x] Users collection
- [x] Courses collection (9 seeded courses)
- [x] Enrollments collection
- [x] Live classes collection
- [x] Certificates collection
- [x] Contacts collection
- [x] CMS content collection
- [x] Payment transactions collection

## Course Categories
| Category | Duration | LMS Access | Description |
|----------|----------|------------|-------------|
| Neo | 4-6 hours | No | Entry-level skill exposure |
| Sprint | 10-15 hours | Yes | Hands-on application |
| Pathway | 30-40 hours | Yes | Portfolio-driven learning |
| Launchpad | 4 months | Yes | Career transformation (flagship) |

## API Endpoints
- Authentication: `/api/auth/*`
- Courses: `/api/courses/*`
- Enrollments: `/api/enrollments/*`
- Payments: `/api/payments/*`
- Live Classes: `/api/live-classes/*`
- Admin: `/api/admin/*`
- CMS: `/api/cms/*`
- Contact: `/api/contact`

## Prioritized Backlog

### P0 - Critical (Next Sprint)
- [ ] Course content builder (weeks/modules/videos/PDFs)
- [ ] Video upload functionality with cloud storage
- [ ] Module completion tracking in LMS
- [ ] Certificate generation on course completion

### P1 - High Priority
- [ ] Drag-and-drop content reordering
- [ ] Live class calendar integration
- [ ] Email notifications (enrollment, class reminders)
- [ ] Student progress analytics

### P2 - Medium Priority
- [ ] Quiz/assignment creation
- [ ] Discussion forums
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Referral system

### P3 - Nice to Have
- [ ] AI-powered course recommendations
- [ ] Chatbot for student support
- [ ] Multi-language support
- [ ] Dark mode for dashboards

## Credentials
- **Admin Login:** admin@skillcircuit.com / admin123

## Notes
- All integrations are LIVE (not mocked)
- Stripe test key pre-configured
- Google OAuth via Emergent Auth
- Hot reload enabled for development
