import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { EditableText, AdminEditBanner } from '../components/EditableContent';
import { Clock, Star, Users, ArrowRight, CheckCircle, Sparkles, TrendingUp } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const categories = [
  { id: 'nano', name: 'Nano', description: '4-6 hours • Quick skill exposure', color: '#3b82f6' },
  { id: 'sprint', name: 'Sprint', description: '10-15 hours • Hands-on projects', color: '#22c55e' },
  { id: 'pathway', name: 'Pathway', description: '30-40 hours • Portfolio building', color: '#8b5cf6' },
  { id: 'launchpad', name: 'Launchpad', description: '4 months • Career transformation', color: '#f16a2f' }
];

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
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const params = activeCategory !== 'all' ? `?category=${activeCategory}` : '';
        const response = await axios.get(`${API}/courses${params}`);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
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
    const cat = categories.find(c => c.id === category);
    return cat?.color || '#64748b';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" data-testid="courses-page">
      <AdminEditBanner />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 px-6 lg:px-12 bg-[#053d6c] overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#f16a2f]/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-3xl"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#f16a2f] text-sm font-semibold mb-6 backdrop-blur-sm border border-white/10"
            >
              <Sparkles className="w-4 h-4" />
              50+ Industry-Ready Courses
            </motion.span>
            <h1 className="font-['Outfit'] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" data-testid="courses-title">
              <EditableText 
                page="courses" 
                section="hero" 
                field="title"
                defaultValue="Find Your Perfect"
                type="heading"
                as="span"
              />{" "}
              <span className="text-[#f16a2f]">
                <EditableText 
                  page="courses" 
                  section="hero" 
                  field="title_highlight"
                  defaultValue="Learning Path"
                  type="heading"
                  as="span"
                />
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              <EditableText 
                page="courses" 
                section="hero" 
                field="subtitle"
                defaultValue="From quick skill boosters to comprehensive career transformation programs. Choose your adventure."
                type="textarea"
                as="span"
              />
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs - Sticky */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-100" data-testid="category-tabs">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 py-5 overflow-x-auto scrollbar-hide">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryChange('all')}
              className={`tab-pill whitespace-nowrap ${activeCategory === 'all' ? 'tab-pill-active' : 'tab-pill-inactive'}`}
              data-testid="tab-all"
            >
              All Courses
            </motion.button>
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryChange(cat.id)}
                className={`tab-pill whitespace-nowrap ${activeCategory === cat.id ? 'tab-pill-active' : 'tab-pill-inactive'}`}
                data-testid={`tab-${cat.id}`}
              >
                {cat.name}
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
          className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 py-5 px-6 lg:px-12"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getCategoryColor(activeCategory) }}
              />
              <p className="text-slate-600 font-medium">
                {categories.find(c => c.id === activeCategory)?.description}
              </p>
            </div>
            {activeCategory === 'launchpad' && (
              <Badge className="bg-[#f16a2f] text-white px-4 py-1.5 text-sm font-semibold">
                <TrendingUp className="w-4 h-4 mr-1" />
                Placement Guaranteed
              </Badge>
            )}
          </div>
        </motion.div>
      )}

      {/* Courses Grid */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-56 bg-slate-200" />
                  <div className="p-6 space-y-4">
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
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-500 text-xl mb-6">No courses found in this category.</p>
              <Button onClick={() => handleCategoryChange('all')} className="btn-primary">
                View All Courses
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {courses.map((course) => (
                <motion.div 
                  key={course.course_id} 
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
                    course.category === 'launchpad' ? 'ring-2 ring-[#f16a2f] ring-offset-4' : ''
                  }`}
                  data-testid={`course-card-${course.course_id}`}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden group">
                    <img 
                      src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {course.category === 'launchpad' && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-[#f16a2f] text-white shadow-lg px-3 py-1.5 font-semibold">
                          FLAGSHIP
                        </Badge>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: getCategoryColor(course.category) }}
                      >
                        {course.category}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-['Outfit'] text-xl font-bold text-white line-clamp-2 drop-shadow-lg">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(course.duration_hours)}</span>
                      </div>
                      {course.lms_access && (
                        <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                          <CheckCircle className="w-4 h-4" />
                          <span>LMS Access</span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {course.skills && course.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {course.skills.slice(0, 3).map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {course.skills.length > 3 && (
                          <span className="text-xs px-3 py-1 bg-[#f16a2f]/10 text-[#f16a2f] rounded-full font-medium">
                            +{course.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                      <div>
                        <span className="text-3xl font-bold text-[#f16a2f]">
                          {formatPrice(course.price)}
                        </span>
                      </div>
                      <Link to={`/courses/${course.course_id}`}>
                        <Button className="btn-primary py-2.5 px-5" data-testid={`enroll-btn-${course.course_id}`}>
                          View Details
                          <ArrowRight className="ml-1.5 w-4 h-4" />
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
        <section className="py-20 px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative rounded-[2rem] overflow-hidden">
              {/* Background Image */}
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200"
                alt="Career transformation"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#053d6c]/95 to-[#053d6c]/70" />
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center px-10 lg:px-16">
                <div className="max-w-xl">
                  <Badge className="bg-[#f16a2f] text-white mb-4 px-4 py-1.5 text-sm font-semibold">
                    Premium Program
                  </Badge>
                  <h2 className="font-['Outfit'] text-3xl lg:text-4xl font-bold text-white mb-4">
                    Ready for Complete Career Transformation?
                  </h2>
                  <p className="text-slate-300 text-lg mb-8">
                    Our Launchpad programs offer guaranteed interviews, internship placements, and comprehensive career support. Your dream job awaits.
                  </p>
                  <Button 
                    onClick={() => handleCategoryChange('launchpad')}
                    className="bg-[#f16a2f] hover:bg-[#ff8f5c] text-white text-lg px-8 py-4 rounded-full shadow-xl"
                    data-testid="explore-launchpad-btn"
                  >
                    Explore Launchpad
                    <ArrowRight className="ml-2 w-5 h-5" />
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
