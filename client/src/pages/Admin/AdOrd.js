import React, { useEffect, useState } from 'react';
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import axios from 'axios';
import './Cart.css'; // Assuming you will add custom styles here
import { Button, Modal, Select, Input } from 'antd';
const { Option } = Select;
const { Search } = Input;

const AdOrd = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusOptions] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "delivered",
    "cancel",
  ]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/allorders'); // Adjust the URL to your backend endpoint
      setOrders(data);
      setFilteredOrders(data); // Initially set filtered orders to all orders
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status); // Set initial status
  };

  const handleChangeStatus = async () => {
    try {
      const { data } = await axios.put(`/api/v1/auth/order-status/${selectedOrder._id}`, {
        status: selectedStatus,
      });
      fetchOrders(); // Refresh orders after status update
      setSelectedOrder(null); // Clear selected order
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'cancel':
        return 'red';
      case 'Processing':
        return 'gold';
      case 'delivered':
        return 'green';
      case 'Not Process':
        return 'grey'
      case 'Shipped': 
        return 'blue'
      default:
        return 'black';
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    const filtered = orders.filter(order => {
      const lowerValue = value.toLowerCase();
      return (
        order._id.toLowerCase().includes(lowerValue) ||
        (order.buyer?.name && order.buyer.name.toLowerCase().includes(lowerValue)) ||
        (order.buyer?.email && order.buyer.email.toLowerCase().includes(lowerValue))
      );
    });
    setFilteredOrders(filtered);
  };

  return (
    <Layout>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h2>All Orders</h2>
            <Search
              placeholder="Search by Order ID, Customer Name, or Email"
              onSearch={handleSearch}
              enterButton
              style={{ marginBottom: '20px' }}
            />
            {filteredOrders.length > 0 ? (
              <div className='order-list'>
                {filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
                  <div key={order._id} className='card mb-2'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-md-6'>
                          <h6 className='card-title'>Order ID: {order._id}</h6>
                          <p className='card-text'><strong>Buyer:</strong> {order.buyer?.name}</p>
                          <p className='card-text'>
                            <strong>Status:</strong> <span style={{ color: getStatusColor(order.status) }}>{order.status}</span>
                          </p>
                          <h6>Products:</h6>
                          <ul className='list-group list-group-flush'>
                            {order.products.map((item, index) => (
                              <li key={index} className='list-group-item'>
                                <p><strong>Product:</strong> {item.product?.name}</p>
                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                <p><strong>Size:</strong> {item.size}</p>
                              </li>
                            ))}
                          </ul>
                          <Button onClick={() => handleEdit(order)} className="mt-3" type="primary">Edit Status</Button>
                        </div>
                        <div className='col-md-6'>
                          <h6 className='mt-2'>Payment Details:</h6>
                          <p><strong>Method:</strong> {order.payment?.method || 'N/A'}</p>
                          <p><strong>Transaction ID:</strong> {order.payment?.transactionId || 'N/A'}</p>
                          <p><strong>Amount:</strong> {order.payment?.amount || 'N/A'}</p>
                          <p><strong>Payment Status:</strong> {order.payment?.status || 'N/A'}</p>
                          <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No orders found</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for editing status */}
      <Modal
        title={`Edit Status - Order ID: ${selectedOrder?._id}`}
        visible={!!selectedOrder}
        onOk={handleChangeStatus}
        onCancel={closeModal}
      >
        <Select value={selectedStatus} onChange={(value) => setSelectedStatus(value)}>
          {statusOptions.map((status, index) => (
            <Option key={index} value={status}>{status}</Option>
          ))}
        </Select>
      </Modal>
    </Layout>
  );
};

export default AdOrd;
