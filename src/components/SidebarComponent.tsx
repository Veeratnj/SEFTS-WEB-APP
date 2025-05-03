import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import get_api_call from '../services/GetAPI';
import TradeModal from './TradeModal';

const SidebarComponent: React.FC = () => {
  const [nseStocks, setNseStocks] = useState([
    { name: 'RELIANCE', points: 12.34, percentage: 1.23, token: '' },
    { name: 'TCS', points: -8.56, percentage: -0.87, token: '' },
    { name: 'INFY', points: 5.21, percentage: 0.45, token: '' },
    { name: 'HDFC', points: -3.87, percentage: -1.12, token: '' },
    { name: 'SBIN', points: 0.45, percentage: 0.18, token: '' },
  ]);

  const [optionsStocks, setOptionsStocks] = useState([
    { name: 'NIFTY 50', points: 15.22, percentage: 1.45, token: '' },
    { name: 'BANKNIFTY', points: -7.14, percentage: -0.56, token: '' },
    { name: 'FINNIFTY', points: 4.67, percentage: 0.72, token: '' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<{
    name: string;
    price: number;
    change: string;
    stock_token: string;
  } | null>(null);

  const handleTradeClick = (stock: { name: string; points: number; percentage?: number; token: string }) => {
    const price = stock.points;
    const change = stock.percentage ?? 0;

    setSelectedStock({
      name: stock.name,
      price: price,
      change: `${change > 0 ? '+' : ''}${change.toFixed(2)}%`,
      stock_token: stock.token ?? ''
    });

    setIsModalOpen(true);
  };
  const userData = localStorage.getItem('userData');
  const { role } = userData ? JSON.parse(userData) : { role: null };

  const is_admin = role === 'admin'? true : false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const nseData = await get_api_call(`${baseUrl}/common/get/stock/tocken`);
        const optionsData = await get_api_call(`${baseUrl}/common/get/stock/tocken`);

        if (Array.isArray(nseData.data)) {
          setNseStocks(nseData.data);
        }
        setNseFavs(nseData.data.map((stock: { name: any }) => stock.name));

        if (Array.isArray(optionsData.data)) {
          setOptionsStocks(optionsData.data);
        }
      } catch (error) {
        console.error('Failed to fetch stock data', error);
      }
    };

    fetchData();
  }, []);

  const [selectedTab, setSelectedTab] = useState<'NSE Hot list' | 'Options'>('NSE Hot list');
  const [searchTerm, setSearchTerm] = useState('');
  const [nseFavs, setNseFavs] = useState<string[]>([]);
  const [optionFavs, setOptionFavs] = useState<string[]>([]);
  const stocks = selectedTab === 'NSE Hot list' ? nseStocks : optionsStocks;
  const favs = selectedTab === 'NSE Hot list' ? nseFavs : optionFavs;
  const setFavs = selectedTab === 'NSE Hot list' ? setNseFavs : setOptionFavs;

  const filteredStocks = searchTerm
    ? stocks.filter(stock =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleAddFav = (stock: string) => {
    if (!favs.includes(stock)) {
      setFavs([...favs, stock]);
      setSearchTerm('');
    }
  };

  const handleRemoveFav = (stock: string) => {
    setFavs(favs.filter(f => f !== stock));
    setSearchTerm('');
  };

  const getArrowIcon = (points: number) =>
    points >= 0 ? (
      <FaArrowUp className="text-green-500 text-xs ml-1" />
    ) : (
      <FaArrowDown className="text-red-500 text-xs ml-1" />
    );
    const disableOptionsButton = true;
    const disableRemovesButton = true;
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
      {/* Company Name */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700 tracking-wide">
          SMART ELITE TRADING CLUB
        </h2>
      </div>

      {/* Tab buttons */}
      <div className="flex justify-center space-x-4 mb-4 ">
      {['NSE Hot list', 'Options'].map(tab => (
        <button
          key={tab}
          onClick={() => {
            if (tab !== 'Options' || !disableOptionsButton) {
              setSelectedTab(tab as 'NSE Hot list' | 'Options');
              setSearchTerm('');
            }
          }}
          className={`px-5 py-2 rounded-full font-semibold text-sm shadow cursor-pointer ${
            selectedTab === tab
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          } transition duration-300`}
          disabled={tab === 'Options' && disableOptionsButton}
        >
          {tab}
        </button>
      ))}
    </div>

      {/* Search bar */}
      {is_admin && 
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          placeholder={`Search ${selectedTab} stocks...`}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        {searchTerm && filteredStocks.length > 0 && (
          <div className="absolute bg-white border rounded-lg w-full shadow-md mt-2 z-10 overflow-auto max-h-60">
            {filteredStocks.map(stock => (
              <div
                key={stock.name}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{stock.name}</span>
                  <span
                    className={`text-sm flex items-center ${
                      stock.points >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stock.points?.toFixed(2)} {getArrowIcon(stock.points)}
                    <span className="ml-1">
                      ({stock.percentage?.toFixed(2)}%)
                    </span>
                  </span>
                </div>
                {favs.includes(stock.name) ? (
                  <button
                    className="text-red-500 text-xs cursor-pointer"
                    onClick={() => handleRemoveFav(stock.name)}
                    
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    className="text-blue-500 text-xs cursor-pointer"
                    onClick={() => handleAddFav(stock.name)}
                  >
                    Add
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>}

      {/* Favorite Stocks */}
      {favs.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold text-blue-800 mb-2">
            Favorite {selectedTab} Stocks
          </h4>
          <div className="overflow-y-auto pr-2 max-h-[calc(100vh-300px)]">
            <ul className="space-y-3">
              {favs.map(favName => {
                const stock = stocks.find(s => s.name === favName);
                if (!stock) return null;
                return (
                  <li
                    key={favName}
                    className="flex justify-between items-center px-4 py-2 bg-blue-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{stock.name}</span>
                      <span
                        className={`text-sm flex items-center ${
                          stock.points >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stock.points.toFixed(2)} {getArrowIcon(stock.points)}
                        <span className="ml-1">
                          ({stock.percentage?.toFixed(2)}%)
                        </span>
                      </span>
                    </div>
                    {is_admin && <div className="flex items-center space-x-2">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full cursor-pointer"
                        onClick={() => handleRemoveFav(stock.name)}
                      >
                        Remove
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full cursor-pointer"
                        onClick={() => handleTradeClick(stock)}
                      >
                        Trade
                      </button>
                    </div>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SidebarComponent;
