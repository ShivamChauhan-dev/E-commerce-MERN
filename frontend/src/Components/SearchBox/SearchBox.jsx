import React, { useState } from 'react';
import axiosConfig from '../../axiosConfig';
import './SearchBox.css';

const SearchBox = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) { // Only search when query length > 2
      try {
        const response = await axiosConfig.get(`/products/search?query=${e.target.value}`);
        onSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      onSearchResults([]); // Clear results if query is too short
    }
  };

  return (
    <input
      type="text"
      placeholder="Search for products..."
      value={query}
      onChange={handleSearch}
      className="search-input"
    />
  );
};

export default SearchBox;
