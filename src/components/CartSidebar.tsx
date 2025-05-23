"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useCheckout } from "@/hooks/useCheckout";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface CartSidebarProps {
  isAboutPage?: boolean;
}

export function CartSidebar({ isAboutPage = false }: CartSidebarProps) {
  const { 
    items, 
    cartCount, 
    cartTotal, 
    removeFromCart, 
    updateQuantity, 
    isCartOpen, 
    openCart, 
    closeCart
  } = useCart();
  
  const { createCheckoutSession, isLoading, error } = useCheckout();
  const { status } = useSession();
  const router = useRouter();
  
  // Handle checkout click with authentication check
  const handleCheckout = () => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=checkout');
      closeCart();
      return;
    }
    
    createCheckoutSession();
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
      <SheetTrigger asChild>
        <motion.button 
          className="rounded-full h-7 w-7 p-0 flex items-center justify-center relative flex-shrink-0"
          aria-label="Open cart"
          onClick={() => openCart()}
          whileHover={{ 
            backgroundColor: isAboutPage ? '#0c151c' : 'rgb(243, 244, 246)' 
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ 
              color: isAboutPage ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)'
            }}
            transition={{ duration: 0.3 }}
          >
            <ShoppingCart size={16} strokeWidth={1.5} />
          </motion.div>
          <span className={`absolute -top-1 -right-1 ${isAboutPage ? 'bg-white text-black' : 'bg-black text-white'} text-[10px] rounded-full w-4 h-4 flex items-center justify-center`}>
            {cartCount}
          </span>
        </motion.button>
      </SheetTrigger>
      <SheetContent side="right" className="cart-sidebar w-[280px] sm:w-[350px] p-0 bg-white focus-visible:outline-none rounded-tl-2xl rounded-bl-2xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-3 px-5 mb-1 border-b border-gray-100">
            <SheetTitle className="text-lg font-medium m-0 p-0">Your Cart</SheetTitle>
          </div>
          
          {items.length > 0 ? (
            <>
              <div className="flex-1 overflow-auto pt-2">
                {items.map((item) => (
                  <div key={item.id} className="px-5 py-4 border-b border-gray-50">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          className="object-cover" 
                          fill
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <button 
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-1 text-gray-500 text-sm">${item.price.toFixed(2)}</div>
                        <div className="mt-3 flex items-center">
                          <button 
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="mx-3 text-sm">{item.quantity}</span>
                          <button 
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-5 border-t border-gray-100">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-500 text-sm">Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-5">
                  <span className="text-gray-500 text-sm">Shipping</span>
                  <span className="font-medium text-sm">Calculated at checkout</span>
                </div>
                
                {error && (
                  <div className="text-red-500 text-xs mb-3 text-center">
                    {error}
                  </div>
                )}
                
                <button 
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="group block w-full"
                >
                  <div className="group inline-flex items-center justify-center py-2.5 w-full pl-4 pr-3 rounded-full bg-black text-white hover:bg-black/90 transition-all font-medium text-sm disabled:opacity-70">
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span className="mr-1.5">Checkout</span>
                        <div className="bg-white rounded-full p-1 flex items-center justify-center ml-auto">
                          <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                            <ArrowRight size={12} stroke="black" strokeWidth={2} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </button>
                
                <SheetClose asChild>
                  <button className="group w-full mt-3">
                    <div className="group inline-flex items-center justify-center py-2.5 w-full pl-4 pr-3 rounded-full bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all font-medium text-sm">
                      <span className="mr-1.5">Continue Shopping</span>
                      <div className="bg-black rounded-full p-1 flex items-center justify-center ml-auto">
                        <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                          <ArrowRight size={12} stroke="white" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </button>
                </SheetClose>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-5">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingCart size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm text-center mb-6">Looks like you haven't added any products to your cart yet.</p>
              <SheetClose asChild>
                <Link href="/products">
                  <div className="group inline-flex items-center justify-center py-2 pl-4 pr-3 rounded-full bg-black text-white hover:bg-black/90 transition-all font-medium text-sm">
                    <span className="mr-1.5">Start Shopping</span>
                    <div className="bg-white rounded-full p-1 flex items-center justify-center">
                      <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                        <ArrowRight size={12} stroke="black" strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 