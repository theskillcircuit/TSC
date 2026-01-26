import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { EditableText, EditableImage, AdminEditBanner } from '../components/EditableContent';
import { Target, Users, Award, Heart, Lightbulb, Rocket } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const AboutPage = () => {
  const values = [
    { icon: Target, title: "Outcome-Driven", description: "Every program is designed with clear, measurable outcomes." },
    { icon: Heart, title: "Student-First", description: "Our students' success is our success." },
    { icon: Lightbulb, title: "Innovation", description: "We constantly evolve our curriculum and methods." },
    { icon: Users, title: "Community", description: "Learning is better together." }
  ];

  const stats = [
    { number: "500+", label: "Successful Placements" },
    { number: "100+", label: "Partner Companies" },
    { number: "50+", label: "Industry Mentors" },
    { number: "4.9", label: "Student Rating" }
  ];

  return (
    <div className="min-h-screen" data-testid="about-page">
      <AdminEditBanner />
      
      {/* Hero Section */}
      <section className="relative py-24 px-6 lg:px-8 bg-gradient-to-br from-[#053d6c] to-[#084a80] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#f16a2f] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h1 
            variants={fadeInUp}
            className="font-['Outfit'] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" 
            data-testid="about-title"
          >
            <EditableText 
              page="about" 
              section="hero" 
              field="title"
              defaultValue="Redefining Employability"
              type="heading"
              as="span"
            />
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-slate-300 leading-relaxed" data-testid="about-subtitle">
            <EditableText 
              page="about" 
              section="hero" 
              field="subtitle"
              defaultValue="We believe skills alone aren't enough. True career success comes from combining technical expertise with behavioral transformation."
              type="textarea"
              as="span"
            />
          </motion.p>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="font-['Outfit'] text-3xl font-bold text-[#053d6c] mb-6">
                <EditableText 
                  page="about" 
                  section="problem" 
                  field="title"
                  defaultValue="The Employability Gap"
                  type="heading"
                  as="span"
                />
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4">
                <p>
                  <EditableText 
                    page="about" 
                    section="problem" 
                    field="paragraph1"
                    defaultValue="Every year, millions of graduates enter the workforce with degrees but struggle to find meaningful employment. The problem isn't a lack of technical knowledge—it's a gap between what education provides and what industry needs."
                    type="textarea"
                    as="span"
                  />
                </p>
                <p>
                  <EditableText 
                    page="about" 
                    section="problem" 
                    field="paragraph2"
                    defaultValue="Employers consistently report that new hires lack soft skills, professional habits, and the ability to adapt to workplace dynamics."
                    type="textarea"
                    as="span"
                  />
                </p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="relative">
              <EditableImage 
                page="about"
                section="problem"
                field="image"
                defaultSrc="https://images.unsplash.com/photo-1582601651824-e1e8a57e6fca?w=800"
                alt="Mentor teaching student"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 lg:px-8 bg-slate-50" data-testid="mission-section">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#f16a2f] flex items-center justify-center mx-auto mb-6">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-['Outfit'] text-3xl font-bold text-[#053d6c] mb-6">
            <EditableText 
              page="about" 
              section="mission" 
              field="title"
              defaultValue="Our Mission"
              type="heading"
              as="span"
            />
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed italic" data-testid="mission-text">
            "<EditableText 
              page="about" 
              section="mission" 
              field="text"
              defaultValue="To embed behavioral change and industry co-creation at the core of graduate transformation — shaping professionals, strengthening education, and serving industry with talent that delivers and endures."
              type="textarea"
              as="span"
            />"
          </p>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="font-['Outfit'] text-3xl font-bold text-[#053d6c] mb-4">
              <EditableText 
                page="about" 
                section="values" 
                field="title"
                defaultValue="Our Values"
                type="heading"
                as="span"
              />
            </h2>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="card-marketing p-6 text-center" 
                data-testid={`value-${index}`}
              >
                <div className="w-14 h-14 rounded-xl bg-[#f16a2f]/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-[#f16a2f]" />
                </div>
                <h3 className="font-['Outfit'] text-lg font-bold text-[#053d6c] mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
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

      {/* Team/Approach Section */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="font-['Outfit'] text-3xl font-bold text-[#053d6c] mb-4">
              <EditableText 
                page="about" 
                section="approach" 
                field="title"
                defaultValue="Our Unique Approach"
                type="heading"
                as="span"
              />
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              <EditableText 
                page="about" 
                section="approach" 
                field="subtitle"
                defaultValue="We don't just teach skills. We transform behaviors, build habits, and create professionals."
                type="textarea"
                as="span"
              />
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8"
          >
            {[
              { num: "1", title: "Industry-Co-Created Curriculum", desc: "Our courses are designed in partnership with industry leaders." },
              { num: "2", title: "Behavioral Transformation", desc: "Daily nudges, accountability systems, and mentor guidance." },
              { num: "3", title: "Guaranteed Outcomes", desc: "Interview opportunities, internships, and career support." }
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-slate-50 rounded-xl p-8">
                <div className="w-12 h-12 rounded-full bg-[#f16a2f] text-white flex items-center justify-center font-bold text-xl mb-4">
                  {item.num}
                </div>
                <h3 className="font-['Outfit'] text-xl font-bold text-[#053d6c] mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
