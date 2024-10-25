import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import vid from '../assets/bellovid.mov'
import spacebarvid from '../assets/spacebarvid.mov'

import pp from '../assets/pp.mp4'
import y1 from '../assets/1year.png'
import wings from '../assets/wings.mov'
import classic from '../assets/classic.mov'
import sporty from '../assets/sporty.MOV'
import urban from '../assets/urban.mov'

import sleeve from '../assets/sleeve.mov'
import vent from '../assets/venturepack.mov'
import talon from '../assets/talon.mov'

import essential from '../assets/essential.mov'
import sling from '../assets/sling.mov'
import ul from '../assets/ul.mov'
import linen from '../assets/linen.mov'

import toast from 'react-hot-toast';
import { useParams, Link, useNavigate } from "react-router-dom";
import './Pd.css';
import { useAuth } from "../context/auth.js";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [availableColors, setAvailableColors] = useState([]); 
  const [selectedColorImage, setSelectedColorImage] = useState(''); 
  const sizes = ['M', 'L', 'XL'];
  const userIdd = auth?.user?.id;

  function getDarkerShade(color) {
    const shadeFactor = 0.8;
    let colorValue = color.replace('#', '');
    if (colorValue.length === 3) {
      colorValue = colorValue.split('').map(c => c + c).join('');
    }
    const r = Math.floor(parseInt(colorValue.substring(0, 2), 16) * shadeFactor);
    const g = Math.floor(parseInt(colorValue.substring(2, 4), 16) * shadeFactor);
    const b = Math.floor(parseInt(colorValue.substring(4, 6), 16) * shadeFactor);
    return `rgb(${r}, ${g}, ${b})`;
  }

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = auth?.token ? `Bearer ${auth.token}` : '';
  }, [auth?.token]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);

      const colors = data?.product?.colors || [];
      if (Array.isArray(colors) && colors.every(item => item.color && typeof item.color === 'string')) {
        setAvailableColors(colors);
      } else {
        console.error('Color values are not valid:', colors);
      }

      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async () => {
    if (!auth?.user) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    if (product?.category?.name !== "bags" && product?.name !=="Sling Bag" && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (product?.name?.toLowerCase().includes("spacebar") && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    try {
      const newItem = {
        userId: userIdd,
        productId: product._id,
        size: selectedSize,
        color: selectedColor,
      };
      await axios.post(`/api/v1/product`, newItem);
      toast.success("Item added to cart");
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleColorChange = (colorObj) => {
    setSelectedColor(colorObj.color);
    setSelectedColorImage(colorObj.link);
  };

  const formatDescription = (description) => {
    if (!description) return [];
    
    // Split the description by hyphens and trim whitespace
    return description.split('\n').map(line => line.replace(/^-+\s*/, '').trim()).filter(line => line.length > 0);
  };


  const buynow = async(req,res) =>{
    if (!auth?.user) {
      toast.error("Please log in to add items to your cart");
      return;
    }
    if (product?.category?.name !== "bags" && product?.name !=="Sling Bag" && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (product?.name?.toLowerCase().includes("spacebar") && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    try {
      const newItem = {
        userId: userIdd,
        productId: product._id,
        size: selectedSize,
        color: selectedColor,
      };
      await axios.post(`/api/v1/product`, newItem);
      toast.success("Item added to cart");
      navigate('/cart/checkout')
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error("Failed to add item to cart");
    }
  }

  const descriptionPoints = formatDescription(product.description);

  return (
    <Layout>
      <div className='offer'>
        <h4><strong>This Month we will be contributing 5% of our profits to charity, orphanage and old age homes.</strong></h4>
      </div>
      <div className="row container product-details mt-2">
      {product && (
        <div className="col-md-6 pic">
          <div className="prod-img-container">
            

            {product.name && (
              <>
                {/* Videos based on the product name */}
                {product.name.toLowerCase() === "laptop sleeve" && (
                  <div className="video">
                    <video src={sleeve} autoPlay loop muted className="card-img"></video>
                  </div>
                )}

                {product.name.toLowerCase() === "venturepack backpack" && (
                  <div className="video">
                    <video src={vent} autoPlay loop muted className="card-img"></video>
                  </div>
                )}

                {product.name.toLowerCase() === "spacebar backpack" && (
                  <div className="video">
                    <video src={spacebarvid} autoPlay loop muted className="card-img"></video>
                  </div>
                )}

                {product.name.toLowerCase() === "blaze backpack" && (
                  <div className="video">
                    <video src={sporty} autoPlay loop muted className="card-img"></video>
                  </div>
                )}

                {product.name.toLowerCase() === "the wings backpack" && (
                  <div className="video">
                    <video src={wings} autoPlay loop muted className="card-img"></video>
                  </div>
                )}
                
                {product.name.toLowerCase() === "classic backpack" && (
                  <div className="video">
                    <video src={classic} autoPlay loop muted className="card-img"></video>
                  </div>
                )}

                {product.name.toLowerCase() === "essential backpack" && (
                  <div className="video">
                    <video src={essential} autoPlay loop muted className="card-img"></video>
                  </div>
                )}

                {product.name.toLowerCase() === "sling bag" && (
                  <div className="video">
                    <video src={sling} autoPlay loop muted className="card-img"></video>
                  </div>
                )}

                {product.name.toLowerCase() === "ultraline shirt" && (
                  <div className="video">
                    <video src={ul} autoPlay loop muted className="card-img"></video>
                  </div>
                )}

                {product.name.toLowerCase() === "ultraline pant" && (
                  <div className="video">
                    <video src={ul} autoPlay loop muted className="card-img"></video>
                  </div>
                )}
                
                {product.name.toLowerCase() === "linen set" && (
                  <div className="video">
                    <video src={linen} autoPlay loop muted className="card-img"></video>
                  </div>
                )}

                {product.name.toLowerCase() === "white trousers" && (
                  <div className="video">
                    <video src={pp} autoPlay loop muted></video>
                  </div>
                )}
                {product.name.toLowerCase() === "talon half pant" && (
                  <div className="video">
                    <video src={talon} autoPlay loop muted className="card-img"></video>
                  </div>
                )}
                {product.name.toLowerCase() === "talon t-shirt" && (
                  <div className="video">
                    <video src={talon} autoPlay loop muted className="card-img"></video>
                  </div>
                )}
                
                {product.name.toLowerCase() === "heritage woollen jacket" && (
                  <div className="video">
                    <video src={urban} autoPlay loop muted className="card-img"></video>
                  </div>
                )}{product.name.toLowerCase() === "owl haze jacket" && (
                  <div className="video">
                    <video src={urban} autoPlay loop muted className="card-img"></video>
                  </div>
                )}{product.name.toLowerCase() === "corduroy pant" && (
                  <div className="video">
                    <video src={urban} autoPlay loop muted className="card-img"></video>
                  </div>
                )}{product.name.toLowerCase() === "urban tshirt" && (
                  <div className="video">
                    <video src={urban} autoPlay loop muted className="card-img"></video>
                  </div>
                )}
                
              </>
            )}
            <img
              src={selectedColorImage || product.photo1}
              className="card-img"
              alt={product.name}
            />
          </div>
          
        </div>
      )}
        <div className="col-md-6 product-details-info">
          <a href="/">Shop</a> /<a href="/backpacks">Backpacks</a> /<a href="/cart">Cart</a>
          <hr />
          <h4 className="prod-name">{product.name}</h4>
          <ul className="description-list">
            {descriptionPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <hr />
          <hr />
          <h4 className="prod-price">
          {product.name === "Laptop Sleeve" && selectedSize === "M"
            ? `Price: NRS.1240/-`
            :product.name === "Laptop Sleeve" && selectedSize === "L"
            ? `Price: NRS.1320/-`
            :product.name === "Laptop Sleeve" && selectedSize === "XL"
            ? `Price: NRS.1400/-`
            : `Price: ${product?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "NRS",
              })}`}
        </h4>
          {product?.category?.name !== "bags" && product?.name !== "Sling Bag" &&(
            <div className="size-options">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          )}
          <hr />
          <p>Available Colors</p>
          {availableColors.length > 0 && (
            <div className="color-options">
              {availableColors.map((colorObj, index) => (
                <div
                  key={index}
                  className={`color-option ${selectedColor === colorObj.color ? 'selected' : ''}`}
                  style={{
                    backgroundColor: colorObj.color.toLowerCase(),
                    borderColor: selectedColor === colorObj.color ? getDarkerShade(colorObj.color) : 'transparent',
                  }}
                  onClick={() => handleColorChange(colorObj)}
                />
              ))}
            </div>
          )}
          <button className="bor-btn-pro" onClick={addToCart}>ADD TO CART</button>
          <button className="bor-btn-pro-bn" onClick={buynow} >BUY NOW</button>

        </div>
      </div>
      {relatedProducts.length > 0 && (
        
<div className="similar-prods">
        <h4>Similar Products: </h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <Link to={`/product/${p.slug}`}>
                {p._id && (
                  <img
                    src={p.photo}
                    className="card-img-top"
                    alt={p.name}
                    height="200px"
                    width="300px"
                  />
                )}
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "NRS",
                      })}
                    </h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      )}
    </Layout>
  );
};

export default ProductDetails;



