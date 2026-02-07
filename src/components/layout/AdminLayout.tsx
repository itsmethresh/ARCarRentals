import { type FC } from 'react';
import { Outlet } from 'react-router-dom';
import AdminFloatingSidebar from '@components/ui/AdminFloatingSidebar';

/**
 * Admin Layout with Floating Sidebar
 */
export const AdminLayout: FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar rendered at top level so mobile hamburger is always visible */}
      <AdminFloatingSidebar />

      <div className="admin-layout-wrapper">
        {/* Main Content Area */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .admin-layout-wrapper {
          display: flex;
          gap: 24px;
          padding: 48px;
          padding-left: 360px;
          min-height: 100vh;
        }

        .admin-main-content {
          flex: 1;
          min-width: 0;
          max-width: 1200px;
        }

        @media (max-width: 1024px) {
          .admin-layout-wrapper {
            padding: 24px;
            padding-left: 300px;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .admin-layout-wrapper {
            padding: 16px;
            padding-left: 16px;
            padding-top: 72px;
          }

          .admin-main-content {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
