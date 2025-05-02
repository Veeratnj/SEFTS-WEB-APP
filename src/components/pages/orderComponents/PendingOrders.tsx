import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';

interface PendingOrderDataType {
  key: string;
  stockName: string;
  orderType: 'Buy' | 'Sell';
  qty: number;
  // atp: number;
  ltp: number;
  gainLoss: number;
  // sl: number;
  // tg: number;
}

const columns: TableProps<PendingOrderDataType>['columns'] = [
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
        {orderType?.toUpperCase()}
      </Tag>
    ),
  },
  {
    title: 'Quantity',
    dataIndex: 'qty',
    key: 'qty',
  },
  // {
  //   title: 'ATP',
  //   dataIndex: 'atp',
  //   key: 'atp',
  // },
  {
    title: 'LTP',
    dataIndex: 'ltp',
    key: 'ltp',
  },
  {
    title: 'Gain & Loss',
    dataIndex: 'gainLoss',
    key: 'gainLoss',
    render: (gainLoss?: number) => (
      <span style={{ color: gainLoss && gainLoss >= 0 ? 'green' : 'red' }}>
        {gainLoss !== undefined ? (gainLoss >= 0 ? `+${gainLoss}` : gainLoss) : '--'}
      </span>
    ),
  },
  // {
  //   title: 'SL',
  //   dataIndex: 'sl',
  //   key: 'sl',
  // },
  // {
  //   title: 'TG',
  //   dataIndex: 'tg',
  //   key: 'tg',
  // },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button type="primary" size="small">
          Closed
        </Button>
      </Space>
    ),
  },
];

const PendingOrders: React.FC = () => {
  const [data, setData] = useState<PendingOrderDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = localStorage.getItem('userData');
        const parsedData = userData ? JSON.parse(userData) : null;

        if (!parsedData || !parsedData.user_id) {
          console.error('No user ID found in localStorage.');
          setLoading(false);
          return;
        }

        const user_id = parsedData.user_id;
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseUrl}/portfolios/get/pending/orders?user_id=${user_id}`);
        console.log('API Raw Response:', response.data);

        let pendingOrders: any[] = [];

        if (Array.isArray(response.data)) {
          pendingOrders = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          pendingOrders = response.data.data;
        } else {
          console.error('Unexpected API response format.', response.data);
        }

        const apiData = pendingOrders.map((item: any, index: number) => ({
          key: String(index + 1),
          stockName: item.stockName || 'N/A',
          orderType: item.orderType || 'Buy',
          qty: item.qty || 0,
          // atp: item.atp || 0,
          ltp: item.ltp || 0,
          gainLoss: item.gainLoss || 0,
          // sl: item.sl || 0,
          // tg: item.tg || 0,
        }));

        setData(apiData);
      } catch (error) {
        console.error('Error fetching pending orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Table<PendingOrderDataType>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default PendingOrders;
