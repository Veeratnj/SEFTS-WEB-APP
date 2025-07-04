import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown, Menu, Button, Drawer } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import StockCard from './sub-components/StockCard';
import logo from '../assets/logo.jpg';
import '../css/HeaderComponent.css';
import { websocket_api_call } from '../services/Websocket';
import { color } from 'framer-motion';

// Type definition for the stock data
interface Stock {
  stock_name: string;
  points: number;
  isUp: boolean;
  percentage: string;
}

const HeaderComponents: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([
    { stock_name: 's1', points: 0, isUp: false, percentage: '' },
    { stock_name: 's2', points: 0, isUp: false, percentage: '' },
    { stock_name: 's3', points: 0, isUp: false, percentage: '' },
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const userData = localStorage.getItem('userData');
  const { name } = userData ? JSON.parse(userData) : { name: 'User' };
  const { role } = userData ? JSON.parse(userData) : { role: null };

  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(";").forEach(cookie => {
      const name = cookie.split("=")[0].trim();
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    });
    const domain_name = import.meta.env.VITE_DOMAIN;
    window.location.href = `https://${domain_name}`;
  };

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/websocket/ws/stocks`;
    const userData = localStorage.getItem('userData');
    const { user_id } = userData ? JSON.parse(userData) : { user_id: null };
    const clientId = `${user_id}`;
    const tokens = ['99926000', '99926009', '99926037'];

    const socket = websocket_api_call(url, clientId, tokens, (data: any) => {
      if (Array.isArray(data.live_prices)) {
        setStocks((prevStocks) => {
          const updatedStocks = data.live_prices.map((stock: any, index: number) => {
            const prev = prevStocks[index];
            const prevPrice = prev?.points || 0;
            const currentPrice = stock.price;
            const isUp = currentPrice > prevPrice;
            const percentage = prevPrice === 0
              ? '0.00'
              : ((Math.abs(currentPrice - prevPrice) / prevPrice) * 100).toFixed(2);

            return {
              stock_name: stock.stock_name,
              points: currentPrice,
              isUp,
              percentage,
            };
          });
          return updatedStocks;
        });
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="1"><p><strong>Name:</strong> {name}</p></Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" onClick={handleLogout}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <header className="header-wrapper">
      <div className="header-inner">
        <div className="header-container">
          <div className="left-container">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
            <div className="stocks">
              {stocks.map((stock, index) => (
                <StockCard
                  id={index.toString()}
                  key={index}
                  stockName={stock.stock_name}
                  points={stock.points}
                  isUp={stock.isUp}
                  percentage={`${stock.percentage}%`}
                />
              ))}
            </div>
          </div>

          <div className="right-container">
            {/* Hamburger Icon for Mobile */}
            <MenuOutlined className="hamburger-icon" onClick={() => setIsDrawerOpen(true)} />

            {/* Desktop Navigation */}
            <nav className="nav-desktop">
              <ul>
                <li><NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink></li>
                <li><NavLink to="/order" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Order</NavLink></li>
                <li><NavLink to="/market" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Market</NavLink></li>
                <li><NavLink to="/tools" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Tools</NavLink></li>
                <li><NavLink to="/brokers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Brokers</NavLink></li>
                <li><NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>History</NavLink></li>
                {role === 'admin' && (
                  <li><NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Admin</NavLink></li>
                )}
              </ul>
            </nav>

            {/* Profile Dropdown */}
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <UserOutlined className="profile-icon" />
            </Dropdown>
            <h1 style={{ color: "white" }}>{name}</h1>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <Drawer
        title={`Hello, ${name}`}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        className="mobile-drawer"
      >
        <ul className="mobile-nav">
          <li><NavLink to="/home" onClick={() => setIsDrawerOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/order" onClick={() => setIsDrawerOpen(false)}>Order</NavLink></li>
          <li><NavLink to="/market" onClick={() => setIsDrawerOpen(false)}>Market</NavLink></li>
          <li><NavLink to="/tools" onClick={() => setIsDrawerOpen(false)}>Tools</NavLink></li>
          <li><NavLink to="/brokers" onClick={() => setIsDrawerOpen(false)}>Brokers</NavLink></li>
          <li><NavLink to="/history" onClick={() => setIsDrawerOpen(false)}>History</NavLink></li>
          {role === 'admin' && (
            <li><NavLink to="/admin" onClick={() => setIsDrawerOpen(false)}>Admin</NavLink></li>
          )}
          <li><Button type="link" onClick={handleLogout}>Logout</Button></li>
        </ul>
      </Drawer>
    </header>
  );
};

export default HeaderComponents;
