import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';

interface OptionOrderDataType {
  key: number;
  optionSymbol: string;
  optionType: 'CE' | 'PE';
  qty: number;
  entryLtp: number | null;
  entryTime: string | null;
  entryPrice: number | null;
  currentLtp: number | null;
  profit: number | null;
}

const columns: TableProps<OptionOrderDataType>['columns'] = [
  {
    title: 'Option Symbol',
    dataIndex: 'optionSymbol',
    key: 'optionSymbol',
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
    render: (entryLtp: number | null) => (entryLtp !== null ? entryLtp : '-'),
  },
  {
    title: 'Entry Time',
    dataIndex: 'entryTime',
    key: 'entryTime',
    render: (entryTime: string | null) => (entryTime ? entryTime : '-'),
  },
  {
    title: 'Entry Price',
    dataIndex: 'entryPrice',
    key: 'entryPrice',
    render: (entryPrice: number | null) => (entryPrice !== null ? entryPrice : '-'),
  },
  {
    title: 'Current LTP',
    dataIndex: 'currentLtp',
    key: 'currentLtp',
    render: (currentLtp: number | null) => (currentLtp !== null ? currentLtp : '-'),
  },
  {
  title: 'Profit',
  dataIndex: 'profit',
  key: 'profit',
  render: (profit: number | null) => {
    if (profit === null) return '-';
    const color = profit >= 0 ? 'green' : 'red';
    return <span style={{ color, fontWeight: 600 }}>{profit.toFixed(2)}</span>;
  },
}
];

const ActiveOptionOrders: React.FC = () => {
  const [data, setData] = useState<OptionOrderDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

useEffect(() => {
  const fetchOptionOrders = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('userData');
      const { user_id } = userData ? JSON.parse(userData) : { user_id: null };
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.get(`${baseUrl}/option/trade/open/${user_id}`);

      const formattedData: OptionOrderDataType[] = response.data.map(
        (item: any, index: number) => {
          const optionType = item.option_symbol.endsWith('CE') ? 'CE' : 'PE';
          return {
            key: index,
            optionSymbol: item.option_symbol,
            optionType,
            qty: item.quantity,
            entryLtp: item.entry_ltp ?? null,
            entryTime: item.trade_entry_time
              ? new Date(item.trade_entry_time).toLocaleString()
              : null,
            entryPrice: item.entry_ltp ?? null,
            currentLtp: item.current_ltp ?? null,
            profit: item.profit ?? null,
          };
        }
      );

      setData(formattedData);
    } catch (error) {
      console.error('Options Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchOptionOrders(); // first call immediately
  const intervalId = setInterval(fetchOptionOrders, 1500); // every 1.5 seconds
  return () => clearInterval(intervalId);
}, []);


  return (
    <div>
      <Table<OptionOrderDataType>
        columns={columns}
        dataSource={data}
        // loading={loading}
         loading={false}
        pagination={false}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ActiveOptionOrders;
