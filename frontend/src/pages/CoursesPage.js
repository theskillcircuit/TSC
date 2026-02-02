import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Clock, CheckCircle, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const categoryColors = {
  nano: '#3b82f6',
  sprint: '#22c55e',
  pathway: '#8b5cf6',
  launchpad: '#f16a2f'
};

const categoryDescriptions = {
  nano: '4-6 hours • Quick skill exposure',
  sprint: '10-15 hours • Hands-on projects',
  pathway: '30-40 hours • Portfolio building',
  launchpad: '4 months • Career transformation'
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = activeCategory !== 'all' ? `?category=${activeCategory}` : '';
        const res = await axios.get(`${API}/courses${params}`);
        const data = Array.isArray(res.data) ? res.data : [];
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const getCategoryColor = (category) => {
    return categoryColors[category] || '#64748b';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDuration = (hours) => {
    if (hours >= 100) {
      const months = Math.round(hours / 160);
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    return `${hours} hours`;
  };

  const categories = ['nano', 'sprint', 'pathway', 'launchpad'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" data-testid="courses-page">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12 bg-[#053d6c] overflow-hidden pt-24 sm:pt-28">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-[#f16a2f]/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-blue-500/20 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 text-[#f16a2f] text-xs sm:text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-sm border border-white/10"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              50+ Industry-Ready Courses
            </motion.span>
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6" data-testid="courses-title">
              Find Your Perfect{" "}
              <span className="text-[#f16a2f]">Learning Path</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto">
              From quick skill boosters to comprehensive career transformation programs. Choose your adventure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs - Sticky */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-100" data-testid="category-tabs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-2 sm:gap-3 py-3 sm:py-5 overflow-x-auto scrollbar-hide">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryChange('all')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium whitespace-nowrap transition-all text-sm sm:text-base ${
                activeCategory === 'all' 
                  ? 'bg-[#053d6c] text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              data-testid="tab-all"
            >
              All Courses
            </motion.button>
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium whitespace-nowrap transition-all capitalize text-sm sm:text-base ${
                  activeCategory === cat 
                    ? 'bg-[#053d6c] text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                data-testid={`tab-${cat}`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Description */}
      {activeCategory !== 'all' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 py-3 sm:py-5 px-4 sm:px-6 lg:px-12"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div 
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                style={{ backgroundColor: getCategoryColor(activeCategory) }}
              />
              <p className="text-slate-600 font-medium text-sm sm:text-base">
                {categoryDescriptions[activeCategory]}
              </p>
            </div>
            {activeCategory === 'launchpad' && (
              <Badge className="bg-[#f16a2f] text-white px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Placement Guaranteed
              </Badge>
            )}
          </div>
        </motion.div>
      )}

      {/* Courses Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-40 sm:h-56 bg-slate-200" />
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded" />
                    <div className="h-12 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 sm:py-20"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg sm:text-xl mb-4 sm:mb-6">
                No courses found in this category.
              </p>
              <Button onClick={() => handleCategoryChange('all')} className="bg-[#f16a2f] hover:bg-[#e55a1f] text-white rounded-full">
                View All Courses
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {Array.isArray(courses) && courses.map((course) => (
                <motion.div 
                  key={course.course_id} 
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className={`bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
                    course.category === 'launchpad' ? 'ring-2 ring-[#f16a2f] ring-offset-2 sm:ring-offset-4' : ''
                  }`}
                  data-testid={`course-card-${course.course_id}`}
                >
                  {/* Image */}
                  <div className="relative h-40 sm:h-56 overflow-hidden group">
                    <img 
                      src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {course.category === 'launchpad' && (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                        <Badge className="bg-[#f16a2f] text-white shadow-lg px-2 sm:px-3 py-1 sm:py-1.5 font-semibold text-xs">
                          FLAGSHIP
                        </Badge>
                      </div>
                    )}
                    
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <span 
                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: getCategoryColor(course.category) }}
                      >
                        {course.category}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                      <h3 className="font-['Outfit'] text-base sm:text-xl font-bold text-white line-clamp-2 drop-shadow-lg">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{formatDuration(course.duration_hours)}</span>
                      </div>
                      {course.lms_access && (
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-green-600 font-medium">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>LMS Access</span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {Array.isArray(course.skills) && course.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                        {course.skills.slice(0, 3).map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs px-2 sm:px-3 py-0.5 sm:py-1 bg-slate-100 text-slate-600 rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {course.skills.length > 3 && (
                          <span className="text-xs px-2 sm:px-3 py-0.5 sm:py-1 bg-[#f16a2f]/10 text-[#f16a2f] rounded-full font-medium">
                            +{course.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 sm:pt-5 border-t border-slate-100">
                      <div>
                        <span className="text-2xl sm:text-3xl font-bold text-[#f16a2f]">
                          {formatPrice(course.price)}
                        </span>
                      </div>
                      <Link to={`/courses/${course.course_id}`}>
                        <Button className="bg-[#053d6c] hover:bg-[#042d52] text-white py-2 sm:py-2.5 px-4 sm:px-5 rounded-full text-xs sm:text-sm" data-testid={`enroll-btn-${course.course_id}`}>
                          View Details
                          <ArrowRight className="ml-1.5 w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Launchpad CTA */}
      {activeCategory !== 'launchpad' && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl sm:rounded-[2rem] overflow-hidden">
              {/* Background Image */}
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200"
                alt="Career transformation"
                className="w-full h-[300px] sm:h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#053d6c]/95 to-[#053d6c]/70" />
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center px-6 sm:px-10 lg:px-16">
                <div className="max-w-xl">
                  <Badge className="bg-[#f16a2f] text-white mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold">
                    Premium Program
                  </Badge>
                  <h2 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                    Ready for Complete Career Transformation?
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-lg mb-6 sm:mb-8">
                    Our Launchpad programs offer guaranteed interviews, internship placements, and comprehensive career support.
                  </p>
                  <Button 
                    onClick={() => handleCategoryChange('launchpad')}
                    className="bg-[#f16a2f] hover:bg-[#ff8f5c] text-white text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-xl"
                    data-testid="explore-launchpad-btn"
                  >
                    Explore Launchpad
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default CoursesPage;
