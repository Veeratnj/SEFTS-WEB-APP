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

        const formattedData: OptionOrderDataType[] = response.data.map((item: any, index: number) => {
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
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error('Options Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptionOrders();
    const intervalId = setInterval(fetchOptionOrders, 60000); // refresh every minute
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Table<OptionOrderDataType>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ActiveOptionOrders;
