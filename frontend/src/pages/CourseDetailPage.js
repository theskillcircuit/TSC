import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Clock, CheckCircle, Users, Star, ArrowLeft, 
  Play, FileText, Award, Calendar, Video 
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/courses/${courseId}`);
        setCourse(response.data);

        // Check enrollment status if logged in
        if (isAuthenticated) {
          try {
            const token = localStorage.getItem('token');
            const enrollmentsRes = await axios.get(`${API}/enrollments`, {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true
            });
            const enrolled = enrollmentsRes.data.some(e => e.course_id === courseId);
            setIsEnrolled(enrolled);
          } catch (err) {
            console.error('Error checking enrollment:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Course not found');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, isAuthenticated, navigate]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to enroll');
      navigate('/login', { state: { from: `/courses/${courseId}` } });
      return;
    }

    if (course.price === 0) {
      // Free enrollment
      toast.success('Enrolled successfully!');
      navigate('/dashboard');
      return;
    }

    try {
      setEnrolling(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/payments/checkout`,
        {
          course_id: courseId,
          origin_url: window.location.origin
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error(error.response?.data?.detail || 'Failed to start checkout');
    } finally {
      setEnrolling(false);
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

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'neo': return 'bg-blue-100 text-blue-700';
      case 'sprint': return 'bg-green-100 text-green-700';
      case 'pathway': return 'bg-purple-100 text-purple-700';
      case 'launchpad': return 'bg-[#f16a2f]/10 text-[#f16a2f]';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f16a2f]"></div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-slate-50" data-testid="course-detail-page">
      {/* Hero */}
      <section className="bg-[#053d6c] py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/courses" className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getCategoryBadgeColor(course.category)}>
                  {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                </Badge>
                {course.category === 'launchpad' && (
                  <Badge className="bg-[#f16a2f] text-white">
                    Placement Guaranteed
                  </Badge>
                )}
              </div>
              
              <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-white mb-4" data-testid="course-title">
                {course.title}
              </h1>
              
              <p className="text-slate-300 text-lg mb-6">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{formatDuration(course.duration_hours)}</span>
                </div>
                {course.lms_access && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>LMS Access</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>4.8 Rating</span>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-xl p-6 shadow-xl" data-testid="price-card">
              {course.image_url && (
                <img 
                  src={course.image_url} 
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-[#f16a2f]">
                  {formatPrice(course.price)}
                </span>
              </div>
              
              {isEnrolled ? (
                <Link to="/dashboard">
                  <Button className="w-full btn-primary py-3" data-testid="go-to-dashboard-btn">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full btn-primary py-3"
                  data-testid="enroll-now-btn"
                >
                  {enrolling ? 'Processing...' : 'Enroll Now'}
                </Button>
              )}
              
              <p className="text-center text-sm text-slate-500 mt-4">
                30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What You'll Learn */}
              {course.outcomes && course.outcomes.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm" data-testid="outcomes-section">
                  <h2 className="font-['Outfit'] text-xl font-bold text-[#053d6c] mb-4">
                    What You'll Achieve
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.outcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {course.skills && course.skills.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm" data-testid="skills-section">
                  <h2 className="font-['Outfit'] text-xl font-bold text-[#053d6c] mb-4">
                    Skills You'll Gain
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Curriculum */}
              {course.weeks && course.weeks.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm" data-testid="curriculum-section">
                  <h2 className="font-['Outfit'] text-xl font-bold text-[#053d6c] mb-4">
                    Course Curriculum
                  </h2>
                  <div className="space-y-4">
                    {course.weeks.map((week, idx) => (
                      <div key={week.week_id} className="border border-slate-200 rounded-lg">
                        <div className="p-4 bg-slate-50 font-medium text-[#053d6c] flex items-center justify-between">
                          <span>Week {week.week_number}: {week.title}</span>
                          <span className="text-sm text-slate-500">
                            {week.modules?.length || 0} modules
                          </span>
                        </div>
                        {week.modules && week.modules.length > 0 && (
                          <div className="p-4 space-y-2">
                            {week.modules.map((module, midx) => (
                              <div key={module.module_id} className="flex items-center gap-3 text-slate-600">
                                {module.module_type === 'video' ? (
                                  <Play className="w-4 h-4 text-[#f16a2f]" />
                                ) : module.module_type === 'pdf' ? (
                                  <FileText className="w-4 h-4 text-blue-500" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                <span>{module.title}</span>
                                {module.duration_minutes && (
                                  <span className="text-xs text-slate-400 ml-auto">
                                    {module.duration_minutes} min
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Includes */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-['Outfit'] text-lg font-bold text-[#053d6c] mb-4">
                  This Course Includes
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Video className="w-5 h-5 text-[#f16a2f]" />
                    <span>{formatDuration(course.duration_hours)} of content</span>
                  </div>
                  {course.lms_access && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <Calendar className="w-5 h-5 text-[#f16a2f]" />
                      <span>Live classes access</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-slate-600">
                    <Award className="w-5 h-5 text-[#f16a2f]" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Users className="w-5 h-5 text-[#f16a2f]" />
                    <span>Community access</span>
                  </div>
                </div>
              </div>

              {/* Upgrade Path */}
              {(course.category === 'sprint' || course.category === 'pathway') && (
                <div className="bg-gradient-to-br from-[#053d6c] to-[#084a80] rounded-xl p-6 text-white">
                  <h3 className="font-['Outfit'] text-lg font-bold mb-2">
                    Upgrade Available
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">
                    {course.category === 'sprint' 
                      ? 'Upgrade to Pathway for portfolio projects and deeper learning.'
                      : 'Upgrade to Launchpad for guaranteed placements and career support.'}
                  </p>
                  <Link to="/courses?category=launchpad">
                    <Button variant="secondary" className="w-full bg-white text-[#053d6c]">
                      View Upgrade Options
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailPage;
