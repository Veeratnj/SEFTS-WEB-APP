import React, { useState, useEffect } from 'react';
import './TradeModal.css';
import post_api_call from '../services/PostAPI'; // Adjust the path if needed

interface Stock {
  name: string;
  price: number;
  change: string;
  stock_token: string; // Assuming stock_token is a string, adjust if needed
}

interface Strategy {
  strategy_name: string;
  uuid: string;
}

interface TradeModalProps {
  stock: Stock;
  isOpen: boolean;
  onClose: () => void;
}

const TradeModal: React.FC<TradeModalProps> = ({ stock, isOpen, onClose }) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [tradeCount, setTradeCount] = useState<number>(0); 
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/common/get/strategies/');
        const data = await response.json();
        if (data.status === 200) {
          setStrategies(data.data);
        } else {
          setError('Failed to fetch strategies');
        }
      } catch (err) {
        setError('Error fetching strategies');
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  const handleRunAlgo = async () => {
    if (!selectedStrategy || quantity <= 0) {
      alert('Please select a strategy and enter a valid quantity.');
      return;
    }

    const selectedStrategyObj = strategies.find(s => s.uuid === selectedStrategy);
    if (!selectedStrategyObj) {
      alert('Selected strategy not found.');
      return;
    }

    const payload = {
      strategy_name: selectedStrategyObj.strategy_name,
      strategy_uuid: selectedStrategyObj.uuid,
      stock_name: stock.name,
      stock_token: stock.stock_token, // Replace with actual token if available
      quantity: quantity,
      trade_count:tradeCount
    };

    try {
      const response = await post_api_call(
        'http://127.0.0.1:8000/common/post/add/strategy/',
        undefined,
        undefined,
        { 'Content-Type': 'application/json' },
        payload
      );

      if (response.status === 201) {
        setSuccessMsg(response.data);
        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 2000);
      } else {
        alert('Something went wrong while adding the strategy.');
      }
    } catch (error) {
      console.error('Error running algo:', error);
      alert('Error running strategy. Please try again.');
    }
  };

  if (!isOpen) return null;

  if (successMsg) {
    return (
      <div className="trade-modal-overlay">
        <div className="trade-modal-card">
          <div className="trade-modal-body">
            <p>{successMsg}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trade-modal-overlay">
      <div className="trade-modal-card">
        <div className="trade-modal-header">
          <div className="stock-info">
            <span className="stock-name">{stock.name}</span>
            <span className="stock-price">
              ₹{stock.price} <span className="stock-change">({stock.change})</span>
            </span>
          </div>
        </div>

        <div className="trade-modal-body">
          <div className="field-pair">
            <div className="form-group">
              <label htmlFor="quantity">Enter Quantity</label>
              <input
                type="number"
                id="quantity"
                placeholder="e.g. 100"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="no-of-trade">Enter number of Trade</label>
              <input
                type="number"
                id="no-of-trade"
                placeholder="e.g. 1"
                value={tradeCount}
                onChange={(e) => setTradeCount(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="algo">Choose Algo Strategy</label>
              <select
                id="algo"
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                disabled={loading || error !== null}
              >
                <option value="">Select...</option>
                {loading ? (
                  <option disabled>Loading strategies...</option>
                ) : error ? (
                  <option disabled>{error}</option>
                ) : (
                  strategies.map((strategy) => (
                    <option key={strategy.uuid} value={strategy.uuid}>
                      {strategy.strategy_name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="trade-modal-footer">
          <button className="btn cancel" onClick={onClose}>Cancel</button>
          <button className="btn run" onClick={handleRunAlgo}>Run Algo</button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;
