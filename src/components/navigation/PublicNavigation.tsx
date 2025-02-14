import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function PublicNavigation() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-sage/10 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <BookOpen className="h-8 w-8 text-accent" />
            <span className="ml-2 text-xl font-bold text-primary-dark">TeachAI</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Login button - responsive styles */}
            <Link 
              to="/login" 
              className="text-primary hover:text-primary-dark"
            >
              Login
            </Link>
            
            {/* Other navigation items - hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/pricing" className="text-primary hover:text-primary-dark">
                Pricing
              </Link>
              <button
                onClick={handleGetStarted}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 shadow-soft"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}