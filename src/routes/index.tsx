import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { MainLayout, AdminLayout } from '@components/layout';
import {
  LandingPage,
  NotFoundPage,
  FeaturesPage,
  PricingPage,
  ResourcesPage,
  LoginPage,
  RegisterPage,
  AdminDashboardPage,
  AdminFleetPage,
  AdminBookingsPage,
  AdminCustomersPage,
  AdminDriversPage,
  CustomerDashboardPage,
} from '@pages/index';

/**
 * Route configuration
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout><LandingPage /></MainLayout>,
  },
  {
    path: '/features',
    element: <MainLayout><FeaturesPage /></MainLayout>,
  },
  {
    path: '/pricing',
    element: <MainLayout><PricingPage /></MainLayout>,
  },
  {
    path: '/resources',
    element: <MainLayout><ResourcesPage /></MainLayout>,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/customer',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <CustomerDashboardPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'fleet', element: <AdminFleetPage /> },
      { path: 'bookings', element: <AdminBookingsPage /> },
      { path: 'customers', element: <AdminCustomersPage /> },
      { path: 'drivers', element: <AdminDriversPage /> },
    ],
  },
  {
    path: '*',
    element: <MainLayout><NotFoundPage /></MainLayout>,
  },
];

/**
 * Router instance
 */
export const router = createBrowserRouter(routes);

export default router;
