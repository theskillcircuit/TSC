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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
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
  const [cmsData, setCmsData] = useState({});
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, cmsRes] = await Promise.all([
          axios.get(`${API}/courses`),
          axios.get(`${API}/cms/home`)
        ]);
        setCourses(coursesRes.data.slice(0, 6));
        setCmsData(cmsRes.data?.sections || {});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Default content (used if CMS doesn't have values)
  const defaults = {
    hero: {
      badge: "Rated 4.9/5 by 5000+ students",
      title_line1: "Transform Your",
      title_line2: "Career Destiny",
      subtitle: "Master in-demand skills, develop winning behaviors, and unlock guaranteed career outcomes. Your transformation starts here.",
      cta_primary: "Explore Courses",
      cta_secondary: "Watch Our Story",
      trust_text: "Join 5,000+ learners",
      trust_subtext: "Already transforming careers"
    },
    stats: {
      stat1_value: "5000",
      stat1_label: "Students Transformed",
      stat2_value: "150",
      stat2_label: "Hiring Partners",
      stat3_value: "94",
      stat3_label: "Placement Rate",
      stat4_value: "4.9",
      stat4_label: "Student Rating"
    },
    usps: {
      title: "The Skill Circuit Difference",
      subtitle: "We don't just teach skills. We engineer complete career transformations through our unique three-pillar approach.",
      usp1_title: "Skill Mastery",
      usp1_desc: "Industry-relevant curriculum designed with top companies. Learn what actually matters.",
      usp2_title: "Behavioral Excellence",
      usp2_desc: "Daily nudges, mentor guidance, and habits that make you stand out in any workplace.",
      usp3_title: "Guaranteed Outcomes",
      usp3_desc: "Interview prep, internships, and job placement support. We're invested in your success."
    },
    journey: {
      title: "From Beginner to Industry Ready",
      subtitle: "Choose your own adventure. Start small or go all-in with our flagship Launchpad program.",
      step1_name: "Nano",
      step1_duration: "4-6 hrs",
      step1_desc: "Quick skill exposure",
      step2_name: "Sprint",
      step2_duration: "2 days",
      step2_desc: "Hands-on projects",
      step3_name: "Pathway",
      step3_duration: "30-40 hrs",
      step3_desc: "Portfolio building",
      step4_name: "Launchpad",
      step4_duration: "4 months",
      step4_desc: "Career transformation"
    },
    testimonials: {
      title: "Hear from Our Graduates",
      subtitle: "Real stories from real people who transformed their careers with The Skill Circuit.",
      t1_name: "Priya Sharma",
      t1_role: "Software Engineer at Google",
      t1_quote: "The Skill Circuit didn't just teach me to code. They transformed how I think, communicate, and present myself. Landed my dream job within 2 months!",
      t1_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      t2_name: "Rahul Verma",
      t2_role: "Product Manager at Microsoft",
      t2_quote: "The behavioral transformation component was game-changing. My interview success rate went from 20% to 80%. Absolutely worth every penny.",
      t2_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      t3_name: "Ananya Patel",
      t3_role: "Data Analyst at Amazon",
      t3_quote: "From a fresher with zero experience to landing a role at Amazon. The Launchpad program literally changed my life trajectory.",
      t3_image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    },
    partners: {
      list: "Google, Microsoft, Amazon, Meta, Netflix, Uber, Airbnb, Stripe"
    },
    benefits: {
      title: "Everything You Need to Succeed",
      benefit1: "Industry-designed curriculum updated quarterly",
      benefit2: "1-on-1 mentorship with industry professionals",
      benefit3: "Guaranteed interview opportunities",
      benefit4: "Recognized certifications",
      benefit5: "Lifetime community access",
      benefit6: "100% placement assistance",
      highlight_number: "300%",
      highlight_text: "Average salary hike"
    },
    cta: {
      title: "Ready to Transform Your Career?",
      subtitle: "Join thousands of successful graduates. Your dream career is just one decision away.",
      cta_primary: "Explore Programs",
      cta_secondary: "Talk to Us"
    }
  };

  const getValue = (section, field) => {
    return cmsData[section]?.[field] || defaults[section]?.[field] || '';
  };

  return (
    <div className="min-h-screen overflow-hidden" data-testid="home-page">
      <AdminEditBanner />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20 sm:pt-24" data-testid="hero-section">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div className="absolute top-20 -right-20 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-[#f16a2f]/10 blur-3xl" animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity }} />
          <motion.div className="absolute -bottom-40 -left-40 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-[#053d6c]/10 blur-3xl" animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }} transition={{ duration: 15, repeat: Infinity }} />
        </div>
        
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-16 lg:py-32 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              {/* Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#f16a2f]/10 text-[#f16a2f] text-xs sm:text-sm font-semibold mb-4 sm:mb-6 border border-[#f16a2f]/20">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#f16a2f]" />
                <span>Rated 4.9/5 by 5000+ students</span>
              </motion.div>
              
              {/* Title */}
              <motion.h1 variants={fadeInUp} className="font-['Outfit'] text-3xl sm:text-5xl lg:text-7xl font-extrabold text-[#053d6c] leading-[1.1] mb-4 sm:mb-6">
                <span className="block">Transform Your</span>
                <span className="block gradient-text">Career Destiny</span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p variants={fadeInUp} className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed mb-6 sm:mb-8 max-w-xl">
                Master in-demand skills, develop winning behaviors, and unlock guaranteed career outcomes. Your transformation starts here.
              </motion.p>
              
              {/* CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button className="btn-primary text-sm sm:text-lg px-6 sm:px-10 py-3 sm:py-5 h-auto w-full sm:w-auto">
                    Explore Courses
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
                <Link to="/about" className="w-full sm:w-auto">
                  <Button variant="outline" className="btn-secondary text-sm sm:text-lg px-6 sm:px-10 py-3 sm:py-5 h-auto w-full sm:w-auto">
                    Watch Our Story
                    <Play className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
              </motion.div>
              
              {/* Trust */}
              <motion.div variants={fadeInUp} className="flex items-center gap-4 sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-10 border-t border-slate-200">
                <div className="flex -space-x-2 sm:-space-x-3">
                  {[1,2,3,4,5].map((i) => (
                    <img key={i} src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`} alt="Student" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-[#053d6c] text-sm sm:text-base">Join 5,000+ learners</p>
                  <p className="text-xs sm:text-sm text-slate-500">Already transforming careers</p>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Hero Images */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative hidden lg:block">
              <div className="grid grid-cols-12 gap-4">
                <motion.div className="col-span-8 row-span-2" whileHover={{ scale: 1.02 }}>
                  <EditableImage page="home" section="hero" field="main_image" defaultSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" alt="Students collaborating" className="w-full h-[400px] object-cover rounded-3xl shadow-2xl" />
                </motion.div>
                <motion.div className="col-span-4" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                  <EditableImage page="home" section="hero" field="side_image1" defaultSrc="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400" alt="Professional" className="w-full h-[190px] object-cover rounded-2xl shadow-xl" />
                </motion.div>
                <motion.div className="col-span-4" animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }}>
                  <EditableImage page="home" section="hero" field="side_image2" defaultSrc="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" alt="Professional" className="w-full h-[190px] object-cover rounded-2xl shadow-xl" />
                </motion.div>
              </div>
              
              {/* Floating Cards */}
              <motion.div className="absolute -bottom-6 -left-10 card-glass p-4 rounded-2xl shadow-2xl" animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#f16a2f] to-orange-400 flex items-center justify-center shadow-lg">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-['Outfit'] font-bold text-[#053d6c] text-lg">
                      <EditableText page="home" section="hero" field="float_card1_title" defaultValue="94% Placement" type="text" as="span" />
                    </p>
                    <p className="text-sm text-slate-500">
                      <EditableText page="home" section="hero" field="float_card1_subtitle" defaultValue="Within 3 months" type="text" as="span" />
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div className="absolute top-10 -right-6 card-glass p-4 rounded-2xl shadow-2xl" animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-['Outfit'] font-bold text-[#053d6c] text-lg">
                      <EditableText page="home" section="hero" field="float_card2_title" defaultValue="Industry Certified" type="text" as="span" />
                    </p>
                    <p className="text-sm text-slate-500">
                      <EditableText page="home" section="hero" field="float_card2_subtitle" defaultValue="Recognized globally" type="text" as="span" />
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Partners Marquee */}
      <section className="py-12 bg-[#053d6c] overflow-hidden" data-testid="partners-section">
        <div className="text-center mb-4">
          <p className="text-white/50 text-sm">
            <EditableText page="home" section="partners" field="list" defaultValue={defaults.partners.list} type="text" as="span" />
          </p>
        </div>
        <div className="relative">
          <div className="animate-marquee flex whitespace-nowrap">
            {[...getValue('partners', 'list').split(','), ...getValue('partners', 'list').split(','), ...getValue('partners', 'list').split(',')].map((partner, idx) => (
              <span key={idx} className="mx-12 text-2xl font-['Outfit'] font-bold text-white/30">{partner.trim()}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <motion.div key={i} variants={scaleIn} className="text-center p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:shadow-xl transition-shadow">
                <p className="font-['Outfit'] text-5xl lg:text-6xl font-extrabold gradient-text mb-2">
                  <EditableText page="home" section="stats" field={`stat${i}_value`} defaultValue={defaults.stats[`stat${i}_value`]} type="text" as="span" />
                  {i === 3 ? '%' : i === 4 ? '' : '+'}
                </p>
                <p className="text-slate-600 font-medium">
                  <EditableText page="home" section="stats" field={`stat${i}_label`} defaultValue={defaults.stats[`stat${i}_label`]} type="text" as="span" />
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* USPs Section */}
      <section className="section-padding bg-gradient-to-b from-white to-slate-50" data-testid="usps-section">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full bg-[#f16a2f]/10 text-[#f16a2f] text-sm font-semibold mb-4">WHY CHOOSE US</span>
            <h2 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-[#053d6c] mb-6">
              <EditableText page="home" section="usps" field="title" defaultValue={defaults.usps.title} type="heading" as="span" />
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              <EditableText page="home" section="usps" field="subtitle" defaultValue={defaults.usps.subtitle} type="textarea" as="span" />
            </p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, color: "from-blue-500 to-cyan-400", num: 1 },
              { icon: Brain, color: "from-purple-500 to-pink-400", num: 2 },
              { icon: Target, color: "from-[#f16a2f] to-orange-400", num: 3 }
            ].map((usp) => (
              <motion.div key={usp.num} variants={fadeInUp} whileHover={{ y: -10 }} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#053d6c] to-[#0a4e8a] rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform" />
                <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${usp.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <usp.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-['Outfit'] text-2xl font-bold text-[#053d6c] mb-4">
                    <EditableText page="home" section="usps" field={`usp${usp.num}_title`} defaultValue={defaults.usps[`usp${usp.num}_title`]} type="text" as="span" />
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    <EditableText page="home" section="usps" field={`usp${usp.num}_desc`} defaultValue={defaults.usps[`usp${usp.num}_desc`]} type="textarea" as="span" />
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="section-padding bg-[#053d6c] relative overflow-hidden" data-testid="journey-section">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-[#f16a2f] text-sm font-semibold mb-4">YOUR LEARNING PATH</span>
            <h2 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-white mb-6">
              <EditableText page="home" section="journey" field="title" defaultValue={defaults.journey.title} type="heading" as="span" />
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              <EditableText page="home" section="journey" field="subtitle" defaultValue={defaults.journey.subtitle} type="textarea" as="span" />
            </p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Rocket, color: "#3b82f6", num: 1 },
              { icon: Zap, color: "#22c55e", num: 2 },
              { icon: TrendingUp, color: "#8b5cf6", num: 3 },
              { icon: GraduationCap, color: "#f16a2f", num: 4 }
            ].map((step, index) => (
              <motion.div key={step.num} variants={fadeInUp} whileHover={{ scale: 1.05 }} className="relative group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: step.color + '20' }}>
                    <step.icon className="w-8 h-8" style={{ color: step.color }} />
                  </div>
                  <div className="text-sm font-mono text-[#f16a2f] mb-2">
                    <EditableText page="home" section="journey" field={`step${step.num}_duration`} defaultValue={defaults.journey[`step${step.num}_duration`]} type="text" as="span" />
                  </div>
                  <h3 className="font-['Outfit'] text-2xl font-bold text-white mb-2">
                    <EditableText page="home" section="journey" field={`step${step.num}_name`} defaultValue={defaults.journey[`step${step.num}_name`]} type="text" as="span" />
                  </h3>
                  <p className="text-slate-300">
                    <EditableText page="home" section="journey" field={`step${step.num}_desc`} defaultValue={defaults.journey[`step${step.num}_desc`]} type="text" as="span" />
                  </p>
                  {index < 3 && <ChevronRight className="absolute top-1/2 -right-4 w-6 h-6 text-white/30 hidden lg:block" />}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/courses">
              <Button className="bg-[#f16a2f] hover:bg-[#ff8f5c] text-white text-lg px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section-padding bg-slate-50" data-testid="featured-courses-section">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-[#f16a2f]/10 text-[#f16a2f] text-sm font-semibold mb-4">POPULAR COURSES</span>
              <h2 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-[#053d6c]">
                Trending <span className="gradient-text">Programs</span>
              </h2>
            </div>
            <Link to="/courses" className="mt-6 md:mt-0">
              <Button variant="outline" className="btn-secondary">View All Courses <ArrowUpRight className="ml-2 w-5 h-5" /></Button>
            </Link>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 6).map((course, idx) => (
              <motion.div key={course.course_id} variants={fadeInUp} whileHover={{ y: -8 }} className="card-marketing">
                <div className="relative h-52 overflow-hidden">
                  <img src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${course.category === 'launchpad' ? 'bg-[#f16a2f] text-white' : 'bg-white/90 text-[#053d6c]'}`}>{course.category}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-['Outfit'] text-xl font-bold text-white line-clamp-2">{course.title}</h3>
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full bg-[#f16a2f]/10 text-[#f16a2f] text-sm font-semibold mb-4">SUCCESS STORIES</span>
            <h2 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-[#053d6c] mb-6">
              <EditableText page="home" section="testimonials" field="title" defaultValue={defaults.testimonials.title} type="heading" as="span" />
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              <EditableText page="home" section="testimonials" field="subtitle" defaultValue={defaults.testimonials.subtitle} type="textarea" as="span" />
            </p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -8 }} className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-2xl transition-all">
                <Quote className="w-10 h-10 text-[#f16a2f]/20 mb-4" />
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  "<EditableText page="home" section="testimonials" field={`t${i}_quote`} defaultValue={defaults.testimonials[`t${i}_quote`]} type="textarea" as="span" />"
                </p>
                <div className="flex items-center gap-4">
                  <EditableImage page="home" section="testimonials" field={`t${i}_image`} defaultSrc={defaults.testimonials[`t${i}_image`]} alt="Graduate" className="w-14 h-14 rounded-full object-cover border-2 border-[#f16a2f]/20" />
                  <div>
                    <p className="font-['Outfit'] font-bold text-[#053d6c]">
                      <EditableText page="home" section="testimonials" field={`t${i}_name`} defaultValue={defaults.testimonials[`t${i}_name`]} type="text" as="span" />
                    </p>
                    <p className="text-sm text-slate-500">
                      <EditableText page="home" section="testimonials" field={`t${i}_role`} defaultValue={defaults.testimonials[`t${i}_role`]} type="text" as="span" />
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-gradient-to-br from-slate-900 to-[#053d6c] relative overflow-hidden" data-testid="benefits-section">
        <div className="absolute inset-0">
          <motion.div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#f16a2f]/20 blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-[#f16a2f] text-sm font-semibold mb-4">WHAT YOU GET</span>
              <h2 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-white mb-8">
                <EditableText page="home" section="benefits" field="title" defaultValue={defaults.benefits.title} type="heading" as="span" />
              </h2>
              
              <div className="space-y-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div key={i} variants={fadeInUp} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#f16a2f]/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-[#f16a2f]" />
                    </div>
                    <p className="text-lg text-white">
                      <EditableText page="home" section="benefits" field={`benefit${i}`} defaultValue={defaults.benefits[`benefit${i}`]} type="text" as="span" />
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="relative">
              <EditableImage page="home" section="benefits" field="image" defaultSrc="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800" alt="Students learning" className="rounded-3xl shadow-2xl w-full h-[400px] object-cover" />
              <motion.div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-['Outfit'] text-3xl font-bold text-[#053d6c]">
                      <EditableText page="home" section="benefits" field="highlight_number" defaultValue={defaults.benefits.highlight_number} type="text" as="span" />
                    </p>
                    <p className="text-slate-500">
                      <EditableText page="home" section="benefits" field="highlight_text" defaultValue={defaults.benefits.highlight_text} type="text" as="span" />
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-12 bg-gradient-to-r from-[#f16a2f] to-orange-500 relative overflow-hidden" data-testid="cta-section">
        <motion.div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity }} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-['Outfit'] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              <EditableText page="home" section="cta" field="title" defaultValue={defaults.cta.title} type="heading" as="span" />
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              <EditableText page="home" section="cta" field="subtitle" defaultValue={defaults.cta.subtitle} type="textarea" as="span" />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button className="bg-white text-[#f16a2f] hover:bg-slate-100 text-lg px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all font-semibold">
                  <EditableText page="home" section="cta" field="cta_primary" defaultValue={defaults.cta.cta_primary} type="text" as="span" />
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-5 rounded-full">
                  <EditableText page="home" section="cta" field="cta_secondary" defaultValue={defaults.cta.cta_secondary} type="text" as="span" />
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
