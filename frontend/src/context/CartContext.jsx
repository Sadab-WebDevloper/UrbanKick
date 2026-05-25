import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty, size, color) => {
    const existItem = cartItems.find((x) => x.product === product._id && x.size === size && x.color === color);
    
    if (existItem) {
      setCartItems(cartItems.map((x) => 
        (x.product === existItem.product && x.size === size && x.color === color) ? { ...existItem, qty: x.qty + qty } : x
      ));
    } else {
      setCartItems([...cartItems, {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
        size,
        color
      }]);
    }
  };

  const removeFromCart = (productId, size, color) => {
    setCartItems(cartItems.filter((x) => !(x.product === productId && x.size === size && x.color === color)));
  };

  const updateQuantity = (productId, size, color, newQty) => {
    if (newQty < 1) return;
    setCartItems(cartItems.map((x) => 
      (x.product === productId && x.size === size && x.color === color) ? { ...x, qty: newQty } : x
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
