import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  CreditCard, 
  FileText, 
  BarChart3,
  Users,
  Globe,
  UserCog,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { authService } from '@services/authService';
import { LogoutModal } from './LogoutModal';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const AdminFloatingSidebar: React.FC = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const navSections: NavSection[] = [
    {
      title: 'MENU',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          href: '/admin/dashboard',
          icon: <LayoutDashboard className="nav-icon-svg" />,
        },
        {
          id: 'fleet',
          label: 'Fleet',
          href: '/admin/fleet',
          icon: <Car className="nav-icon-svg" />,
        },
        {
          id: 'bookings',
          label: 'Bookings',
          href: '/admin/bookings',
          icon: <Calendar className="nav-icon-svg" />,
        },
      ],
    },
    {
      title: 'FINANCIAL',
      items: [
        {
          id: 'transactions',
          label: 'Transactions',
          href: '/admin/transactions',
          icon: <CreditCard className="nav-icon-svg" />,
        },
        {
          id: 'invoices',
          label: 'Invoices',
          href: '/admin/invoices',
          icon: <FileText className="nav-icon-svg" />,
        },
        {
          id: 'analytics',
          label: 'Analytics',
          href: '/admin/analytics',
          icon: <BarChart3 className="nav-icon-svg" />,
        },
      ],
    },
    {
      title: 'WEBSITE',
      items: [
        {
          id: 'leads',
          label: 'Leads',
          href: '/admin/leads',
          icon: <Users className="nav-icon-svg" />,
        },
        {
          id: 'content',
          label: 'Website Content',
          href: '/admin/content',
          icon: <Globe className="nav-icon-svg" />,
        },
      ],
    },
    {
      title: 'TOOLS',
      items: [
        {
          id: 'users',
          label: 'User & Roles',
          href: '/admin/users',
          icon: <UserCog className="nav-icon-svg" />,
        },
        {
          id: 'settings',
          label: 'Settings',
          href: '/admin/settings',
          icon: <Settings className="nav-icon-svg" />,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`admin-floating-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Header: Logo and Name */}
        <div className="sidebar-header">
          <div className="logo-container">
            <img src="/ARCarRentals.png" alt="AR Car Rentals" className="logo" />
            <div className="brand-name">AR Car Rentals</div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="sidebar-content">
          {navSections.map((section) => (
            <div key={section.title} className="nav-section">
              <div className="section-title">{section.title}</div>
              <div className="section-items">
                {section.items.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.href}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {/* Logout in TOOLS section */}
          <div className="nav-section">
            <div className="section-items">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogoutClick();
                }}
                className="nav-item logout-button"
              >
                <span className="nav-icon">
                  <LogOut className="nav-icon-svg" />
                </span>
                <span className="nav-label">Log out</span>
              </button>
            </div>
          </div>
        </div>

        <style>{`
        .admin-floating-sidebar {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          width: 280px;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 48px;
          left: 48px;
          height: calc(100vh - 96px);
          overflow: hidden;
          z-index: 50;
        }

        .sidebar-header {
          margin-bottom: 24px;
          flex-shrink: 0;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.02em;
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-right: 4px;
          scrollbar-width: thin;
          scrollbar-color: #E5E7EB transparent;
          min-height: 0;
        }

        .sidebar-content::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-content::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 2px;
        }

        .sidebar-content::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }

        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-title {
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0 12px;
          margin-bottom: 4px;
        }

        .section-items {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #1a1a1a;
          font-family: inherit;
          text-decoration: none;
          width: 100%;
          font-size: 14px;
          font-weight: 500;
        }

        .nav-item:hover {
          background: #f9fafb;
        }

        .nav-item.active {
          background: #E22B2B;
          color: white;
        }

        .nav-item.active:hover {
          background: #c71f1f;
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-icon-svg {
          width: 20px;
          height: 20px;
        }

        .nav-label {
          font-size: 14px;
          font-weight: 500;
        }

        .logout-button {
          text-align: left;
        }

        .mobile-menu-toggle {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          background: #E22B2B;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(226, 43, 43, 0.3);
          transition: all 0.2s;
        }

        .mobile-menu-toggle:hover {
          background: #c71f1f;
        }

        .mobile-menu-toggle:active {
          transform: scale(0.95);
        }

        .mobile-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        @media (max-width: 1024px) {
          .admin-floating-sidebar {
            width: 240px;
            padding: 20px 16px;
            left: 24px;
            top: 24px;
            height: calc(100vh - 48px);
          }

          .brand-name {
            font-size: 16px;
          }

          .nav-item {
            padding: 10px 12px;
            gap: 10px;
          }

          .nav-label {
            font-size: 13px;
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-overlay {
            display: block;
          }

          .admin-floating-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            height: 100vh;
            width: 280px;
            margin: 0;
            border-radius: 0;
            z-index: 1000;
            transition: left 0.3s ease;
            overflow-y: auto;
          }

          .admin-floating-sidebar.mobile-open {
            left: 0;
          }

          .sidebar-content {
            max-height: calc(100vh - 100px);
          }
        }

        @media (max-width: 480px) {
          .admin-floating-sidebar {
            width: 260px;
          }

          .mobile-menu-toggle {
            top: 16px;
            left: 16px;
            padding: 8px;
          }
        }
      `}</style>
    </aside>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default AdminFloatingSidebar;
