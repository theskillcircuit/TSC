import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, Clock, Award, Calendar, Play, 
  TrendingUp, ChevronRight, Video, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [enrollmentsRes, classesRes, certsRes] = await Promise.all([
          axios.get(`${API}/enrollments`, { headers, withCredentials: true }),
          axios.get(`${API}/live-classes`, { withCredentials: true }),
          axios.get(`${API}/certificates`, { headers, withCredentials: true })
        ]);

        setEnrollments(Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : []);
        setLiveClasses(Array.isArray(classesRes.data) ? classesRes.data : []);
        setCertificates(Array.isArray(certsRes.data) ? certsRes.data : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setEnrollments([]);
        setLiveClasses([]);
        setCertificates([]);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUpcomingClasses = () => {
    const now = new Date();
    return liveClasses
      .filter(c => new Date(c.scheduled_at) > now)
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f16a2f]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="student-dashboard">
      {/* Header */}
      <div className="bg-[#053d6c] py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-white mb-2" data-testid="dashboard-greeting">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-300">
            Continue your learning journey and achieve your career goals.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Courses */}
            <section data-testid="enrolled-courses-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-['Outfit'] text-xl font-bold text-[#053d6c]">
                  My Courses
                </h2>
                <Link to="/courses" className="text-[#f16a2f] text-sm font-medium hover:underline">
                  Browse More
                </Link>
              </div>

              {enrollments.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-['Outfit'] text-lg font-semibold text-[#053d6c] mb-2">
                    No courses yet
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Start your learning journey by enrolling in a course.
                  </p>
                  <Link to="/courses">
                    <Button className="btn-primary">
                      Explore Courses
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div 
                      key={enrollment.enrollment_id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      data-testid={`enrollment-${enrollment.enrollment_id}`}
                    >
                      <div className="flex gap-4">
                        {enrollment.course?.image_url && (
                          <img 
                            src={enrollment.course.image_url}
                            alt={enrollment.course?.title}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Badge className="mb-2 bg-[#f16a2f]/10 text-[#f16a2f]">
                                {enrollment.course?.category}
                              </Badge>
                              <h3 className="font-['Outfit'] font-semibold text-[#053d6c] line-clamp-1">
                                {enrollment.course?.title}
                              </h3>
                            </div>
                            <Link to={`/courses/${enrollment.course_id}`}>
                              <Button size="sm" className="btn-primary flex-shrink-0">
                                <Play className="w-4 h-4 mr-1" />
                                Continue
                              </Button>
                            </Link>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-slate-500">Progress</span>
                              <span className="font-medium text-[#053d6c]">
                                {Math.round(enrollment.progress_percent || 0)}%
                              </span>
                            </div>
                            <Progress 
                              value={enrollment.progress_percent || 0} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Certificates */}
            <section data-testid="certificates-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-['Outfit'] text-xl font-bold text-[#053d6c]">
                  Certificates
                </h2>
              </div>

              {certificates.length === 0 ? (
                <div className="bg-white rounded-xl p-6 text-center">
                  <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">
                    Complete courses to earn certificates
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div 
                      key={cert.certificate_id}
                      className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <Award className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-[#053d6c]">{cert.course?.title}</p>
                        <p className="text-xs text-slate-500">
                          Issued {formatDate(cert.issued_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm" data-testid="quick-stats">
              <h3 className="font-['Outfit'] font-semibold text-[#053d6c] mb-4">
                Your Progress
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="font-['Outfit'] text-2xl font-bold text-[#f16a2f]">
                    {enrollments.length}
                  </p>
                  <p className="text-xs text-slate-500">Courses</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="font-['Outfit'] text-2xl font-bold text-[#053d6c]">
                    {certificates.length}
                  </p>
                  <p className="text-xs text-slate-500">Certificates</p>
                </div>
              </div>
            </div>

            {/* Upcoming Classes */}
            <div className="bg-white rounded-xl p-6 shadow-sm" data-testid="upcoming-classes">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Outfit'] font-semibold text-[#053d6c]">
                  Upcoming Classes
                </h3>
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              
              {getUpcomingClasses().length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">
                  No upcoming classes scheduled
                </p>
              ) : (
                <div className="space-y-3">
                  {getUpcomingClasses().map((liveClass) => (
                    <div 
                      key={liveClass.class_id}
                      className="p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f16a2f]/10 flex items-center justify-center flex-shrink-0">
                          <Video className="w-5 h-5 text-[#f16a2f]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#053d6c] text-sm line-clamp-1">
                            {liveClass.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDate(liveClass.scheduled_at)}
                          </p>
                        </div>
                      </div>
                      {liveClass.meeting_url && (
                        <a 
                          href={liveClass.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center gap-1 text-xs text-[#f16a2f] hover:underline"
                        >
                          Join {liveClass.platform}
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upgrade CTA */}
            {enrollments.some(e => e.course?.category === 'sprint' || e.course?.category === 'pathway') && (
              <div className="bg-gradient-to-br from-[#053d6c] to-[#084a80] rounded-xl p-6 text-white">
                <TrendingUp className="w-8 h-8 mb-3" />
                <h3 className="font-['Outfit'] font-semibold mb-2">
                  Ready to Level Up?
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Upgrade to Launchpad for guaranteed placements and career support.
                </p>
                <Link to="/courses?category=launchpad">
                  <Button className="w-full bg-[#f16a2f] hover:bg-[#d65a25] text-white">
                    View Upgrade Options
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
