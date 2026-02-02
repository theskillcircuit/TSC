import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const faqs = [
    { q: 'How do I enroll in a course?', a: 'Browse our courses, select the one you\'re interested in, and click \'Enroll Now\'.' },
    { q: 'Do you offer refunds?', a: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied.' },
    { q: 'What is the Launchpad program?', a: 'Launchpad is our flagship 4-month program with guaranteed interview opportunities.' },
    { q: 'Can I upgrade from Sprint to Pathway?', a: 'Absolutely! You can upgrade at any time with price adjustment.' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API}/contact`, formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="contact-page">
      {/* Hero Section */}
      <section className="bg-[#053d6c] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4" data-testid="contact-title">
            Get in Touch
          </h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Have questions? We&apos;re here to help you start your transformation journey.
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Contact Info */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="space-y-6 sm:space-y-8"
            >
              <div>
                <h2 className="font-['Outfit'] text-xl sm:text-2xl font-bold text-[#053d6c] mb-3 sm:mb-4">
                  Contact Information
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Reach out to us through any of these channels. We typically respond within 24 hours.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Email */}
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#f16a2f]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#f16a2f]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Email</p>
                    <p className="font-medium text-[#053d6c] text-sm sm:text-base">theskillcircuit@gmail.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#f16a2f]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#f16a2f]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Phone</p>
                    <p className="font-medium text-[#053d6c] text-sm sm:text-base">+91 98765 43210</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#f16a2f]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#f16a2f]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Location</p>
                    <p className="font-medium text-[#053d6c] text-sm sm:text-base">Bangalore, India</p>
                  </div>
                </div>
              </div>

              {/* Quick Connect */}
              <div className="bg-gradient-to-br from-[#053d6c] to-[#084a80] rounded-xl p-5 sm:p-6 text-white">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                  <h3 className="font-['Outfit'] font-semibold text-sm sm:text-base">Quick Connect</h3>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm mb-4">
                  Want instant support? Chat with us on WhatsApp.
                </p>
                <a 
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  WhatsApp Us
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg" data-testid="contact-form">
                <h2 className="font-['Outfit'] text-xl sm:text-2xl font-bold text-[#053d6c] mb-4 sm:mb-6">
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="rounded-lg text-sm"
                        data-testid="contact-name-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="rounded-lg text-sm"
                        data-testid="contact-email-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="rounded-lg text-sm"
                      data-testid="contact-phone-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="rounded-lg resize-none text-sm"
                      data-testid="contact-message-input"
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={submitting}
                    className="bg-[#f16a2f] hover:bg-[#e55a1f] text-white w-full sm:w-auto rounded-full px-6 py-2.5"
                    data-testid="contact-submit-btn"
                  >
                    {submitting ? 'Sending...' : (
                      <>
                        Send Message
                        <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Outfit'] text-xl sm:text-2xl font-bold text-[#053d6c] mb-6 sm:mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 sm:p-6">
                <h3 className="font-['Outfit'] font-semibold text-[#053d6c] mb-2 text-sm sm:text-base">
                  {faq.q}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
