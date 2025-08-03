import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, DatePicker, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface ClosedOptionOrder {
  key: string;
  optionSymbol: string;
  optionType: 'CE' | 'PE';
  qty: number;
  entryLtp: number | null;
  exitLtp: number | null;
  entryTime: string | null;
  exitTime: string | null;
  totalProfit: number;
}

export default function OptionTradeHistory() {
  const [allTrades, setAllTrades] = useState<ClosedOptionOrder[]>([]);
  const [trades, setTrades] = useState<ClosedOptionOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const fetchOptionTrades = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('userData');
      const { user_id } = userData ? JSON.parse(userData) : { user_id: null };
      if (!user_id) return;

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.get(`${baseUrl}/option/trade/closed/${user_id}`);
      const records = res.data?.closed_trades;

      if (!Array.isArray(records)) {
        setAllTrades([]);
        setTrades([]);
        return;
      }

      const formatted: ClosedOptionOrder[] = records.map((item: any) => ({
        key: item.order_id,
        optionSymbol: item.option_symbol,
        optionType: item.option_type ?? 'CE', // default fallback if not present
        qty: item.quantity,
        entryLtp: item.entry_price ?? null,
        exitLtp: item.exit_price ?? null,
        entryTime: item.entry_time ? new Date(item.entry_time).toLocaleString() : null,
        exitTime: item.exit_time ? new Date(item.exit_time).toLocaleString() : null,
        totalProfit: item.pnl ?? 0,
      }));

      setAllTrades(formatted);
    } catch (err) {
      console.error('Error fetching option trades:', err);
      message.error('Failed to fetch closed option trades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptionTrades();
  }, []);

  useEffect(() => {
    if (dateRange?.[0] && dateRange?.[1]) {
      const start = dateRange[0].startOf('day');
      const end = dateRange[1].endOf('day');
      const filtered = allTrades.filter(t => {
        const entry = t.entryTime ? new Date(t.entryTime) : null;
        return entry && entry >= start.toDate() && entry <= end.toDate();
      });
      setTrades(filtered);
    } else {
      setTrades(allTrades);
    }
  }, [allTrades, dateRange]);

  const totalPnl = trades.reduce((acc, t) => acc + t.totalProfit, 0);

  const columns: ColumnsType<ClosedOptionOrder> = [
    {
      title: 'Option Symbol',
      dataIndex: 'optionSymbol',
      key: 'optionSymbol',
      render: (symbol) => <span className="font-medium">{symbol}</span>,
    },
    {
      title: 'Option Type',
      dataIndex: 'optionType',
      key: 'optionType',
      render: (type: 'CE' | 'PE') => (
        <Tag color={type === 'CE' ? 'blue' : 'red'}>{type}</Tag>
      ),
    },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    { title: 'Entry LTP', dataIndex: 'entryLtp', key: 'entryLtp' },
    { title: 'Exit LTP', dataIndex: 'exitLtp', key: 'exitLtp' },
    { title: 'Entry Time', dataIndex: 'entryTime', key: 'entryTime' },
    { title: 'Exit Time', dataIndex: 'exitTime', key: 'exitTime' },
    {
      title: 'Total Profit',
      dataIndex: 'totalProfit',
      key: 'totalProfit',
      render: (profit) => (
        <span className={profit >= 0 ? 'text-green-600' : 'text-red-500'}>
          {profit >= 0 ? `+${profit.toFixed(2)}` : profit.toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <RangePicker
          value={dateRange}
          onChange={(range) => setDateRange(range)}
          format="YYYY-MM-DD"
        />
        {dateRange && <Button onClick={() => setDateRange(null)}>Clear Range</Button>}

        <div className="ml-auto font-semibold">
          Total P&L:{' '}
          <span className={totalPnl >= 0 ? 'text-green-600' : 'text-red-500'}>
            {totalPnl.toFixed(2)}
          </span>
        </div>
        <Button
          onClick={() => {
            const headers = [
              'Option Symbol',
              'Option Type',
              'Qty',
              'Entry LTP',
              'Exit LTP',
              'Entry Time',
              'Exit Time',
              'Total Profit',
            ];
            const rows = trades.map(t => [
              t.optionSymbol,
              t.optionType,
              t.qty,
              t.entryLtp ?? '',
              t.exitLtp ?? '',
              t.entryTime ?? '',
              t.exitTime ?? '',
              t.totalProfit,
            ]);
            const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'option_trade_history.csv';
            link.click();
          }}
        >
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={trades}
        loading={loading}
        rowKey="key"
        pagination={false}
        bordered
      />
    </div>
  );
}
