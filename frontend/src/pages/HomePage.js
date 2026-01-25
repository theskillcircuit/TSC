import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { ArrowRight, Zap, Brain, Target, ChevronRight, Star, Users, Briefcase } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [cmsContent, setCmsContent] = useState(null);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const response = await axios.get(`${API}/cms/home`);
        setCmsContent(response.data);
      } catch (error) {
        console.error('Error fetching CMS content:', error);
      }
    };
    fetchCMS();
  }, []);

  const heroTitle = cmsContent?.sections?.hero?.title || "Master the Circuit of Success";
  const heroSubtitle = cmsContent?.sections?.hero?.subtitle || "Transform your career with industry-ready skills, behavioral excellence, and guaranteed outcomes.";

  const usps = [
    {
      icon: Zap,
      title: "Skill Mastery",
      description: "Specialized tracks in technology, management, and business roles with up-to-date, industry-relevant curriculum."
    },
    {
      icon: Brain,
      title: "Behavioral Transformation",
      description: "Daily nudges, accountability loops, mentor guidance, and structured practice that build professional habits employers value."
    },
    {
      icon: Target,
      title: "Career Outcomes",
      description: "Guaranteed interview opportunities via Launchpad, integrated internships, and long-term alumni support."
    }
  ];

  const journeySteps = [
    { name: "Neo", duration: "4-6 hours", description: "Quick skill exposure", color: "bg-blue-500" },
    { name: "Sprint", duration: "10-15 hours", description: "Hands-on application", color: "bg-green-500" },
    { name: "Pathway", duration: "30-40 hours", description: "Portfolio-driven learning", color: "bg-purple-500" },
    { name: "Launchpad", duration: "4 months", description: "Career transformation", color: "bg-[#f16a2f]" }
  ];

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 to-white" data-testid="hero-section">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-[#053d6c]" />
          <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-[#f16a2f]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f16a2f]/10 text-[#f16a2f] text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                <span>Rated 4.9/5 by 500+ students</span>
              </div>
              
              <h1 className="font-['Outfit'] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#053d6c] leading-tight mb-6" data-testid="hero-title">
                {heroTitle}
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl" data-testid="hero-subtitle">
                {heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <Button className="btn-primary text-lg px-8 py-4 h-auto" data-testid="explore-courses-btn">
                    Explore Courses
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="btn-secondary text-lg px-8 py-4 h-auto" data-testid="learn-more-btn">
                    Learn More
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-slate-200">
                <div>
                  <p className="font-['Outfit'] text-3xl font-bold text-[#053d6c]">500+</p>
                  <p className="text-sm text-slate-500">Placements</p>
                </div>
                <div>
                  <p className="font-['Outfit'] text-3xl font-bold text-[#053d6c]">100+</p>
                  <p className="text-sm text-slate-500">Partner Companies</p>
                </div>
                <div>
                  <p className="font-['Outfit'] text-3xl font-bold text-[#f16a2f]">4.9</p>
                  <p className="text-sm text-slate-500">Student Rating</p>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative animate-slide-up">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1573164713619-24c711fe7878?w=800" 
                  alt="Students collaborating" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#053d6c]/30 to-transparent" />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 glass rounded-xl p-4 shadow-xl animate-float" data-testid="floating-card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#f16a2f] flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-['Outfit'] font-bold text-[#053d6c]">Placement Guaranteed</p>
                    <p className="text-sm text-slate-500">With Launchpad programs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USPs Section */}
      <section className="section-padding bg-white" data-testid="usps-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-[#053d6c] mb-4">
              Why Choose The Skill Circuit?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We don't just teach skills. We transform careers through a unique blend of technical mastery, behavioral excellence, and guaranteed outcomes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {usps.map((usp, index) => (
              <div 
                key={index} 
                className="card-marketing p-8 hover:-translate-y-1"
                data-testid={`usp-card-${index}`}
              >
                <div className="w-14 h-14 rounded-xl bg-[#f16a2f]/10 flex items-center justify-center mb-6">
                  <usp.icon className="w-7 h-7 text-[#f16a2f]" />
                </div>
                <h3 className="font-['Outfit'] text-xl font-bold text-[#053d6c] mb-3">
                  {usp.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {usp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="section-padding bg-slate-50" data-testid="journey-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-[#053d6c] mb-4">
              Your Learning Journey
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Progress through our structured pathway - from quick skill exposure to complete career transformation.
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2" />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {journeySteps.map((step, index) => (
                <div key={index} className="relative" data-testid={`journey-step-${step.name.toLowerCase()}`}>
                  <div className="bg-white rounded-xl p-6 shadow-lg relative z-10 h-full">
                    <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white font-bold mb-4`}>
                      {index + 1}
                    </div>
                    <h3 className="font-['Outfit'] text-xl font-bold text-[#053d6c] mb-2">
                      {step.name}
                    </h3>
                    <p className="text-[#f16a2f] font-medium text-sm mb-2">{step.duration}</p>
                    <p className="text-slate-600 text-sm">{step.description}</p>
                  </div>
                  {index < journeySteps.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 text-slate-300 -translate-y-1/2 z-20" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/courses">
              <Button className="btn-primary" data-testid="start-journey-btn">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#053d6c]" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of successful graduates who've launched their careers with The Skill Circuit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button className="bg-[#f16a2f] hover:bg-[#d65a25] text-white text-lg px-8 py-4 h-auto" data-testid="cta-explore-btn">
                Explore Courses
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 h-auto" data-testid="cta-contact-btn">
                Talk to Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
