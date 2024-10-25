import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { Link } from 'react-router-dom';

const Search = () => {
  const [values, setValues] = useSearch();
  const [loading, setLoading] = useState(true); // State to track loading state

  useEffect(() => {
    // Simulate loading delay for demonstration (remove in actual implementation)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust timing as needed

    // Cleanup function to clear timeout on component unmount or re-render
    return () => clearTimeout(timeout);
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h6>
                {values?.results.length < 1
                  ? "No Products Found"
                  : `Found ${values?.results.length} Products`}
              </h6>
              <div className="d-flex flex-wrap mt-4">
                {values?.results.map((p) => (
                  <Link
                    key={p._id}
                    to={`/product/${p.slug}`}
                    className="linkdiffprods"
                  >
                    <div className="pcard">
                      <div className="pimg">
                        <img
                          src={p.photo}
                          alt="Product image"
                        />
                       
                      </div>
                      <div className="pdets">
                        <p>{p.name}</p>
                        <p>
                          <s>Rs.{p.price + 200}.-</s> Rs.{p.price}/-
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
