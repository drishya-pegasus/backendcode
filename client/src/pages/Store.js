import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout.js';
import { useAuth } from '../context/auth';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Store.css';

const Store = () => {
  const [auth, setAuth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/get-product');
      setProducts(data.products);
      setIsLoaded(true);
    } catch (err) {
      console.log(err);
    }
  };

  const preloadImages = (products) => {
    products.forEach(product => {
      const img = new Image();
      img.src = product.photo;
      const img1 = new Image();
      img1.src = product.photo1;
      const img2 = new Image();
      img2.src = product.photo2;
    });
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      preloadImages(products);
    }
  }, [products]);

  return (
    <Layout>
      <div className='offer'>
        <h4><strong>MONSOON SALE! 20% OFF ON ALL APPARELS</strong></h4>
      </div>
      <div className='offer'>
        <h4><strong>This Month we will be contributing 5% of our profits to charity, orphanage and old age homes.</strong></h4>
      </div>
      <div className={`fullprod ${isLoaded ? 'loaded' : ''}`}>
        <div className='pcards'>
          {products?.map((p, index) => (
            <Link
              key={p._id}
              to={`/product/${p.slug}`}
              className="linkdiffprods"
              style={{ '--animation-order': index }}
            >
              <div className="pcard">
                <div className="pimg">
                  <img 
                    src={p.photo}
                    alt="Product image" 
                    className="default-photo"
                  />
                  <img 
                    src={p.photo1} 
                    alt="Product image on hover" 
                    className="hover-photo"
                  />
                </div>
                <div className="pdets">
                  <h4><strong>{p.name}</strong></h4>
                  <p className='priceofdetail'><s>Rs.{p.price + 200}.-</s> <strong>Rs.{p.price}/-</strong></p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Store;
