import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/ui/button';
import { EditableText, EditableImage, AdminEditBanner } from '../components/EditableContent';
import { 
  ArrowRight, Zap, Brain, Target, ChevronRight, Star, Users, 
  Briefcase, Play, CheckCircle, Award, Rocket, GraduationCap,
  TrendingUp, Clock, Shield, Heart, Quote, ArrowUpRight
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Counter Component
const Counter = ({ end, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API}/courses`);
        setCourses(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const usps = [
    {
      icon: Zap,
      title: "Skill Mastery",
      description: "Industry-relevant curriculum designed with top companies. Learn what actually matters.",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: Brain,
      title: "Behavioral Excellence",
      description: "Daily nudges, mentor guidance, and habits that make you stand out in any workplace.",
      color: "from-purple-500 to-pink-400"
    },
    {
      icon: Target,
      title: "Guaranteed Outcomes",
      description: "Interview prep, internships, and job placement support. We're invested in your success.",
      color: "from-[#f16a2f] to-orange-400"
    }
  ];

  const journeySteps = [
    { name: "Nano", duration: "4-6 hrs", description: "Quick skill exposure", icon: Rocket, color: "#3b82f6" },
    { name: "Sprint", duration: "2 days", description: "Hands-on projects", icon: Zap, color: "#22c55e" },
    { name: "Pathway", duration: "30-40 hrs", description: "Portfolio building", icon: TrendingUp, color: "#8b5cf6" },
    { name: "Launchpad", duration: "4 months", description: "Career transformation", icon: GraduationCap, color: "#f16a2f" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      quote: "The Skill Circuit didn't just teach me to code. They transformed how I think, communicate, and present myself. Landed my dream job within 2 months!",
      rating: 5
    },
    {
      name: "Rahul Verma",
      role: "Product Manager at Microsoft",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      quote: "The behavioral transformation component was game-changing. My interview success rate went from 20% to 80%. Absolutely worth every penny.",
      rating: 5
    },
    {
      name: "Ananya Patel",
      role: "Data Analyst at Amazon",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      quote: "From a fresher with zero experience to landing a role at Amazon. The Launchpad program literally changed my life trajectory.",
      rating: 5
    }
  ];

  const partners = [
    "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Uber", "Airbnb", "Stripe"
  ];

  const stats = [
    { value: 5000, suffix: "+", label: "Students Transformed" },
    { value: 150, suffix: "+", label: "Hiring Partners" },
    { value: 94, suffix: "%", label: "Placement Rate" },
    { value: 4.9, suffix: "", label: "Student Rating" }
  ];

  return (
    <div className="min-h-screen overflow-hidden" data-testid="home-page">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50" data-testid="hero-section">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 -right-20 w-[600px] h-[600px] rounded-full bg-[#f16a2f]/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#053d6c]/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-3xl"
            animate={{ y: [-50, 50, -50] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32 relative z-10 w-full"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f16a2f]/10 text-[#f16a2f] text-sm font-semibold mb-6 border border-[#f16a2f]/20">
                <Star className="w-4 h-4 fill-[#f16a2f]" />
                <span>Rated 4.9/5 by 5000+ students</span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="font-['Outfit'] text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#053d6c] leading-[1.1] mb-6" 
                data-testid="hero-title"
              >
                Transform Your
                <span className="block gradient-text">Career Destiny</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-slate-600 leading-relaxed mb-8 max-w-xl" 
                data-testid="hero-subtitle"
              >
                Master in-demand skills, develop winning behaviors, and unlock guaranteed career outcomes. Your transformation starts here.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <Button className="btn-primary text-lg px-10 py-5 h-auto animate-pulse-orange" data-testid="explore-courses-btn">
                    Explore Courses
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="btn-secondary text-lg px-10 py-5 h-auto" data-testid="learn-more-btn">
                    Watch Our Story
                    <Play className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
              
              {/* Trust Badges */}
              <motion.div variants={fadeInUp} className="flex items-center gap-6 mt-10 pt-10 border-t border-slate-200">
                <div className="flex -space-x-3">
                  {[1,2,3,4,5].map((i) => (
                    <img 
                      key={i}
                      src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`}
                      alt="Student"
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                    />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-[#053d6c]">Join 5,000+ learners</p>
                  <p className="text-sm text-slate-500">Already transforming careers</p>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right Image Grid */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-12 gap-4">
                <motion.div 
                  className="col-span-8 row-span-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" 
                    alt="Students collaborating" 
                    className="w-full h-[400px] object-cover rounded-3xl shadow-2xl"
                  />
                </motion.div>
                <motion.div 
                  className="col-span-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400" 
                    alt="Professional woman" 
                    className="w-full h-[190px] object-cover rounded-2xl shadow-xl"
                  />
                </motion.div>
                <motion.div 
                  className="col-span-4"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" 
                    alt="Professional man" 
                    className="w-full h-[190px] object-cover rounded-2xl shadow-xl"
                  />
                </motion.div>
              </div>
              
              {/* Floating Cards */}
              <motion.div 
                className="absolute -bottom-6 -left-10 card-glass p-4 rounded-2xl shadow-2xl"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                data-testid="floating-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#f16a2f] to-orange-400 flex items-center justify-center shadow-lg">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-['Outfit'] font-bold text-[#053d6c] text-lg">94% Placement</p>
                    <p className="text-sm text-slate-500">Within 3 months</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute top-10 -right-6 card-glass p-4 rounded-2xl shadow-2xl"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-['Outfit'] font-bold text-[#053d6c] text-lg">Industry Certified</p>
                    <p className="text-sm text-slate-500">Recognized globally</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-[#f16a2f] rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Partners Marquee */}
      <section className="py-12 bg-[#053d6c] overflow-hidden" data-testid="partners-section">
        <div className="relative">
          <div className="animate-marquee flex whitespace-nowrap">
            {[...partners, ...partners, ...partners].map((partner, idx) => (
              <span key={idx} className="mx-12 text-2xl font-['Outfit'] font-bold text-white/30">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={scaleIn}
                className="text-center p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:shadow-xl transition-shadow"
              >
                <p className="font-['Outfit'] text-5xl lg:text-6xl font-extrabold gradient-text mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* USPs Section */}
      <section className="section-padding bg-gradient-to-b from-white to-slate-50" data-testid="usps-section">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#f16a2f]/10 text-[#f16a2f] text-sm font-semibold mb-4">
              WHY CHOOSE US
            </span>
            <h2 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-[#053d6c] mb-6">
              The Skill Circuit <span className="gradient-text">Difference</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We don't just teach skills. We engineer complete career transformations through our unique three-pillar approach.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {usps.map((usp, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="relative group"
                data-testid={`usp-card-${index}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#053d6c] to-[#0a4e8a] rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform" />
                <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${usp.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <usp.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-['Outfit'] text-2xl font-bold text-[#053d6c] mb-4">
                    {usp.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {usp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="section-padding bg-[#053d6c] relative overflow-hidden" data-testid="journey-section">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-[#f16a2f] text-sm font-semibold mb-4">
              YOUR LEARNING PATH
            </span>
            <h2 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-white mb-6">
              From Beginner to <span className="text-[#f16a2f]">Industry Ready</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Choose your own adventure. Start small or go all-in with our flagship Launchpad program.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {journeySteps.map((step, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="relative group"
                data-testid={`journey-step-${step.name.toLowerCase()}`}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: step.color + '20' }}
                  >
                    <step.icon className="w-8 h-8" style={{ color: step.color }} />
                  </div>
                  <div className="text-sm font-mono text-[#f16a2f] mb-2">{step.duration}</div>
                  <h3 className="font-['Outfit'] text-2xl font-bold text-white mb-2">
                    {step.name}
                  </h3>
                  <p className="text-slate-300">{step.description}</p>
                  
                  {index < journeySteps.length - 1 && (
                    <ChevronRight className="absolute top-1/2 -right-4 w-6 h-6 text-white/30 hidden lg:block" />
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/courses">
              <Button className="bg-[#f16a2f] hover:bg-[#ff8f5c] text-white text-lg px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all" data-testid="start-journey-btn">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="section-padding bg-slate-50" data-testid="featured-courses-section">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
          >
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-[#f16a2f]/10 text-[#f16a2f] text-sm font-semibold mb-4">
                POPULAR COURSES
              </span>
              <h2 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-[#053d6c]">
                Trending <span className="gradient-text">Programs</span>
              </h2>
            </div>
            <Link to="/courses" className="mt-6 md:mt-0">
              <Button variant="outline" className="btn-secondary">
                View All Courses
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {courses.slice(0, 6).map((course, idx) => (
              <motion.div 
                key={course.course_id}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="card-marketing"
              >
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      course.category === 'launchpad' ? 'bg-[#f16a2f] text-white' : 'bg-white/90 text-[#053d6c]'
                    }`}>
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-['Outfit'] text-xl font-bold text-white line-clamp-2">
                      {course.title}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration_hours}h</span>
                    </div>
                    <span className="text-2xl font-bold text-[#f16a2f]">${course.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#f16a2f]/10 text-[#f16a2f] text-sm font-semibold mb-4">
              SUCCESS STORIES
            </span>
            <h2 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-[#053d6c] mb-6">
              Hear from Our <span className="gradient-text">Graduates</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Real stories from real people who transformed their careers with The Skill Circuit.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-2xl transition-all"
              >
                <Quote className="w-10 h-10 text-[#f16a2f]/20 mb-4" />
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#f16a2f]/20"
                  />
                  <div>
                    <p className="font-['Outfit'] font-bold text-[#053d6c]">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-gradient-to-br from-slate-900 to-[#053d6c] relative overflow-hidden" data-testid="benefits-section">
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#f16a2f]/20 blur-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-[#f16a2f] text-sm font-semibold mb-4">
                WHAT YOU GET
              </span>
              <h2 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-white mb-8">
                Everything You Need to <span className="text-[#f16a2f]">Succeed</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { icon: CheckCircle, text: "Industry-designed curriculum updated quarterly" },
                  { icon: Users, text: "1-on-1 mentorship with industry professionals" },
                  { icon: Briefcase, text: "Guaranteed interview opportunities" },
                  { icon: Award, text: "Recognized certifications" },
                  { icon: Heart, text: "Lifetime community access" },
                  { icon: Shield, text: "100% placement assistance" }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    variants={fadeInUp}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#f16a2f]/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-[#f16a2f]" />
                    </div>
                    <p className="text-lg text-white">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="relative">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800"
                alt="Students learning"
                className="rounded-3xl shadow-2xl"
              />
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-['Outfit'] text-3xl font-bold text-[#053d6c]">300%</p>
                    <p className="text-slate-500">Average salary hike</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-12 bg-gradient-to-r from-[#f16a2f] to-orange-500 relative overflow-hidden" data-testid="cta-section">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-['Outfit'] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of successful graduates. Your dream career is just one decision away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button className="bg-white text-[#f16a2f] hover:bg-slate-100 text-lg px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all font-semibold" data-testid="cta-explore-btn">
                  Explore Programs
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-5 rounded-full" data-testid="cta-contact-btn">
                  Talk to Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
