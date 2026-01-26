import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { EditableText, EditableImage } from './EditableContent';

const Footer = () => {
  const [email, setEmail] = React.useState('');

  // Default footer content
  const defaults = {
    description: "Transforming careers through skill mastery, behavioral excellence, and guaranteed outcomes. Your success is our mission.",
    newsletter_title: "Stay in the Loop",
    newsletter_subtitle: "Get the latest courses, career tips, and success stories delivered to your inbox.",
    quick_links_title: "Quick Links",
    programs_title: "Programs",
    contact_title: "Get in Touch",
    email_label: "Email us",
    email_value: "hello@skillcircuit.com",
    phone_label: "Call us",
    phone_value: "+91 98765 43210",
    location_label: "Visit us",
    location_value: "Bangalore, India",
    copyright: `© ${new Date().getFullYear()} The Skill Circuit. All rights reserved. Built with ❤️ for learners.`
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription
    setEmail('');
  };

  return (
    <footer className="bg-[#053d6c] text-white relative overflow-hidden" data-testid="footer">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#f16a2f]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Newsletter Section - Editable */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-['Outfit'] text-2xl lg:text-3xl font-bold mb-2">
                <EditableText page="global" section="footer" field="newsletter_title" defaultValue={defaults.newsletter_title} type="text" as="span" />
              </h3>
              <p className="text-slate-300">
                <EditableText page="global" section="footer" field="newsletter_subtitle" defaultValue={defaults.newsletter_subtitle} type="textarea" as="span" />
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full lg:w-auto">
              <Input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-full px-6 h-12 w-full lg:w-80 focus:ring-[#f16a2f]"
              />
              <Button type="submit" className="bg-[#f16a2f] hover:bg-[#ff8f5c] rounded-full px-6 h-12 shadow-lg">
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand - Editable */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f16a2f] to-orange-400 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl font-['Outfit']">
                  <EditableText page="global" section="footer" field="logo_initials" defaultValue="SC" type="text" as="span" />
                </span>
              </div>
              <span className="font-['Outfit'] font-bold text-xl">
                <EditableText page="global" section="footer" field="brand_name" defaultValue="The Skill Circuit" type="text" as="span" />
              </span>
            </Link>
            <p className="text-slate-300 leading-relaxed mb-6">
              <EditableText 
                page="global" 
                section="footer" 
                field="description"
                defaultValue={defaults.description}
                type="textarea"
                as="span"
              />
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#', field: 'social_facebook' },
                { icon: Twitter, href: '#', field: 'social_twitter' },
                { icon: Linkedin, href: '#', field: 'social_linkedin' },
                { icon: Instagram, href: '#', field: 'social_instagram' },
                { icon: Youtube, href: '#', field: 'social_youtube' }
              ].map((social, idx) => (
                <motion.a 
                  key={idx}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#f16a2f] flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links - Editable */}
          <div>
            <h4 className="font-['Outfit'] font-semibold text-lg mb-6">
              <EditableText page="global" section="footer" field="quick_links_title" defaultValue={defaults.quick_links_title} type="text" as="span" />
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Browse Courses', path: '/courses', field: 'link1' },
                { name: 'About Us', path: '/about', field: 'link2' },
                { name: 'Success Stories', path: '/about#testimonials', field: 'link3' },
                { name: 'Contact', path: '/contact', field: 'link4' },
                { name: 'Student Login', path: '/login', field: 'link5' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className="text-slate-300 hover:text-[#f16a2f] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <EditableText page="global" section="footer_links" field={link.field} defaultValue={link.name} type="text" as="span" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs - Editable */}
          <div>
            <h4 className="font-['Outfit'] font-semibold text-lg mb-6">
              <EditableText page="global" section="footer" field="programs_title" defaultValue={defaults.programs_title} type="text" as="span" />
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Nano Courses', path: '/courses?category=nano', badge: '4-6 hrs', field: 'prog1' },
                { name: 'Sprint Programs', path: '/courses?category=sprint', badge: '2 days', field: 'prog2' },
                { name: 'Pathway Tracks', path: '/courses?category=pathway', badge: '30+ hrs', field: 'prog3' },
                { name: 'Launchpad', path: '/courses?category=launchpad', badge: 'Premium', field: 'prog4' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className="text-slate-300 hover:text-[#f16a2f] transition-colors flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      <EditableText page="global" section="footer_programs" field={link.field} defaultValue={link.name} type="text" as="span" />
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-400">
                      {link.badge}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Editable */}
          <div>
            <h4 className="font-['Outfit'] font-semibold text-lg mb-6">
              <EditableText page="global" section="footer" field="contact_title" defaultValue={defaults.contact_title} type="text" as="span" />
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:hello@skillcircuit.com" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-[#f16a2f]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#f16a2f] transition-colors">
                    <Mail className="w-5 h-5 text-[#f16a2f] group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">
                      <EditableText page="global" section="footer_contact" field="email_label" defaultValue={defaults.email_label} type="text" as="span" />
                    </p>
                    <p className="text-white font-medium">
                      <EditableText page="global" section="footer_contact" field="email_value" defaultValue={defaults.email_value} type="text" as="span" />
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-[#f16a2f]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#f16a2f] transition-colors">
                    <Phone className="w-5 h-5 text-[#f16a2f] group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">
                      <EditableText page="global" section="footer_contact" field="phone_label" defaultValue={defaults.phone_label} type="text" as="span" />
                    </p>
                    <p className="text-white font-medium">
                      <EditableText page="global" section="footer_contact" field="phone_value" defaultValue={defaults.phone_value} type="text" as="span" />
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f16a2f]/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#f16a2f]" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">
                      <EditableText page="global" section="footer_contact" field="location_label" defaultValue={defaults.location_label} type="text" as="span" />
                    </p>
                    <p className="text-white font-medium">
                      <EditableText page="global" section="footer_contact" field="location_value" defaultValue={defaults.location_value} type="text" as="span" />
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Editable */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              <EditableText page="global" section="footer" field="copyright" defaultValue={defaults.copyright} type="text" as="span" />
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                <EditableText page="global" section="footer_legal" field="privacy" defaultValue="Privacy Policy" type="text" as="span" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                <EditableText page="global" section="footer_legal" field="terms" defaultValue="Terms of Service" type="text" as="span" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                <EditableText page="global" section="footer_legal" field="refund" defaultValue="Refund Policy" type="text" as="span" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
