import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select, Button, message, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

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
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [tradeTypeFilter, setTradeTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const pageSize = 10000000;

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

  const fetchTrades = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = localStorage.getItem('userData');
      const { user_id } = userData ? JSON.parse(userData) : { user_id: null };

      if (!user_id) {
        setError('User ID not found');
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const flag =
        dateFilter === '1D' ? 1 :
        dateFilter === '1W' ? 2 :
        dateFilter === '1M' ? 3 :
        dateFilter === '1Y' ? 4 : 5;

      const payload: any = {
        user_id,
        flag,
        limit: pageSize,
        offset: 0,
      };

      if (tradeTypeFilter) payload.type = tradeTypeFilter;

      const res = await axios.post(`${baseUrl}/portfolios/trade-history`, payload);
      const apiData = res.data?.data;

      if (!apiData || !Array.isArray(apiData.records)) {
        setAllTrades([]);
        setTrades([]);
        return;
      }

      const formatted: Trade[] = apiData.records.map((item: any) => ({
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

      setAllTrades(formatted);
    } catch (err) {
      console.error('API error:', err);
      message.error('Failed to load trade history.');
      setError('Fetch error');
    } finally {
      setLoading(false);
    }
  };

  // Apply date range filter on frontend
  useEffect(() => {
    let filtered = [...allTrades];

    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].format('YYYY-MM-DD');
      const end = dateRange[1].format('YYYY-MM-DD');

      filtered = filtered.filter(trade => trade.date >= start && trade.date <= end);
    }

    setTrades(filtered);
  }, [allTrades, dateRange]);

  // Refetch when filters change
  useEffect(() => {
    fetchTrades();
  }, [dateFilter, tradeTypeFilter]);

  const totalPnl = trades.reduce((acc, trade) => acc + trade.pnl, 0);

  const columns: ColumnsType<Trade> = [
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Entry', dataIndex: 'entry', key: 'entry' },
    { title: 'Exit', dataIndex: 'exit', key: 'exit' },
    { title: 'Entry Time', dataIndex: 'entry_time', key: 'entry_time' },
    { title: 'Exit Time', dataIndex: 'exit_time', key: 'exit_time' },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    {
      title: 'P&L',
      dataIndex: 'pnl',
      key: 'pnl',
      render: (_, record) => (
        <span className={record.pnl >= 0 ? 'text-green-600' : 'text-red-500'}>
          {record.pnl.toFixed(2)}
        </span>
      ),
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          {['1D', '1W', '1M', '1Y', 'ALL'].map(label => (
            <Button
              key={label}
              type={dateFilter === label ? 'primary' : 'default'}
              onClick={() => {
                setDateFilter(label as any);
              }}
            >
              {label}
            </Button>
          ))}

          <Select
            value={tradeTypeFilter}
            onChange={(val) => setTradeTypeFilter(val)}
            style={{ width: 120 }}
            options={[
              { value: '', label: 'All Types' },
              { value: 'Buy', label: 'Buy' },
              { value: 'Sell', label: 'Sell' },
            ]}
          />

          <RangePicker
            value={dateRange}
            onChange={(range) => setDateRange(range)}
            format="YYYY-MM-DD"
            allowClear
            placeholder={['Start date', 'End date']}
          />

          {dateRange && (
            <Button onClick={() => setDateRange(null)}>Clear Date Range</Button>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <div className="font-semibold text-gray-800">
            Total P&L:{' '}
            <span className={totalPnl >= 0 ? 'text-green-600' : 'text-red-500'}>
              {totalPnl.toFixed(2)}
            </span>
          </div>
          <Button
            onClick={() => {
              const csvContent = [
                ['Stock', 'Type', 'Entry', 'Exit', 'Entry Time', 'Exit Time', 'Qty', 'P&L', 'Date'],
                ...trades.map(t => [
                  t.stock, t.type, t.entry, t.exit, t.entry_time, t.exit_time, t.qty, t.pnl, t.date
                ]),
              ]
                .map(row => row.join(','))
                .join('\n');

              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', `trade-history.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={trades}
        loading={loading}
        // rowKey={(_, index) => index.toString()}
        rowKey={(_, index) => (index !== undefined ? index.toString() : Math.random().toString())}
        pagination={false}
        bordered
      />
    </div>
  );
}
