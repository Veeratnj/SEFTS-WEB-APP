import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, DatePicker, Tag, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ClosedOptionOrder {
  key: string;
  optionSymbol: string;
  optionType: 'CE' | 'PE';
  qty: number;
  entryLtp: number | null;
  exitLtp: number | null;
  entryPrice: number | null;
  exitPrice: number | null;
  entryTime: string | null;
  exitTime: string | null;
  totalProfit: number;
}

export default function OptionTradeHistory() {
  const [trades, setTrades] = useState<ClosedOptionOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [flag, setFlag] = useState<number>(2); // Default: 1 Week

  const fetchOptionTrades = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('userData');
      const { user_id } = userData ? JSON.parse(userData) : { user_id: null };
      if (!user_id) {
        message.error('User not logged in');
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const payload: any = {
        user_id,
        limit: 1000,
        offset: 0,
      };

      if (dateRange?.[0] && dateRange?.[1]) {
        payload.flag = null;
        payload.from_date = dateRange[0].startOf('day').toISOString();
        payload.to_date = dateRange[1].endOf('day').toISOString();
      } else {
        payload.flag = flag;
      }

      const res = await axios.post(`${baseUrl}/option/option/trade-history`, payload);
      const records = res.data?.data?.records ?? [];

      if (!Array.isArray(records)) {
        setTrades([]);
        return;
      }

      const formatted: ClosedOptionOrder[] = records.map((item: any) => ({
        key: `${item.option_symbol}_${item.trade_entry_time}`,
        optionSymbol: item.option_symbol,
        optionType: item.option_type ?? 'CE',
        qty: item.quantity,
        entryLtp: item.entry_ltp ?? null,
        exitLtp: item.exit_ltp ?? null,
        entryPrice: item.entry_price ?? null,
        exitPrice: item.exit_price ?? null,
        entryTime: item.trade_entry_time
          ? new Date(item.trade_entry_time).toLocaleString()
          : null,
        exitTime: item.trade_exit_time
          ? new Date(item.trade_exit_time).toLocaleString()
          : null,
        totalProfit: item.pnl ?? 0
      }));

      setTrades(formatted);
    } catch (err) {
      console.error('Error fetching option trades:', err);
      message.error('Failed to fetch closed option trades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptionTrades();
  }, [dateRange, flag]);

  const totalPnl = trades.reduce((acc, t) => acc + t.totalProfit, 0);

  const columns: ColumnsType<ClosedOptionOrder> = [
    {
      title: 'Option Symbol',
      dataIndex: 'optionSymbol',
      key: 'optionSymbol',
      render: (symbol) => <span className="font-medium">{symbol}</span>
    },
    {
      title: 'Option Type',
      dataIndex: 'optionType',
      key: 'optionType',
      render: (type: 'CE' | 'PE') => (
        <Tag color={type === 'CE' ? 'blue' : 'red'}>{type}</Tag>
      )
    },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    { title: 'Entry LTP', dataIndex: 'entryLtp', key: 'entryLtp' },
    { title: 'Exit LTP', dataIndex: 'exitLtp', key: 'exitLtp' },
    { title: 'Entry Price', dataIndex: 'entryPrice', key: 'entryPrice' },
    { title: 'Exit Price', dataIndex: 'exitPrice', key: 'exitPrice' },
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
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Quick Filter Selector */}
        <Select
          value={flag}
          onChange={(val) => {
            setFlag(val);
            setDateRange(null); // Clear custom range when quick filter changes
          }}
          style={{ width: 160 }}
        >
          <Option value={1}>1 Day</Option>
          <Option value={2}>1 Week</Option>
          <Option value={3}>1 Month</Option>
          <Option value={4}>1 Year</Option>
          <Option value={5}>All</Option>
        </Select>

        {/* Date Range Picker */}
        <RangePicker
          value={dateRange}
          onChange={(range) => {
            setDateRange(range);
            setFlag(0); // No quick filter when date range is selected
          }}
          format="YYYY-MM-DD"
        />
        {dateRange && (
          <Button onClick={() => setDateRange(null)}>Clear Range</Button>
        )}

        <div className="ml-auto font-semibold">
          Total P&L:{' '}
          <span className={totalPnl >= 0 ? 'text-green-600' : 'text-red-500'}>
            {totalPnl.toFixed(2)}
          </span>
        </div>

        {/* Export CSV */}
        <Button
          onClick={() => {
            const headers = [
              'Option Symbol',
              'Option Type',
              'Qty',
              'Entry LTP',
              'Exit LTP',
              'Entry Price',
              'Exit Price',
              'Entry Time',
              'Exit Time',
              'Total Profit'
            ];
            const rows = trades.map((t) => [
              t.optionSymbol,
              t.optionType,
              t.qty,
              t.entryLtp ?? '',
              t.exitLtp ?? '',
              t.entryPrice ?? '',
              t.entryTime ?? '',
              t.exitTime ?? '',
              t.totalProfit
            ]);
            const csvContent = [headers, ...rows]
              .map((r) => r.join(','))
              .join('\n');
            const blob = new Blob([csvContent], {
              type: 'text/csv;charset=utf-8;'
            });
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
