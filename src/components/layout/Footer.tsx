import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Container } from '@components/ui';
import { config } from '@utils/config';

/**
 * Footer component
 */
export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/aboutus' },
      { label: 'Our Fleet', href: '/browsevehicles' },
      { label: 'Locations', href: '/aboutus' },
    ],
    services: [
      { label: 'Car Rental' },
      { label: 'Tour Packages' },
      { label: 'Airport Pickup' },
      { label: 'Corporate Rental' },
    ],
    support: [
      { label: 'FAQs', href: '/faq' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Contact Us', href: '/contact' },
    ],
  };

  return (
    <footer className="bg-neutral-900 text-white">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-600">
                  <span className="text-white font-bold text-lg">AR</span>
                </div>
                <span className="font-bold text-lg">AR CAR RENTAL SERVICES</span>
              </Link>
              <p className="text-neutral-400 text-sm mb-6 max-w-xs">
                Your trusted partner for car rental and tour services in Cebu City.
                Experience comfort, reliability, and exceptional service.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-neutral-800 hover:bg-primary-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-neutral-800 hover:bg-primary-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-neutral-800 hover:bg-primary-600 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-neutral-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <span className="text-neutral-400 hover:text-white transition-colors text-sm cursor-default">
                      {link.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-neutral-400">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{config.contact.location}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-neutral-400">
                  <Phone className="h-5 w-5 shrink-0" />
                  <a href={`tel:${config.contact.phone}`} className="hover:text-white transition-colors">
                    {config.contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-neutral-400">
                  <Mail className="h-5 w-5 shrink-0" />
                  <a href={`mailto:${config.contact.email}`} className="hover:text-white transition-colors">
                    {config.contact.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
            <p>© {currentYear} {config.app.name}. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
