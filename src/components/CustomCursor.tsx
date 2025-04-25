"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform, animate } from "framer-motion";

export function CustomCursor() {
  // State hooks must be called unconditionally at the top level
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isOverSidebar, setIsOverSidebar] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  // Spring animation hooks - more bouncy
  const cursorSize = useSpring(40, { stiffness: 400, damping: 15 });
  const cursorOpacity = useSpring(0, { stiffness: 300, damping: 25 });
  const cursorX = useSpring(mousePosition.x, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(mousePosition.y, { stiffness: 500, damping: 28 });
  const cursorScale = useSpring(1, { stiffness: 500, damping: 10 });
  
  // Transform for scaling effect - simpler approach 
  const sizeScale = useTransform(cursorSize, [0, 40], [0.5, 1]);

  // Check if sidebar is open
  useEffect(() => {
    const checkSidebarStatus = () => {
      const sidebarOpen = document.body.hasAttribute('data-sidebar-open');
      setIsSidebarOpen(sidebarOpen);
    };
    
    // Initial check
    checkSidebarStatus();
    
    // Watch for sidebar open/close
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-sidebar-open') {
          checkSidebarStatus();
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Mouse movement, sidebar detection, and click handling
  useEffect(() => {
    // Only track mouse if sidebar is open
    if (!isSidebarOpen) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Check if mouse is over a sidebar or clickable element
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const isOverClickableArea = element?.closest('.mobile-sidebar, .cart-sidebar, button, a, input, [role="dialog"]');
      setIsOverSidebar(!!isOverClickableArea);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
    const handleMouseDown = (e: MouseEvent) => {
      // Only trigger bouncy effect if clicking outside sidebars
      if (!isOverSidebar) {
        setIsClicked(true);
        // Animate the scale spring for bouncy effect
        cursorScale.set(0.8);
        setTimeout(() => {
          cursorScale.set(1.2);
          setTimeout(() => {
            cursorScale.set(1);
          }, 150);
        }, 100);
      }
    };
    
    const handleMouseUp = () => {
      setIsClicked(false);
    };
    
    // Track mouse movement and clicks
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSidebarOpen, isOverSidebar, cursorScale]);
  
  // Update spring animations based on state
  useEffect(() => {
    // Force opacity to 0 when sidebar is closed
    if (!isSidebarOpen) {
      cursorOpacity.set(0);
      cursorSize.set(0);
      return;
    }
    
    if (isOverSidebar) {
      cursorOpacity.set(0);
      cursorSize.set(0);
    } else {
      cursorOpacity.set(isVisible ? 1 : 0);
      cursorSize.set(40);
    }
  }, [isVisible, isOverSidebar, isSidebarOpen, cursorOpacity, cursorSize]);
  
  // Update cursor position
  useEffect(() => {
    cursorX.set(mousePosition.x);
    cursorY.set(mousePosition.y);
  }, [mousePosition, cursorX, cursorY]);

  // Only render if sidebar is open
  if (!isSidebarOpen) return null;
  
  return (
    <motion.div
      className="custom-cursor"
      style={{
        left: cursorX,
        top: cursorY,
        width: cursorSize,
        height: cursorSize,
        opacity: cursorOpacity,
        scale: cursorScale,
        transform: `translateX(-50%) translateY(-50%) scale(${sizeScale})`,
        pointerEvents: "none"
      }}
    />
  );
} 