import { useState } from 'react';
import ActiveOptionOrders from './orderComponents/ActiveOptionOrders';
import ClosedOptionOrders from './orderComponents/ClosedOptionOrders';

const OptionOrders = () => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Closed'>('Active');

  const renderContent = () => {
    switch (activeTab) {
      case 'Active':
        return <ActiveOptionOrders />;
      case 'Closed':
        return <ClosedOptionOrders />;
      default:
        return <div className="text-center">Select a tab</div>;
    }
  };

  return (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full h-full">
        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6 justify-left">
          {['Active', 'Closed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'Active' | 'Closed')}
              className={`py-2 px-4 font-semibold ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default OptionOrders;
