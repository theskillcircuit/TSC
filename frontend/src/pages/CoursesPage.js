import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Clock, Star, Users, ArrowRight, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const categories = [
  { id: 'neo', name: 'Neo', description: '4-6 hours • Entry-level exposure' },
  { id: 'sprint', name: 'Sprint', description: '10-15 hours • Hands-on application' },
  { id: 'pathway', name: 'Pathway', description: '30-40 hours • Portfolio-driven' },
  { id: 'launchpad', name: 'Launchpad', description: '4 months • Career transformation' }
];

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

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'neo': return 'bg-blue-100 text-blue-700';
      case 'sprint': return 'bg-green-100 text-green-700';
      case 'pathway': return 'bg-purple-100 text-purple-700';
      case 'launchpad': return 'bg-[#f16a2f]/10 text-[#f16a2f]';
      default: return 'bg-slate-100 text-slate-700';
    }
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
    <div className="min-h-screen bg-slate-50" data-testid="courses-page">
      {/* Hero Section */}
      <section className="bg-[#053d6c] py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="courses-title">
            Explore Our Programs
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Choose from our carefully designed learning paths - from quick skill boosters to comprehensive career transformation programs.
          </p>
        </div>
      </section>

      {/* Category Tabs - Sticky */}
      <div className="sticky top-16 z-40 bg-white shadow-sm border-b border-slate-200" data-testid="category-tabs">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`tab-pill whitespace-nowrap ${activeCategory === 'all' ? 'tab-pill-active' : 'tab-pill-inactive'}`}
              data-testid="tab-all"
            >
              All Courses
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`tab-pill whitespace-nowrap ${activeCategory === cat.id ? 'tab-pill-active' : 'tab-pill-inactive'}`}
                data-testid={`tab-${cat.id}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Description */}
      {activeCategory !== 'all' && (
        <div className="bg-white border-b border-slate-200 py-4 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${activeCategory === 'launchpad' ? 'bg-[#f16a2f]' : getCategoryBadgeColor(activeCategory).split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`} />
              <p className="text-slate-600">
                {categories.find(c => c.id === activeCategory)?.description}
              </p>
              {activeCategory === 'launchpad' && (
                <Badge className="bg-[#f16a2f] text-white">
                  Placement Guaranteed
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded" />
                    <div className="h-10 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">No courses found in this category.</p>
              <Button onClick={() => handleCategoryChange('all')} className="mt-4 btn-primary">
                View All Courses
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div 
                  key={course.course_id} 
                  className={`card-marketing group ${course.category === 'launchpad' ? 'ring-2 ring-[#f16a2f]' : ''}`}
                  data-testid={`course-card-${course.course_id}`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {course.category === 'launchpad' && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-[#f16a2f] text-white shadow-lg">
                          FLAGSHIP
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4">
                      <Badge className={getCategoryBadgeColor(course.category)}>
                        {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-['Outfit'] text-xl font-bold text-[#053d6c] mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(course.duration_hours)}</span>
                      </div>
                      {course.lms_access && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>LMS Access</span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {course.skills && course.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                            {skill}
                          </span>
                        ))}
                        {course.skills.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                            +{course.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <span className="text-2xl font-bold text-[#f16a2f]">
                          {formatPrice(course.price)}
                        </span>
                      </div>
                      <Link to={`/courses/${course.course_id}`}>
                        <Button className="btn-primary py-2 px-4" data-testid={`enroll-btn-${course.course_id}`}>
                          View Details
                          <ArrowRight className="ml-1 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Launchpad CTA */}
      {activeCategory !== 'launchpad' && (
        <section className="py-16 px-6 lg:px-8 bg-gradient-to-r from-[#053d6c] to-[#084a80]">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-[#f16a2f] text-white mb-4">Premium Program</Badge>
            <h2 className="font-['Outfit'] text-3xl font-bold text-white mb-4">
              Ready for Career Transformation?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Our Launchpad programs offer guaranteed interview opportunities, internship placements, and comprehensive career support.
            </p>
            <Button 
              onClick={() => handleCategoryChange('launchpad')}
              className="bg-[#f16a2f] hover:bg-[#d65a25] text-white"
              data-testid="explore-launchpad-btn"
            >
              Explore Launchpad Programs
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default CoursesPage;
