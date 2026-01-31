import { type FC, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Twitter, Clock, MapPin } from 'lucide-react';
import { cn } from '@utils/helpers';
import { config } from '@utils/config';
import { Button, Container } from '@components/ui';
import { useScroll, useIsMobile } from '@hooks/index';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
];

/**
 * Top bar with contact info and social links
 */
const TopBar: FC = () => (
  <div className="bg-primary-600 py-2 text-white text-sm">
    <Container>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{config.contact.businessHours}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span>{config.contact.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/80 transition-colors"
            aria-label="Follow us on Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/80 transition-colors"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/80 transition-colors"
            aria-label="Follow us on Twitter"
          >
            <Twitter className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Container>
  </div>
);

/**
 * Main Header component with navigation
 */
export const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled } = useScroll({ threshold: 50 });
  const isMobile = useIsMobile();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50">
      <TopBar />
      <nav
        className={cn(
          'bg-white transition-shadow duration-300',
          isScrolled && 'shadow-md'
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={closeMobileMenu}
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-600">
                <span className="text-white font-bold text-lg">AR</span>
              </div>
              <span className="font-bold text-lg text-neutral-900">
                AR CAR RENTALS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'font-medium transition-colors hover:text-primary-600',
                      isActive ? 'text-primary-600' : 'text-neutral-700'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Button variant="primary" size="sm">
                Log In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-neutral-700 hover:text-primary-600 transition-colors"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobile && (
            <div
              className={cn(
                'md:hidden overflow-hidden transition-all duration-300',
                isMobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
              )}
            >
              <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      cn(
                        'px-4 py-2 rounded-lg font-medium transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="mt-2 px-4">
                  <Button variant="primary" fullWidth>
                    Log In
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </nav>
    </header>
  );
};

export default Header;
