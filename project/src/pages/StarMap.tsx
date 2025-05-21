import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, ChevronLeft, ChevronRight, X } from 'lucide-react';

// Define interfaces for type safety
interface StarMapProps {
  moonImageSrc?: string;
  couplePhotos?: string[];
}

const StarMap = ({
  moonImageSrc = '/assets/moon-4k.jpg',
  couplePhotos = [
    '/assets/IMG_4303.JPG', // Replace with actual couple photo URLs
    '/assets/PXL_20240521_211705437.jpg',
    '/assets/PXL_20240521_211722077.jpg'
  ]
}: StarMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showPhotos, setShowPhotos] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const moonImageRef = useRef<HTMLImageElement | null>(null);

  // Load moon image
  const loadMoonImage = useCallback(() => {
    const img = new Image();
    img.src = moonImageSrc;
    img.crossOrigin = 'anonymous'; // Ensure CORS compatibility
    img.onload = () => {
      console.log('Moon image loaded successfully:', moonImageSrc);
      moonImageRef.current = img;
      // Redraw canvas once image is loaded
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawMoon(ctx, canvas.width, canvas.height);
        }
      }
    };
    img.onerror = () => {
      console.error('Failed to load moon image:', moonImageSrc);
    };
  }, [moonImageSrc]);

  // Draw the moon with image texture, outer space background, and stars
  const drawMoon = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.25; // Smaller radius to balance with larger canvas

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw outer space background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0a0a1f'); // Deep black with a hint of blue
      gradient.addColorStop(1, '#2c1b47'); // Dark cosmic purple
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw stars across the entire canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      for (let i = 0; i < 300; i++) { // Increased number of stars
        const x = Math.random() * width;
        const y = Math.random() * height;
        const starRadius = Math.random() * 1.8;
        const opacity = Math.random() * 0.6 + 0.3;

        // Avoid drawing stars over the moon
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > radius) {
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(x, y, starRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1; // Reset opacity

      // Save context for clipping the moon
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Draw moon image - perfect fit without black outlines
      if (moonImageRef.current) {
        // Get the dimensions of the moon area
        const moonSize = radius * 2;
        
        // Calculate scale to ensure the moon image covers the entire circle
        // We use the larger dimension to ensure full coverage
        const imgScale = Math.max(
          moonSize / moonImageRef.current.width,
          moonSize / moonImageRef.current.height
        ) * 1.05; // Add 5% extra to ensure no edges show
        
        // Calculate new dimensions that maintain aspect ratio
        const imgWidth = moonImageRef.current.width * imgScale;
        const imgHeight = moonImageRef.current.height * imgScale;
        
        // Center the image on the moon circle
        const imgX = centerX - imgWidth / 2;
        const imgY = centerY - imgHeight / 2;
        
        // Draw the image
        ctx.drawImage(moonImageRef.current, imgX, imgY, imgWidth, imgHeight);
      } else {
        // Fallback if image not loaded
        ctx.fillStyle = '#e5e7eb';
        ctx.fill();
      }

      ctx.restore();
    },
    []
  );

  // Handle canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load moon image
    loadMoonImage();

    // Responsive canvas sizing to cover full viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawMoon(ctx, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawMoon, loadMoonImage]);

  // Handle tap/click to toggle message and photos
  const handleCanvasClick = () => {
    setShowPhotos((prev) => !prev);
    // Reset selected photo when toggling
    setSelectedPhotoIndex(null);
  };

  // Handle photo selection
  const handlePhotoClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent canvas click
    setSelectedPhotoIndex(index);
  };

  // Close expanded photo
  const closeExpandedPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex(null);
  };

  // Navigate through expanded photos
  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas click
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev + 1) % couplePhotos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas click
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev - 1 + couplePhotos.length) % couplePhotos.length);
    }
  };

  // Define different positions for the photos
  // UPDATED: Fixed positioning to prevent overlap between photos 1 and 3 on mobile
  const photoPositions = [
    'bottom-20 left-4 md:top-36 md:left-8', // Photo 1: Bottom-left on mobile, top on desktop
    'bottom-40 right-4 md:top-72 md:right-12', // Photo 2: Bottom-right on mobile, top on desktop
    'bottom-60 left-8 md:bottom-40 md:left-24', // Photo 3: Bottom-left on mobile (lower than photo 1), bottom on desktop
    'bottom-36 right-6 md:bottom-60 md:right-20', // Photo 4: Bottom-right on mobile, bottom on desktop
    'top-64 left-1/2 -translate-x-1/2 md:top-56', // Photo 5: Middle on both
  ];

  return (
    <div className="relative min-h-screen bg-transparent font-sans">
      {/* Canvas covering the entire viewport */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full cursor-pointer z-0"
        onClick={handleCanvasClick}
      />

      {/* Header and description */}
      <div className="relative z-10 flex flex-col items-center pt-8 md:pt-12 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight text-shadow"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
          A Moonlit Promise
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white max-w-2xl mb-8 leading-relaxed font-medium"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
        >
          May 21 , 2024, under this celestial moon, we sealed a timeless vow amidst the stars.
        </motion.p>

        {/* Our eternal vow message */}
        <AnimatePresence>
          {showPhotos && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="mt-4 md:mt-8 mx-4 md:mx-auto max-w-md w-full bg-black/40 backdrop-blur-lg border border-white/30 rounded-xl text-white shadow-lg overflow-hidden"
            >
              <div className="p-5 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Moon size={20} className="text-blue-300" />
                  <h3 className="font-medium text-lg md:text-xl">Our Eternal Vow</h3>
                </div>
                <p className="text-sm md:text-base text-white leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  Beneath this moon, I vowed to cherish you forever. Our love is written in the stars, eternal and boundless.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scattered Photos */}
      <AnimatePresence>
        {showPhotos && couplePhotos.map((photo, index) => {
          // Ensure we have a position, use modulo if we have more photos than positions
          const position = photoPositions[index % photoPositions.length];
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 * index, 
                ease: 'easeOut'
              }}
              className={`absolute z-20 ${position}`}
            >
              <div 
                onClick={(e) => handlePhotoClick(e, index)}
                className="w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 border-2 border-white/30"
              >
                <img 
                  src={photo} 
                  alt={`Romantic moment ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Expanded Photo Viewer */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/80 flex items-center justify-center p-4"
            onClick={closeExpandedPhoto}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl max-h-full w-full overflow-hidden rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={closeExpandedPhoto}
                className="absolute right-3 top-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 z-10 transition-colors"
                aria-label="Close photo"
              >
                <X size={24} />
              </button>
              
              {/* Current photo */}
              <img 
                src={couplePhotos[selectedPhotoIndex]} 
                alt={`Romantic moment ${selectedPhotoIndex + 1}`} 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {/* Navigation buttons */}
              <div className="absolute bottom-0 inset-x-0 flex justify-between items-center p-4">
                <button 
                  onClick={prevPhoto}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div className="flex space-x-2">
                  {couplePhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhotoIndex(index);
                      }}
                      className={`w-2.5 h-2.5 rounded-full ${
                        index === selectedPhotoIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                      aria-label={`Go to photo ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={nextPhoto}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom text card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mx-auto mt-8 md:mt-12 px-4 max-w-md text-center"
      >
        <p className="text-sm md:text-base text-white font-medium leading-relaxed"
           style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
          Amidst the stars, our promise shines eternal. Tap the moon to reveal our cherished moments.
        </p>
      </motion.div>
    </div>
  );
};

// Example Test Cases
export const StarMapTestCases = () => {
  return (
    <div className="relative">
      <h2 className="text-lg font-semibold mb-2 text-white p-4">Moon with Scattered Photos</h2>
      <StarMap />
    </div>
  );
};

export default StarMap;
