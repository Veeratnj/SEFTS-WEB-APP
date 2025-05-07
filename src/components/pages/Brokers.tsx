import React, { useState } from 'react';

const brokers = [
  { name: 'Angelone', description: 'Angelone is a leading full-service stockbroker in India.' },
  { name: 'Dhan', description: 'Dhan is a modern trading platform for traders and investors.' },
  { name: 'Zerodha', description: 'Zerodha is India\'s largest discount broker with low-cost trading.' },
];

const Brokers = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null); // State for selected broker

  const handleBrokerClick = (broker: string) => {
    setSelectedBroker(broker); // Set the selected broker
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-lg p-8 h-full flex flex-col w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Brokers</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brokers.map((broker) => (
            <div
              key={broker.name}
              onClick={() => handleBrokerClick(broker.name)}
              className="p-6 border border-blue-200 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-transform hover:scale-105 bg-white"
            >
              <h2 className="text-xl font-semibold mb-2">{broker.name}</h2>
              <p className="text-gray-600">{broker.description}</p>
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
              To access the <strong>{selectedBroker}</strong> terminal, you need an active subscription. For more information, please contact our support team.
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Brokers;