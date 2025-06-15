import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown, Menu, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import StockCard from './sub-components/StockCard';
import logo from '../assets/logo.jpg';
import '../css/HeaderComponent.css';
import { websocket_api_call } from '../services/Websocket';

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

  const userData = localStorage.getItem('userData');
  const { name } = userData ? JSON.parse(userData) : { name: 'User' };
  const { role } = userData ? JSON.parse(userData) : { role: null };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.setItem('isAuthenticated', 'false');
    document.cookie.split(";").forEach(cookie => {
    const name = cookie.split("=")[0].trim();
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
  });

    window.location.href = '/login';
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

  // Dropdown menu items
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <p><strong>Name:</strong> {name}</p>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="header-wrapper">
      <div className="header-inner">
        <div className="header-container">
          {/* Left container: Logo + stock cards */}
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

          {/* Right container: Navigation links + Profile */}
          <div className="right-container">
            <nav>
              <ul>
                <li>
                  <NavLink
                    to="/home"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/order"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    Order
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/market"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    Market
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/tools"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    Tools
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/brokers"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    Brokers
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/history"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    History
                  </NavLink>
                </li>
                { role ==='admin' && <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    Admin
                  </NavLink>
                </li>}
              </ul>
            </nav>

            {/* Profile Dropdown */}
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <UserOutlined className="profile-icon" />
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponents;