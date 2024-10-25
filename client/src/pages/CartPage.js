import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import 'ldrs/hourglass'; // Import the hourglass component
import { hourglass } from 'ldrs';
import './Cartpage.css'; // Import the CSS file
import { RiDeleteBin6Line } from "react-icons/ri";
import { useShipping } from '../context/shipping';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom'; // Import Link for navigation

// Remove useHistory import

hourglass.register();

const districts = [
  "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura",
  "Banke", "Bara", "Bardiya", "Bhaktapur", "Bhojpur", "Chitwan", "Dadeldhura",
  "Dailekh", "Dang", "Darchula", "Dhading", "Dhankuta", "Dhanusha", "Dolakha",
  "Dolpa", "Doti", "Eastern Rukum", "Gorkha", "Gulmi", "Humla", "Ilam",
  "Jajarkot", "Jhapa", "Jumla", "Kailali", "Kalikot", "Kanchanpur", "Kapilvastu",
  "Kaski", "Kathmandu", "Kavrepalanchok", "Khotang", "Lalitpur", "Lamjung",
  "Mahottari", "Makwanpur", "Manang", "Morang", "Mugu", "Mustang", "Myagdi",
  "Nawalpur", "Nuwakot", "Okhaldhunga", "Palpa", "Panchthar", "Parasi",
  "Parbat", "Parsa", "Pyuthan", "Ramechhap", "Rasuwa", "Rautahat", "Rolpa",
  "Rupandehi", "Salyan", "Sankhuwasabha", "Saptari", "Sarlahi", "Sindhuli",
  "Sindhupalchok", "Siraha", "Solukhumbu", "Sunsari", "Surkhet", "Syangja",
  "Tanahun", "Taplejung", "Terhathum", "Udayapur", "Western Rukum"
];

const couponCodes = [
  "FIRSTORDER", "DASHAINHYPE", "10FLAT"
]
const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const userId = auth?.user?.id;
  const useremail = auth?.user?.email;


  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (couponCodes.includes(couponInput)) {
      setAppliedCoupon(couponInput);
      setError('');
      // Apply coupon logic here (e.g., update total price with discount)
      // For demonstration, let's console log the applied coupon
      console.log(`Coupon "${couponInput}" applied!`);
    } else {
      setError('Invalid coupon code');
    }
  };

  const updateAllQuantities = async () => {
    try {
      for (const item of cart) {
        await axios.put('/api/v1/cart/update-quantity', {
          userId,
          productId: item.productId._id,
          size: item.size,
          quantity: item.quantity,
        });
      }
    } catch (error) {
      console.error("Error updating quantities:", error);
      toast.error("Failed to update quantities");
    }
  };

  const handleCheckout = async () => {
    if (!selectedDistrict) {
      toast.error("Please Select The District");
      return;
    }
    
    setLoading(true);

    try {
      // Update all quantities in the database
      await updateAllQuantities();

      // Navigate to checkout page
      navigate('/cart/checkout', { state: { district: selectedDistrict, cart } });
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to proceed to checkout");
    } finally {
      setLoading(false);
    }
  };

  const customPrice = (productId, size) => {
    let price;
  
    // Check if the product is "Laptop Sleeve"
    if (productId.name === "Laptop Sleeve") {
      if (size === "M") {
        price = 1550;
      } else if (size === "L") {
        price = 1650;
      } else if (size === "XL") {
        price = 1750;
      }
    } else {
      // Default price for other products
      price = productId.price;
    }
  
    return price;
  };
  

  const totalPrice = () => {
    try {
     
      let total = 0;
     
      cart?.forEach((item) => {
        const price = customPrice(item.productId, item.size); // Use customPrice function
        total += price * item.quantity;

      });
  
      return total;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };
  

  // Calculate shipping cost based on selected district
  const shippingCost = selectedDistrict === 'Kathmandu' ? 100 : 200;
  const totalPriceNumeric = totalPrice(); // Calculate totalPrice once for efficiency

  const discount = appliedCoupon ? totalPriceNumeric * 0.1 : 0;
  const grandTotal = selectedDistrict 
  ? totalPriceNumeric + shippingCost - discount 
  : totalPriceNumeric - discount;
  

  const updateQuantity = (productId, size, quantity) => {
    setCart((prevCart) =>
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
      setCart(response.data.cart.products);
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
      setCart(response.data.cart.products);
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

  const getDeliveryCharge = () => {
    if (!selectedDistrict) {
      return "Rs.0/-";
    }
    return ["Kathmandu", "Lalitpur", "Bhaktapur"].includes(selectedDistrict) ? "Rs.100/-" : "Rs.200/-";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <l-hourglass
          size="40"
          bg-opacity="0.1"
          speed="1.75" 
          color="black" 
        ></l-hourglass>
      </div>
    );
  }

  const handleEmailSend = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("useremail", useremail);
    formData.append("userId", userId);

    const cartToSend = cart.map((item) => ({
      product: item.productId._id,
      quantity: item.quantity,
      size: item.size,
    }));

    formData.append("cart", JSON.stringify(cartToSend));

    const updateQuantity = async (productId, size, quantity) => {
      try {
        setLoading(true);
        const response = await axios.put('/api/v1/cart/update-quantity', {
          userId,
          productId,
          size,
          quantity,
        });
        setCart(response.data.cart.products);
        toast.success("Quantity updated successfully!");
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity");
      } finally {
        setLoading(false);
      }
    };
    

    try {
      // Send email
      const emailResponse = await axios.post("/api/v1/cart/send-email", formData);
      console.log("Email sent:", emailResponse.data);
      toast.success("Email sent successfully!");

      // Create order
      const orderResponse = await axios.post("/api/v1/order/create", {
        products: cartToSend,
        payment: {}, // Add payment details here
        buyer: userId,
        status: 'Not Process',
      });
      console.log("Order created:", orderResponse.data);
      toast.success("Order created successfully!");

      // Navigate to checkout page
    } catch (error) {
      console.error("Failed to send email or create order:", error);
      toast.error("Failed to send email or create order");
    }
  };

  return (
    <Layout>
    <div className='cartpagereal'>
      <div className='leftcart'>
        {cart?.map((p) => (
          
          <div className="pc" key={p._id}>
            <div className='cartproduct'>
              <div className='cartimgpro'>
              <img 
                    src={p.productId.colors.find(c => c.color === p.color)?.link || p.productId.photo} 
                    alt={p.productId.name} 
                    width="250px" 
                    height="300px"
                  />              </div>
              <div className='proddesc'>
                <h6 className='proddesctitle'>{p.productId.name}</h6>
                <h6>
                    Color: {p.color}{" "}
              
                  </h6>                <div className='sameline'><h6>{p.size}</h6></div>
                <h6 className='quan'>
                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        updateQuantity(
                          p.productId._id,
                          p.size,
                          Math.max(p.quantity - 1, 1)
                        )
                      }
                    >
                      -
                    </button>
                    <input
                      className="quanquan"
                      type="number"
                      value={p.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          p.productId._id,
                          p.size,
                          Math.max(Number(e.target.value), 1)
                        )
                      }
                      min="1"
                    />
                    <button
                      onClick={() =>
                        updateQuantity(
                          p.productId._id,
                          p.size,
                          p.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </h6>
  
                <RiDeleteBin6Line className='bbb' onClick={() => removeCartItem(p.productId._id, p.size)}/>
              </div>

              <h6 className='price'><strong>Rs.{customPrice(p.productId, p.size) * p.quantity}/-</strong></h6>

                <hr/>
            </div>
          </div>
        ))}
      </div>
  
      <div className='rightcart'>
        <div className='rightgoated'>
          <div className='righttitle'><h3>Summary</h3></div>
          <hr/>
          <div className='prices'>
            <div className='pleft'>Subtotal<br/><br/>Location <br/><br/> Delivery Charge</div>
            <div className='pright'>Rs.{totalPrice()}/- <br/>
              <form className="district-form">
                <select
                  id="district"
                  value={selectedDistrict}
                  placeholder="Shipping district"
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="district-select"
                >
                  <option value="" disabled>
                    Select a district
                  </option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </form><br/>
              {getDeliveryCharge()}
            </div>
          </div>
          <hr/>
          <div className='ptotal'>
            <div className='ptleft'>Total</div>
            <div className='ptright'>Rs. {grandTotal}/-</div>
          </div>
          <hr/>
          <p>Please note that the delivery price for Kathmandu, Lalitpur and Bhaktapur is Rs.100/- and for other districts its Rs.200/-</p>
                <hr/>
          <button className='coup' onClick={handleCheckout}>Checkout</button>
        </div>
      </div>
    </div>
  </Layout>
  
);
};

export default CartPage;

