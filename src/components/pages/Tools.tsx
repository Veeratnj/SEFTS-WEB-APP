import React, { useState } from 'react';
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility
  const [selectedTool, setSelectedTool] = useState<string | null>(null); // State for selected tool

  const handleToolClick = (tool: { title: string; path: string }) => {
    setSelectedTool(tool.title); // Set the selected tool
    setIsModalOpen(true); // Open the modal
  };

  const handleNavigate = (path: string) => {
    setIsModalOpen(false); // Close the modal
    navigate(path); // Navigate to the tool's path
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-lg p-8 h-full flex flex-col w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Tools</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.title}
              onClick={() => handleToolClick(tool)}
              className="p-6 border border-blue-200 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-transform hover:scale-105 bg-white"
            >
              <h2 className="text-xl font-semibold mb-2">{tool.title}</h2>
              <p className="text-gray-600">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Subscription Required</h1>
            <p className="text-gray-600 mb-6">
              To access the <strong>{selectedTool}</strong>, you need an active subscription. For more information, please contact our support team.
            </p>
            {/* <button
              onClick={() => window.location.href = 'mailto:support@example.com'}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Contact Support
            </button> */}
            <button
              onClick={() => setIsModalOpen(false)} // Close modal on click
              className="mt-4 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Close
            </button>
            {/* <button
              onClick={() => handleNavigate(tools.find((tool) => tool.title === selectedTool)?.path || '/')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Proceed Anyway
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tools;