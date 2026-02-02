import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/ui/button';
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
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API}/courses`);
        setCourses(res.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const categories = [
    { name: 'Nano', desc: '4-6 hour skill boosters', icon: Zap, color: '#3b82f6' },
    { name: 'Sprint', desc: '2-day intensive workshops', icon: Rocket, color: '#22c55e' },
    { name: 'Pathway', desc: '30+ hour career tracks', icon: Target, color: '#8b5cf6' },
    { name: 'Launchpad', desc: '4-month transformation', icon: GraduationCap, color: '#f16a2f' }
  ];

  const stats = [
    { value: 5000, suffix: '+', label: 'Students Transformed' },
    { value: 94, suffix: '%', label: 'Placement Rate' },
    { value: 100, suffix: '+', label: 'Industry Partners' },
    { value: 4.9, suffix: '/5', label: 'Student Rating' }
  ];

  const testimonials = [
    {
      quote: "The Launchpad program completely transformed my career. Within 3 months of completion, I landed my dream job at a top tech company.",
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The behavioral training sets Skill Circuit apart. It's not just about technical skills - they prepare you for real workplace success.",
      name: "Rahul Verma",
      role: "Product Manager at Amazon",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "I went from zero coding knowledge to a full-stack developer role. The mentorship and support were incredible throughout.",
      name: "Ananya Patel",
      role: "Full Stack Developer",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  const usps = [
    { icon: Award, title: 'Industry-Certified', desc: 'Courses designed with top companies' },
    { icon: Users, title: 'Expert Mentors', desc: '1-on-1 guidance from industry pros' },
    { icon: Briefcase, title: 'Job Guarantee', desc: 'Placement support until you succeed' },
    { icon: Shield, title: 'Lifetime Access', desc: 'Learn at your pace, forever' }
  ];

  return (
    <div className="min-h-screen overflow-hidden" data-testid="home-page">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20 sm:pt-24" data-testid="hero-section">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 -right-20 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-[#f16a2f]/10 blur-3xl" 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
            transition={{ duration: 20, repeat: Infinity }} 
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-[#053d6c]/10 blur-3xl" 
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }} 
            transition={{ duration: 15, repeat: Infinity }} 
          />
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
                <span className="block bg-gradient-to-r from-[#f16a2f] to-orange-500 bg-clip-text text-transparent">Career Destiny</span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p variants={fadeInUp} className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed mb-6 sm:mb-8 max-w-xl">
                Master in-demand skills, develop winning behaviors, and unlock guaranteed career outcomes. Your transformation starts here.
              </motion.p>
              
              {/* CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button className="bg-[#f16a2f] hover:bg-[#e55a1f] text-white text-sm sm:text-lg px-6 sm:px-10 py-3 sm:py-5 h-auto w-full sm:w-auto rounded-full shadow-lg">
                    Explore Courses
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
                <Link to="/about" className="w-full sm:w-auto">
                  <Button variant="outline" className="border-2 border-[#053d6c] text-[#053d6c] hover:bg-[#053d6c] hover:text-white text-sm sm:text-lg px-6 sm:px-10 py-3 sm:py-5 h-auto w-full sm:w-auto rounded-full">
                    Watch Our Story
                    <Play className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
              </motion.div>
              
              {/* Trust */}
              <motion.div variants={fadeInUp} className="flex items-center gap-4 sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-10 border-t border-slate-200">
                <div className="flex -space-x-2 sm:-space-x-3">
                  {[1,2,3,4,5].map((i) => (
                    <img 
                      key={i} 
                      src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`} 
                      alt="Student" 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md" 
                    />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-[#053d6c] text-sm sm:text-base">Join 5,000+ learners</p>
                  <p className="text-xs sm:text-sm text-slate-500">Already transforming careers</p>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Hero Images */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: 0.3 }} 
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-12 gap-4">
                <motion.div className="col-span-8 row-span-2" whileHover={{ scale: 1.02 }}>
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" 
                    alt="Students collaborating" 
                    className="w-full h-[400px] object-cover rounded-3xl shadow-2xl" 
                  />
                </motion.div>
                <motion.div className="col-span-4" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400" 
                    alt="Professional" 
                    className="w-full h-[190px] object-cover rounded-2xl shadow-xl" 
                  />
                </motion.div>
                <motion.div className="col-span-4" animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }}>
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" 
                    alt="Student" 
                    className="w-full h-[190px] object-cover rounded-2xl shadow-xl" 
                  />
                </motion.div>
                
                {/* Floating Cards */}
                <motion.div 
                  className="absolute -left-8 top-1/3 bg-white rounded-2xl p-4 shadow-xl border border-slate-100" 
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#f16a2f]/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#f16a2f]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#053d6c]">94% Placement</p>
                      <p className="text-xs text-slate-500">Within 3 months</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute -right-4 top-1/4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100" 
                  animate={{ y: [0, 10, 0] }} 
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-[#053d6c]">Industry Certified</p>
                      <p className="text-xs text-slate-500">Recognized globally</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 bg-[#053d6c]" data-testid="stats-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }} 
                className="text-center"
              >
                <p className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f16a2f] mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-slate-300 text-sm sm:text-base">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-white" data-testid="categories-section">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer} 
            className="text-center mb-12 sm:mb-16"
          >
            <motion.span variants={fadeInUp} className="text-[#f16a2f] font-semibold text-sm uppercase tracking-wider">
              Learning Paths
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-['Outfit'] text-2xl sm:text-4xl lg:text-5xl font-bold text-[#053d6c] mt-2">
              Choose Your Journey
            </motion.h2>
          </motion.div>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer} 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {categories.map((cat, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Link to={`/courses?category=${cat.name.toLowerCase()}`}>
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }} 
                    className="bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                  >
                    <div 
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-transform group-hover:scale-110" 
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <cat.icon className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: cat.color }} />
                    </div>
                    <h3 className="font-['Outfit'] text-xl sm:text-2xl font-bold text-[#053d6c] mb-2">{cat.name}</h3>
                    <p className="text-slate-600 mb-4 text-sm sm:text-base">{cat.desc}</p>
                    <div className="flex items-center text-[#f16a2f] font-semibold group-hover:gap-3 gap-1 transition-all text-sm sm:text-base">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-slate-50" data-testid="usp-section">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer} 
            className="text-center mb-12 sm:mb-16"
          >
            <motion.span variants={fadeInUp} className="text-[#f16a2f] font-semibold text-sm uppercase tracking-wider">
              Why Choose Us
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-['Outfit'] text-2xl sm:text-4xl lg:text-5xl font-bold text-[#053d6c] mt-2">
              The Skill Circuit Advantage
            </motion.h2>
          </motion.div>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer} 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {usps.map((usp, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp} 
                whileHover={{ y: -5 }} 
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#f16a2f]/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <usp.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#f16a2f]" />
                </div>
                <h3 className="font-['Outfit'] text-lg sm:text-xl font-bold text-[#053d6c] mb-2">{usp.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base">{usp.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-white" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer} 
            className="text-center mb-12 sm:mb-16"
          >
            <motion.span variants={fadeInUp} className="text-[#f16a2f] font-semibold text-sm uppercase tracking-wider">
              Success Stories
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-['Outfit'] text-2xl sm:text-4xl lg:text-5xl font-bold text-[#053d6c] mt-2">
              What Our Students Say
            </motion.h2>
          </motion.div>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer} 
            className="grid md:grid-cols-3 gap-6 sm:gap-8"
          >
            {testimonials.map((t, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp} 
                whileHover={{ y: -8 }} 
                className="bg-gradient-to-br from-slate-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-lg hover:shadow-2xl transition-all"
              >
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-[#f16a2f]/20 mb-4" />
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#f16a2f]/20" 
                  />
                  <div>
                    <p className="font-['Outfit'] font-bold text-[#053d6c] text-sm sm:text-base">{t.name}</p>
                    <p className="text-slate-500 text-xs sm:text-sm">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Courses Section */}
      {courses.length > 0 && (
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-slate-50" data-testid="courses-section">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={staggerContainer} 
              className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 sm:mb-16 gap-4"
            >
              <div>
                <motion.span variants={fadeInUp} className="text-[#f16a2f] font-semibold text-sm uppercase tracking-wider">
                  Popular Courses
                </motion.span>
                <motion.h2 variants={fadeInUp} className="font-['Outfit'] text-2xl sm:text-4xl lg:text-5xl font-bold text-[#053d6c] mt-2">
                  Start Learning Today
                </motion.h2>
              </div>
              <motion.div variants={fadeInUp}>
                <Link to="/courses">
                  <Button variant="outline" className="border-[#053d6c] text-[#053d6c] hover:bg-[#053d6c] hover:text-white rounded-full px-6 text-sm sm:text-base">
                    View All Courses
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={staggerContainer} 
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {courses.map((course, i) => (
                <motion.div 
                  key={course.course_id} 
                  variants={fadeInUp} 
                  whileHover={{ y: -8 }} 
                  className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img 
                      src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/90 text-[#053d6c]">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-['Outfit'] text-lg sm:text-xl font-bold text-[#053d6c] mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl sm:text-3xl font-bold text-[#f16a2f]">${course.price}</span>
                      <Link to={`/courses/${course.course_id}`}>
                        <Button className="bg-[#053d6c] hover:bg-[#042d52] text-white rounded-full px-4 sm:px-6 text-sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-32 px-4 sm:px-6 lg:px-12 bg-gradient-to-r from-[#f16a2f] to-orange-500 relative overflow-hidden" data-testid="cta-section">
        <motion.div 
          className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-white/10 blur-3xl" 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }} 
          transition={{ duration: 10, repeat: Infinity }} 
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
          >
            <h2 className="font-['Outfit'] text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-10 max-w-2xl mx-auto">
              Join thousands of successful graduates who have transformed their careers with The Skill Circuit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button className="bg-white text-[#f16a2f] hover:bg-slate-100 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl transition-all font-semibold w-full sm:w-auto">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-full w-full sm:w-auto">
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
