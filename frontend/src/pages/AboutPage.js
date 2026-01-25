import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Target, Users, Award, Heart, Lightbulb, Rocket } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AboutPage = () => {
  const [cmsContent, setCmsContent] = useState(null);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const response = await axios.get(`${API}/cms/about`);
        setCmsContent(response.data);
      } catch (error) {
        console.error('Error fetching CMS content:', error);
      }
    };
    fetchCMS();
  }, []);

  const heroTitle = cmsContent?.sections?.hero?.title || "Redefining Employability";
  const heroSubtitle = cmsContent?.sections?.hero?.subtitle || "We believe skills alone aren't enough. True career success comes from combining technical expertise with behavioral transformation.";
  const missionText = cmsContent?.sections?.mission?.text || "To embed behavioral change and industry co-creation at the core of graduate transformation — shaping professionals, strengthening education, and serving industry with talent that delivers and endures.";

  const values = [
    {
      icon: Target,
      title: "Outcome-Driven",
      description: "Every program is designed with clear, measurable outcomes. We don't just teach; we transform careers."
    },
    {
      icon: Heart,
      title: "Student-First",
      description: "Our students' success is our success. Every decision we make puts their growth and opportunities first."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We constantly evolve our curriculum and methods to stay ahead of industry demands."
    },
    {
      icon: Users,
      title: "Community",
      description: "Learning is better together. Our alumni network provides lifelong support and opportunities."
    }
  ];

  const stats = [
    { number: "500+", label: "Successful Placements" },
    { number: "100+", label: "Partner Companies" },
    { number: "50+", label: "Industry Mentors" },
    { number: "4.9", label: "Student Rating" }
  ];

  return (
    <div className="min-h-screen" data-testid="about-page">
      {/* Hero Section */}
      <section className="relative py-24 px-6 lg:px-8 bg-gradient-to-br from-[#053d6c] to-[#084a80] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#f16a2f] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-['Outfit'] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" data-testid="about-title">
            {heroTitle}
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed" data-testid="about-subtitle">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-['Outfit'] text-3xl font-bold text-[#053d6c] mb-6">
                The Employability Gap
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Every year, millions of graduates enter the workforce with degrees but struggle to find meaningful employment. The problem isn't a lack of technical knowledge—it's a gap between what education provides and what industry needs.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Employers consistently report that new hires lack soft skills, professional habits, and the ability to adapt to workplace dynamics. Traditional education focuses on theoretical knowledge but overlooks the behavioral transformation needed for career success.
              </p>
              <p className="text-slate-600 leading-relaxed">
                <strong className="text-[#053d6c]">That's where we come in.</strong> The Skill Circuit bridges this gap by combining industry-relevant skills with behavioral transformation coaching.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1582601231162-132ca60713d6?w=800"
                alt="Mentor teaching student"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#f16a2f]/10 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-[#f16a2f]" />
                  </div>
                  <div>
                    <p className="font-['Outfit'] font-bold text-[#053d6c]">Industry-Ready</p>
                    <p className="text-sm text-slate-500">From Day One</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 lg:px-8 bg-slate-50" data-testid="mission-section">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#f16a2f] flex items-center justify-center mx-auto mb-6">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-['Outfit'] text-3xl font-bold text-[#053d6c] mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed italic" data-testid="mission-text">
            "{missionText}"
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit'] text-3xl font-bold text-[#053d6c] mb-4">
              Our Values
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              These principles guide everything we do, from curriculum design to student support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card-marketing p-6 text-center" data-testid={`value-${index}`}>
                <div className="w-14 h-14 rounded-xl bg-[#f16a2f]/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-[#f16a2f]" />
                </div>
                <h3 className="font-['Outfit'] text-lg font-bold text-[#053d6c] mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 lg:px-8 bg-[#053d6c]" data-testid="stats-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-['Outfit'] text-4xl lg:text-5xl font-bold text-[#f16a2f] mb-2">
                  {stat.number}
                </p>
                <p className="text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit'] text-3xl font-bold text-[#053d6c] mb-4">
              Our Unique Approach
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We don't just teach skills. We transform behaviors, build habits, and create professionals.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-xl p-8">
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl mb-4">1</div>
              <h3 className="font-['Outfit'] text-xl font-bold text-[#053d6c] mb-3">
                Industry-Co-Created Curriculum
              </h3>
              <p className="text-slate-600">
                Our courses are designed in partnership with industry leaders, ensuring every skill taught is immediately applicable in the workplace.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-8">
              <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl mb-4">2</div>
              <h3 className="font-['Outfit'] text-xl font-bold text-[#053d6c] mb-3">
                Behavioral Transformation
              </h3>
              <p className="text-slate-600">
                Daily nudges, accountability systems, and mentor guidance help build the professional habits that employers value most.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-8">
              <div className="w-12 h-12 rounded-full bg-[#f16a2f] text-white flex items-center justify-center font-bold text-xl mb-4">3</div>
              <h3 className="font-['Outfit'] text-xl font-bold text-[#053d6c] mb-3">
                Guaranteed Outcomes
              </h3>
              <p className="text-slate-600">
                Our Launchpad programs come with guaranteed interview opportunities, internships, and long-term career support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
