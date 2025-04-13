import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HeaderComponents from './components/HeaderComponents';
import SidebarComponent from './components/SidebarComponent';
import Home from './components/pages/Home';
import Order from './components/pages/Order';
import Market from './components/pages/Market';
import Tools from './components/pages/Tools';
import Broker from './components/pages/Brokers';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Top Navbar */}
        <HeaderComponents />

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Left Static Card - 40% */}
          <div className="w-[40%] p-4">
            <SidebarComponent />
          </div>

          {/* Right Dynamic Page - 60% */}
          <div className="w-[60%] p-4 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/order" element={<Order />} />
              <Route path="/brokers" element={<Broker />} />
              <Route path="/market" element={<Market />} />
              <Route path="/tools" element={<Tools />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
