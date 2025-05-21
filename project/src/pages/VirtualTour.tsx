import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Map, MapPin, X, Play, Pause, Volume2, Heart } from 'lucide-react';

interface Place {
  id: number;
  name: string;
  description: string;
  media: { type: string; url: string; thumbnail?: string };
}

const places: Place[] = [
  {
    id: 1,
    name: 'Our First Coffee Shop',
    description: 'The cozy corner café where our love story began, with your favorite book sparking our first conversation.',
    media: {
      type: 'image',
      url: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      thumbnail: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    },
  },
  {
    id: 2,
    name: 'Beach Sunset Spot',
    description: 'Our secret spot where we watched the sun melt into the sea, sharing dreams over a picnic blanket.',
    media: {
      type: 'image',
      url: '/assets/PXL_20241204_174742524.jpg',
      thumbnail: '/assets/PXL_20241204_174742524.jpg',
    },
  },
  {
    id: 3,
    name: 'City Park Bench',
    description: 'Our beloved bench where we talked for hours, planning our future under the shade of ancient oaks.',
    media: {
      type: 'image',
      url: '/assets/PXL_20241204_194641530.jpg',
      thumbnail: '/assets/PXL_20241204_194641530.jpg',
    },
  },
  {
    id: 4,
    name: 'Mountain Viewpoint',
    description: 'That trail where we got lost but found a view that took our breath away, just like you do every day.',
    media: {
      type: 'video',
      url: '/assets/PXL_20250315_171002284~3.mp4',
      thumbnail: 'https://images.pexels.com/photos/1033729/pexels-photo-1033729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    },
  },
  {
    id: 5,
    name: 'Starlit Whisper',
    description: 'A tender message whispered under the stars, my heart to yours, Kuttu.',
    media: {
      type: 'audio',
      url: 'https://example.com/audio.mp3',
      thumbnail: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    },
  },
];

const Modal = ({
  isOpen,
  onClose,
  place,
}: {
  isOpen: boolean;
  onClose: () => void;
  place: Place | null;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudioPlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => console.error('Audio playback error:', e));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  if (!isOpen || !place) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: 1 }}
          animate={{ scale: 1, opacity: 1, rotate: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg max-w-lg w-full p-6 relative bg-[url('https://www.transparenttextures.com/patterns/paper.png')] border-8 border-white shadow-lg transform rotate-1 border-image-[url('https://www.transparenttextures.com/patterns/torn.png')] border-image-slice-30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ribbon accent */}
          <div className="absolute -top-2 -left-2 w-16 h-4 bg-primary-400 rounded-sm opacity-80 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary-400 rotate-45 absolute -bottom-1"></div>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-red-600"
            aria-label="Close modal"
          >
            <X size={18} className="text-white" />
          </button>

          {/* Media */}
          <div className="relative w-full h-64 md:h-80 bg-gray-100 rounded-md overflow-hidden mb-4 border-8 border-white shadow-md">
            {place.media.type === 'video' ? (
              <video
                key={place.media.url}
                src={place.media.url}
                poster={place.media.thumbnail}
                controls
                playsInline
                autoPlay={false}
                muted
                className="w-full h-full object-contain"
                onError={() => console.error('Video load error:', place.media.url)}
              >
                <p>Your browser does not support this video format.</p>
              </video>
            ) : place.media.type === 'audio' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 p-4">
                <img
                  src={place.media.thumbnail || 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'}
                  alt={place.name}
                  className="w-32 h-32 object-cover rounded-full mb-4 border-2 border-primary-400"
                />
                <audio
                  ref={audioRef}
                  src={place.media.url}
                  controls
                  className="w-full"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={() => console.error('Audio load error:', place.media.url)}
                />
                <button
                  onClick={toggleAudioPlay}
                  className="mt-4 w-12 h-12 rounded-full bg-primary-400 flex items-center justify-center hover:bg-primary-500 transition"
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                >
                  {isPlaying ? <Pause className="text-white" size={24} /> : <Play className="text-white ml-1" size={24} />}
                </button>
              </div>
            ) : (
              <img
                src={place.media.url}
                alt={place.name}
                className="w-full h-full object-contain"
                onError={() => console.error('Image load error:', place.media.url)}
              />
            )}
          </div>

          {/* Place details */}
          <div className="text-center bg-white/80 rounded-md p-4">
            <h3 className="text-xl font-medium text-gray-800 mb-2 font-dancing">{place.name}</h3>
            <p className="text-gray-600 font-sans">{place.description}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const VirtualTour = () => {
  const [activePlace, setActivePlace] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [dragPosition, setDragPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const nextPlace = () => {
    setActivePlace((prev) => (prev === places.length - 1 ? 0 : prev + 1));
  };

  const prevPlace = () => {
    setActivePlace((prev) => (prev === 0 ? places.length - 1 : prev - 1));
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setDragStart('touches' in e ? e.touches[0].clientX : e.clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const dragDistance = clientX - dragStart;
    setDragPosition(dragDistance);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (Math.abs(dragPosition) > 100) {
      if (dragPosition > 0) {
        prevPlace();
      } else {
        nextPlace();
      }
    }
    setDragPosition(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevPlace();
    if (e.key === 'ArrowRight') nextPlace();
  };

  const openModal = (place: Place) => {
    setSelectedPlace(place);
  };

  const closeModal = () => {
    setSelectedPlace(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] bg-cover bg-center">
      <div className="container mx-auto max-w-5xl relative">
        {/* Pinned Polaroid title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white p-6 rounded-lg shadow-lg border border-gray-100 text-center mb-12 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] transform -rotate-2"
        >
          <h1 className="text-3xl md:text-4xl font-dancing text-gray-800 flex items-center justify-center gap-2">
            <Heart size={24} className="text-red-500" /> Places We've Been Together
          </h1>
          {/* Pushpin effect */}
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-red-500 rounded-full shadow-md"></div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 max-w-2xl mx-auto mb-12 font-dancing text-lg bg-white p-4 rounded-lg shadow-sm border border-gray-100 transform rotate-2"
        >
          A collection of the places where our hearts found home, captured in our love’s scrapbook.
        </motion.p>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto relative" role="region" aria-label="Place carousel" tabIndex={0} onKeyDown={handleKeyDown}>
          {/* Navigation controls */}
          <button
            onClick={prevPlace}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
            aria-label="Previous place"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <button
            onClick={nextPlace}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
            aria-label="Next place"
          >
            <ChevronRight size={24} className="text-gray-800" />
          </button>

          {/* Carousel content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <motion.div
              animate={{ x: isDragging ? dragPosition : 0, scale: isDragging ? 0.98 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full h-full"
            >
              <div className="relative w-full h-full" onClick={() => openModal(places[activePlace])}>
                {places[activePlace].media.type === 'video' ? (
                  <div className="relative w-full h-full bg-gray-100">
                    <video
                      key={places[activePlace].media.url}
                      src={places[activePlace].media.url}
                      poster={places[activePlace].media.thumbnail}
                      muted
                      autoPlay={false}
                      className="w-full h-full object-cover pointer-events-none"
                      onError={() => console.error('Video load error:', places[activePlace].media.url)}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button
                        className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center hover:bg-primary-500 transition focus:outline-none focus:ring-2 focus:ring-primary-300"
                        aria-label="Open video"
                      >
                        <Play className="text-white ml-1" size={20} />
                      </button>
                    </div>
                  </div>
                ) : places[activePlace].media.type === 'audio' ? (
                  <div className="relative w-full h-full bg-gray-100">
                    <img
                      src={places[activePlace].media.thumbnail || 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'}
                      alt={places[activePlace].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button
                        className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center hover:bg-primary-500 transition focus:outline-none focus:ring-2 focus:ring-primary-300"
                        aria-label="Open audio"
                      >
                        <Play className="text-white ml-1" size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={places[activePlace].media.url}
                    alt={places[activePlace].name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary-500 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="text-xl font-medium text-white mb-1 font-dancing">{places[activePlace].name}</h3>
                      <p className="text-gray-200 font-dancing">{places[activePlace].description}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded px-3 py-1 text-white text-sm flex items-center gap-1">
                  <Map size={14} />
                  <span>Drag to explore</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Place indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {places.map((_, index) => (
              <button
                key={index}
                onClick={() => setActivePlace(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activePlace === index ? 'bg-primary-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`View place ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>

        {/* Place Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {places.map((place) => (
            <div
              key={place.id}
              className="relative bg-white p-4 rounded-lg shadow-lg border border-gray-100 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] cursor-pointer transform hover:scale-105 transition-transform"
              onClick={() => openModal(place)}
            >
              <div className="relative w-full h-32 mb-4 rounded-md overflow-hidden">
                {place.media.type === 'video' ? (
                  <div className="relative w-full h-full bg-gray-100">
                    <video
                      src={place.media.url}
                      poster={place.media.thumbnail}
                      autoPlay={false}
                      className="w-full h-full object-cover pointer-events-none"
                      onError={() => console.error('Video load error:', place.media.url)}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button
                        className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center hover:bg-primary-500 transition focus:outline-none focus:ring-2 focus:ring-primary-300"
                        aria-label="Open video"
                      >
                        <Play className="text-white ml-1" size={20} />
                      </button>
                    </div>
                    {/* Torn-edge frame */}
                    <div className="absolute inset-0 border-4 border-white border-image-[url('https://www.transparenttextures.com/patterns/torn.png')] border-image-slice-30"></div>
                  </div>
                ) : place.media.type === 'audio' ? (
                  <div className="relative w-full h-full bg-gray-100">
                    <img
                      src={place.media.thumbnail || 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button
                        className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center hover:bg-primary-500 transition focus:outline-none focus:ring-2 focus:ring-primary-300"
                        aria-label="Open audio"
                      >
                        <Play className="text-white ml-1" size={20} />
                      </button>
                    </div>
                    {/* Torn-edge frame */}
                    <div className="absolute inset-0 border-4 border-white border-image-[url('https://www.transparenttextures.com/patterns/torn.png')] border-image-slice-30"></div>
                  </div>
                ) : (
                  <div className="relative w-full h-full bg-gray-100">
                    <img
                      src={place.media.url}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Torn-edge frame */}
                    <div className="absolute inset-0 border-4 border-white border-image-[url('https://www.transparenttextures.com/patterns/torn.png')] border-image-slice-30"></div>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2 font-dancing">{place.name}</h3>
              <p className="text-gray-600 font-sans text-sm">{place.description}</p>
              {/* Ribbon accent */}
              <div className="absolute -top-2 -right-2 w-12 h-3 bg-primary-400 rounded-sm opacity-80 flex items-center justify-center">
                <div className="w-2 h-2 bg-primary-400 rotate-45 absolute -bottom-1"></div>
              </div>
            </div>
          ))}
        </motion.div>

        <Modal isOpen={!!selectedPlace} onClose={closeModal} place={selectedPlace} />
      </div>
    </div>
  );
};

export default VirtualTour;