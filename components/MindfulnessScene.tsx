import React, { useState, useEffect } from 'react';

interface CircleProps {
  size: number;
  posX: number;
  posY: number;
  color: string;
  delay: number;
}

const Circle: React.FC<CircleProps> = ({ size, posX, posY, color, delay }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`absolute rounded-full transition-all duration-3000 ${animate ? 'opacity-60' : 'opacity-0'}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `calc(50% + ${posX}px - ${size/2}px)`,
        top: `calc(50% + ${posY}px - ${size/2}px)`,
        backgroundColor: color,
        transform: `scale(${animate ? 1 : 0.5})`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'ease-in-out'
      }}
    />
  );
};

const MindfulnessScene: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [circles, setCircles] = useState<CircleProps[]>([]);
  
  useEffect(() => {
    // Generate random circles
    const newCircles = Array.from({ length: 15 }, (_, i) => ({
      size: Math.random() * 150 + 50,
      posX: (Math.random() - 0.5) * 600,
      posY: (Math.random() - 0.5) * 600,
      color: [
        '#8b5cf6', // purple
        '#a78bfa', // light purple
        '#7dd3fc', // light blue
        '#0ea5e9', // blue
        '#86efac'  // light green
      ][Math.floor(Math.random() * 5)],
      delay: i * 300
    }));
    
    setCircles(newCircles);
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 20,
        y: (e.clientY - window.innerHeight / 2) / 20
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-500 to-purple-600 overflow-hidden">
      <div 
        className="relative w-full h-full transition-transform duration-500 ease-out"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      >
        {circles.map((circle, i) => (
          <Circle key={i} {...circle} />
        ))}
        
        {/* Center breathing circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-40 h-40 bg-white bg-opacity-30 rounded-full flex items-center justify-center animate-pulse">
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
