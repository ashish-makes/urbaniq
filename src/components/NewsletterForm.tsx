"use client";

import React, { useState } from 'react';
import { Send } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }
    
    setStatus('loading');
    
    // In a real application, you would connect to a newsletter API
    // This is a simulated submission
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setMessage('Thanks for subscribing!');
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address" 
          disabled={status === 'loading'}
          className="w-full py-2.5 pl-4 pr-10 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black/20 transition-all disabled:opacity-70"
        />
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-black text-white p-1.5 rounded-full hover:bg-black/90 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <div className="h-[14px] w-[14px] border-2 border-t-transparent border-white rounded-full animate-spin" />
          ) : (
            <Send size={14} className="text-white" />
          )}
        </button>
      </form>
      
      {message && (
        <div className={`text-sm mt-2 ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </div>
      )}
    </div>
  );
} 