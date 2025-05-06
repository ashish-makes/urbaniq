'use client';

import { useCart } from "@/context/CartContext";
import { ProductCard } from "./ProductCard";

interface ClientProductCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  isBestseller?: boolean;
  slug?: string;
}

export function ClientProductCard(props: ClientProductCardProps) {
  // Use cart context
  const { addToCart } = useCart();
  
  // Handle add to cart
  const handleAddToCart = () => {
    addToCart({
      id: props.id,
      name: props.name,
      price: props.price,
      image: props.image,
    });
  };

  return (
    <ProductCard 
      {...props}
      onAddToCart={handleAddToCart}
    />
  );
} 