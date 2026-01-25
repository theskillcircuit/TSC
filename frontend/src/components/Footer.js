import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#053d6c] text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#f16a2f] flex items-center justify-center">
                <span className="text-white font-bold text-lg font-['Outfit']">SC</span>
              </div>
              <span className="font-['Outfit'] font-bold text-xl">The Skill Circuit</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Transforming careers through skill mastery, behavioral excellence, and guaranteed outcomes.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#f16a2f] flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#f16a2f] flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#f16a2f] flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#f16a2f] flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Outfit'] font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-slate-300 hover:text-[#f16a2f] transition-colors text-sm">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-[#f16a2f] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-[#f16a2f] transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-[#f16a2f] transition-colors text-sm">
                  Student Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-['Outfit'] font-semibold text-lg mb-4">Programs</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/courses?category=neo" className="text-slate-300 hover:text-[#f16a2f] transition-colors text-sm">
                  Neo Courses
                </Link>
              </li>
              <li>
                <Link to="/courses?category=sprint" className="text-slate-300 hover:text-[#f16a2f] transition-colors text-sm">
                  Sprint Programs
                </Link>
              </li>
              <li>
                <Link to="/courses?category=pathway" className="text-slate-300 hover:text-[#f16a2f] transition-colors text-sm">
                  Pathway Tracks
                </Link>
              </li>
              <li>
                <Link to="/courses?category=launchpad" className="text-slate-300 hover:text-[#f16a2f] transition-colors text-sm">
                  Launchpad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-['Outfit'] font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#f16a2f] mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 text-sm">hello@skillcircuit.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#f16a2f] mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#f16a2f] mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 text-sm">Bangalore, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} The Skill Circuit. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
