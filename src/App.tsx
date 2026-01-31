import type { FC } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@routes/index';

/**
 * Main App component
 */
export const App: FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
