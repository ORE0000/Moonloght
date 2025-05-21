import { useState, useEffect, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/Navigation';
import MusicPlayer from '../components/MusicPlayer';
import SurpriseButton from '../components/SurpriseButton';
import { Heart } from 'lucide-react';

// Memoize MusicPlayer to prevent re-renders
const MemoizedMusicPlayer = memo(MusicPlayer);

const MainLayout = () => {
  const [showSurprise, setShowSurprise] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-ivory-50 overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-ivory-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 z-50">
            <Heart className="text-rose-500 fill-rose-500" size={24} />
            <h1 className="text-xl md:text-2xl font-display text-rose-600">
              Dear Kuttu
            </h1>
          </div>
          <Navigation isMobile={isMobile} />
        </div>
      </header>
      
      <main className="pt-16 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="min-h-[calc(100vh-9rem)]"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-ivory-100 shadow-sm py-2">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-2 sm:gap-4">
          <div className="text-sm text-rose-600 font-display">
            With love, Ashu ❤️
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <MemoizedMusicPlayer />
            <SurpriseButton onTrigger={() => setShowSurprise(true)} />
          </div>
        </div>
      </footer>
      
      {showSurprise && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center min-h-screen"
            onClick={() => setShowSurprise(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: 5 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-ivory-100 rounded-lg p-8 max-w-md mx-4 shadow-xl transform rotate-1 border-4 border-rose-300"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-display text-rose-600 mb-4">My Secret Message</h3>
              <p className="font-display text-lg mb-6">
                Kuttu, you make my heart skip a beat every single day. You're the missing puzzle piece that makes my life complete. 
                I love you more than all the stars in the universe. Forever yours, Ashu ❤️
              </p>
              <button 
                onClick={() => setShowSurprise(false)}
                className="w-full py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition"
              >
                Close ❤️
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default MainLayout;