import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { config } from '@utils/config';

/**
 * Footer component - Redesigned with multi-column layout and embedded map
 */
export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  // Footer navigation links
  const footerLinks = {
    about: [
      { label: 'About Us', href: '/aboutus' },
      { label: 'Our Fleet', href: '/browsevehicles' },
      { label: 'Locations', href: '/contact' },
      { label: 'Reviews', href: '/aboutus#reviews' },
    ],
    menu: [
      { label: 'Home', href: '/' },
      { label: 'Fleet', href: '/browsevehicles' },
      { label: 'Services', href: '/aboutus' },
      { label: 'Contact', href: '/contact' },
    ],
    services: [
      { label: 'Self-Drive Rental', href: '/browsevehicles' },
      { label: 'With Driver', href: '/browsevehicles' },
      { label: 'Airport Pickup', href: '/contact' },
      { label: 'Tour Packages', href: '/aboutus' },
    ],
  };

  return (
    <footer style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="relative z-10 overflow-hidden">
      {/* Main Footer Content */}
      <div className="bg-neutral-900 py-12 lg:py-16 relative z-10">
        <div className="mx-auto w-full max-w-[1600px]" style={{ paddingInline: 'clamp(1.5rem, 3vw, 3rem)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">

            {/* Brand Column */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <Link to="/" className="inline-block mb-4">
                <img
                  src="/ARCarRentals.png"
                  alt="AR Car Rentals Logo"
                  className="h-24 w-auto object-contain"
                />
              </Link>

              {/* Slogan */}
              <p className="text-[#E22B2B] font-semibold text-sm mb-4">
                Your Trusted Car Rental Partner
              </p>

              {/* Description */}
              <p className="text-neutral-400 text-sm mb-6 max-w-xs leading-relaxed">
                Providing quality and affordable car rental services in Cebu City since 2010. Experience comfort, reliability, and exceptional service.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com/arcarrentalscebu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-neutral-600 flex items-center justify-center text-neutral-400 hover:bg-[#E22B2B] hover:border-[#E22B2B] hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-neutral-600 flex items-center justify-center text-neutral-400 hover:bg-[#E22B2B] hover:border-[#E22B2B] hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-neutral-600 flex items-center justify-center text-neutral-400 hover:bg-[#E22B2B] hover:border-[#E22B2B] hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-neutral-600 flex items-center justify-center text-neutral-400 hover:bg-[#E22B2B] hover:border-[#E22B2B] hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* About Links */}
            <div>
              <h3 className="font-bold text-white mb-4">About</h3>
              <ul className="space-y-3">
                {footerLinks.about.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-neutral-400 hover:text-[#E22B2B] transition-colors text-sm flex items-center gap-2"
                    >
                      <span className="text-[#E22B2B]">›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Menu Links */}
            <div>
              <h3 className="font-bold text-white mb-4">Menu</h3>
              <ul className="space-y-3">
                {footerLinks.menu.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-neutral-400 hover:text-[#E22B2B] transition-colors text-sm flex items-center gap-2"
                    >
                      <span className="text-[#E22B2B]">›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="font-bold text-white mb-4">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-neutral-400 hover:text-[#E22B2B] transition-colors text-sm flex items-center gap-2"
                    >
                      <span className="text-[#E22B2B]">›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + Map */}
            <div className="lg:col-span-1">
              <h3 className="font-bold text-white mb-4">Contact</h3>
              <ul className="space-y-3 mb-4">
                <li className="text-sm">
                  <span className="text-white font-medium">Call:</span>
                  <br />
                  <a href={`tel:${config.contact.phone.replace(/\s/g, '')}`} className="text-neutral-400 hover:text-[#E22B2B] transition-colors">
                    {config.contact.phone}
                  </a>
                </li>
                <li className="text-sm">
                  <span className="text-white font-medium">Email:</span>
                  <br />
                  <a href={`mailto:${config.contact.email}`} className="text-neutral-400 hover:text-[#E22B2B] transition-colors">
                    {config.contact.email}
                  </a>
                </li>
              </ul>

              {/* Mini Map */}
              <div className="rounded-lg overflow-hidden h-[120px] border border-neutral-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1097.9893781772598!2d123.95057130262597!3d10.31254061844564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a9993cc853238d%3A0xf750bf6ab6483471!2sAR%20Car%20Rentals%20%26%20Tour%20Services%20Cebu!5e0!3m2!1sen!2sph!4v1770650571353!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AR Car Rentals Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Red Gradient */}
      <div className="py-4" style={{ background: 'linear-gradient(90deg, #E22B2B 0%, #b91c1c 50%, #991b1b 100%)' }}>
        <div className="mx-auto w-full max-w-[1600px]" style={{ paddingInline: 'clamp(1.5rem, 3vw, 3rem)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            {/* Quick Links */}
            <div className="flex items-center gap-6 text-white">
              <Link to="/privacy-policy" className="hover:text-white/80 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-white/50">|</span>
              <Link to="/aboutus" className="hover:text-white/80 transition-colors">
                Our History
              </Link>
              <span className="text-white/50">|</span>
              <Link to="/terms-of-service" className="hover:text-white/80 transition-colors">
                Terms of Service
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-white/80">
              © {currentYear} {config.app.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
