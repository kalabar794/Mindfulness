import React, { useState, useEffect, useRef } from 'react';

interface AudioControlsProps {
  audioSrc?: string;
}

type SoundOption = {
  id: string;
  name: string;
  src: string;
};

const SOUND_OPTIONS: SoundOption[] = [
  { id: 'waves', name: 'Ocean Waves', src: '/assets/waves.mp3' },
  { id: 'rain', name: 'Gentle Rain', src: '/assets/rain.mp3' },
  { id: 'forest', name: 'Forest Sounds', src: '/assets/forest.mp3' },
  { id: 'meditation', name: 'Meditation Bells', src: '/assets/meditation.mp3' }
];

const AudioControls: React.FC<AudioControlsProps> = ({ audioSrc = '/assets/meditation.mp3' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [expanded, setExpanded] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundOption>(SOUND_OPTIONS[0]);
  const controlsRef = useRef<HTMLDivElement>(null);

  // Handle click outside to collapse menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize audio
  useEffect(() => {
    const newAudio = new Audio(selectedSound.src);
    newAudio.loop = true;
    newAudio.volume = volume;
    setAudio(newAudio);

    return () => {
      newAudio.pause();
      newAudio.src = '';
    };
  }, [selectedSound]);

  // Update volume whenever it changes
  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [volume, audio]);

  const togglePlay = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeSound = (sound: SoundOption) => {
    if (isPlaying && audio) {
      audio.pause();
    }
    setSelectedSound(sound);
    setIsPlaying(false);
    setExpanded(false);
  };

  return (
    <div className="fixed bottom-0 w-full p-4 bg-white bg-opacity-90" ref={controlsRef}>
      <div className={`transition-all duration-300 ${expanded ? 'h-48' : 'h-0'} overflow-hidden`}>
        <div className="mb-6 pt-2">
          <h3 className="text-center text-purple-600 font-medium mb-4">Select Ambient Sound</h3>
          <div className="grid grid-cols-2 gap-2 px-4">
            {SOUND_OPTIONS.map(sound => (
              <button
                key={sound.id}
                onClick={() => changeSound(sound)}
                className={`py-2 px-3 rounded-lg text-sm ${
                  selectedSound.id === sound.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              >
                {sound.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="px-8 mb-4">
          <label htmlFor="volume-slider" className="block text-center text-purple-600 mb-2">
            Volume
          </label>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
      </div>
      
      <div className="flex justify-center items-center">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-12 h-12 mx-2 rounded-full bg-purple-600 text-white hover:bg-purple-700"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center justify-center w-8 h-8 mx-2 rounded-full border ${expanded ? 'border-purple-600 text-purple-600 rotate-180' : 'border-purple-300 text-purple-400'} transition-all`}
          aria-label={expanded ? 'Hide sound options' : 'Show sound options'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AudioControls;
