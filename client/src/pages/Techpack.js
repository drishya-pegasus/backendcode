import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout.js';
import { useAuth } from '../context/auth';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Store.css';

const Techpack = () => {
  const [auth, setAuth] = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/get-product');
      const bagsProducts = data.products.filter(product => product.category.name === 'techpack');
      setProducts(bagsProducts);
      setIsLoaded(true);
    } catch (err) {
      console.log(err);
    }
  };

  const preloadImages = (products) => {
    products.forEach(product => {
      const img = new Image();
      img.src = `/api/v1/product/product-photo/${product._id}`;
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
        <h4><strong>This Month we will be contributing 5% of our profits to charity, orphanage and old age homes.</strong></h4>
      </div>
      <div className={`fullprod ${isLoaded ? 'loaded' : ''}`}>
        <div className='pcardss'>
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
                    className="default"
                  />
                </div>
                <div className="pdets">
                  <p>{p.name}</p>
                  <p><s>Rs.{p.price + 200}.-</s> Rs.{p.price}/-</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Techpack;
