// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-6">The page you are looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;