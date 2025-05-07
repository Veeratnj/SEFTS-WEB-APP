import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const stocks: string[] = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']; // Example stock list

const Market: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<string>('1d');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility

  const handleStockSelect = (stock: string) => {
    setSelectedStock(stock);
    setSearchTerm('');
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fake dummy candlestick data
  const dummyData = [
    {
      x: new Date('2025-04-01').getTime(),
      y: [100, 110, 90, 105]
    },
    {
      x: new Date('2025-04-02').getTime(),
      y: [105, 115, 95, 110]
    },
    {
      x: new Date('2025-04-03').getTime(),
      y: [110, 120, 100, 115]
    },
    {
      x: new Date('2025-04-04').getTime(),
      y: [115, 125, 105, 120]
    },
  ];

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 350,
    },
    title: {
      text: `${selectedStock} Candlestick Chart`,
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-lg p-8 h-full flex flex-col w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Market</h1>

        {/* Search Bar */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          placeholder="Search for a stock..."
          className="border p-2 w-full mb-4 rounded-md"
          onClick={() => setIsModalOpen(true)} // Open modal on click
        />

        {/* Stock Suggestions */}
        {searchTerm && (
          <ul className="border bg-white rounded-md mb-4">
            {filteredStocks.map((stock) => (
              <li
                key={stock}
                onClick={() => handleStockSelect(stock)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {stock}
              </li>
            ))}
          </ul>
        )}

        {/* Timeframe Selection */}
        {selectedStock && (
          <div className="my-4">
            <h2 className="text-xl font-semibold mb-2">Selected Stock: {selectedStock}</h2>
            <div className="flex flex-wrap gap-2">
              {['1m', '5m', '15m', '1h', '1d'].map((frame) => (
                <button
                  key={frame}
                  onClick={() => setTimeframe(frame)}
                  className={`p-2 border rounded-md ${
                    timeframe === frame ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  {frame}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chart Section */}
        {selectedStock && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Candlestick Chart for {selectedStock} ({timeframe})</h2>
            <Chart
              options={chartOptions}
              series={[{ data: dummyData }]}
              type="candlestick"
              height={350}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Subscription Required</h1>
            <p className="text-gray-600 mb-6">
              To access this feature, you need an active subscription. For more information, please contact our support team.
            </p>
            <button
              onClick={() => window.location.href = 'mailto:support@example.com'}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Contact Support
            </button>
            <button
              onClick={() => setIsModalOpen(true)} // Close modal on click
              className="mt-4 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;