import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts and components
import MainLayout from './layouts/MainLayout';
import IntroAnimation from './components/IntroAnimation';

// Pages
import HomePage from './pages/HomePage';
import PhotoAlbum from './pages/PhotoAlbum';
import Timeline from './pages/Timeline';
import KuttuBot from './pages/KuttuBot';
import MediaGallery from './pages/MediaGallery';
import StarMap from './pages/StarMap';
import VirtualTour from './pages/VirtualTour';
import FutureTogether from './pages/FutureTogether';
import SecretDiary from './pages/SecretDiary';
import AIJournal from './pages/AIJournal';
import VideoMosaic from './pages/VideoMosaic';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (showIntro) {
    return <IntroAnimation />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="album" element={<PhotoAlbum />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="kuttubot" element={<KuttuBot />} />
          <Route path="media" element={<MediaGallery />} />
          <Route path="starmap" element={<StarMap />} />
          <Route path="places" element={<VirtualTour />} />
          <Route path="future" element={<FutureTogether />} />
          <Route path="secret" element={<SecretDiary />} />
          <Route path="journal" element={<AIJournal />} />
          <Route path="videos" element={<VideoMosaic />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;