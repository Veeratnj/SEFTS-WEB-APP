import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

type Trade = {
  stock: string;
  type: 'Buy' | 'Sell';
  entry: number;
  exit: number;
  qty: number;
  pnl: number;
  date: string;
  entry_time?: string;
  exit_time?: string;
};

export default function TradeHistory() {
  const [originalTrades, setOriginalTrades] = useState<Trade[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [tradeTypeFilter, setTradeTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<'entry' | 'exit' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${formattedDate} ${formattedTime}`;
  };

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const { user_id } = userData ? JSON.parse(userData) : { user_id: null };
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    axios
      .get(`${baseUrl}/portfolios/trade-history/${user_id}`)
      .then(res => {
        const apiData = res.data;
        const formattedTrades: Trade[] = apiData.map((item: any) => ({
          stock: item.stock_name,
          type: item.trade_type.toLowerCase() === 'buy' ? 'Buy' : 'Sell',
          entry: item.entry_ltp,
          exit: item.exit_ltp,
          qty: item.quantity,
          pnl: item.pnl,
          date: new Date(item.trade_entry_time).toISOString().split('T')[0],
          entry_time: formatTimestamp(item.trade_entry_time),
          exit_time: formatTimestamp(item.trade_exit_time),
        }));
        setOriginalTrades(formattedTrades);
        setTrades(formattedTrades);
      })
      .catch(err => console.error('Error fetching trade history:', err));
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      const filteredByDateRange = originalTrades.filter(trade => {
        const tradeDate = trade.date;
        const from = fromDate.toISOString().split('T')[0];
        const to = toDate.toISOString().split('T')[0];
        return tradeDate >= from && tradeDate <= to;
      });
      setTrades(filteredByDateRange);
    } else {
      setTrades(originalTrades);
    }
  }, [fromDate, toDate, originalTrades]);

  const filterByDate = (trades: Trade[]) => {
    const now = new Date();
    const msInDay = 24 * 60 * 60 * 1000;

    return trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      switch (dateFilter) {
        case '1D':
          return now.getTime() - tradeDate.getTime() <= msInDay;
        case '1W':
          return now.getTime() - tradeDate.getTime() <= 7 * msInDay;
        case '1M':
          return now.getTime() - tradeDate.getTime() <= 30 * msInDay;
        case '1Y':
          return now.getTime() - tradeDate.getTime() <= 365 * msInDay;
        default:
          return true;
      }
    });
  };

  const filteredTrades = filterByDate(trades).filter(trade =>
    tradeTypeFilter === '' ? true : trade.type === tradeTypeFilter
  );

  const sortedTrades = filteredTrades.sort((a, b) => {
    const aVal = sortField === 'date' ? new Date(a.date).getTime() : a[sortField];
    const bVal = sortField === 'date' ? new Date(b.date).getTime() : b[sortField];
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const totalPnl = filteredTrades.reduce((acc, trade) => acc + trade.pnl, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Filter and P&L Display */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          {['1D', '1W', '1M', '1Y', 'ALL'].map(label => (
            <button
              key={label}
              onClick={() => setDateFilter(label as any)}
              className={`px-3 py-1 rounded-lg text-sm ${
                dateFilter === label
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
          <div className="flex flex-wrap gap-2 items-center">
            <div>
            <label className="text-sm text-gray-700">From:</label>
            <input
              type="date"
              value={fromDate ? fromDate.toISOString().split('T')[0] : ''}
              onChange={e => setFromDate(e.target.value ? new Date(e.target.value) : null)}
              className="px-3 py-1 rounded-lg border border-gray-300 text-sm"
            />
            </div>
            <div>
            <label className="text-sm text-gray-700">To:</label>
            <input
              type="date"
              value={toDate ? toDate.toISOString().split('T')[0] : ''}
              onChange={e => setToDate(e.target.value ? new Date(e.target.value) : null)}
              className="px-3 py-1 rounded-lg border border-gray-300 text-sm"
            />
            </div>
          </div>
        </div>
        <div className="text-right font-semibold text-base text-gray-800">
          Total P&L:{' '}
          <span className={totalPnl >= 0 ? 'text-green-600' : 'text-red-500'}>
            {totalPnl.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Trade Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 w-full">
        <div className="overflow-x-auto max-h-[calc(100vh-200px)] w-full">
          <table className="min-w-[900px] w-full text-sm border-t">
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
                <th className="px-6 py-3 text-left">Entry time</th>
                <th className="px-6 py-3 text-left">Exit time</th>
                <th className="px-6 py-3 text-left">Qty</th>
                <th className="px-6 py-3 text-left">P&L</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </motion.thead>

            <tbody>
              {sortedTrades.length > 0 ? (
                sortedTrades.map((trade, idx) => (
                  <tr
                    key={idx}
                    className="transition-all border-b even:bg-gradient-to-r even:from-gray-50 even:to-white hover:bg-indigo-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{trade.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trade.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trade.entry}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trade.exit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trade.entry_time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trade.exit_time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trade.qty}</td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-semibold ${
                        trade.pnl >= 0 ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {trade.pnl}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{trade.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center px-6 py-6 text-gray-400 italic">
                    No matching trade records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
