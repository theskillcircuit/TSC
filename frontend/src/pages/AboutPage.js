import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Award, Heart, Lightbulb, Rocket } from 'lucide-react';

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
    { icon: Target, title: 'Outcome-Driven', desc: 'Every program is designed with clear, measurable outcomes.' },
    { icon: Heart, title: 'Student-First', desc: 'Our students\' success is our success.' },
    { icon: Lightbulb, title: 'Innovation', desc: 'We constantly evolve our curriculum and methods.' },
    { icon: Users, title: 'Community', desc: 'Learning is better together.' }
  ];

  const stats = [
    { value: '500+', label: 'Successful Placements' },
    { value: '100+', label: 'Partner Companies' },
    { value: '50+', label: 'Industry Mentors' },
    { value: '4.9', label: 'Student Rating' }
  ];

  const approach = [
    { title: 'Industry-Co-Created Curriculum', desc: 'Our courses are designed in partnership with industry leaders.' },
    { title: 'Behavioral Transformation', desc: 'Daily nudges, accountability systems, and mentor guidance.' },
    { title: 'Guaranteed Outcomes', desc: 'Interview opportunities, internships, and career support.' }
  ];

  return (
    <div className="min-h-screen" data-testid="about-page">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#053d6c] to-[#084a80] overflow-hidden pt-24 sm:pt-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-[#f16a2f] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-white blur-3xl" />
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h1 
            variants={fadeInUp}
            className="font-['Outfit'] text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6" 
            data-testid="about-title"
          >
            Redefining Employability
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-base sm:text-xl text-slate-300 leading-relaxed" data-testid="about-subtitle">
            We believe skills alone aren&apos;t enough. True career success comes from combining technical expertise with behavioral transformation.
          </motion.p>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#053d6c] mb-4 sm:mb-6">
                The Employability Gap
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 text-sm sm:text-base">
                <p>
                  Every year, millions of graduates enter the workforce with degrees but struggle to find meaningful employment. The problem isn&apos;t a lack of technical knowledge—it&apos;s a gap between what education provides and what industry needs.
                </p>
                <p>
                  Employers consistently report that new hires lack soft skills, professional habits, and the ability to adapt to workplace dynamics.
                </p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                alt="Mentor teaching student"
                className="rounded-2xl shadow-2xl w-full h-[300px] sm:h-[400px] object-cover"
              />
              <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white rounded-xl p-3 sm:p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#f16a2f]/10 flex items-center justify-center">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-[#f16a2f]" />
                  </div>
                  <div>
                    <p className="font-['Outfit'] font-bold text-[#053d6c] text-sm sm:text-base">Industry-Ready</p>
                    <p className="text-xs sm:text-sm text-slate-500">From Day One</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50" data-testid="mission-section">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#f16a2f] flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Award className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#053d6c] mb-4 sm:mb-6">
            Our Mission
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed italic" data-testid="mission-text">
            &ldquo;To embed behavioral change and industry co-creation at the core of graduate transformation — shaping professionals, strengthening education, and serving industry with talent that delivers and endures.&rdquo;
          </p>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#053d6c] mb-4">
              Our Values
            </h2>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {values.map((value, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="bg-slate-50 p-5 sm:p-6 rounded-2xl text-center hover:shadow-lg transition-shadow" 
                data-testid={`value-${i + 1}`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#f16a2f]/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#f16a2f]" />
                </div>
                <h3 className="font-['Outfit'] text-base sm:text-lg font-bold text-[#053d6c] mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#053d6c]" data-testid="stats-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f16a2f] mb-2">
                  {stat.value}
                </p>
                <p className="text-slate-300 text-sm sm:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#053d6c] mb-4">
              Our Unique Approach
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              We don&apos;t just teach skills. We transform behaviors, build habits, and create professionals.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {approach.map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-slate-50 rounded-xl p-6 sm:p-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f16a2f] text-white flex items-center justify-center font-bold text-lg sm:text-xl mb-4">
                  {i + 1}
                </div>
                <h3 className="font-['Outfit'] text-lg sm:text-xl font-bold text-[#053d6c] mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base">
                  {step.desc}
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
