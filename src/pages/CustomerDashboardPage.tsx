import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Calendar, Clock, User, LogOut, Menu, X } from 'lucide-react';
import { Button, Container, Card } from '@components/ui';
import { authService, type User as UserType } from '@services/authService';

/**
 * Customer Dashboard page
 */
export const CustomerDashboardPage: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      if (currentUser.role === 'admin' || currentUser.role === 'staff') {
        navigate('/admin/dashboard');
        return;
      }
      setUser(currentUser);
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <Container>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-600">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-lg text-neutral-900">AR CAR RENTALS</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-neutral-600">
                Welcome, <span className="font-semibold text-neutral-900">{user.fullName}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />}>
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-neutral-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-neutral-200">
              <div className="flex flex-col gap-2">
                <p className="px-4 py-2 text-neutral-600">
                  Welcome, <span className="font-semibold">{user.fullName}</span>
                </p>
                <Button variant="ghost" fullWidth onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />}>
                  Logout
                </Button>
              </div>
            </div>
          )}
        </Container>
      </header>

      {/* Dashboard Content */}
      <main className="py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Customer Dashboard</h1>
            <p className="text-neutral-500">Manage your bookings and account information</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100">
                  <Calendar className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">0</p>
                  <p className="text-sm text-neutral-500">Active Bookings</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">0</p>
                  <p className="text-sm text-neutral-500">Completed Rentals</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">0</p>
                  <p className="text-sm text-neutral-500">Favorite Vehicles</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Account Information */}
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-bold text-neutral-900">Account Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-neutral-500">Full Name</label>
                <p className="text-neutral-900 font-medium">{user.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Email</label>
                <p className="text-neutral-900 font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Phone Number</label>
                <p className="text-neutral-900 font-medium">{user.phoneNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Account Type</label>
                <p className="text-neutral-900 font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </Card>

          {/* Recent Bookings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Recent Bookings</h2>
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 mb-4">No bookings yet</p>
              <Button variant="primary" onClick={() => navigate('/')}>
                Browse Vehicles
              </Button>
            </div>
          </Card>
        </Container>
      </main>
    </div>
  );
};

export default CustomerDashboardPage;
