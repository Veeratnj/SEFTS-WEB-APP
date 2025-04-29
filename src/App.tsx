import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HeaderComponents from './components/HeaderComponents';
import SidebarComponent from './components/SidebarComponent';
import Home from './components/pages/Home';
import Order from './components/pages/Order';
import Market from './components/pages/Market';
import Tools from './components/pages/Tools';
import Broker from './components/pages/Brokers';
import History from './components/pages/History';

import Login from './components/pages/Login';

// PrivateRoute Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Replace with actual authentication logic
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Layout Component for Authenticated Routes
const AuthenticatedLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <HeaderComponents />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-[40%] p-4">
          <SidebarComponent />
        </div>

        {/* Right Dynamic Content */}
        <div className="w-[60%] p-4 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<Order />} />
            <Route path="/brokers" element={<Broker />} />
            <Route path="/market" element={<Market />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/history" element={<History data={[]} caption={''} />} />
            <Route path="/home" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
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
};

export default App;