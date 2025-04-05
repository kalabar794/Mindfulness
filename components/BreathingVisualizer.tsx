import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Define breathing patterns
export const BREATHING_PATTERNS = {
  'calm': { 
    inhale: 4, 
    hold1: 0, 
    exhale: 4, 
    hold2: 0, 
    name: 'Calm Breathing',
    description: 'Simple 4-4 breathing for relaxation'
  },
  'box': { 
    inhale: 4, 
    hold1: 4, 
    exhale: 4, 
    hold2: 4, 
    name: 'Box Breathing',
    description: 'Equal parts inhale, hold, exhale, and hold'
  },
  '4-7-8': { 
    inhale: 4, 
    hold1: 7, 
    exhale: 8, 
    hold2: 0, 
    name: '4-7-8 Relaxing Breath',
    description: 'Calming breath to reduce anxiety'
  },
  'energizing': { 
    inhale: 6, 
    hold1: 0, 
    exhale: 2, 
    hold2: 0, 
    name: 'Energizing Breath',
    description: 'Longer inhale, shorter exhale for energy'
  },
};

export type PatternKey = keyof typeof BREATHING_PATTERNS;

// Instructions component for mobile/small screens
const MobileInstructions: React.FC<{
  phase: string;
  timer: number;
  maxTime: number;
}> = ({ phase, timer, maxTime }) => {
  return (
    <div className="absolute bottom-8 left-0 right-0 mx-auto text-center z-10">
      <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white rounded-full px-6 py-3 inline-block">
        <div className="text-2xl font-bold mb-1">{phase}</div>
        <div className="w-32 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-white transition-all duration-200"
            style={{ width: `${(timer / maxTime) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// The breathing sphere component
const BreathingSphere: React.FC<{
  pattern: PatternKey;
  isPaused: boolean;
  setCurrentPhase: (phase: string) => void;
  setTimerInfo: (timer: number, maxTime: number) => void;
}> = ({ pattern, isPaused, setCurrentPhase, setTimerInfo }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Animation state
  const [scaleTarget, setScaleTarget] = useState(1);
  const elapsedRef = useRef(0);
  const phaseTimeRef = useRef(0);
  const phaseRef = useRef<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  
  // Get the active pattern settings
  const activePattern = BREATHING_PATTERNS[pattern];
  
  // Reset on pattern change
  useEffect(() => {
    elapsedRef.current = 0;
    phaseTimeRef.current = 0;
    phaseRef.current = 'inhale';
  }, [pattern]);

  // Handle animation frame
  useFrame((_, delta) => {
    if (!sphereRef.current || !materialRef.current || isPaused) return;
    
    // Update timers
    elapsedRef.current += delta;
    phaseTimeRef.current += delta;
    
    // Get pattern durations
    const { inhale, hold1, exhale, hold2 } = activePattern;
    const totalCycleDuration = inhale + hold1 + exhale + hold2;
    
    // Determine current phase and reset phase timer if needed
    const cycleTime = elapsedRef.current % totalCycleDuration;
    
    let currentPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2' = 'inhale';
    let phaseMaxTime = inhale;
    
    if (cycleTime < inhale) {
      currentPhase = 'inhale';
      phaseMaxTime = inhale;
      
      // Set scale target for smooth animation
      const progress = cycleTime / inhale;
      setScaleTarget(1 + progress * 0.5);
      
      // Update material color
      const hue = 0.6 - progress * 0.1; // Slight shift from blue toward purple
      materialRef.current.color.setHSL(hue, 0.7, 0.5 + progress * 0.2);
      materialRef.current.emissive.setHSL(hue, 0.9, 0.4);
      materialRef.current.emissiveIntensity = 0.1 + progress * 0.3;
    } 
    else if (cycleTime < inhale + hold1) {
      currentPhase = 'hold1';
      phaseMaxTime = hold1;
      setScaleTarget(1.5); // Hold expanded
    } 
    else if (cycleTime < inhale + hold1 + exhale) {
      currentPhase = 'exhale';
      phaseMaxTime = exhale;
      
      // Set scale target for smooth animation
      const progress = (cycleTime - inhale - hold1) / exhale;
      setScaleTarget(1.5 - progress * 0.5);
      
      // Update material color
      const hue = 0.5 + progress * 0.1; // Slight shift from purple toward blue
      materialRef.current.color.setHSL(hue, 0.7, 0.7 - progress * 0.2);
      materialRef.current.emissive.setHSL(hue, 0.9, 0.4);
      materialRef.current.emissiveIntensity = 0.4 - progress * 0.3;
    } 
    else {
      currentPhase = 'hold2';
      phaseMaxTime = hold2;
      setScaleTarget(1); // Hold contracted
    }
    
    // If phase changed, reset phase timer
    if (phaseRef.current !== currentPhase) {
      phaseRef.current = currentPhase;
      phaseTimeRef.current = cycleTime - (
        currentPhase === 'inhale' ? 0 :
        currentPhase === 'hold1' ? inhale :
        currentPhase === 'exhale' ? (inhale + hold1) :
        (inhale + hold1 + exhale)
      );
      
      // Update phase display
      const phaseDisplay = 
        currentPhase === 'inhale' ? 'Breathe In' :
        currentPhase === 'hold1' ? 'Hold' :
        currentPhase === 'exhale' ? 'Breathe Out' :
        'Hold';
      
      setCurrentPhase(phaseDisplay);
    }
    
    // Update timer info for progress bar
    setTimerInfo(
      phaseTimeRef.current,
      phaseMaxTime
    );
    
    // Smooth scale animation
    if (sphereRef.current) {
      const currentScale = sphereRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, scaleTarget, delta * 3);
      sphereRef.current.scale.set(newScale, newScale, newScale);
    }
    
    // Gentle rotation for visual interest
    sphereRef.current.rotation.y += delta * 0.1;
    sphereRef.current.rotation.z += delta * 0.05;
  });
  
  return (
    <>
      {/* Ambient particles */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.7} color="#ffffff" />
      
      {/* Breathing sphere */}
      <Sphere args={[1, 64, 64]} ref={sphereRef}>
        <meshStandardMaterial 
          ref={materialRef}
          roughness={0.4} 
          metalness={0.3}
          transparent={true}
          opacity={0.9}
          emissive="#5d3fd3"
          emissiveIntensity={0.2}
        />
      </Sphere>
      
      {/* Add particle effects */}
      <Particles count={200} />
    </>
  );
};

// Particles component for atmosphere
const Particles: React.FC<{ count: number }> = ({ count }) => {
  const points = useRef<THREE.Points>(null);
  
  // Generate random particles
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const r = 2 + Math.random() * 2;
      
      pos[i * 3] = r * Math.sin(theta) * Math.cos(angle);
      pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(angle);
      pos[i * 3 + 2] = r * Math.cos(theta);
    }
    return pos;
  }, [count]);
  
  useFrame((_, delta) => {
    if (points.current) {
      points.current.rotation.x += delta * 0.01;
      points.current.rotation.y += delta * 0.02;
    }
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          array={positions} 
          count={count} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        color="#8a7cff" 
        transparent 
        opacity={0.6} 
        sizeAttenuation={true} 
      />
    </points>
  );
};

// Main component that combines everything
const BreathingVisualizer: React.FC<{
  selectedPattern: PatternKey;
  isPaused: boolean;
}> = ({ selectedPattern, isPaused }) => {
  const [currentPhase, setCurrentPhase] = useState('Breathe In');
  const [timer, setTimer] = useState(0);
  const [maxTime, setMaxTime] = useState(4);
  
  const handleTimerInfo = (t: number, max: number) => {
    setTimer(t);
    setMaxTime(max);
  };
  
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <BreathingSphere 
          pattern={selectedPattern}
          isPaused={isPaused}
          setCurrentPhase={setCurrentPhase}
          setTimerInfo={handleTimerInfo}
        />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      <MobileInstructions 
        phase={currentPhase}
        timer={timer}
        maxTime={maxTime}
      />
    </div>
  );
};

export default BreathingVisualizer; 