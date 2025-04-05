import React, { useState } from 'react';
import { useRouter } from 'next/router';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [hover, setHover] = useState(false);

  const startSession = () => {
    router.push('/mindfulness');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600">
      <div className="w-full max-w-md px-4 py-8 sm:py-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Interactive Mindfulness Space
        </h1>
        <p className="text-white text-opacity-90 mb-8 text-lg">
          Find your center with guided meditation and peaceful visualization
        </p>
        
        <div 
          className={`relative mx-auto w-48 h-48 mb-10 rounded-full bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center transition-all duration-500 overflow-hidden ${hover ? 'scale-110 shadow-lg' : ''}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className={`absolute inset-4 rounded-full bg-gradient-to-br from-purple-300 to-blue-300 transition-all duration-500 ${hover ? 'blur-sm' : ''}`}></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startSession}
              className="relative z-10 w-28 h-28 rounded-full bg-white text-purple-600 font-medium shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            >
              <span className="absolute inset-0 rounded-full bg-white transition-all duration-300 group-hover:scale-95"></span>
              <span className="relative z-20">Begin</span>
            </button>
          </div>
        </div>
        
        <div className="text-white text-opacity-70 text-sm">
          <p>No account required. Just breathe and be present.</p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
