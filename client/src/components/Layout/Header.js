import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { CiUser, CiSearch } from 'react-icons/ci';
import { BsBag } from 'react-icons/bs';
import './Header.css';
import logo from '../../assets/bello_logo.webp';
import SearchInput from '../Form/SearchInput';
import { useAuth } from '../../context/auth';
import { NavLink, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Menu = () => (
  <>
    <p>
      <NavLink to="/store" href="#store">
        Store
      </NavLink>
    </p>
    <p>
      <NavLink to="/backpacks" href="#backpack">
        Backpacks
      </NavLink>
    </p>
    <p>
      <NavLink to="/apparals" href="#apparels">
        Apparels
      </NavLink>
    </p>
    <p>
      <NavLink to="/techpack" href="#techpack">
        Techpack
      </NavLink>
    </p>
    <p>
      <NavLink to="/about" href="#about us">
        About us
      </NavLink>
    </p>
   
  </>
);

const Header = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [auth, setAuth] = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State to track loading state
  const [searching, setSearching] = useState(false); // State to track search in progress
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchClick = () => {
    setToggleSearch(!toggleSearch);
    
     setToggleMenu(false); // Close the menu if it's open
    
  };



  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: '',
    });
    localStorage.removeItem('auth');
    toast.success('Logout Successfully');
  };

  const searchFunction = async (searchQuery) => {
    // Replace with actual API call or search logic
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]); // Simulating no search results
      }, 2000); // Simulating delay
    });
  };

  const handleSearchSubmit = async (searchQuery) => {
    try {
      setLoading(true);
      setSearching(true); // Start searching

      // Simulate API call or fetch data
      const searchResults = await searchFunction(searchQuery);

      // Navigate only if there are search results
      if (searchResults.length > 0) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      } else {
        toast.error('No results found.'); // Handle case where no results are found
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Error occurred while searching.'); // Handle error cases
    } finally {
      setLoading(false); // Always reset loading state
      setSearching(false); // End searching
    }
  };

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
      
        <div className="gpt3__navbar-links_container">
          <Menu />
        </div>
        <div className="gpt3__navbar-links_logo">
          <NavLink to="/">
            <img src={logo} alt="logo" />
          </NavLink>
        </div>
      </div>
      
      <div className="gpt3__navbar-sign">
        {!toggleSearch && (
          <>
            <CiSearch
              color="#fff"
              size={30}
              onClick={handleSearchClick}
              className="se"
            />
            {auth?.user ? (
              <>
                <div className="dropdown">
                  <CiUser
                    size={27}
                    color="#fff"
                    onClick={toggleDropdown}
                    className="profile"
                  />
                  {isOpen && (
                    <div className="dropdown-content">
                      <a href="#">{auth?.user?.name}</a>
                      <br />
                      <NavLink to="/dashboard/user">User Details</NavLink>
                      <br />
                      <NavLink onClick={handleLogout}>Log Out</NavLink>
                      <br />
                      {auth?.user?.role === 0 ? (
                         <NavLink to="/dashboard/user">User Dashboard</NavLink>
                      ) : (
                        <NavLink to="/dashboard/admin">Admin Dashboard</NavLink>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="dropdown">
                  <CiUser
                    onClick={toggleDropdown}
                    size={27}
                    color="#fff"
                    className="profile"
                  />
                  {isOpen && (
                    <div className="dropdown-content">
                      <Link to="/register">Register</Link>
                      <Link to="/login">Login</Link>
                    </div>
                  )}
                </div>
              </>
            )}
            <Link to="/cart">
              <BsBag color="white" className="bag" />
            </Link>
          </>
        )}
      </div>
      <div className="gpt3__navbar-menu">
        {toggleMenu ? (
          <RiCloseLine
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <RiMenu3Line
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className="gpt3__navbar-menu_container scale-up-center">
            <div className="gpt3__navbar-menu_container-links">
              <Menu />
              {!toggleSearch && (
                <>
                  <CiSearch
                    color="#fff"
                    size={30}
                    onClick={() => setToggleSearch(true)}
                  />
                  {auth?.user ? (
                    <>
                      <div className="dropdown">
                        <CiUser
                          size={27}
                          color="#fff"
                          onClick={toggleDropdown}
                          className="profile"
                        />
                        {isOpen && (
                          <div className="dropdown-content">
                            <a href="#">{auth?.user?.name}</a>
                            <br />
                            <a href="http://localhost:3000/dashboard/user">Profile</a>
                            <br />
                            <NavLink onClick={handleLogout}>Log Out</NavLink>
                            <br />
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="dropdown">
                        <CiUser
                          onClick={toggleDropdown}
                          size={27}
                          color="#fff"
                          className="profile"
                        />
                        {isOpen && (
                          <div className="dropdown-content">
                            <Link to="/register">Register</Link>
                            <Link to="/login">Login</Link>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <Link to="/cart">
                    <BsBag color="white" className="bag" />
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={`search-input-container ${toggleSearch ? 'active' : ''}`}>
        <SearchInput
          toggleSearch={toggleSearch}
          onSearchSubmit={handleSearchSubmit} // Pass handleSearchSubmit function to SearchInput component
        />
        <RiCloseLine
          color="#fff"
          size={30}
          onClick={() => setToggleSearch(false)}
          className="closese"
        />
      </div>
      {searching && <div className="loading-indicator">Searching...</div>}
      {loading && <div className="loading-indicator">Loading...</div>}
    </div>
  );
};

export default Header;
