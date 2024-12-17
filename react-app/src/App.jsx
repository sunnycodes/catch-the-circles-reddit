import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RefreshCw, Trophy, RotateCcw } from 'lucide-react';

// Background Space Effect Component remains unchanged
const SpaceBackground = () => {
  const [stars, setStars] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);
  
  const createStar = useCallback(() => ({
    id: Math.random(),
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    twinkleSpeed: Math.random() * 2 + 0.5,
    twinkleDelay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.5
  }), []);

  const createAsteroid = useCallback(() => ({
    id: Math.random(),
    x: Math.random() * 100,
    y: -10,
    size: Math.random() * 20 + 10,
    rotation: Math.random() * 360,
    speed: Math.random() * 0.5 + 0.2,
    rotationSpeed: (Math.random() - 0.5) * 2
  }), []);

  const createShootingStar = useCallback(() => ({
    id: Math.random(),
    x: Math.random() * 100,
    y: Math.random() * 30,
    length: Math.random() * 100 + 50,
    speed: Math.random() * 2 + 1,
    angle: Math.random() * 30 + 30
  }), []);

  useEffect(() => {
    const initialStars = Array.from({ length: 50 }, createStar);
    setStars(initialStars);
  }, [createStar]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAsteroids(prev => {
        if (prev.length < 8 && Math.random() < 0.05) {
          return [...prev, createAsteroid()];
        }
        return prev
          .map(asteroid => ({
            ...asteroid,
            y: asteroid.y + asteroid.speed,
            rotation: asteroid.rotation + asteroid.rotationSpeed
          }))
          .filter(asteroid => asteroid.y < 110);
      });

      setShootingStars(prev => {
        if (prev.length < 2 && Math.random() < 0.01) {
          return [...prev, createShootingStar()];
        }
        return prev
          .map(star => ({
            ...star,
            x: star.x + star.speed * Math.cos((star.angle * Math.PI) / 180),
            y: star.y + star.speed * Math.sin((star.angle * Math.PI) / 180)
          }))
          .filter(star => star.x < 120 && star.y < 120);
      });
    }, 16);

    return () => clearInterval(interval);
  }, [createAsteroid, createShootingStar]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'white',
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px white`,
            animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite ${star.twinkleDelay}s`
          }}
        />
      ))}

      {asteroids.map(asteroid => (
        <div
          key={asteroid.id}
          className="absolute bg-gray-700 rounded-lg"
          style={{
            left: `${asteroid.x}%`,
            top: `${asteroid.y}%`,
            width: `${asteroid.size}px`,
            height: `${asteroid.size}px`,
            transform: `rotate(${asteroid.rotation}deg)`,
            boxShadow: 'inset -2px -2px 10px rgba(0,0,0,0.5)'
          }}
        />
      ))}

      {shootingStars.map(star => (
        <div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.length}px`,
            height: '2px',
            backgroundColor: 'white',
            transform: `rotate(${star.angle}deg)`,
            boxShadow: '0 0 20px white',
            opacity: 0.7
          }}
        />
      ))}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

const useAudioContext = () => {
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playClickSound = useCallback((frequency = 800) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.1);
  }, []);

  return { playClickSound };
};

// Game Circle Component (replaced GameStar)
const GameCircle = ({ position, size, onClick, duration }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.9 }}
    transition={{ duration: 0.5 }}
    style={{
      left: position.x,
      top: position.y,
      width: size,
      height: size,
    }}
    className="absolute cursor-pointer"
    onClick={onClick}
  >
    <div 
      className="w-full h-full rounded-full relative animate-pulse"
      style={{
        background: 'radial-gradient(circle at 30% 30%, #93C5FD, #3B82F6)',
        boxShadow: '0 0 20px #93C5FD, 0 0 40px #3B82F6, 0 0 60px #2563EB',
        animation: 'circlePulse 2s infinite'
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.6), transparent)',
          animation: 'circleGlow 2s infinite'
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '2px solid rgba(255,255,255,0.3)',
          filter: 'blur(1px)'
        }}
      />
    </div>
  </motion.div>
);

// Modal Component remains unchanged
const Modal = ({ children, isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-slate-900 bg-opacity-90 p-4 rounded-xl shadow-2xl border border-blue-500"
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Main Game Component
const CatchTheCircles = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [circles, setCircles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  
  const { playClickSound } = useAudioContext();

  const resetToInitialState = () => {
    setScore(0);
    setLevel(1);
    setCombo(0);
    setCircles([]);
    setIsPlaying(false);
    setIsPaused(false);
    setGameOver(false);
  };

  const generateCircle = useCallback(() => {
    const size = Math.random() * 30 + 20;
    const position = {
      x: Math.random() * (200 - size),
      y: Math.random() * (300 - size),
    };
    
    return {
      id: Date.now(),
      position,
      size,
      createdAt: Date.now(),
    };
  }, []);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setLevel(1);
    setCircles([]);
    setGameOver(false);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const handleCircleClick = (id) => {
    if (!isPlaying || isPaused) return;

    // Play sound with frequency based on combo
    const baseFrequency = 400;
    const comboFrequency = baseFrequency;
    playClickSound(comboFrequency);

    setCircles(prev => prev.filter(circle => circle.id !== id));
    setScore(prev => prev + (10 * level));
    setCombo(prev => prev + 1);
    
    if (combo > 0 && combo % 10 === 0) {
      setLevel(prev => Math.min(prev + 1, 1000));
    }
  };

  useEffect(() => {
    let intervalId;
    
    if (isPlaying && !isPaused) {
      const decayFactor = 0.3;
      const scoreMultiplier = Math.log10(score + 1) * decayFactor;
      const calculatedInterval = 1000 / (1 + scoreMultiplier);

      intervalId = setInterval(() => {
        setCircles(prev => {
          const now = Date.now();
          const newCircles = prev.filter(circle => {
            if (now - circle.createdAt > 2000) {
              setGameOver(true);
              setIsPlaying(false);
              if (score > highScore) {
                setHighScore(score);
              }
              return false;
            }
            return true;
          });
          
          return [...newCircles, generateCircle()];
        });
      }, (1000 / level));
    }

    return () => clearInterval(intervalId);
  }, [isPlaying, isPaused, level, generateCircle, score, highScore]);

  const buttonBaseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-md";
  const buttonStyles = {
    play: `${buttonBaseClasses} bg-blue-600 bg-opacity-60 hover:bg-opacity-80 text-white`,
    pause: `${buttonBaseClasses} bg-yellow-600 bg-opacity-60 hover:bg-opacity-80 text-white`,
    restart: `${buttonBaseClasses} bg-red-600 bg-opacity-60 hover:bg-opacity-80 text-white`,
    reset: `${buttonBaseClasses} bg-slate-600 bg-opacity-60 hover:bg-opacity-80 text-white`
  };

  return (
    <div className="flex flex-col h-full font-mono items-center justify-center min-h-screen bg-slate-900 p-2">
      <SpaceBackground />
      <div className="rounded-xl flex flex-col h-full shadow-2xl p-2 w-full relative bg-slate-900 bg-opacity-30">
        <div className="flex justify-between items-center mb-2">
          <div className="text text-blue-400">Level: {level}</div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-blue-900 bg-opacity-60 backdrop-blur-md rounded-lg">
              <Trophy className="inline-block mr-2 text-yellow-400" size={15} />
              <span className="font-bold text-yellow-400">{highScore}</span>
            </div>
            <div className="px-4 py-2 bg-blue-900 bg-opacity-60 backdrop-blur-md rounded-lg">
              <span className="font-bold text-blue-400">{score}</span>
            </div>
          </div>
        </div>

        <div className="relative h-full w-full rounded-lg overflow-hidden">
          <AnimatePresence>
            {circles.map(circle => (
              <GameCircle
                key={circle.id}
                {...circle}
                onClick={() => handleCircleClick(circle.id)}
                duration={2000 / level}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-4 mt-2">
          {!isPlaying ? (
            <>
              <button onClick={startGame} className={buttonStyles.play}>
                <Play size={15} />
                Start 
              </button>
              <button onClick={resetToInitialState} className={buttonStyles.reset}>
                <RotateCcw size={15} />
              </button>
            </>
          ) : (
            <>
              <button onClick={pauseGame} className={buttonStyles.pause}>
                {isPaused ? <Play size={15} /> : <Pause size={15} />}
              </button>
              <button onClick={startGame} className={buttonStyles.restart}>
                <RefreshCw size={15} />
              </button>
              <button onClick={resetToInitialState} className={buttonStyles.reset}>
                <RotateCcw size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      <Modal isOpen={gameOver}>
        <div className="text-center text-white">
          <div className="text text-xl mb-2 text-red-500">Game Over!</div>
          <div className="text mb-2">Final Score: {score}</div>
          {score === highScore && score > 0 && (
            <div className="text-green-500 mb-4">New High Score! 🎉</div>
          )}
          <div className="flex justify-center gap-4">
            <button
              onClick={startGame}
              className={buttonStyles.play}
            >
              Play Again
            </button>
            <button
              onClick={resetToInitialState}
              className={buttonStyles.reset}
            >
              <X size={15} />
              Exit
            </button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        @keyframes circleGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default CatchTheCircles;