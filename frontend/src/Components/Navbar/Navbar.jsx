import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import nav_dropdown from '../Assets/nav_dropdown.png';
import search_icon from '../Assets/search_icon.png'; 
import { ShopContext } from '../../Context/ShopContext';
import axiosConfig from '../../axiosConfig';
import { AuthContext } from '../../Context/AuthProvider';

const Navbar = () => {
  const [menu, setMenu] = useState('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { getTotaleCartItems } = useContext(ShopContext);

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const response = await axiosConfig.get(`/products/search?query=${query}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSuggestions([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    setIsAuthenticated(false); // Update the authentication state
    window.location.replace('/'); // Navigate to the home page
};

  return (
    <div className="nav-main">
      <div className='navbar'>
        <div className='nav-logo'>
          <img src={logo} alt='Logo' />
          <p>PRINTER</p>
        </div>
        <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt='Menu' />
        
        <div className='nav-search'>
          <form onSubmit={handleSearchSubmit}>
            <input
              type='text'
              placeholder='Search for products...'
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search products"
            />
            <button type='submit' aria-label="Submit search">
              <img src={search_icon} alt='Search' />
            </button>
            {suggestions.length > 0 && (
            <ul className='search-suggestions'>
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => navigate(`/search?q=${suggestion.name}`)}>
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
          </form>
        </div>

        <div className='nav-login-cart'>
                    {isAuthenticated
                        ? <button onClick={handleLogout}>Logout</button>
                        : <Link to='/login'><button>Login</button></Link>}
                    <Link to='/cart'><img src={cart_icon} alt='Cart' /></Link>
                    <div className='nav-cart-count'>{getTotaleCartItems()}</div>
                </div>
      </div>
      <div className="nav-list">
        <ul ref={menuRef} className='nav-menu'>
          <li onClick={() => setMenu('shop')}>
            <Link to='/' style={{ textDecoration: 'none' }}>Shop</Link>
            {menu === 'shop' ? <hr /> : null}
          </li>
          <li onClick={() => setMenu('mens')}>
            <Link to='/mens' style={{ textDecoration: 'none' }}>Men</Link>
            {menu === 'mens' ? <hr /> : null}
          </li>
          <li onClick={() => setMenu('womens')}>
            <Link to='/womens' style={{ textDecoration: 'none' }}>Women</Link>
            {menu === 'womens' ? <hr /> : null}
          </li>
          <li onClick={() => setMenu('kids')}>
            <Link to='/kids' style={{ textDecoration: 'none' }}>Kids</Link>
            {menu === 'kids' ? <hr /> : null}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
