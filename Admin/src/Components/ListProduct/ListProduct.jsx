import { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';
import axiosConfig from '../../axiosConfig'; // Import the Axios instance

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await axiosConfig.get('products/allproducts'); // Fetch with Axios
      console.log(response.data); // Log the data to check its structure
      if (Array.isArray(response.data)) {
        setAllProducts(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setAllProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    try {
      await axiosConfig.post('products/removeproduct', { id });
      fetchInfo(); // Refresh the list
    } catch (error) {
      console.error("Error removing product:", error);
    }
  }

  return (
    <div className='list-product'>
      <h1>All Product List</h1>
      <div className="listproduct-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproduct">
        <hr />
        {Array.isArray(allProducts) && allProducts.length > 0 ? (
          allProducts.map((product, index) => (
            <div key={index}>
              <div className="listproduct-format-main listproduct-format">
                <img src={product.image} alt={product.name} className="listproduct-product-icon" />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img 
                  onClick={() => removeProduct(product.id)} 
                  className='listproduct-remove-icon' 
                  src={cross_icon} 
                  alt="Remove" 
                />
              </div>
              <hr />
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  )
}

export default ListProduct;