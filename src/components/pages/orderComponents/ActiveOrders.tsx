import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';

interface OrderDataType {
  key: number;
  stockName: string;
  orderType: 'Buy' | 'Sell';
  qty: number;
  atp: number;
  ltp: number;
  gainLoss: string | null;
  sl: number | null;
  tg: number | null;
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
    title: 'ATP',
    dataIndex: 'atp',
    key: 'atp',
  },
  {
    title: 'LTP',
    dataIndex: 'ltp',
    key: 'ltp',
  },
  {
    title: 'Gain & Loss',
    dataIndex: 'gainLoss',
    key: 'gainLoss',
    render: (gainLoss) => {
      if (gainLoss === null) {
        return '-';
      }
      const isPositive = gainLoss.startsWith('+');
      return (
        <span style={{ color: isPositive ? 'green' : 'red' }}>
          {gainLoss}
        </span>
      );
    },
  },
  {
    title: 'SL',
    dataIndex: 'sl',
    key: 'sl',
    render: (sl) => (sl !== null ? sl : '-'),
  },
  {
    title: 'TG',
    dataIndex: 'tg',
    key: 'tg',
    render: (tg) => (tg !== null ? tg : '-'),
  },
];

const ActiveOrders: React.FC = () => {
  const [data, setData] = useState<OrderDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('userData');
      const { user_id } = userData ? JSON.parse(userData) : { user_id: null };
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      console.log('Base URL:', baseUrl);
      const response = await axios.get(`${baseUrl}/portfolios/get/active/orders?user_id=${user_id}`);
      if (response.data.status === 200) {
        const formattedData: OrderDataType[] = response.data.data.map((item: any) => ({
          key: item.key,
          stockName: item.stockName,
          orderType: item.orderType.charAt(0).toUpperCase() + item.orderType.slice(1).toLowerCase(), // 'buy' -> 'Buy'
          qty: item.qty,
          atp: item.atp,
          ltp: item.ltp,
          gainLoss: item.gainLoss,
          sl: item.sl,
          tg: item.tg,
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
  

  return (
    <div>
      <Table<OrderDataType> 
        columns={columns} 
        dataSource={data} 
        loading={loading} 
        pagination={false} 
        scroll={{ x: true }} 
      />
    </div>
  );
};

export default ActiveOrders;
