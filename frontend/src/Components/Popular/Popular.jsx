import React, { useEffect, useState } from 'react';
import './Popular.css';
import axiosConfig from '../../axiosConfig'; 
import Item from '../Item/Item';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await axiosConfig.get('products/popularinwomen');
        setPopularProducts(response.data);
      } catch (error) {
        console.error('Error fetching popular products:', error);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
