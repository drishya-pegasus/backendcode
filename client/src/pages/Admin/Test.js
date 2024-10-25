import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import './Cartpage.css';
import 'ldrs/hourglass';
import pay from '../assets/fonepay.png';
import esewa from '../assets/esewa.jpg';
import { Card } from 'antd';

const couponCodes = [
  "FIRSTORDER", "DASHAINHYPE", "10FLAT"
];

const Checkout = () => {
  const sizes = ['Cash On Delivery', 'Fonepay', 'Esewa'];
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [auth] = useAuth();
  const [contextCart, setContextCart] = useCart();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [error, setError] = useState('');
  const userId = auth?.user?.id;
  const useremail = auth?.user?.email;
  const [termsChecked, setTermsChecked] = useState(false);
  const [formValues, setFormValues] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    file: null,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const location = useLocation();
  const { district: locationDistrict, cart: locationCart } = location.state || {};

  useEffect(() => {
    const isValid = Object.values(formValues).every(value => value) && termsChecked && selectedPaymentMethod;
    setIsFormValid(isValid);
  }, [formValues, termsChecked, selectedPaymentMethod]);

  const handleCheckboxChange = () => {
    setTermsChecked(!termsChecked);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFile(files[0]);
  };
  
  const handleCheckout = () => {
    if (isFormValid) {
      console.log("Checkout confirmed!");
      navigate('/');
    } else {
      alert("Please fill all fields and agree to the terms and conditions.");
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (couponCodes.includes(couponInput)) {
      setAppliedCoupon(couponInput);
      setError('');
      console.log(`Coupon "${couponInput}" applied!`);
    } else {
      setError('Invalid coupon code');
    }
  };

  const totalPrice = () => {
    try {
      let total = 0;
      contextCart?.forEach((item) => {
        total += item.productId.price * item.quantity;
      });
      return total;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const shippingCost = locationDistrict === 'Kathmandu' ? 100 : 200;
  const totalPriceNumeric = totalPrice();

  const discount = appliedCoupon ? contextCart.reduce((acc, item) => acc + (item.productId.price * item.quantity * 0.1), 0) : 0;
  const grandTotal = totalPriceNumeric + shippingCost - discount;

  const updateQuantity = (productId, size, quantity) => {
    setContextCart((prevCart) =>
      prevCart.map((item) =>
        item.productId._id === productId && item.size === size
          ? { ...item, quantity: quantity }
          : item
      )
    );
  };

  const removeCartItem = async (productId, size) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/v1/cart/${userId}`, {
        data: { productId, size },
      });
      setContextCart(response.data.cart.products);
      toast.success("Item removed from cart successfully!");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/cart/${userId}`);
      setContextCart(response.data.cart.products);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast.error("Error fetching cart data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartData();
    }
  }, [userId]);

  const handleEmailSend = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append("useremail", useremail);
      formData.append("userId", userId);
      formData.append("deliverycharge", locationDistrict);
      formData.append("phone", formValues.phone);
      formData.append("exactad", formValues.address);
      formData.append("emem", formValues.email);

      const cartToSend = contextCart.map((item) => ({
        product: item.productId._id,
        productname: item.productId.name,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));
  
      console.log('Cart to send:', cartToSend);
      formData.append("total", grandTotal.toFixed(2));
      formData.append("cart", JSON.stringify(cartToSend));
  
      // Check payment method and append file if necessary
      if (selectedPaymentMethod !== "Cash On Delivery" && file) {
        formData.append("attachments", file);
      } else {
        formData.append("attachments", null);
      }
  
      // Check if terms and payment method are selected
      if (!termsChecked || !selectedPaymentMethod) {
        throw new Error("Fill the necessary values");
      }
  
      setLoading(true);
  
      // Send email
      const emailResponse = await axios.post("/api/v1/cart/send-email", formData);
      console.log("Email sent:", emailResponse.data);
      toast.success("Email sent successfully!");
  
      // Create order
      const orderData = {
        products: cartToSend,
        payment: selectedPaymentMethod, // Add payment details if required
        buyer: userId,
        status: "Pending", // Add order status, if applicable
      };
  
      console.log('Order data:', orderData);
  
      const orderResponse = await axios.post("/api/v1/order/create", orderData);
  
      console.log("Order created:", orderResponse.data);
      toast.success("Order created successfully!");
      navigate('/');
    } catch (error) {
      console.error("Error sending email or creating order:", error.message);
      toast.error("Failed to send email or create order");
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <Layout>
      <div className="checkfullpage">
        <div className="twoooo">
          <div className="fullleftcheck">
            <div className="cardforbilling">
              <h5 className="card-header">Billing Information</h5>
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <input type="text" className="form-control" id="fullName" name="fullName" value={formValues.fullName} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="text" className="form-control" id="phone" name="phone" value={formValues.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={formValues.email} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" name="address" value={formValues.address} onChange={handleInputChange} required />
                  </div>
                  {selectedPaymentMethod !== 'Cash On Delivery' && (
                    <div className="mb-3">
                      <label htmlFor="file" className="form-label">Attach File (if applicable)</label>
                      <input type="file" className="form-control" id="file" name="file" onChange={handleFileChange} />
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                    {sizes.map((method) => (
                      <div key={method} className="form-check">
                        <input 
                          type="radio" 
                          id={method} 
                          name="paymentMethod" 
                          value={method} 
                          checked={selectedPaymentMethod === method} 
                          onChange={() => handlePaymentMethodSelect(method)} 
                          className="form-check-input" 
                        />
                        <label htmlFor={method} className="form-check-label">{method}</label>
                      </div>
                    ))}
                  </div>
                  <div className="form-check">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      checked={termsChecked} 
                      onChange={handleCheckboxChange} 
                      className="form-check-input" 
                    />
                    <label htmlFor="terms" className="form-check-label">I agree to the terms and conditions</label>
                  </div>
                  <button 
                    type="submit" 
                    className="placeorderbutton" 
                    onClick={handleEmailSend} 
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="rightside">
            <h5>Order Summary</h5>
            <div className="cart-container">
              {contextCart.map((item) => (
                <div key={item.productId._id} className="card mb-3">
                  <div className="row g-0">
                    <div className="col-md-4">
                     <img
                    src={item.productId.colors.find(c => c.color === item.color)?.link || item.productId.photo}
                    className="img-fluid rounded-start"
                    alt={item.productId.name}
                  />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{item.productId.name}</h5>
                        <p className="card-text">Color: {item.color}</p>
                        <p className="card-text">Quantity: {item.quantity}</p>
                        <p className="card-text">Price: Rs.{item.quantity * item.productId.price}/-</p>
                        <button
                          className="delbut"
                          onClick={() => removeCartItem(item.productId._id, item.size)}
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Card className="summary-card" style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <h6 style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Total Price: <span style={{ float: 'right' }}>Rs.{totalPrice().toFixed(2)}/-</span></h6>
      <h6 style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Shipping Cost: <span style={{ float: 'right' }}>Rs.{shippingCost}/-</span></h6>
      {appliedCoupon && <h6 style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Discount: <span style={{ float: 'right' }}>-Rs.{discount.toFixed(2)}/-</span></h6>}
      <h6 style={{ marginBottom: 0, fontWeight: 600 }}>Grand Total: <span style={{ float: 'right' }}>Rs.{grandTotal.toFixed(2)}/-</span></h6>
    </Card>
            <form onSubmit={handleCouponSubmit} className="mt-3">
              <div className="mb-3">
                <label htmlFor="coupon" className="form-label">Coupon Code</label>
                <input type="text" className="form-control" id="coupon" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
                {error && <div className="text-danger mt-2">{error}</div>}
              </div>
              <button type="submit" className="coupounbutton">Apply Coupon</button>
            </form>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;

// const [isModalVisible, setIsModalVisible] = useState(false);

// const handlePaymentMethodSelect = (method) => {
//   setSelectedPaymentMethod(method);
//   if (method === 'Fonepay' || method === 'Esewa') {
//     setIsModalVisible(true);
//   }
// };
// const handleModalClose = () => {
//   setIsModalVisible(false);
// };

// <Modal visible={isModalVisible} onCancel={handleModalClose} footer={null}>
//         {selectedPaymentMethod === 'Fonepay' && (
//           <img src={pay} alt="Fonepay" />
//         )}
// </Modal>