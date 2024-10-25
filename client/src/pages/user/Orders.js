import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../../context/auth";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import './User.css';

const Orders = () => {
  const [auth] = useAuth();
  const userId = auth?.user?.id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("User ID is not available.");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/ord/${userId}`);
        if (response.data.length === 0) {
          setError("No orders found.");
        } else {
          setOrders(response.data);
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'cancel':
        return 'red';
      case 'Processing':
        return 'gold';
      case 'delivered':
        return 'green';
      case 'Not Process':
        return 'grey';
      case 'Shipped': 
        return 'blue';
      default:
        return 'black';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error && error !== "No orders found.") {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h2 className="text-center">Order History</h2>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              orders.map(order => (
                <div key={order._id} className="order-card border shadow-sm p-3 mb-3 bg-white rounded">
                  <h3 className="order-id">Order ID: {order._id}</h3>
                  <p>Status: <span style={{ color: getStatusColor(order.status) }}>{order.status}</span></p>
                  <p>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <h4>Products:</h4>
                  <ul className="product-list">
                    {order.products.map(item => (
                      item.product && (
                        <li key={item.product._id} className="product-item">
                          <p><strong>Product Name:</strong> {item.product.name}</p>
                          <p><strong>Quantity:</strong> {item.quantity}</p>
                          <p><strong>Size:</strong> {item.size}</p>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
