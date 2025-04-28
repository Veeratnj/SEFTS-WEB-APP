import React from 'react';
import { useNavigate } from 'react-router-dom'; // If you're using react-router

const tools = [
  { title: 'RSI Calculator', description: 'Calculate the Relative Strength Index for stocks.', path: '/tools/rsi' },
  { title: 'Moving Averages Tool', description: 'Find simple and exponential moving averages.', path: '/tools/moving-averages' },
  { title: 'Earnings Dates Viewer', description: 'Check upcoming earnings reports.', path: '/tools/earnings' },
  { title: 'Volume Analyzer', description: 'Analyze stock volume trends.', path: '/tools/volume' },
  { title: 'Risk/Reward Calculator', description: 'Calculate your trade\'s risk and reward.', path: '/tools/risk-reward' },
];

const Tools: React.FC = () => {
  const navigate = useNavigate();

  const handleToolClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-lg p-8 h-full flex flex-col w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Tools</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.title}
              onClick={() => handleToolClick(tool.path)}
              className="p-6 border border-blue-200 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-transform hover:scale-105 bg-white"
            >
              <h2 className="text-xl font-semibold mb-2">{tool.title}</h2>
              <p className="text-gray-600">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;
