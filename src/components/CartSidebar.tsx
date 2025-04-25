"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

// Empty cart by default
const cartItems: CartItem[] = [];

const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

export function CartSidebar() {
  const [open, setOpen] = useState(false);

  // Update body attribute when cart sidebar opens/closes
  useEffect(() => {
    if (open) {
      document.body.setAttribute('data-sidebar-open', 'true');
    } else {
      document.body.removeAttribute('data-sidebar-open');
    }
  }, [open]);
  
  return (
    <Sheet defaultOpen={false} modal={true} open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button 
          className="rounded-full h-7 w-7 p-0 flex items-center justify-center hover:bg-gray-100 transition-colors relative flex-shrink-0"
          aria-label="Open cart"
        >
          <ShoppingCart size={16} strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="cart-sidebar w-[280px] sm:w-[350px] p-0 bg-white focus-visible:outline-none rounded-tl-2xl rounded-bl-2xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-3 px-5 mb-1 border-b border-gray-100">
            <SheetTitle className="text-lg font-medium m-0 p-0">Your Cart</SheetTitle>
          </div>
          
          {cartItems.length > 0 ? (
            <>
              <div className="flex-1 overflow-auto pt-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="px-5 py-4 border-b border-gray-50">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-1 text-gray-500 text-sm">${item.price.toFixed(2)}</div>
                        <div className="mt-3 flex items-center">
                          <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="mx-3 text-sm">{item.quantity}</span>
                          <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
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
                <Link href="/checkout" className="group block w-full">
                  <div className="group inline-flex items-center justify-center py-2.5 w-full pl-4 pr-3 rounded-full bg-black text-white hover:bg-black/90 transition-all font-bricolage text-sm">
                    <span className="mr-1.5">Checkout</span>
                    <div className="bg-white rounded-full p-1 flex items-center justify-center ml-auto">
                      <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                        <ArrowRight size={12} stroke="black" strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                </Link>
                <SheetClose asChild>
                  <button className="group w-full mt-3">
                    <div className="group inline-flex items-center justify-center py-2.5 w-full pl-4 pr-3 rounded-full bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all font-bricolage text-sm">
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
                <Link href="/">
                  <div className="group inline-flex items-center justify-center py-2 pl-4 pr-3 rounded-full bg-black text-white hover:bg-black/90 transition-all font-bricolage text-sm">
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