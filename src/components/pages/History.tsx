import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Trade = {
  stock: string;
  type: 'Buy' | 'Sell';
  entry: number;
  exit: number;
  qty: number;
  pnl: number;
  date: string;
};

const dummyTrades: Trade[] = [
  {
    stock: 'AAPL',
    type: 'Buy',
    entry: 150,
    exit: 155,
    qty: 10,
    pnl: 50,
    date: '2024-08-20',
  },
  {
    stock: 'GOOGL',
    type: 'Sell',
    entry: 2700,
    exit: 2650,
    qty: 5,
    pnl: 250,
    date: '2024-08-19',
  },
  {
    stock: 'TSLA',
    type: 'Buy',
    entry: 700,
    exit: 720,
    qty: 2,
    pnl: 40,
    date: '2024-08-18',
  },
  {
    stock: 'MSFT',
    type: 'Sell',
    entry: 310,
    exit: 305,
    qty: 4,
    pnl: 20,
    date: '2024-08-21',
  },
];

export default function TradeHistory() {
  const [tradeTypeFilter, setTradeTypeFilter] = useState('');
  const [sortField, setSortField] = useState<'entry' | 'exit' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedData = dummyTrades
    .filter(trade => (tradeTypeFilter === '' ? true : trade.type === tradeTypeFilter))
    .sort((a, b) => {
      const aVal = sortField === 'date' ? new Date(a.date).getTime() : a[sortField];
      const bVal = sortField === 'date' ? new Date(b.date).getTime() : b[sortField];
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Trade Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trade Type:</label>
          <select
            value={tradeTypeFilter}
            onChange={e => setTradeTypeFilter(e.target.value)}
            className="text-sm rounded border-gray-300 p-2"
          >
            <option value="">All</option>
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>

        {/* Sort Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By:</label>
          <select
            value={sortField}
            onChange={e => setSortField(e.target.value as 'entry' | 'exit' | 'date')}
            className="text-sm rounded border-gray-300 p-2"
          >
            <option value="date">Date</option>
            <option value="entry">Entry Price</option>
            <option value="exit">Exit Price</option>
          </select>
        </div>

        {/* Sort Order (Radio Buttons) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order:</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center text-sm text-gray-700">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                value="asc"
                checked={sortOrder === 'asc'}
                onChange={() => setSortOrder('asc')}
              />
              <span className="ml-2">Ascending</span>
            </label>
            <label className="inline-flex items-center text-sm text-gray-700">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                value="desc"
                checked={sortOrder === 'desc'}
                onChange={() => setSortOrder('desc')}
              />
              <span className="ml-2">Descending</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full text-sm border-t">
          <caption className="caption-top text-lg font-semibold text-gray-800 p-4 bg-gray-100">
            Trade History
          </caption>

          <motion.thead
            className="bg-indigo-600 text-white sticky top-0 z-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <tr>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Entry</th>
              <th className="px-6 py-3 text-left">Exit</th>
              <th className="px-6 py-3 text-left">Qty</th>
              <th className="px-6 py-3 text-left">P&L</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </motion.thead>

          <tbody>
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((trade, idx) => (
                <tr
                  key={idx}
                  className="transition-all border-b even:bg-gradient-to-r even:from-gray-50 even:to-white hover:bg-indigo-100 hover:scale-103"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{trade.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.entry}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.exit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                    {trade.pnl}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center px-6 py-6 text-gray-400 italic"
                >
                  No matching trade records.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
