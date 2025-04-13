import React from 'react';
import OrderTopCard from '../sub-components/OrderTopCards';

const Order = () => {
  return (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full h-full">
        <OrderTopCard/>

        <h1 className="text-2xl font-semibold mb-4">Order Screen</h1>
        <p>This is your order card content.</p>
        {/* You can add forms, tables, or anything here */}
      </div>
    </div>
  );
};

export default Order;
