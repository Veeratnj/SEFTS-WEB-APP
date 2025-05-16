import React, { useEffect, useState, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form, Tabs, message } from "antd";
import type { InputRef } from "antd";
import type { FormInstance } from "antd/es/form";
import axios from "axios";
import '../../css/admin.css';

const { TabPane } = Tabs;

interface Stock {
  key: string;
  stock_name: string;
  token: string;
  exchange: string;
  is_hotlist: boolean;
  trend_type: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  is_deleted: boolean;
}

interface StockDetail {
  key: string;
  stock_name: string;
  token: string;
  ltp: number;
  last_update: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text" | "date";
  record: any;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <Input type="number" />
    ) : inputType === "date" ? (
      <Input type="datetime-local" />
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Admin: React.FC = () => {
  const [stockList, setStockList] = useState<Stock[]>([]);
  const [stockDetailsList, setStockDetailsList] = useState<StockDetail[]>([]);
  const [editingKeyStock, setEditingKeyStock] = useState("");
  const [editingKeyDetail, setEditingKeyDetail] = useState("");

  const [searchStockNameStock, setSearchStockNameStock] = useState("");
  const [searchTokenStock, setSearchTokenStock] = useState("");

  const [searchStockNameDetail, setSearchStockNameDetail] = useState("");
  const [searchTokenDetail, setSearchTokenDetail] = useState("");

  const [formStock] = Form.useForm();
  const [formDetail] = Form.useForm();

  useEffect(() => {
    fetchStocks();
    fetchStockDetails();
  }, []);

  // Fetch stocks data
  const fetchStocks = async () => {
    try {
      const res = await axios.get("http://localhost:8000/custom/admin/get/stocks");
      if (res.data.status === 200) {
        const dataWithKey = res.data.data.map((item: Stock, idx: number) => ({
          ...item,
          key: item.token + idx,
        }));
        setStockList(dataWithKey);
      }
    } catch (err) {
      message.error("Failed to fetch stocks");
    }
  };

  // Fetch stock details data
  const fetchStockDetails = async () => {
    try {
      const res = await axios.get("http://localhost:8000/custom/admin/get/stocks/details");
      if (res.data.status === 200) {
        const dataWithKey = res.data.data.map((item: StockDetail, idx: number) => ({
          ...item,
          key: item.token + idx,
        }));
        setStockDetailsList(dataWithKey);
      }
    } catch (err) {
      message.error("Failed to fetch stock details");
    }
  };

  // Editable logic for Stocks tab
  const isEditingStock = (record: Stock) => record.key === editingKeyStock;

  const editStock = (record: Partial<Stock>) => {
    formStock.setFieldsValue({ ...record });
    setEditingKeyStock(record.key!);
  };

  const cancelStock = () => {
    setEditingKeyStock("");
  };

  const saveStock = async (key: React.Key) => {
    try {
      const row = (await formStock.validateFields()) as Stock;
      const newData = [...stockList];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const updatedItem = { ...item, ...row };
        newData.splice(index, 1, updatedItem);
        setStockList(newData);
        setEditingKeyStock("");

        // Call POST API to update backend
        await axios.post("http://localhost:8000/custom/admin/cud/stocks", updatedItem);
        message.success("Stock updated successfully");
      } else {
        message.error("Update failed: Item not found");
      }
    } catch (err) {
      message.error("Update failed");
    }
  };

  // Editable logic for Stock Details tab
  const isEditingDetail = (record: StockDetail) => record.key === editingKeyDetail;

  const editDetail = (record: Partial<StockDetail>) => {
    formDetail.setFieldsValue({
      ...record,
      last_update: record.last_update
        ? record.last_update.substring(0, 16)
        : "", // trim for datetime-local input
    });
    setEditingKeyDetail(record.key!);
  };

  const cancelDetail = () => {
    setEditingKeyDetail("");
  };

  const saveDetail = async (key: React.Key) => {
    try {
      const row = (await formDetail.validateFields()) as StockDetail;
      const newData = [...stockDetailsList];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        // Convert datetime-local string back to ISO string if needed
        const updatedItem = {
          ...item,
          ...row,
          last_update: new Date(row.last_update).toISOString(),
        };
        newData.splice(index, 1, updatedItem);
        setStockDetailsList(newData);
        setEditingKeyDetail("");

        // Call POST API to update backend
        await axios.post("http://localhost:8000/custom/admin/cud/stocks/details", updatedItem);
        message.success("Stock detail updated successfully");
      } else {
        message.error("Update failed: Item not found");
      }
    } catch (err) {
      message.error("Update failed");
    }
  };

  // Columns for Stocks table
  const stockColumns = [
    {
      title: "Stock Name",
      dataIndex: "stock_name",
      key: "stock_name",
      editable: true,
    },
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
      editable: true,
    },
    {
      title: "Exchange",
      dataIndex: "exchange",
      key: "exchange",
      editable: true,
    },
    {
      title: "Is Hotlist",
      dataIndex: "is_hotlist",
      key: "is_hotlist",
      editable: true,
      render: (text: boolean) => (text ? "Yes" : "No"),
    },
    {
      title: "Trend Type",
      dataIndex: "trend_type",
      key: "trend_type",
      editable: true,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      editable: true,
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      editable: true,
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by",
      editable: true,
    },
    {
      title: "Is Deleted",
      dataIndex: "is_deleted",
      key: "is_deleted",
      editable: true,
      render: (text: boolean) => (text ? "Yes" : "No"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: Stock) => {
        const editable = isEditingStock(record);
        return editable ? (
          <span>
            <Button
              onClick={() => saveStock(record.key)}
              type="link"
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Popconfirm title="Cancel changes?" onConfirm={cancelStock}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button
            disabled={editingKeyStock !== ""}
            onClick={() => editStock(record)}
            type="link"
          >
            Edit
          </Button>
        );
      },
    },
  ];

  // Columns for Stock Details table
  const stockDetailsColumns = [
    {
      title: "Stock Name",
      dataIndex: "stock_name",
      key: "stock_name",
      editable: false,
    },
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
      editable: false,
    },
    {
      title: "LTP",
      dataIndex: "ltp",
      key: "ltp",
      editable: true,
    },
    {
      title: "Last Update",
      dataIndex: "last_update",
      key: "last_update",
      editable: true,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: StockDetail) => {
        const editable = isEditingDetail(record);
        return editable ? (
          <span>
            <Button
              onClick={() => saveDetail(record.key)}
              type="link"
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Popconfirm title="Cancel changes?" onConfirm={cancelDetail}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button
            disabled={editingKeyDetail !== ""}
            onClick={() => editDetail(record)}
            type="link"
          >
            Edit
          </Button>
        );
      },
    },
  ];

  // Merge columns for editable cells (Stocks)
  const mergedStockColumns = stockColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Stock) => ({
        record,
        inputType:
          col.dataIndex === "created_by" ||
          col.dataIndex === "is_deleted" ||
          col.dataIndex === "is_hotlist"
            ? "text"
            : col.dataIndex === "created_at" || col.dataIndex === "updated_at"
            ? "date"
            : col.dataIndex === "token"
            ? "text"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditingStock(record),
      }),
    };
  });

  // Merge columns for editable cells (Stock Details)
  const mergedDetailColumns = stockDetailsColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: StockDetail) => ({
        record,
        inputType: col.dataIndex === "ltp" ? "number" : col.dataIndex === "last_update" ? "date" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditingDetail(record),
      }),
    };
  });

  // Filtered data for Stocks
  const filteredStockList = stockList.filter(
    (stock) =>
      stock.stock_name.toLowerCase().includes(searchStockNameStock.toLowerCase()) &&
      stock.token.toLowerCase().includes(searchTokenStock.toLowerCase())
  );

  // Filtered data for Stock Details
  const filteredStockDetailsList = stockDetailsList.filter(
    (detail) =>
      detail.stock_name.toLowerCase().includes(searchStockNameDetail.toLowerCase()) &&
      detail.token.toLowerCase().includes(searchTokenDetail.toLowerCase())
  );

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Stock Details" key="1">
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <Input.Search
            placeholder="Search by Stock Name"
            onChange={(e) => setSearchStockNameDetail(e.target.value)}
            style={{ maxWidth: 300 }}
            allowClear
          />
          <Input.Search
            placeholder="Search by Token"
            onChange={(e) => setSearchTokenDetail(e.target.value)}
            style={{ maxWidth: 300 }}
            allowClear
          />
        </div>
        <Form form={formDetail} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={filteredStockDetailsList}
            columns={mergedDetailColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancelDetail,
            }}
          />
        </Form>
      </TabPane>

      <TabPane tab="Stock" key="2">
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <Input.Search
            placeholder="Search by Stock Name"
            onChange={(e) => setSearchStockNameStock(e.target.value)}
            style={{ maxWidth: 300 }}
            allowClear
          />
          <Input.Search
            placeholder="Search by Token"
            onChange={(e) => setSearchTokenStock(e.target.value)}
            style={{ maxWidth: 300 }}
            allowClear
          />
        </div>
        <Form form={formStock} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={filteredStockList}
            columns={mergedStockColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancelStock,
            }}
          />
        </Form>
      </TabPane>
    </Tabs>
  );
};

export default Admin;
