import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Splitter } from 'antd'; // Make sure you have antd@5.13.0+ installed

import HeaderComponents from './components/HeaderComponents';
import SidebarComponent from './components/SidebarComponent';
import Home from './components/pages/Home';
import Order from './components/pages/Order';
import Market from './components/pages/Market';
import Tools from './components/pages/Tools';
import Broker from './components/pages/Brokers';
import History from './components/pages/History';
import Login from './components/pages/Login';
import Admin from './components/pages/Admin';

// PrivateRoute Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Layout Component for Authenticated Routes
const AuthenticatedLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  // Handle window resize to detect mobile screen
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <HeaderComponents />
      <div className="flex flex-1">
        {/* Desktop layout with sidebar */}
        {!isMobile && sidebarOpen ? (
          <Splitter style={{ width: '100%' }}>
            <Splitter.Panel
              defaultSize="40%"
              min="20%"
              max="70%"
              style={{ position: 'relative' }}
            >
              <button
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 10,
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: 4,
                  padding: '2px 8px',
                  cursor: 'pointer'
                }}
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                ×
              </button>
              <SidebarComponent />
            </Splitter.Panel>
            <Splitter.Panel>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/order" element={<Order />} />
                <Route path="/brokers" element={<Broker />} />
                <Route path="/market" element={<Market />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/history" element={<History />} />
                <Route path="/home" element={<Navigate to="/" />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Splitter.Panel>
          </Splitter>
        ) : (
          // Mobile or no-sidebar layout
          <div className="w-full p-4 overflow-auto relative">
            {!isMobile && (
              <button
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 10,
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: 4,
                  padding: '2px 8px',
                  cursor: 'pointer'
                }}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
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
              <Route path="/history" element={<History />} />
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
