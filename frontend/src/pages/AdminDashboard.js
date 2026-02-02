import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { 
  LayoutDashboard, BookOpen, Users, Calendar, 
  FileText, Settings, Plus, Edit, Trash2, 
  TrendingUp, DollarSign, Eye, Video, 
  ChevronRight, X, Save, Check
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [cmsContent, setCmsContent] = useState({});

  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingClass, setEditingClass] = useState(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', category: 'neo', duration_hours: 5,
    price: 29, image_url: '', lms_access: false, skills: [], outcomes: [], is_published: false
  });
  const [classForm, setClassForm] = useState({
    course_id: '', title: '', description: '', scheduled_at: '',
    duration_minutes: 60, meeting_url: '', platform: 'zoom'
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'overview') {
        const res = await axios.get(`${API}/admin/analytics`, { headers, withCredentials: true });
        setAnalytics(res.data || {});
      } else if (activeTab === 'courses') {
        const res = await axios.get(`${API}/courses?published_only=false`);
        setCourses(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'students') {
        const res = await axios.get(`${API}/admin/students`, { headers, withCredentials: true });
        setStudents(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'live-classes') {
        const res = await axios.get(`${API}/live-classes`);
        setLiveClasses(Array.isArray(res.data) ? res.data : []);
        // Also fetch courses for dropdown
        const coursesRes = await axios.get(`${API}/courses?published_only=false`);
        setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      } else if (activeTab === 'contacts') {
        const res = await axios.get(`${API}/admin/contacts`, { headers, withCredentials: true });
        setContacts(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'cms') {
        const [homeRes, aboutRes] = await Promise.all([
          axios.get(`${API}/cms/home`),
          axios.get(`${API}/cms/about`)
        ]);
        setCmsContent({ home: homeRes.data, about: aboutRes.data });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Access denied');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Course CRUD
  const handleSaveCourse = async () => {
    try {
      const payload = {
        ...courseForm,
        skills: typeof courseForm.skills === 'string' 
          ? courseForm.skills.split(',').map(s => s.trim()).filter(Boolean)
          : courseForm.skills,
        outcomes: typeof courseForm.outcomes === 'string'
          ? courseForm.outcomes.split(',').map(s => s.trim()).filter(Boolean)
          : courseForm.outcomes
      };

      if (editingCourse) {
        await axios.put(`${API}/admin/courses/${editingCourse.course_id}`, payload, { headers, withCredentials: true });
        toast.success('Course updated successfully');
      } else {
        await axios.post(`${API}/admin/courses`, payload, { headers, withCredentials: true });
        toast.success('Course created successfully');
      }
      
      setShowCourseModal(false);
      setEditingCourse(null);
      setCourseForm({
        title: '', description: '', category: 'neo', duration_hours: 5,
        price: 29, image_url: '', lms_access: false, skills: [], outcomes: [], is_published: false
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await axios.delete(`${API}/admin/courses/${courseId}`, { headers, withCredentials: true });
      toast.success('Course deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      duration_hours: course.duration_hours,
      price: course.price,
      image_url: course.image_url || '',
      lms_access: course.lms_access,
      skills: course.skills?.join(', ') || '',
      outcomes: course.outcomes?.join(', ') || '',
      is_published: course.is_published
    });
    setShowCourseModal(true);
  };

  // Live Class CRUD
  const handleSaveClass = async () => {
    try {
      if (editingClass) {
        await axios.put(`${API}/admin/live-classes/${editingClass.class_id}`, classForm, { headers, withCredentials: true });
        toast.success('Live class updated');
      } else {
        await axios.post(`${API}/admin/live-classes`, classForm, { headers, withCredentials: true });
        toast.success('Live class scheduled');
      }
      
      setShowClassModal(false);
      setEditingClass(null);
      setClassForm({
        course_id: '', title: '', description: '', scheduled_at: '',
        duration_minutes: 60, meeting_url: '', platform: 'zoom'
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save live class');
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Delete this live class?')) return;
    
    try {
      await axios.delete(`${API}/admin/live-classes/${classId}`, { headers, withCredentials: true });
      toast.success('Live class deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // CMS Update
  const handleUpdateCMS = async (page, section, content) => {
    try {
      await axios.put(`${API}/admin/cms`, {
        page, section, content
      }, { headers, withCredentials: true });
      toast.success('Content updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update content');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'live-classes', label: 'Live Classes', icon: Video },
    { id: 'contacts', label: 'Contacts', icon: FileText },
    { id: 'cms', label: 'CMS', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-100" data-testid="admin-dashboard">
      {/* Sidebar */}
      <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto z-30">
        <div className="p-4">
          <h2 className="font-['Outfit'] text-lg font-bold text-[#053d6c] mb-4">
            Admin Panel
          </h2>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-[#f16a2f]/10 text-[#f16a2f]' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                data-testid={`admin-tab-${tab.id}`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-4 pb-8 px-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f16a2f]"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && analytics && (
              <div className="space-y-6" data-testid="overview-section">
                <h1 className="font-['Outfit'] text-2xl font-bold text-[#053d6c]">Dashboard Overview</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon={Users} label="Total Users" value={analytics.total_users} color="blue" />
                  <StatCard icon={BookOpen} label="Total Courses" value={analytics.total_courses} color="green" />
                  <StatCard icon={TrendingUp} label="Enrollments" value={analytics.total_enrollments} color="purple" />
                  <StatCard icon={DollarSign} label="Revenue" value={`$${analytics.total_revenue?.toFixed(2) || '0'}`} color="orange" />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Category Breakdown */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-['Outfit'] font-semibold text-[#053d6c] mb-4">Courses by Category</h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.category_counts || {}).map(([cat, count]) => (
                        <div key={cat} className="flex items-center justify-between">
                          <span className="capitalize text-slate-600">{cat}</span>
                          <Badge>{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Enrollments */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-['Outfit'] font-semibold text-[#053d6c] mb-4">Recent Enrollments</h3>
                    <div className="space-y-3">
                      {analytics.recent_enrollments?.slice(0, 5).map((enrollment) => (
                        <div key={enrollment.enrollment_id} className="flex items-center justify-between text-sm">
                          <div>
                            <p className="font-medium text-[#053d6c]">{enrollment.user?.name}</p>
                            <p className="text-slate-500">{enrollment.course?.title}</p>
                          </div>
                          <Badge variant="secondary">{enrollment.course?.category}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-6" data-testid="courses-section">
                <div className="flex items-center justify-between">
                  <h1 className="font-['Outfit'] text-2xl font-bold text-[#053d6c]">Course Management</h1>
                  <Button 
                    onClick={() => { setEditingCourse(null); setShowCourseModal(true); }} 
                    className="btn-primary"
                    data-testid="add-course-btn"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {courses.map((course) => (
                        <tr key={course.course_id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {course.image_url && (
                                <img src={course.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                              )}
                              <span className="font-medium text-[#053d6c]">{course.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="capitalize">{course.category}</Badge>
                          </td>
                          <td className="px-6 py-4 text-slate-600">${course.price}</td>
                          <td className="px-6 py-4">
                            <Badge variant={course.is_published ? 'default' : 'secondary'}>
                              {course.is_published ? 'Published' : 'Draft'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEditCourse(course)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(course.course_id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-6" data-testid="students-section">
                <h1 className="font-['Outfit'] text-2xl font-bold text-[#053d6c]">Student Management</h1>
                
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Enrollments</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map((student) => (
                        <tr key={student.user_id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-[#053d6c]">{student.name}</td>
                          <td className="px-6 py-4 text-slate-600">{student.email}</td>
                          <td className="px-6 py-4">
                            <Badge>{student.enrollments?.length || 0} courses</Badge>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-sm">
                            {new Date(student.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Live Classes Tab */}
            {activeTab === 'live-classes' && (
              <div className="space-y-6" data-testid="live-classes-section">
                <div className="flex items-center justify-between">
                  <h1 className="font-['Outfit'] text-2xl font-bold text-[#053d6c]">Live Class Management</h1>
                  <Button 
                    onClick={() => { setEditingClass(null); setShowClassModal(true); }} 
                    className="btn-primary"
                    data-testid="add-class-btn"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Class
                  </Button>
                </div>

                <div className="grid gap-4">
                  {liveClasses.map((lc) => (
                    <div key={lc.class_id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#f16a2f]/10 flex items-center justify-center">
                          <Video className="w-6 h-6 text-[#f16a2f]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#053d6c]">{lc.title}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(lc.scheduled_at).toLocaleString()} • {lc.duration_minutes} min • {lc.platform}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => {
                          setEditingClass(lc);
                          setClassForm({
                            course_id: lc.course_id,
                            title: lc.title,
                            description: lc.description || '',
                            scheduled_at: lc.scheduled_at,
                            duration_minutes: lc.duration_minutes,
                            meeting_url: lc.meeting_url || '',
                            platform: lc.platform
                          });
                          setShowClassModal(true);
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClass(lc.class_id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="space-y-6" data-testid="contacts-section">
                <h1 className="font-['Outfit'] text-2xl font-bold text-[#053d6c]">Contact Submissions</h1>
                
                <div className="grid gap-4">
                  {contacts.map((contact) => (
                    <div key={contact.contact_id} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-medium text-[#053d6c]">{contact.name}</p>
                          <p className="text-sm text-slate-500">{contact.email} • {contact.phone}</p>
                        </div>
                        <Badge>{contact.status}</Badge>
                      </div>
                      <p className="text-slate-600 text-sm">{contact.message}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(contact.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CMS Tab */}
            {activeTab === 'cms' && (
              <div className="space-y-6" data-testid="cms-section">
                <h1 className="font-['Outfit'] text-2xl font-bold text-[#053d6c]">Content Management</h1>
                
                <div className="grid gap-6">
                  {/* Home Page CMS */}
                  <CMSEditor 
                    title="Home Page - Hero Section"
                    content={cmsContent.home?.sections?.hero || {}}
                    fields={['title', 'subtitle', 'cta_primary', 'cta_secondary']}
                    onSave={(content) => handleUpdateCMS('home', 'hero', content)}
                  />
                  
                  {/* About Page CMS */}
                  <CMSEditor 
                    title="About Page - Hero Section"
                    content={cmsContent.about?.sections?.hero || {}}
                    fields={['title', 'subtitle']}
                    onSave={(content) => handleUpdateCMS('about', 'hero', content)}
                  />
                  
                  <CMSEditor 
                    title="About Page - Mission"
                    content={cmsContent.about?.sections?.mission || {}}
                    fields={['text']}
                    onSave={(content) => handleUpdateCMS('about', 'mission', content)}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Course Modal */}
      <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                  placeholder="Course title"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  placeholder="Course description"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={courseForm.category} onValueChange={(v) => setCourseForm({...courseForm, category: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neo">Neo</SelectItem>
                    <SelectItem value="sprint">Sprint</SelectItem>
                    <SelectItem value="pathway">Pathway</SelectItem>
                    <SelectItem value="launchpad">Launchpad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Duration (hours)</label>
                <Input 
                  type="number"
                  value={courseForm.duration_hours}
                  onChange={(e) => setCourseForm({...courseForm, duration_hours: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price ($)</label>
                <Input 
                  type="number"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({...courseForm, price: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input 
                  value={courseForm.image_url}
                  onChange={(e) => setCourseForm({...courseForm, image_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Skills (comma-separated)</label>
                <Input 
                  value={courseForm.skills}
                  onChange={(e) => setCourseForm({...courseForm, skills: e.target.value})}
                  placeholder="Python, JavaScript, React"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Outcomes (comma-separated)</label>
                <Input 
                  value={courseForm.outcomes}
                  onChange={(e) => setCourseForm({...courseForm, outcomes: e.target.value})}
                  placeholder="Build web apps, Deploy to cloud"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={courseForm.lms_access}
                    onChange={(e) => setCourseForm({...courseForm, lms_access: e.target.checked})}
                  />
                  <span className="text-sm">LMS Access</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={courseForm.is_published}
                    onChange={(e) => setCourseForm({...courseForm, is_published: e.target.checked})}
                  />
                  <span className="text-sm">Published</span>
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCourseModal(false)}>Cancel</Button>
            <Button onClick={handleSaveCourse} className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Live Class Modal */}
      <Dialog open={showClassModal} onOpenChange={setShowClassModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClass ? 'Edit Live Class' : 'Schedule Live Class'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Course</label>
              <Select value={classForm.course_id} onValueChange={(v) => setClassForm({...classForm, course_id: v})}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.course_id} value={c.course_id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={classForm.title}
                onChange={(e) => setClassForm({...classForm, title: e.target.value})}
                placeholder="Class title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Scheduled At</label>
              <Input 
                type="datetime-local"
                value={classForm.scheduled_at}
                onChange={(e) => setClassForm({...classForm, scheduled_at: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input 
                  type="number"
                  value={classForm.duration_minutes}
                  onChange={(e) => setClassForm({...classForm, duration_minutes: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Platform</label>
                <Select value={classForm.platform} onValueChange={(v) => setClassForm({...classForm, platform: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="google_meet">Google Meet</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Meeting URL</label>
              <Input 
                value={classForm.meeting_url}
                onChange={(e) => setClassForm({...classForm, meeting_url: e.target.value})}
                placeholder="https://zoom.us/j/..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClassModal(false)}>Cancel</Button>
            <Button onClick={handleSaveClass} className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-[#f16a2f]/10 text-[#f16a2f]'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">{label}</p>
          <p className="font-['Outfit'] text-2xl font-bold text-[#053d6c] mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// CMS Editor Component
const CMSEditor = ({ title, content, fields, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(content);

  const handleSave = () => {
    onSave(formData);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-['Outfit'] font-semibold text-[#053d6c]">{title}</h3>
        {!editing ? (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} className="btn-primary">
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>
      
      {editing ? (
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field}>
              <label className="text-sm font-medium capitalize">{field.replace('_', ' ')}</label>
              {field === 'text' || field === 'subtitle' ? (
                <Textarea 
                  value={formData[field] || ''}
                  onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                  rows={3}
                />
              ) : (
                <Input 
                  value={formData[field] || ''}
                  onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field) => (
            <div key={field}>
              <span className="text-xs text-slate-500 capitalize">{field.replace('_', ' ')}:</span>
              <p className="text-slate-700">{content[field] || '-'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
