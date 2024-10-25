import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout.js';
import { useAuth } from '../context/auth';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Store.css';

const Womens = () => {
  const [auth, setAuth] = useAuth();
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/womens');
      setProducts(data);
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
      <div className='products-col'>
        <h1 className='text-center'>Womens Products</h1>
        <div className='prods'>
          {products?.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p.slug}`}
              className="product-link"
            >
              <div className="prod-card">
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className=""
                  alt={p.name}
                />
                <div className="card-content">
                  <h5>{p.name}</h5>
                  <p>Rs.{p.price}/-</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Womens;
