import React, { useEffect, useState } from 'react';
import StockCard from './sub-components/StockCard';
import logo from '../assets/logo.jpg';
import '../css/HeaderComponent.css';
import { websocket_api_call } from '../services/Websocket';

const HeaderComponents = () => {
  const [stocks, setStocks] = useState([
    { stockName: '', points: 0, isUp: null, percentage: '' },
    { stockName: '', points: 0, isUp: null, percentage: '' },
    { stockName: '', points: 0, isUp: null, percentage: '' },
  ]);

  useEffect(() => {
    const url = 'ws://127.0.0.1:8000/ws';
    const clientId = 'unique-client-id'; // Replace with a unique client ID
    const tokens = ['26000', '26009', '26037']; // Replace with actual tokens

    const socket = websocket_api_call(url, clientId, tokens, (data) => {
      if (Array.isArray(data)) {
        setStocks(data); // Update the stocks state directly with the received data
      }
    });

    return () => {
      socket.close(); // Cleanup WebSocket connection on component unmount
    };
  }, []);

  return (
    <header className="header-wrapper">
      <div className="header-container">
        <div className="left-container">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="stocks">
            {stocks.map((stock, index) => (
              <StockCard
                key={index}
                stockName={stock.stockName}
                points={stock.points}
                isUp={stock.isUp}
                percentage={stock.percentage}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponents;