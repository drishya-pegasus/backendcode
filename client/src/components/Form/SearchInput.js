import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './btn.css';

const SearchInput = ({ toggleSearch }) => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/api/v1/product/search/${values.keyword}`);
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form className="d-flex" role="search" onSubmit={handleSubmit}>
        <input
          type="search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
          className={`search-input ${toggleSearch ? 'active' : ''}`}
          placeholder="Search..."
        />
      </form>
    </div>
  );
};

export default SearchInput;
