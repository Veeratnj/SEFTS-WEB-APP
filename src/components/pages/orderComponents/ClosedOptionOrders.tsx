import React, { useEffect, useState } from 'react';
import { Table, Tag, message } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';

interface ClosedOptionOrder {
  key: string;
  stockName: string;
  optionType: 'CE' | 'PE';
  qty: number;
  entryLtp: number | null;
  exitLtp: number | null;
  entryTime: string | null;
  exitTime: string | null;
  totalProfit: number;
}

// Utility function to format option symbol
const formatOptionSymbol = (symbol: string): string => {
  const match = symbol.match(/^BANKNIFTY(\d{2}[A-Z]{3})(\d+)(CE|PE)$/);
  if (!match) return symbol;

  const [, expiry, strike, type] = match;
  return `BANKNIFTY ${strike} ${type} (${expiry})`;
};

const columns: TableProps<ClosedOptionOrder>['columns'] = [
  {
    title: 'Option Symbol',
    dataIndex: 'stockName',
    key: 'stockName',
    render: (text) => <span className="font-medium">{text}</span>,
  },
  {
    title: 'Option Type',
    dataIndex: 'optionType',
    key: 'optionType',
    render: (type: 'CE' | 'PE') => (
      <Tag color={type === 'CE' ? 'blue' : 'orange'}>{type}</Tag>
    ),
  },
  {
    title: 'Quantity',
    dataIndex: 'qty',
    key: 'qty',
  },
  {
    title: 'Entry LTP',
    dataIndex: 'entryLtp',
    key: 'entryLtp',
  },
  {
    title: 'Exit LTP',
    dataIndex: 'exitLtp',
    key: 'exitLtp',
  },
  {
    title: 'Entry Time',
    dataIndex: 'entryTime',
    key: 'entryTime',
  },
  {
    title: 'Exit Time',
    dataIndex: 'exitTime',
    key: 'exitTime',
  },
  {
    title: 'Total Profit',
    dataIndex: 'totalProfit',
    key: 'totalProfit',
    render: (profit: number) => (
      <span style={{ color: profit >= 0 ? 'green' : 'red' }}>
        {profit >= 0 ? `+${profit.toFixed(2)}` : profit.toFixed(2)}
      </span>
    ),
  },
];

const ClosedOptionOrders: React.FC = () => {
  const [data, setData] = useState<ClosedOptionOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClosedOptionOrders = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('userData');
      const { user_id } = userData ? JSON.parse(userData) : { user_id: null };
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      const res = await axios.get(`${baseUrl}/option/trade/closed/${user_id}`);
      const raw = res.data;

      if (!raw || !Array.isArray(raw.closed_trades)) {
        console.error("Unexpected response:", raw);
        return;
      }

      const formatted: ClosedOptionOrder[] = raw.closed_trades.map((item: any) => ({
        key: item.order_id,
        stockName: formatOptionSymbol(item.option_symbol),
        optionType: item.option_symbol?.endsWith('CE') ? 'CE' : 'PE',
        qty: item.quantity,
        entryLtp: item.entry_price ?? null,
        exitLtp: item.exit_price ?? null,
        entryTime: item.entry_time ? new Date(item.entry_time).toLocaleString() : null,
        exitTime: item.exit_time ? new Date(item.exit_time).toLocaleString() : null,
        totalProfit: item.pnl ?? 0,
      }));

      setData(formatted);
    } catch (error) {
      console.error('Error fetching closed option orders:', error);
      message.error('Failed to fetch closed option orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClosedOptionOrders();
  }, []);

  return (
    <div>
      <Table<ClosedOptionOrder>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ClosedOptionOrders;
