'use client';

import React, { useState, useRef, KeyboardEvent, ClipboardEvent, useEffect } from 'react';

interface OtpInputProps {
  value: string;
  valueLength: number;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function OtpInput({ 
  value, 
  valueLength, 
  onChange,
  disabled = false
}: OtpInputProps) {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Create an array of references for each input
  useEffect(() => {
    inputRefs.current = Array(valueLength)
      .fill(null)
      .map((_, i) => inputRefs.current[i] || null);
  }, [valueLength]);

  // Auto-focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  // Handle changes to any input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    
    // Only accept digits
    if (!/^\d*$/.test(newValue)) return;
    
    // Get the single digit or empty string
    const digit = newValue.substring(newValue.length - 1);
    
    // Create a new value by replacing the digit at the current index
    const newOtpValue = value.substring(0, index) + (digit || '') + value.substring(index + 1);
    
    onChange(newOtpValue);
    
    // Move to next input if we entered a digit (unless we're at the last input)
    if (digit && index < valueLength - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  // Handle backspace and arrow keys for navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      // If current input is empty and user presses backspace, go to previous input
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Left arrow moves to previous input
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < valueLength - 1) {
      // Right arrow moves to next input
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  // Handle pasting an OTP
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted data is a number and has expected length
    if (!/^\d+$/.test(pastedData)) return;
    
    const otpValue = pastedData.substring(0, valueLength);
    
    // Update the OTP value
    onChange(otpValue);
    
    // Focus the input after the last pasted digit
    const focusIndex = Math.min(otpValue.length, valueLength - 1);
    inputRefs.current[focusIndex]?.focus();
    setActiveInput(focusIndex);
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length: valueLength }, (_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}"
          maxLength={1}
          value={value[index] || ''}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={() => setActiveInput(index)}
          disabled={disabled}
          className={`
            w-10 h-12 sm:w-12 sm:h-14 rounded-md
            text-center text-xl sm:text-2xl font-semibold
            border-2 transition-all duration-200
            ${value[index] ? 'border-black bg-gray-50' : 'border-gray-300 bg-white'}
            ${activeInput === index ? 'border-black shadow-sm' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:border-black focus:shadow-sm focus:outline-none'}
          `}
          aria-label={`Digit ${index + 1} of verification code`}
        />
      ))}
    </div>
  );
} 