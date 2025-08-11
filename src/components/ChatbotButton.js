"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatbotButton({ onClick, isOpen }) {
  // Position and dragging state
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  
  const buttonRef = useRef(null);
  const dragThreshold = 5;

  // Initialize position on mount
  useEffect(() => {
    const updateInitialPosition = () => {
      setPosition({
        x: window.innerWidth - 80,
        y: window.innerHeight - 104
      });
    };

    updateInitialPosition();
    window.addEventListener('resize', updateInitialPosition);
    return () => window.removeEventListener('resize', updateInitialPosition);
  }, []);

  // Mouse down handler - Start dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setHasBeenDragged(false);
    
    const rect = buttonRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Mouse move handler - Update position while dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    const buttonWidth = 56;
    const buttonHeight = 56;

    const constrainedX = Math.max(0, Math.min(window.innerWidth - buttonWidth, newX));
    const constrainedY = Math.max(0, Math.min(window.innerHeight - buttonHeight, newY));

    const moveDistance = Math.sqrt(
      Math.pow(constrainedX - position.x, 2) + Math.pow(constrainedY - position.y, 2)
    );
    
    if (moveDistance > dragThreshold) {
      setHasBeenDragged(true);
    }

    setPosition({ x: constrainedX, y: constrainedY });
  };

  // Mouse up handler - Stop dragging
  const handleMouseUp = (e) => {
    setIsDragging(false);
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    if (!hasBeenDragged) {
      onClick();
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      className={`fixed w-14 h-14 text-white rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center transform-gpu select-none ${
        isDragging 
          ? 'scale-110 shadow-orange-500/60 cursor-grabbing' 
          : 'hover:scale-110 hover:shadow-orange-500/50 cursor-grab hover:cursor-pointer'
      } ${
        isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        background: isOpen 
          ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
          : 'linear-gradient(135deg, #f97316, #ea580c)',
        boxShadow: isDragging
          ? '0 20px 40px rgba(255, 152, 0, 0.6), 0 0 0 4px rgba(255, 152, 0, 0.3)'
          : '0 8px 25px rgba(255, 152, 0, 0.4), 0 0 0 1px rgba(255, 152, 0, 0.2)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none'
      }}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {/* Animated icon */}
      <div className={`transform transition-all duration-300 ${isDragging ? 'scale-90' : ''}`}>
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </div>

      {/* Ripple effect when dragging */}
      {isDragging && (
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping pointer-events-none"></div>
      )}

      {/* Drag indicator dots */}
      <div className={`absolute -bottom-1 -right-1 flex space-x-0.5 transition-opacity duration-300 ${
        isDragging ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="w-1 h-1 bg-white/60 rounded-full"></div>
        <div className="w-1 h-1 bg-white/60 rounded-full"></div>
        <div className="w-1 h-1 bg-white/60 rounded-full"></div>
      </div>
    </button>
  );
}
