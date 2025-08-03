import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HeaderComponents from './components/HeaderComponents';
import SidebarComponent from './components/SidebarComponent';
import Home from './components/pages/Home';
import Order from './components/pages/Order';
import Market from './components/pages/Market';
import Tools from './components/pages/Tools';
import Broker from './components/pages/Brokers';
import Login from './components/pages/Login';
import Admin from './components/pages/Admin';
import TradeHistoryMain from './components/pages/TradeHistoryMain';

// PrivateRoute Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Layout Component for Authenticated Routes
const AuthenticatedLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <HeaderComponents />
      <div className="flex flex-1">
        {/* Desktop layout with sidebar */}
        {!isMobile && sidebarOpen ? (
          <>
            <div className="w-1/4 relative border-r">
              <button
                className="absolute top-2 right-2 z-10 bg-gray-200 rounded px-2"
                onClick={() => setSidebarOpen(false)}
              >
                ×
              </button>
              <SidebarComponent />
            </div>
            <div className="w-3/4 overflow-auto p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/order" element={<Order />} />
                <Route path="/brokers" element={<Broker />} />
                <Route path="/market" element={<Market />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/history" element={<TradeHistoryMain />} />
                <Route path="/home" element={<Navigate to="/" />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </div>
          </>
        ) : (
          <div className="w-full p-4 overflow-auto relative">
            {!isMobile && (
              <button
                className="absolute top-2 left-2 z-10 bg-gray-200 rounded px-2"
                onClick={() => setSidebarOpen(true)}
              >
                ≡
              </button>
            )}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/order" element={<Order />} />
              <Route path="/brokers" element={<Broker />} />
              <Route path="/market" element={<Market />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/history" element={<TradeHistoryMain />} />
              <Route path="/home" element={<Navigate to="/" />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AuthenticatedLayout />
          </PrivateRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
