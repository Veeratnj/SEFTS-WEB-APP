import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, message } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';

interface ClosedOrderDataType {
  key: string;
  stockName: string;
  orderType: 'Buy' | 'Sell';
  qty: number;
  atp: number;
  ltp: number;
  totalProfit: number;
  sl: number;
  tg: number;
}

const columns: TableProps<ClosedOrderDataType>['columns'] = [
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
    title: 'Total Profit',
    dataIndex: 'totalProfit',
    key: 'totalProfit',
    render: (profit: number) => (
      <span style={{ color: profit >= 0 ? 'green' : 'red' }}>
        {profit >= 0 ? `+${profit}` : profit}
      </span>
    ),
  },
  {
    title: 'SL',
    dataIndex: 'sl',
    key: 'sl',
  },
  {
    title: 'TG',
    dataIndex: 'tg',
    key: 'tg',
  },
];

const ClosedOrders: React.FC = () => {
  const [data, setData] = useState<ClosedOrderDataType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClosedOrders = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('userData');
      const { user_id } = userData ? JSON.parse(userData) : { user_id: null };
      const response = await axios.get(`http://127.0.0.1:8000/portfolios/get/close/orders?user_id=${user_id}`);
      if (response.data.status === 200) {
        const fetchedData: ClosedOrderDataType[] = response.data.data.map((item: any) => ({
          key: item.key,
          stockName: item.stockName,
          orderType: item.orderType.charAt(0).toUpperCase() + item.orderType.slice(1).toLowerCase(),
          qty: item.qty,
          atp: item.atp,
          ltp: item.ltp,
          totalProfit: item.gainLoss ?? 0, // mapping gainLoss -> totalProfit (handle null)
          sl: item.sl ?? 0,
          tg: item.tg ?? 0,
        }));
        setData(fetchedData);
      } else {
        message.error(response.data.msg || 'Failed to fetch closed orders');
      }
    } catch (error) {
      console.error('Error fetching closed orders:', error);
      message.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClosedOrders();
  }, []);

  return (
    <div>
      <Table<ClosedOrderDataType> 
        columns={columns} 
        dataSource={data} 
        loading={loading}
        pagination={false} 
        scroll={{ x: true }} 
      />
    </div>
  );
};

export default ClosedOrders;
