import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { EditableText, EditableImage, AdminEditBanner } from '../components/EditableContent';
import { Target, Users, Award, Heart, Lightbulb, Rocket, Briefcase, GraduationCap } from 'lucide-react';

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
  // Default content for values section
  const defaultValues = {
    title: "Our Values",
    v1_title: "Outcome-Driven",
    v1_desc: "Every program is designed with clear, measurable outcomes.",
    v2_title: "Student-First",
    v2_desc: "Our students' success is our success.",
    v3_title: "Innovation",
    v3_desc: "We constantly evolve our curriculum and methods.",
    v4_title: "Community",
    v4_desc: "Learning is better together."
  };

  // Default stats
  const defaultStats = {
    stat1_value: "500+",
    stat1_label: "Successful Placements",
    stat2_value: "100+",
    stat2_label: "Partner Companies",
    stat3_value: "50+",
    stat3_label: "Industry Mentors",
    stat4_value: "4.9",
    stat4_label: "Student Rating"
  };

  // Default approach
  const defaultApproach = {
    title: "Our Unique Approach",
    subtitle: "We don't just teach skills. We transform behaviors, build habits, and create professionals.",
    step1_title: "Industry-Co-Created Curriculum",
    step1_desc: "Our courses are designed in partnership with industry leaders.",
    step2_title: "Behavioral Transformation",
    step2_desc: "Daily nudges, accountability systems, and mentor guidance.",
    step3_title: "Guaranteed Outcomes",
    step3_desc: "Interview opportunities, internships, and career support."
  };

  const valueIcons = [Target, Heart, Lightbulb, Users];

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
                defaultSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                alt="Mentor teaching student"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#f16a2f]/10 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-[#f16a2f]" />
                  </div>
                  <div>
                    <p className="font-['Outfit'] font-bold text-[#053d6c]">
                      <EditableText page="about" section="problem" field="card_title" defaultValue="Industry-Ready" type="text" as="span" />
                    </p>
                    <p className="text-sm text-slate-500">
                      <EditableText page="about" section="problem" field="card_subtitle" defaultValue="From Day One" type="text" as="span" />
                    </p>
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

      {/* Values Section - Fully Editable */}
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
                defaultValue={defaultValues.title}
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
            {[1, 2, 3, 4].map((i) => {
              const Icon = valueIcons[i - 1];
              return (
                <motion.div 
                  key={i} 
                  variants={fadeInUp}
                  className="card-marketing p-6 text-center" 
                  data-testid={`value-${i}`}
                >
                  <div className="w-14 h-14 rounded-xl bg-[#f16a2f]/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-[#f16a2f]" />
                  </div>
                  <h3 className="font-['Outfit'] text-lg font-bold text-[#053d6c] mb-2">
                    <EditableText 
                      page="about" 
                      section="values" 
                      field={`v${i}_title`}
                      defaultValue={defaultValues[`v${i}_title`]}
                      type="text"
                      as="span"
                    />
                  </h3>
                  <p className="text-slate-600 text-sm">
                    <EditableText 
                      page="about" 
                      section="values" 
                      field={`v${i}_desc`}
                      defaultValue={defaultValues[`v${i}_desc`]}
                      type="textarea"
                      as="span"
                    />
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Fully Editable */}
      <section className="py-20 px-6 lg:px-8 bg-[#053d6c]" data-testid="stats-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <p className="font-['Outfit'] text-4xl lg:text-5xl font-bold text-[#f16a2f] mb-2">
                  <EditableText 
                    page="about" 
                    section="stats" 
                    field={`stat${i}_value`}
                    defaultValue={defaultStats[`stat${i}_value`]}
                    type="text"
                    as="span"
                  />
                </p>
                <p className="text-slate-300">
                  <EditableText 
                    page="about" 
                    section="stats" 
                    field={`stat${i}_label`}
                    defaultValue={defaultStats[`stat${i}_label`]}
                    type="text"
                    as="span"
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Approach Section - Fully Editable */}
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
                defaultValue={defaultApproach.title}
                type="heading"
                as="span"
              />
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              <EditableText 
                page="about" 
                section="approach" 
                field="subtitle"
                defaultValue={defaultApproach.subtitle}
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
            {[1, 2, 3].map((i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-slate-50 rounded-xl p-8">
                <div className="w-12 h-12 rounded-full bg-[#f16a2f] text-white flex items-center justify-center font-bold text-xl mb-4">
                  {i}
                </div>
                <h3 className="font-['Outfit'] text-xl font-bold text-[#053d6c] mb-3">
                  <EditableText 
                    page="about" 
                    section="approach" 
                    field={`step${i}_title`}
                    defaultValue={defaultApproach[`step${i}_title`]}
                    type="text"
                    as="span"
                  />
                </h3>
                <p className="text-slate-600">
                  <EditableText 
                    page="about" 
                    section="approach" 
                    field={`step${i}_desc`}
                    defaultValue={defaultApproach[`step${i}_desc`]}
                    type="textarea"
                    as="span"
                  />
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
