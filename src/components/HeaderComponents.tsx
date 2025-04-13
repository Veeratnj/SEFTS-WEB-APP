import React from 'react';
import { NavLink } from 'react-router-dom';
import StockCard from './sub-components/StockCard';
import logo from '../assets/logo.jpg';
import '../css/HeaderComponent.css';

const HeaderComponents = () => {
  return (
    <header className="header-wrapper">
      <div className="header-container">
        {/* Left container: Logo + stock cards */}
        <div className="left-container">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="stocks">
            <StockCard stockName="Nifty 50" points={2856.35} isUp={true} percentage="+0.52%" />
            <StockCard stockName="Nifty Bank" points={3785.10} isUp={false} percentage="-1.03%" />
            <StockCard stockName="Nifty Fin Services" points={1425.0} isUp={true} percentage="+0.75%" />
          </div>
        </div>

        {/* Right container: Navigation links */}
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
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponents;
