import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import axiosConfig from '../../axiosConfig'; 
import Item from '../Item/Item';

const NewCollections = () => {
  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    const fetchNewCollections = async () => {
      try {
        const response = await axiosConfig.get('products/newcollection');
        setNewCollection(response.data);
      } catch (error) {
        console.error('Error fetching new collections:', error);
      }
    };

    fetchNewCollections();
  }, []);

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {newCollection.map((item, i) => (
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

export default NewCollections;
