import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Heart, SkipForward, SkipBack, Play, Pause, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
  playlist?: string[];
  isModalOpen?: boolean;
  onClose?: () => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const defaultPlaylist = [
  '/src/assets/Sounds/Connie Francis - You can ask the flowers I sit for hours (Pretty Little Baby) (Lyrics Terjemahan).mp3',
];

const AudioPlayer = ({ 
  playlist = defaultPlaylist, 
  isModalOpen, 
  onClose, 
  isPlaying, 
  setIsPlaying 
}: AudioPlayerProps) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Howl | null>(null);
  const animationRef = useRef<number | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Howl only if not already initialized
    if (soundRef.current) {
      soundRef.current.unload();
    }

    const newSound = new Howl({
      src: [playlist[currentTrack]],
      volume,
      html5: true,
      autoplay: true,
      loop: true, // Loop to ensure continuous playback
      onplay: () => {
        setIsPlaying(true);
        setDuration(newSound.duration());
        startProgressUpdate();
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onend: () => {
        setCurrentTrack((prev) => (prev + 1) % playlist.length);
        setCurrentTime(0);
      },
      onloaderror: (_, error) => {
        setError('Failed to load audio track. Please try again later.');
        setIsPlaying(false);
      },
      onplayerror: (_, error) => {
        setError('Failed to play audio track. Please try again.');
        setIsPlaying(false);
      },
    });

    soundRef.current = newSound;

    return () => {
      newSound.unload();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentTrack, playlist]);

  useEffect(() => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.play();
      } else {
        soundRef.current.pause();
      }
    }
  }, [isPlaying]);

  const startProgressUpdate = () => {
    const update = () => {
      if (soundRef.current) {
        setCurrentTime(soundRef.current.seek() as number);
        animationRef.current = requestAnimationFrame(update);
      }
    };
    animationRef.current = requestAnimationFrame(update);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (soundRef.current) {
      soundRef.current.fade(volume, 0, 500);
      setTimeout(() => {
        soundRef.current?.stop();
        setCurrentTrack((prev) => (prev + 1) % playlist.length);
        setCurrentTime(0);
      }, 500);
    }
  };

  const previousTrack = () => {
    if (soundRef.current) {
      soundRef.current.fade(volume, 0, 500);
      setTimeout(() => {
        soundRef.current?.stop();
        setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
        setCurrentTime(0);
      }, 500);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (soundRef.current) {
      soundRef.current.seek(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const waveform = Array.from({ length: 60 }, () => Math.random() * 24 + 12);

  return (
    <motion.div
      ref={playerRef}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative bg-gradient-to-br from-rose-100 to-pink-100 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl w-full max-w-md mx-auto border border-rose-200/50 font-display"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="absolute top-3 right-3 p-2 rounded-full bg-rose-200/80 hover:bg-rose-300/80 text-rose-600 shadow-sm transition-all duration-200"
        aria-label="Hide player"
      >
        <ChevronUp size={18} />
      </motion.button>

      <div className="text-center mb-4">
        <h3 className="text-lg sm:text-xl text-rose-600 font-display">
          For My Dearest Kuttu ❤️
        </h3>
        <p className="text-sm text-pink-500">
          A melody that sings my love for you
        </p>
      </div>

      {error ? (
        <div className="text-red-500 text-xs sm:text-sm mb-3 font-medium">{error}</div>
      ) : (
        <div className="flex items-center justify-center h-10 sm:h-12 mb-4 overflow-hidden">
          {waveform.map((height, index) => (
            <motion.div
              key={index}
              className="w-1 mx-[1px] bg-gradient-to-b from-rose-400 to-pink-600 rounded-sm"
              style={{ height: `${height}px` }}
              animate={{
                height: isPlaying ? `${Math.random() * 24 + 12}px` : `${height}px`,
              }}
              transition={{ duration: 0.15, ease: 'easeInOut', repeat: isPlaying ? Infinity : 0 }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 mb-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={previousTrack}
          className="p-2 rounded-full bg-rose-200/80 hover:bg-rose-300/80 transition-all duration-200 shadow-sm"
          aria-label="Previous track"
          disabled={!!error}
        >
          <SkipBack size={16} className="text-rose-600 sm:size-[18px]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlay}
          className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-md"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={!!error}
        >
          {isPlaying ? (
            <Pause size={18} className="text-white sm:size-[20px]" />
          ) : (
            <Play size={18} className="text-white sm:size-[20px]" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextTrack}
          className="p-2 rounded-full bg-rose-200/80 hover:bg-rose-300/80 transition-all duration-200 shadow-sm"
          aria-label="Next track"
          disabled={!!error}
        >
          <SkipForward size={16} className="text-rose-600 sm:size-[18px]" />
        </motion.button>
      </div>

      {!error && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs sm:text-sm text-rose-600 font-medium">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-rose-300 rounded-full appearance-none cursor-pointer accent-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
              disabled={!!error}
            />
            <span className="text-xs sm:text-sm text-rose-600 font-medium">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Heart size={14} className="text-rose-600 sm:size-[16px]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
                if (soundRef.current) {
                  soundRef.current.volume(newVolume);
                }
              }}
              className="flex-1 h-1.5 bg-rose-300 rounded-full appearance-none cursor-pointer accent-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
              disabled={!!error}
            />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AudioPlayer;