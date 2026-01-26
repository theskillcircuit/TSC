import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { EditableText, AdminEditBanner } from '../components/EditableContent';
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

  // Default content for contact info
  const defaultContactInfo = {
    email_label: "Email",
    email_value: "theskillcircuit@gmail.com",
    phone_label: "Phone",
    phone_value: "+91 98765 43210",
    location_label: "Location",
    location_value: "Bangalore, India"
  };

  // Default FAQ content
  const defaultFaq = {
    title: "Frequently Asked Questions",
    q1: "How do I enroll in a course?",
    a1: "Browse our courses, select the one you're interested in, and click 'Enroll Now'.",
    q2: "Do you offer refunds?",
    a2: "Yes, we offer a 30-day money-back guarantee if you're not satisfied.",
    q3: "What is the Launchpad program?",
    a3: "Launchpad is our flagship 4-month program with guaranteed interview opportunities.",
    q4: "Can I upgrade from Sprint to Pathway?",
    a4: "Absolutely! You can upgrade at any time with price adjustment."
  };

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
      <AdminEditBanner />
      
      {/* Hero Section */}
      <section className="bg-[#053d6c] py-16 px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="contact-title">
            <EditableText 
              page="contact" 
              section="hero" 
              field="title"
              defaultValue="Get in Touch"
              type="heading"
              as="span"
            />
          </h1>
          <p className="text-slate-300 text-lg">
            <EditableText 
              page="contact" 
              section="hero" 
              field="subtitle"
              defaultValue="Have questions? We're here to help you start your transformation journey."
              type="textarea"
              as="span"
            />
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info - Fully Editable */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="space-y-8"
            >
              <div>
                <h2 className="font-['Outfit'] text-2xl font-bold text-[#053d6c] mb-4">
                  <EditableText 
                    page="contact" 
                    section="info" 
                    field="title"
                    defaultValue="Contact Information"
                    type="text"
                    as="span"
                  />
                </h2>
                <p className="text-slate-600">
                  <EditableText 
                    page="contact" 
                    section="info" 
                    field="subtitle"
                    defaultValue="Reach out to us through any of these channels. We typically respond within 24 hours."
                    type="textarea"
                    as="span"
                  />
                </p>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-[#f16a2f]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#f16a2f]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">
                      <EditableText page="contact" section="info" field="email_label" defaultValue={defaultContactInfo.email_label} type="text" as="span" />
                    </p>
                    <p className="font-medium text-[#053d6c]">
                      <EditableText page="contact" section="info" field="email_value" defaultValue={defaultContactInfo.email_value} type="text" as="span" />
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-[#f16a2f]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#f16a2f]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">
                      <EditableText page="contact" section="info" field="phone_label" defaultValue={defaultContactInfo.phone_label} type="text" as="span" />
                    </p>
                    <p className="font-medium text-[#053d6c]">
                      <EditableText page="contact" section="info" field="phone_value" defaultValue={defaultContactInfo.phone_value} type="text" as="span" />
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-[#f16a2f]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#f16a2f]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">
                      <EditableText page="contact" section="info" field="location_label" defaultValue={defaultContactInfo.location_label} type="text" as="span" />
                    </p>
                    <p className="font-medium text-[#053d6c]">
                      <EditableText page="contact" section="info" field="location_value" defaultValue={defaultContactInfo.location_value} type="text" as="span" />
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Connect - Editable */}
              <div className="bg-gradient-to-br from-[#053d6c] to-[#084a80] rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6" />
                  <h3 className="font-['Outfit'] font-semibold">
                    <EditableText page="contact" section="info" field="quick_title" defaultValue="Quick Connect" type="text" as="span" />
                  </h3>
                </div>
                <p className="text-slate-300 text-sm mb-4">
                  <EditableText page="contact" section="info" field="quick_desc" defaultValue="Want instant support? Chat with us on WhatsApp." type="textarea" as="span" />
                </p>
                <a 
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <EditableText page="contact" section="info" field="whatsapp_btn" defaultValue="WhatsApp Us" type="text" as="span" />
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
              <div className="bg-white rounded-xl p-8 shadow-lg" data-testid="contact-form">
                <h2 className="font-['Outfit'] text-2xl font-bold text-[#053d6c] mb-6">
                  <EditableText page="contact" section="form" field="title" defaultValue="Send us a Message" type="text" as="span" />
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="input-styled"
                        data-testid="contact-name-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="input-styled"
                        data-testid="contact-email-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="input-styled"
                      data-testid="contact-phone-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="input-styled resize-none"
                      data-testid="contact-message-input"
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full sm:w-auto"
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

      {/* FAQ Section - Fully Editable */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Outfit'] text-2xl font-bold text-[#053d6c] mb-8 text-center">
            <EditableText 
              page="contact" 
              section="faq" 
              field="title"
              defaultValue={defaultFaq.title}
              type="heading"
              as="span"
            />
          </h2>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-['Outfit'] font-semibold text-[#053d6c] mb-2">
                  <EditableText 
                    page="contact" 
                    section="faq" 
                    field={`q${i}`}
                    defaultValue={defaultFaq[`q${i}`]}
                    type="text"
                    as="span"
                  />
                </h3>
                <p className="text-slate-600 text-sm">
                  <EditableText 
                    page="contact" 
                    section="faq" 
                    field={`a${i}`}
                    defaultValue={defaultFaq[`a${i}`]}
                    type="textarea"
                    as="span"
                  />
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
