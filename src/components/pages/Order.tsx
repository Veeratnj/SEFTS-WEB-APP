import  { useState } from 'react';
import OrderTopCard from '../sub-components/OrderTopCards';
import ActiveOrders from './orderComponents/ActiveOrders';
import ClosedOrders from './orderComponents/ClosedOrders';
import PendingOrders from './orderComponents/PendingOrders';
import RejectedOrders from './orderComponents/RejectedOrders';

const Order = () => {
  const [activeTab, setActiveTab] = useState('Pending');

  const renderContent = () => {
    switch (activeTab) {
      case 'Pending':
        return <div><PendingOrders/></div>;
      case 'Active':
        return <div><ActiveOrders/></div>;
      case 'Closed':
        return <div><ClosedOrders/></div>;
      case 'Rejected':
        return <div><RejectedOrders/></div>;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full h-full">
        {/* <OrderTopCard /> */}

        {/* Navbar */}
        <div className="flex space-x-4 border-b mb-6">
          {['Pending', 'Active', 'Closed', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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

        {/* Content Area */}
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Order;
