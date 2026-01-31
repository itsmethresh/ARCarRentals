import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Container, Button } from '@components/ui';

/**
 * 404 Not Found page component
 */
export const NotFoundPage: FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Container maxWidth="sm">
        <div className="text-center py-16">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-neutral-500 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been removed or the URL is incorrect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button
                variant="primary"
                leftIcon={<Home className="h-5 w-5" />}
              >
                Go to Homepage
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              leftIcon={<ArrowLeft className="h-5 w-5" />}
            >
              Go Back
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;
