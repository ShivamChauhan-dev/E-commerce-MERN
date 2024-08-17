import React, { createContext, useEffect, useState } from "react";
import axiosConfig from "../axiosConfig"

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {

  const [all_product, setAll_product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosConfig.get('products/allproducts');
        setAll_product(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCart = async () => {
      if (localStorage.getItem('auth-token')) {
        try {
          const response = await axiosConfig.post('users/getcart', {}, {
            headers: {
              'auth-token': localStorage.getItem('auth-token'),
            }
          });
          setCartItems(response.data);
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchProducts();
    fetchCart();
  }, []);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    if (localStorage.getItem('auth-token')) {
      try {
        await axiosConfig.post('users/addtocart', { itemId }, {
          headers: {
            'auth-token': localStorage.getItem('auth-token'),
          }
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if (localStorage.getItem('auth-token')) {
      try {
        await axiosConfig.post('users/removefromcart', { itemId }, {
          headers: {
            'auth-token': localStorage.getItem('auth-token'),
          }
        });
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotaleCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotaleCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = { all_product, cartItems, addToCart, removeFromCart, getTotaleCartAmount, getTotaleCartItems };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
