import React from 'react';

interface StockCardProps {
  id: string;
  stockName: string;
  points: number;
  isUp: boolean;
  percentage: string;
}

const StockCard: React.FC<StockCardProps> = ({ id, stockName, points, isUp, percentage }) => {
  return (
    <div
      id={id}
    //   className="bg-blue-500 px-3 py-2 rounded-lg flex flex-col justify-center shadow text-white w-36"
        className="bg-gray-100 px-3 py-2 rounded-lg flex flex-col justify-center shadow text-gray-800 w-36"
    >
      {/* Stock Name */}
      <div className="text-xs font-medium mb-1">{stockName}</div>

      {/* Points, Icon, Percentage */}
      <div className="flex items-center space-x-2 text-xs">
        <div className="font-semibold">{points}</div>
        <span className={isUp ? 'text-green-800 font-bold' : 'text-red-800 font-bold'}>
          {isUp ? '▲' : '▼'}
        </span>
        <div className={`text-xs ${isUp ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}`}>
          {percentage}
        </div>
      </div>
    </div>
  );
};

export default StockCard;
