import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@skillcircuit.com',
      href: 'mailto:hello@skillcircuit.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 98765 43210',
      href: 'tel:+919876543210'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Bangalore, India',
      href: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50" data-testid="contact-page">
      {/* Hero Section */}
      <section className="bg-[#053d6c] py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-['Outfit'] text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="contact-title">
            Get in Touch
          </h1>
          <p className="text-slate-300 text-lg">
            Have questions? We're here to help you start your transformation journey.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-['Outfit'] text-2xl font-bold text-[#053d6c] mb-4">
                  Contact Information
                </h2>
                <p className="text-slate-600">
                  Reach out to us through any of these channels. Our team typically responds within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a 
                    key={index}
                    href={info.href}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    data-testid={`contact-info-${info.label.toLowerCase()}`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#f16a2f]/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-[#f16a2f]" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{info.label}</p>
                      <p className="font-medium text-[#053d6c]">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Quick Connect */}
              <div className="bg-gradient-to-br from-[#053d6c] to-[#084a80] rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6" />
                  <h3 className="font-['Outfit'] font-semibold">Quick Connect</h3>
                </div>
                <p className="text-slate-300 text-sm mb-4">
                  Want instant support? Chat with us on WhatsApp for quick responses.
                </p>
                <a 
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-8 shadow-lg" data-testid="contact-form">
                <h2 className="font-['Outfit'] text-2xl font-bold text-[#053d6c] mb-6">
                  Send us a Message
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
                    {submitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Outfit'] text-2xl font-bold text-[#053d6c] mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: "How do I enroll in a course?",
                a: "Simply browse our courses, select the one you're interested in, and click 'Enroll Now'. You can pay securely using your preferred payment method."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your course. Contact our support team to initiate a refund."
              },
              {
                q: "What is the Launchpad program?",
                a: "Launchpad is our flagship 4-month program that includes comprehensive training, internship placement, and guaranteed interview opportunities with our partner companies."
              },
              {
                q: "Can I upgrade from Sprint to Pathway?",
                a: "Absolutely! You can upgrade your enrollment at any time. The price difference will be adjusted, and your progress will be preserved."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-['Outfit'] font-semibold text-[#053d6c] mb-2">
                  {faq.q}
                </h3>
                <p className="text-slate-600 text-sm">
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
