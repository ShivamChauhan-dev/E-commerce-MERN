import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Item from '../Item/Item';
import axios from 'axios';
import './SearchResults.css';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q'); // Note 'q' here to match frontend

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/products/search?query=${query}`);
        const data = response.data;
        setSearchResults(data);
        setNoResults(data.length === 0);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [location.search]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (noResults) {
    return <p>No products found for your search.</p>;
  }

  return (
    <div className="search-results">
      <div className="search-results-container">
        <h1>Search Results</h1>
        <div className="results-grid">
          {searchResults.length > 0 ? (
            searchResults.map((item) => (
              <Item
                key={item._id}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            ))
          ) : (
            <p>No products found for your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
