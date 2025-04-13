import React from 'react';
import { FaChartLine, FaMoneyBillWave, FaBalanceScale } from 'react-icons/fa';

const OrderTopCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Card 1 */}
      <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
        <FaChartLine size={30} className="text-blue-500" />
        <div>
          <p className="text-sm text-gray-500">Current Value</p>
          <p className="text-xl font-semibold">₹175,638.98</p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
        <FaMoneyBillWave size={30} className="text-green-500" />
        <div>
          <p className="text-sm text-gray-500">Running P/L</p>
          <p className="text-xl font-semibold">₹90,000.00</p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
        <FaBalanceScale size={30} className="text-purple-500" />
        <div>
          <p className="text-sm text-gray-500">Total Close P/L</p>
          <p className="text-xl font-semibold text-green-600">+₹85,638.98</p>
        </div>
      </div>
    </div>
  );
};

export default OrderTopCards;
