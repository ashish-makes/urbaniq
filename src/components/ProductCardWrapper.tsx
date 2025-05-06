'use client';

import { ClientProductCard } from './ClientProductCard';

interface WrapperProps {
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

export function ProductCardWrapper(props: WrapperProps) {
  return <ClientProductCard {...props} />;
} 