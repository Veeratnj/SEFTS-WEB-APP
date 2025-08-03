import { useState } from 'react';
import OrderTopCard from '../sub-components/OrderTopCards';
import ActiveOrders from './orderComponents/ActiveOrders';
import ClosedOrders from './orderComponents/ClosedOrders';
import PendingOrders from './orderComponents/PendingOrders';
import RejectedOrders from './orderComponents/RejectedOrders';
import OptionOrders from './OptionOrders'; // create this new component

const Order = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [orderType, setOrderType] = useState<'Equity' | 'Options'>('Equity');

  const renderContent = () => {
    if (orderType === 'Options') {
      return <OptionOrders />;
    }

    switch (activeTab) {
      case 'Pending':
        return <PendingOrders />;
      case 'Active':
        return <ActiveOrders />;
      case 'Closed':
        return <ClosedOrders />;
      case 'Rejected':
        return <RejectedOrders />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full h-full">
        {/* Toggle Switch */}
        <div className="flex justify-end mb-4">
          <button
            className={`px-4 py-1 rounded-l-full ${
              orderType === 'Equity' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setOrderType('Equity')}
          >
            Equity
          </button>
          <button
            className={`px-4 py-1 rounded-r-full ${
              orderType === 'Options' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setOrderType('Options')}
          >
            Options
          </button>
        </div>

        {/* Tabs only for Equity */}
        {orderType === 'Equity' && (
          <div className="flex space-x-4 border-b mb-6">
            {['Pending', 'Active', 'Closed', 'Rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-[0.400rem] font-semibold ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Order;
