import { Outlet, useLocation } from 'react-router-dom';
import './App.css';

function App() {
  const location = useLocation();
  
  // Hide the site title on surprise pages
  const isSurprisePage = location.pathname.startsWith('/surprise/');
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      {!isSurprisePage && (
        <header className="w-full bg-white shadow-sm">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-center">
            <h1 className="text-2xl font-bold text-purple-600">Anniversary Vibe</h1>
          </div>
        </header>
      )}
      
      <main className="flex-grow w-full flex flex-col relative">
        <Outlet />
      </main>
      
      <footer className="w-full bg-white border-t border-gray-200 mt-8 relative z-10">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Made with ❤️ | Share your love with Anniversary Vibe
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
