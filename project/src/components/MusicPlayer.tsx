import { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AudioPlayer from './AudioPlayer';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true); // Music plays by default
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility without affecting playback
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleModal}
        className="p-2 sm:p-3 rounded-full bg-rose-100 hover:bg-rose-200 transition-colors focus:outline-none"
        aria-label={isModalOpen ? 'Hide music player' : 'Show music player'}
      >
        <Heart
          size={18}
          className={isPlaying ? 'text-rose-500 fill-rose-500 sm:size-[18px] size-[20px]' : 'text-rose-300 fill-rose-300 sm:size-[18px] size-[20px]'}
        />
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1000] bg-rose-300/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={toggleModal}
          >
            <AudioPlayer 
              isModalOpen={isModalOpen} 
              onClose={toggleModal}
              isPlaying={isPlaying} 
              setIsPlaying={setIsPlaying} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;