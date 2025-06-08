import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';
import { FaSlidersH } from 'react-icons/fa';

interface OrderDataType {
  key: number;
  stockName: string;
  orderType: 'Buy' | 'Sell';
  qty: number;
  entryLtp: number | null;
  ltp: number;
  gainLoss: string | null;
}

const columns: TableProps<OrderDataType>['columns'] = [
  {
    title: 'Stock Name',
    dataIndex: 'stockName',
    key: 'stockName',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Order Type',
    dataIndex: 'orderType',
    key: 'orderType',
    render: (orderType) => (
      <Tag color={orderType === 'Buy' ? 'green' : 'volcano'}>
        {orderType.toUpperCase()}
      </Tag>
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
    title: 'LTP',
    dataIndex: 'ltp',
    key: 'ltp',
  },
  {
    title: 'Total Profit',
    key: 'totalProfit',
    render: (_, record) => {
      const { entryLtp, ltp, orderType,qty } = record;
      if (entryLtp === null) return '-';

      const profit = orderType === 'Buy'
        ? (ltp*qty) - (entryLtp*qty)
        : (entryLtp*qty) - (ltp*qty);

      const isProfit = profit >= 0;
      return (
        <span style={{ color: isProfit ? 'green' : 'red' }}>
          {isProfit ? `+${(profit * qty).toFixed(2)}` : (profit * qty).toFixed(2)}
        </span>
      );
    },
  },
];

const ActiveOrders: React.FC = () => {
  const [data, setData] = useState<OrderDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userData = localStorage.getItem('userData');
        const { user_id } = userData ? JSON.parse(userData) : { user_id: null };
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseUrl}/portfolios/get/active/orders?user_id=${user_id}`);
        if (response.data.status === 200) {
          const formattedData: OrderDataType[] = response.data.data.map((item: any) => ({
            key: item.key,
            stockName: item.stockName,
            orderType: item.orderType.charAt(0).toUpperCase() + item.orderType.slice(1).toLowerCase(),
            qty: item.qty,
            entryLtp: item.entry_ltp ?? null,
            ltp: item.ltp,
            gainLoss: item.gainLoss,
          }));
          setData(formattedData);
        } else {
          console.error('API error:', response.data.msg);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    intervalId = setInterval(fetchOrders, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <Table<OrderDataType>
        columns={columns}
        dataSource={data}
        loading={false}
        pagination={false}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ActiveOrders;