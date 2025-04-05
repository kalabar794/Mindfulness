import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Define different breathing patterns
const BREATHING_PATTERNS = {
  'simple': { inhale: 4, hold1: 0, exhale: 4, hold2: 0, name: 'Simple Breath Awareness' },
  'box': { inhale: 4, hold1: 4, exhale: 4, hold2: 4, name: 'Box Breathing' },
  '4-7-8': { inhale: 4, hold1: 7, exhale: 8, hold2: 0, name: '4-7-8 Relaxing Breath' },
  'energizing': { inhale: 6, hold1: 0, exhale: 2, hold2: 0, name: 'Energizing Breath' },
};

type PatternKey = keyof typeof BREATHING_PATTERNS;

// Main breath visualization component
const BreathSphere: React.FC<{
  pattern: PatternKey;
  isPaused: boolean;
}> = ({ pattern, isPaused }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Track breathing state
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const totalCycleDuration = useRef(0);
  const timer = useRef(0);
  
  // Get the active pattern settings
  const activePattern = BREATHING_PATTERNS[pattern];
  
  // Reset timer when pattern changes
  useEffect(() => {
    timer.current = 0;
    setPhase('inhale');
    totalCycleDuration.current = 
      activePattern.inhale + 
      activePattern.hold1 + 
      activePattern.exhale + 
      activePattern.hold2;
  }, [pattern, activePattern]);

  // Use Three.js animation frame for smooth updates
  useFrame((_, delta) => {
    if (!sphereRef.current || !materialRef.current || isPaused) return;
    
    timer.current += delta;
    
    // Calculate where we are in the current breathing cycle
    const cyclePosition = timer.current % totalCycleDuration.current;
    
    // Determine the current phase of breathing
    let newPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2';
    let phaseProgress = 0;
    
    if (cyclePosition < activePattern.inhale) {
      newPhase = 'inhale';
      phaseProgress = cyclePosition / activePattern.inhale;
    } else if (cyclePosition < activePattern.inhale + activePattern.hold1) {
      newPhase = 'hold1';
      phaseProgress = (cyclePosition - activePattern.inhale) / activePattern.hold1;
    } else if (cyclePosition < activePattern.inhale + activePattern.hold1 + activePattern.exhale) {
      newPhase = 'exhale';
      phaseProgress = (cyclePosition - activePattern.inhale - activePattern.hold1) / activePattern.exhale;
    } else {
      newPhase = 'hold2';
      phaseProgress = (cyclePosition - activePattern.inhale - activePattern.hold1 - activePattern.exhale) / activePattern.hold2;
    }
    
    // Update phase state for UI feedback
    if (phase !== newPhase) {
      setPhase(newPhase);
    }
    
    // Apply animation based on phase
    if (newPhase === 'inhale') {
      // During inhale: expand sphere, brighten color
      const scale = 1 + (phaseProgress * 0.5);
      sphereRef.current.scale.set(scale, scale, scale);
      
      const emissiveIntensity = 0.1 + (phaseProgress * 0.3);
      materialRef.current.emissiveIntensity = emissiveIntensity;
      
      // Cool to warm color transition during inhale
      const hue = 0.6 - (phaseProgress * 0.2); // Shift from blue toward purple
      materialRef.current.color.setHSL(hue, 0.7, 0.5 + phaseProgress * 0.2);
      materialRef.current.emissive.setHSL(hue, 0.9, 0.4);
    }
    else if (newPhase === 'exhale') {
      // During exhale: contract sphere, dim color
      const scale = 1.5 - (phaseProgress * 0.5);
      sphereRef.current.scale.set(scale, scale, scale);
      
      const emissiveIntensity = 0.4 - (phaseProgress * 0.3);
      materialRef.current.emissiveIntensity = emissiveIntensity;
      
      // Warm to cool color transition during exhale
      const hue = 0.4 + (phaseProgress * 0.2); // Shift from purple toward blue
      materialRef.current.color.setHSL(hue, 0.7, 0.7 - phaseProgress * 0.2);
      materialRef.current.emissive.setHSL(hue, 0.9, 0.4);
    }
    
    // Add subtle continuous rotation
    sphereRef.current.rotation.y += delta * 0.1;
    sphereRef.current.rotation.z += delta * 0.05;
  });
  
  // Simplified texture handling to avoid linter errors
  const texture = useTexture('/assets/sphere-texture.jpg');
  
  // Texture setup with useEffect instead of callback
  useEffect(() => {
    // Handle single texture
    if (texture && !Array.isArray(texture)) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    }
  }, [texture]);
  
  return (
    <>
      {/* Ambient particles around the breathing sphere */}
      <PointCloud count={500} radius={3} />
      
      {/* Main breathing sphere */}
      <Sphere args={[1, 64, 64]} ref={sphereRef}>
        <meshStandardMaterial 
          ref={materialRef}
          map={Array.isArray(texture) ? texture[0] : texture}
          roughness={0.4} 
          metalness={0.3}
          transparent
          opacity={0.9}
          emissive="#5d3fd3"
          emissiveIntensity={0.2}
        />
      </Sphere>
    </>
  );
};

// Ambient particles to create atmosphere around the sphere
const PointCloud: React.FC<{ count: number, radius: number }> = ({ count, radius }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random points in a spherical distribution
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(Math.random() * 2 - 1);
      const r = (Math.random() * 0.5 + 0.5) * radius;
      
      pos[i3] = r * Math.sin(theta) * Math.cos(phi);
      pos[i3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      pos[i3 + 2] = r * Math.cos(theta);
      
      // Color gradient from purple to blue
      colors[i3] = 0.5 + Math.random() * 0.3;     // R
      colors[i3 + 1] = 0.3 + Math.random() * 0.3; // G
      colors[i3 + 2] = 0.7 + Math.random() * 0.3; // B
    }
    
    return { positions: pos, colors };
  }, [count, radius]);
  
  // Animate particles
  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += delta * 0.01;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions.positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={positions.colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

// Text overlay component to show current breathing phase
const PhaseIndicator: React.FC<{ phase: string }> = ({ phase }) => {
  // We're not rendering anything in the ThreeJS canvas - this is just to
  // communicate with the parent component for HTML overlay text
  return null;
};

// Main BreathingGuide component that can be imported elsewhere
const BreathingGuide: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<PatternKey>('simple');
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<string>('inhale');
  
  // Handle pattern selection
  const handlePatternChange = (pattern: PatternKey) => {
    setSelectedPattern(pattern);
  };
  
  // Toggle playback
  const togglePlayPause = () => {
    setIsPaused(!isPaused);
  };
  
  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls);
  };
  
  // Get current pattern settings for display
  const currentPattern = BREATHING_PATTERNS[selectedPattern];
  
  // Get instructional text based on current phase
  const getInstructionText = () => {
    if (isPaused) return 'Paused';
    
    if (selectedPattern === 'simple') return 'Breathe Naturally';
    
    switch (currentPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
      default: return 'Breathe Naturally';
    }
  };
  
  return (
    <div className="relative w-full h-full">
      {/* Three.js Canvas */}
      <Canvas 
        className="w-full h-full bg-gradient-to-b from-indigo-900 to-purple-900"
        dpr={[1, 2]} // Performance optimization for high-DPI displays
      >
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, 5]} 
          fov={45}
        />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a78bfa" />
        
        {/* Main breathing visualization */}
        <BreathSphere pattern={selectedPattern} isPaused={isPaused} />
        
        {/* Camera controls - limited for better UX */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          rotateSpeed={0.3}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI * 2/3}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
      
      {/* Text instruction overlay */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center select-none pointer-events-none">
        <h2 className="text-white text-4xl font-light tracking-wider drop-shadow-lg">
          {getInstructionText()}
        </h2>
      </div>
      
      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex justify-center mb-2">
          <button
            onClick={toggleControls}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            aria-label={showControls ? "Hide controls" : "Show controls"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              {showControls ? (
                <path d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" />
              ) : (
                <path d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 011.06 1.06l-7.5 7.5z" />
              )}
            </svg>
          </button>
        </div>
        
        {showControls && (
          <div className="bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-xl max-w-xl mx-auto">
            {/* Pattern selection */}
            <div className="mb-4">
              <p className="text-white text-center mb-2 font-medium">Breathing Pattern</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(BREATHING_PATTERNS).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handlePatternChange(key as PatternKey)}
                    className={`py-2 px-3 rounded-lg text-sm transition-all ${
                      selectedPattern === key
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                    }`}
                  >
                    {value.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Play/pause control */}
            <div className="flex justify-center">
              <button
                onClick={togglePlayPause}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
              >
                {isPaused ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Pattern information */}
            {selectedPattern !== 'simple' && (
              <div className="mt-4 text-white text-center text-sm">
                <p className="opacity-80">
                  In: {currentPattern.inhale}s 
                  {currentPattern.hold1 > 0 && ` • Hold: ${currentPattern.hold1}s`} 
                  • Out: {currentPattern.exhale}s
                  {currentPattern.hold2 > 0 && ` • Hold: ${currentPattern.hold2}s`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreathingGuide; 