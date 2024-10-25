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
import pay from '../assets/payment.png';
import esewa from '../assets/esewa.jpg';

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
  const { district: locationDistrict, cart: locationCart, product, productDetails } = location.state || {};

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
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: files[0]
    }));
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

  const discount = appliedCoupon ? totalPriceNumeric * 0.1 : 0;
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
  
      const cartToSend = contextCart.map((item) => ({
        product: item.productId._id,
        productname: item.productId.name,
        quantity: item.quantity,
        size: item.size,
      }));  
  
      console.log('Cart to send:', cartToSend);
      formData.append("total", grandTotal.toFixed(2));
      formData.append("cart", JSON.stringify(cartToSend));
  
      if (formValues.file) {
        formData.append("attachments", formValues.file);
      } 
  
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
                  <div className="mb-3">
                    <label htmlFor="file" className="form-label">Attachment</label>
                    <input type="file" className="form-control" id="file" name="file" onChange={handleFileChange} />
                  </div>
                  <div className="form-check mb-3">
                    <input type="checkbox" className="form-check-input" id="terms" checked={termsChecked} onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="terms">I agree to the terms and conditions</label>
                  </div>
                  <button type="submit" className="btn btn-primary" onClick={handleEmailSend} disabled={!isFormValid}>Confirm Order</button>
                </form>
              </div>
            </div>
          </div>
          <div className="fullrightcheck">
            <div className="upperfullright">
              <div className="card mt-4 mb-4">
                <h5 className="card-header">Your Cart</h5>
                <div className="card-body">
                  <div className="row">
                    {product && productDetails && (
                      <div key={product.productId} className="mb-4">
                        <div className="col-md-2">
                          <img
                            src={productDetails.image}
                            alt={productDetails.name}
                            className="img-fluid img-thumbnail mb-2"
                          />
                        </div>
                        <div className="col-md-8">
                          <h5>{productDetails.name}</h5>
                          <p>Price: {productDetails.price}</p>
                          <p>Quantity: 1</p>
                          <p>Size: {product.size}</p>
                          <p>Color: {product.color}</p>
                        </div>
                      </div>
                    )}
                    {contextCart?.map((p) => (
                      <div key={`${p.productId._id}-${p.size}`} className="mb-4">
                        <div className="row">
                          <div className="col-md-2">
                            <img
                              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p.productId._id}`}
                              alt={p.productId.name}
                              className="img-fluid img-thumbnail mb-2"
                            />
                          </div>
                          <div className="col-md-8">
                            <h5>{p.productId.name}</h5>
                            <p>Price: {p.productId.price}</p>
                            <p>Quantity: {p.quantity}</p>
                            <p>Size: {p.size}</p>
                          </div>
                          <div className="col-md-2 d-flex align-items-center justify-content-end">
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeCartItem(p.productId._id, p.size)}
                              disabled={loading}
                            >
                              <RiDeleteBin6Line />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="middlepart"></div>
            <div className="middlepagecheck">
              <h4>Order Summary</h4>
              <div className="fullrightbottom">
                <div className="fullleftbottom">
                  <p>Cart Total</p>
                  <p>Delivery</p>
                  {appliedCoupon && <p>Discount</p>}
                  <p>Total</p>
                </div>
                <div className="fullrightbottomtext">
                  <p>${totalPriceNumeric.toFixed(2)}</p>
                  <p>${shippingCost.toFixed(2)}</p>
                  {appliedCoupon && <p>-${discount.toFixed(2)}</p>}
                  <p>${grandTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="middlepagecheck">
              <h4>Choose Payment Method</h4>
              <div className="payment-button-container">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`payment-button ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodSelect(size)}
                  >
                    {size === 'Cash On Delivery' && (
                      <>
                        <i className="ldrs-hourglass"></i>
                        <p>Cash On Delivery</p>
                      </>
                    )}
                    {size === 'Fonepay' && (
                      <>
                        <img src={pay} alt="Fonepay" className="payment-logo" />
                        <p>Fonepay</p>
                      </>
                    )}
                    {size === 'Esewa' && (
                      <>
                        <img src={esewa} alt="Esewa" className="payment-logo" />
                        <p>Esewa</p>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <form onSubmit={handleCouponSubmit} className="couponform">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter coupon code"
              />
              <button type="submit" className="btn btn-primary">Apply</button>
            </form>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
