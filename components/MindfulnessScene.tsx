import React, { useRef, useEffect, useMemo, useState } from 'react';

interface CircleProps {
  size: number;
  posX: number;
  posY: number;
  color: string;
  delay: number;
  index: number;
}

// Optimized Circle component - no local state, CSS animations instead of state transitions
const Circle: React.FC<CircleProps> = ({ size, posX, posY, color, delay, index }) => {
  return (
    <div 
      className="absolute rounded-full opacity-0"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `calc(50% + ${posX}px - ${size/2}px)`,
        top: `calc(50% + ${posY}px - ${size/2}px)`,
        backgroundColor: color,
        // Use CSS animations instead of React state transitions
        animation: `fadeIn 1.5s forwards ${delay}ms, 
                   float${index % 3} 8s infinite ${delay}ms`,
        // Use transform for GPU acceleration
        willChange: 'transform, opacity'
      }}
    />
  );
};

interface MindfulnessSceneProps {
  onComplete?: () => void;
  duration?: number;
}

const MindfulnessScene: React.FC<MindfulnessSceneProps> = ({ 
  onComplete,
  duration = 5 * 60 // Default 5 minutes in seconds
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  
  // Handle timer for session completion
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (duration > 0) {
      setTimeRemaining(duration);
      
      intervalId = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalId);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [duration, onComplete]);
  
  // Generate circles only once with useMemo
  const circles = useMemo(() => {
    // Reduce number of circles on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const circleCount = isMobile ? 8 : 15;
    
    return Array.from({ length: circleCount }, (_, i) => ({
      size: Math.random() * (isMobile ? 100 : 150) + 50,
      posX: (Math.random() - 0.5) * (isMobile ? 300 : 600),
      posY: (Math.random() - 0.5) * (isMobile ? 300 : 600),
      color: [
        '#8b5cf6', // purple
        '#a78bfa', // light purple
        '#7dd3fc', // light blue
        '#0ea5e9', // blue
        '#86efac'  // light green
      ][Math.floor(Math.random() * 5)],
      delay: i * 300,
      index: i
    }));
  }, []);
  
  // Optimized mouse tracking using requestAnimationFrame
  useEffect(() => {
    let previousTime = 0;
    const THROTTLE_MS = 16; // ~60fps throttle
    
    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      
      // Skip handling if not enough time has passed (throttling)
      if (currentTime - previousTime < THROTTLE_MS) return;
      previousTime = currentTime;
      
      if (!containerRef.current) return;
      
      // Calculate movement relative to viewport size (responsive)
      const moveX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 50);
      const moveY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 50);
      
      // Use direct DOM manipulation instead of state for smoother motion
      containerRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    
    // Use passive event listeners for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Handle touch events for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0 || !containerRef.current) return;
      
      const touch = e.touches[0];
      const moveX = (touch.clientX - window.innerWidth / 2) / (window.innerWidth / 30);
      const moveY = (touch.clientY - window.innerHeight / 2) / (window.innerHeight / 30);
      
      containerRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  // Format remaining time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-500 to-purple-600 overflow-hidden">
      {/* Add animation keyframes using CSS-in-JS for better performance */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 0.6; transform: scale(1); }
        }
        @keyframes float0 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(5px, -5px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float1 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-8px, 3px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(3px, 8px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
      
      <div 
        ref={containerRef}
        className="relative w-full h-full will-change-transform"
        style={{ 
          transition: 'transform 0.3s ease-out',
          transform: 'translate(0px, 0px)',
        }}
      >
        {circles.map((circle, i) => (
          <Circle key={i} {...circle} index={i} />
        ))}
        
        {/* Timer display */}
        <div className="absolute top-4 left-0 right-0 mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-black bg-opacity-30 backdrop-blur-sm rounded-full text-white font-mono text-xl">
            {formatTime(timeRemaining)}
          </div>
        </div>
        
        {/* Optimized breathing circle with CSS animations */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 will-change-transform">
          <div className="w-40 h-40 bg-white bg-opacity-30 rounded-full flex items-center justify-center" 
               style={{ animation: 'pulse 4s infinite ease-in-out' }}>
            <div className="w-32 h-32 bg-white bg-opacity-60 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindfulnessScene;
