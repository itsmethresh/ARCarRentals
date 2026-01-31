import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import {
  LandingPage,
  NotFoundPage,
  FeaturesPage,
  PricingPage,
  ResourcesPage,
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
    path: '*',
    element: <MainLayout><NotFoundPage /></MainLayout>,
  },
];

/**
 * Router instance
 */
export const router = createBrowserRouter(routes);

export default router;
