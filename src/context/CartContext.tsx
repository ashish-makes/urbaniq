"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

// Types
export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    image: string;
  }, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Generate a session ID for non-authenticated users and set it as a cookie
  useEffect(() => {
    // Check for existing sessionId cookie
    let sessionId = Cookies.get('cartSessionId');
    
    if (!sessionId) {
      // Generate new sessionId and set as cookie
      sessionId = uuidv4();
      Cookies.set('cartSessionId', sessionId, { 
        expires: 30, // 30 days
        path: '/' 
      });
    }
    
    setIsInitialized(true);
  }, []);

  // Load cart from local storage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);

  // Sync cart with API if user is authenticated or we have a sessionId
  useEffect(() => {
    if (isInitialized) {
      fetchCart();
    }
  }, [session, isInitialized]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  // Fetch cart from API (for all users)
  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        if (data.items && Array.isArray(data.items)) {
          setItems(data.items);
        }
      }
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  // Add item to cart
  const addToCart = async (product: {
    id: string;
    name: string;
    price: number;
    image: string;
  }, quantity: number = 1) => {
    // First update local state for immediate feedback
    const existingItemIndex = items.findIndex(item => item.productId === product.id);
    let newItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      newItems = [...items];
      newItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        id: uuidv4(), // Generate client-side ID (will be replaced by server ID after sync)
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      };
      newItems = [...items, newItem];
    }

    setItems(newItems);
    
    // Then sync with server
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: product.id,
          quantity,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // If server returned a sessionId and we're not authenticated, set it as a cookie
        if (!session?.user && data.sessionId) {
          Cookies.set('cartSessionId', data.sessionId, { 
            expires: 30, // 30 days
            path: '/' 
          });
        }
        
        // Refresh cart to get server-generated IDs
        fetchCart();
      }
    } catch (error) {
      console.error('Failed to update cart on server', error);
    }
    
    // Open cart sidebar when adding an item
    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    // First update local state for immediate feedback
    const newItems = items.filter(item => item.id !== itemId);
    setItems(newItems);
    
    // Then sync with server
    try {
      await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      
      // Refresh cart to ensure sync
      fetchCart();
    } catch (error) {
      console.error('Failed to remove item from cart on server', error);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    // First update local state for immediate feedback
    const newItems = items.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    
    setItems(newItems);
    
    // Then sync with server
    try {
      await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      
      // Refresh cart to ensure sync
      fetchCart();
    } catch (error) {
      console.error('Failed to update item quantity on server', error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    // First update local state for immediate feedback
    setItems([]);
    
    // Then sync with server
    try {
      await fetch('/api/cart', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to clear cart on server', error);
    }
  };

  // Open cart sidebar
  const openCart = () => {
    setIsCartOpen(true);
  };

  // Close cart sidebar
  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Calculate cart total and count
  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      openCart,
      closeCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 