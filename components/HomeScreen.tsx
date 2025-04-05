import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// Exercise option interface
interface ExerciseOption {
  id: string;
  title: string;
  description: string;
  route: string;
  color: string;
  icon: string;
}

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  // Define mindfulness exercise options
  const exercises: ExerciseOption[] = [
    {
      id: 'meditation',
      title: 'Guided Meditation',
      description: 'Peaceful visualization session with timer',
      route: '/mindfulness',
      color: 'from-purple-500 to-blue-500',
      icon: '/file.svg'
    },
    {
      id: 'breathing',
      title: 'Breathing Exercise',
      description: 'Follow guided breathing patterns in 3D',
      route: '/breathing',
      color: 'from-indigo-600 to-blue-400',
      icon: '/globe.svg'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600">
      <div className="w-full max-w-2xl px-4 py-8 sm:py-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Interactive Mindfulness Space
        </h1>
        <p className="text-white text-opacity-90 mb-12 text-lg">
          Find your center with guided meditation and breathing exercises
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-12">
          {exercises.map((exercise) => (
            <div 
              key={exercise.id}
              className={`relative bg-white bg-opacity-10 backdrop-blur-sm rounded-xl overflow-hidden p-6 transition-all duration-300 cursor-pointer ${
                hoveredOption === exercise.id ? 'transform scale-105 shadow-lg' : ''
              }`}
              onMouseEnter={() => setHoveredOption(exercise.id)}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={() => router.push(exercise.route)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${exercise.color} opacity-30 transition-opacity duration-300 ${
                hoveredOption === exercise.id ? 'opacity-50' : 'opacity-30'
              }`}></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  {exercise.icon && (
                    <Image 
                      src={exercise.icon} 
                      alt={exercise.title} 
                      width={28} 
                      height={28}
                    />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{exercise.title}</h3>
                <p className="text-white text-opacity-80 text-sm">{exercise.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-white text-opacity-70 text-sm">
          <p>No account required. Just breathe and be present.</p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
