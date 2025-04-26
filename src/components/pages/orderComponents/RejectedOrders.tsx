import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, message } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';

interface RejectedOrderDataType {
  key: string;
  stockName: string;
  orderType: 'Buy' | 'Sell' | null;
  qty: number;
  rejectedTime: string | null;
}

const columns: TableProps<RejectedOrderDataType>['columns'] = [
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
      orderType ? (
        <Tag color={orderType === 'Buy' ? 'green' : 'volcano'}>
          {orderType.toUpperCase()}
        </Tag>
      ) : (
        <Tag color="default">N/A</Tag>
      )
    ),
  },
  {
    title: 'Quantity',
    dataIndex: 'qty',
    key: 'qty',
  },
  {
    title: 'Rejected Time',
    dataIndex: 'rejectedTime',
    key: 'rejectedTime',
    render: (time) => time || 'N/A',
  },
];

const RejectedOrders: React.FC = () => {
  const [data, setData] = useState<RejectedOrderDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = localStorage.getItem('userData');
        const { user_id } = userData ? JSON.parse(userData) : { user_id: null };
        const response = await axios.get(`http://127.0.0.1:8000/portfolios/get/rejected/orders?user_id=${user_id}`);
        console.log('Response:', response.data);

        const orders = response.data?.data || [];
        const apiData = orders.map((item: any, index: number) => ({
          key: String(index + 1),
          stockName: item.stockName,
          orderType: item.orderType,
          qty: item.qty,
          rejectedTime: item.rejected_time,
        }));
        setData(apiData);
      } catch (error) {
        console.error('Error fetching rejected orders:', error);
        message.error('Failed to fetch rejected orders');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Table<RejectedOrderDataType>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        scroll={{ x: true }}
        locale={{ emptyText: 'No Rejected Orders Available' }}
      />
    </div>
  );
};

export default RejectedOrders;
