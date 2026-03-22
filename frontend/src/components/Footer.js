import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

// Logo URL
const LOGO_URL = "https://customer-assets.emergentagent.com/job_fac660c7-fe9e-4111-b346-2b7c90d0cb92/artifacts/2h3cxjba_Logo_Transparent.png";

const Footer = () => {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="bg-[#053d6c] text-white relative overflow-hidden" data-testid="footer">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#f16a2f]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-['Outfit'] text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                Stay in the Loop
              </h3>
              <p className="text-slate-300 text-sm sm:text-base">
                Get the latest courses, career tips, and success stories delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full lg:w-auto">
              <Input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-full px-4 sm:px-6 h-10 sm:h-12 w-full lg:w-80 focus:ring-[#f16a2f] text-sm"
              />
              <Button type="submit" className="bg-[#f16a2f] hover:bg-[#ff8f5c] rounded-full px-4 sm:px-6 h-10 sm:h-12 shadow-lg flex-shrink-0">
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 sm:mb-6">
              <img 
                src={LOGO_URL} 
                alt="The Skill Circuit" 
                className="h-10 sm:h-12 w-auto"
              />
              <span className="font-['Outfit'] font-bold text-lg sm:text-xl">
                The Skill Circuit
              </span>
            </Link>
            <p className="text-slate-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              Transforming careers through skill mastery, behavioral excellence, and guaranteed outcomes. Your success is our mission.
            </p>
            <div className="flex gap-2 sm:gap-3">
              {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, idx) => (
                <motion.a 
                  key={idx}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-[#f16a2f] flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Outfit'] font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { name: 'Browse Courses', path: '/courses' },
                { name: 'About Us', path: '/about' },
                { name: 'Success Stories', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'Student Login', path: '/login' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className="text-slate-300 hover:text-[#f16a2f] transition-colors flex items-center gap-2 group text-sm sm:text-base"
                  >
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 -ml-4 sm:-ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-['Outfit'] font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Programs
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { name: 'Nano Courses', path: '/courses?category=nano', badge: '4-6 hrs' },
                { name: 'Sprint Programs', path: '/courses?category=sprint', badge: '2 days' },
                { name: 'Pathway Tracks', path: '/courses?category=pathway', badge: '30+ hrs' },
                { name: 'Launchpad', path: '/courses?category=launchpad', badge: 'Premium' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className="text-slate-300 hover:text-[#f16a2f] transition-colors flex items-center justify-between group text-sm sm:text-base"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 -ml-4 sm:-ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </span>
                    <span className="text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-white/10 text-slate-400 hidden sm:inline">
                      {link.badge}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-['Outfit'] font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Get in Touch
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a href="mailto:theskillcircuit@gmail.com" className="flex items-start gap-3 sm:gap-4 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#f16a2f]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#f16a2f] transition-colors">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#f16a2f] group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm">Email us</p>
                    <p className="text-white font-medium text-sm sm:text-base">theskillcircuit@gmail.com</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="flex items-start gap-3 sm:gap-4 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#f16a2f]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#f16a2f] transition-colors">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#f16a2f] group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm">Call us</p>
                    <p className="text-white font-medium text-sm sm:text-base">+91 98765 43210</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#f16a2f]/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#f16a2f]" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm">Visit us</p>
                    <p className="text-white font-medium text-sm sm:text-base">Bangalore, India</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} The Skill Circuit. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
