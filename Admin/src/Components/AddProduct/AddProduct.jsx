// import React from 'react'
import { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import axiosConfig from '../../axiosConfig'; // Import the Axios instance

const AddProduct = () => {

  const [image, setImage] = useState(null);  // Initialize image with null
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "",
    new_price: "",
    old_price: ""
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  }

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  }

  const Add_Product = async () => {
    console.log(productDetails);
    let responseData;
    let product = { ...productDetails };

    try {
      let formData = new FormData();
      formData.append('product', image);

      // Upload image
      responseData = await axiosConfig.post('products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).then((response) => response.data);

      if (responseData.success) {
        product.image = responseData.image_url;
        console.log(product);

        // Add product details
        const addProductResponse = await axiosConfig.post('products/addproduct', product);
        const data = addProductResponse.data;

        data.success ? alert("Product Added") : alert("Failed");
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product. Please try again.");
    }
  }

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type Here' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="Product Thumbnail" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  )
}

export default AddProduct;
