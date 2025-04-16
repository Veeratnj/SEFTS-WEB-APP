import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import StockCard from './sub-components/StockCard';
import logo from '../assets/logo.jpg';
import '../css/HeaderComponent.css';
import { websocket_api_call } from '../services/Websocket';

const HeaderComponents = () => {

  const [stocks, setStocks] = useState([
    { stock_name: 's1', points: 0, isUp: false, percentage: '' },
    { stock_name: 's2', points: 0, isUp: false, percentage: '' },
    { stock_name: 's3', points: 0, isUp: false, percentage: '' },
  ]);



  // useEffect(() => {
  //   const url = 'ws://127.0.0.1:8000/websocket/ws/stocks'; // Correct WebSocket URL
  //   const clientId = 'unique-client-id'; // Replace with a unique client ID
  //   const tokens = ['9123', '2885','3045']; // Replace with actual tokens
  
  //   const socket = websocket_api_call(url, clientId, tokens, (data) => {
  //     if (Array.isArray(data.live_prices)) { // Check for the correct structure of the response
  //       setStocks(data.live_prices); // Update the stocks state with live prices
  //       console.log('Received data:', data.live_prices);
  //     }
  //   });
  
  //   return () => {
  //     socket.close(); // Cleanup WebSocket connection on component unmount
  //   };
  // }, []);

  // useEffect(() => {
  //   const url = 'ws://127.0.0.1:8000/websocket/ws/stocks';
  //   const clientId = 'unique-client-id';
  //   const tokens = ['9123', '2885', '3045'];
  
  //   const socket = websocket_api_call(url, clientId, tokens, (data) => {
  //     if (Array.isArray(data.live_prices)) {
  //       const updatedStocks = data.live_prices.map((stock, index) => {
  //         const prev = stocks[index];
  //         const prevPrice = prev?.points || 0;
  //         const currentPrice = stock.price;
  //         const isUp = currentPrice > prevPrice;
  //         const percentage = prevPrice === 0 ? '0.00' : ((Math.abs(currentPrice - prevPrice) / prevPrice) * 100).toFixed(2);
  //         console.log('stock_name:', stock.stock_name);
  //         console.log('updated stocks:', updatedStocks);
  //         return {
  //           stock_name: stock.stock_name,
  //           points: currentPrice,
  //           isUp,
  //           percentage,
  //         };
  //       });
  
  //       setStocks(updatedStocks);
  //       console.log('Updated Stocks:', updatedStocks);
  //     }
  //   });
  
  //   return () => {
  //     socket.close();
  //   };
  // }, []);
  
  useEffect(() => {
    const url = 'ws://127.0.0.1:8000/websocket/ws/stocks';
    const clientId = 'unique-client-id';
    const tokens = ['9123', '2885', '3045'];
  
    const socket = websocket_api_call(url, clientId, tokens, (data) => {
      if (Array.isArray(data.live_prices)) {
        setStocks((prevStocks) => {
          const updatedStocks = data.live_prices.map((stock: any, index: number) => {
            const prev = prevStocks[index];
            const prevPrice = prev?.points || 0;
            const currentPrice = stock.price;
            const isUp = currentPrice > prevPrice;
            const percentage = prevPrice === 0
              ? '0.00'
              : ((Math.abs(currentPrice - prevPrice) / prevPrice) * 100)?.toFixed(2);
  
            return {
              stock_name: stock.stock_name,
              points: currentPrice,
              isUp,
              percentage,
            };
          });
  
          // console.log('Updated Stocks:', updatedStocks);
          return updatedStocks;
        });
      }
    });
  
    return () => {
      socket.close();
    };
  }, []);
  


  return (
    <header className="header-wrapper">
      <div className="header-container">
        {/* Left container: Logo + stock cards */}
        <div className="left-container">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          {/* <div className="stocks">
            <StockCard stock_name="Nifty 50" points={2856.35} isUp={true} percentage="+0.52%" />
            <StockCard stock_name="Nifty Bank" points={3785.10} isUp={false} percentage="-1.03%" />
            <StockCard stock_name="Nifty Fin Services" points={1425.0} isUp={true} percentage="+0.75%" />
          </div> */}
          <div className="stocks">
            {stocks.map((stock, index: any) => (
              // console.log('stock:', stock.stock_name),
              // <StockCard
              //   key={index}
              //   stock_name={stock.stock_name}
              //   points={stock.points}
              //   isUp={stock.isUp}
              //   percentage={'0%'}
              // />
              <StockCard
                id={index}
                key={index}
                stockName={stock.stock_name} // ✅ corrected name
                points={stock.points}
                isUp={stock.isUp}
                percentage={`${stock.percentage}%`} // ✅ pass computed percentage
              />

            ))}
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
