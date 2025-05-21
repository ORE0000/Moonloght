import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Grid, Book, Edit2, Lock, Heart, Play, Pause } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import MediaEditor from '../components/MediaEditor';

// Timeline events integrated into albumPages
const timelineEvents = [
  {
    date: "Jan 18, 2024",
    title: "Kuttu's Humour",
    description: "Ye dekho… tumne kitni funny video bheji thi us din 😂🎥 insta pe",
    media: {
      type: "video",
      url: "/src/assets/VID_42880319_220630_118.mp4",
      thumbnail: "https://images.pexels.com/photos/1033729/pexels-photo-1033729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    },
  },
  {
    date: "March 18, 2024",
    title: "Rishikesh",
    description: "Our second trip together, laughter, memories, and moments we did not realize would mean so much later. A mutual bond slowly turning into something more. 💖",
    media: {
      type: "image",
      url: "/src/assets/IMG_1577.JPG",
      thumbnail: "/src/assets/IMG-20241208-WA0068.jpg",
    },
  },
  {
    date: "March 18, 2024",
    title: "Rishikesh",
    description: "You were fun to be around, and I did not even know why — it just felt easy, natural, and warm. 😊🌿✨",
    media: {
      type: "image",
      url: "/src/assets/IMG-20240804-WA0008.jpg",
      thumbnail: "/src/assets/IMG-20240804-WA0008.jpg",
    },
  },
  {
    date: "March 18, 2024",
    title: "Haridwar",
    description: "Spending the evening with friends was special, but getting to talk to you by the riverside in Haridwar made it unforgettable. The calm water, the soft breeze, and your presence — it all just felt right. 🌅💬🌊✨",
    media: {
      type: "image",
      url: "/src/assets/IMG_1886-1.jpg",
      thumbnail: "",
    },
  },
  {
    date: "May 11, 2024",
    title: "Kempt Falls",
    description: "We went to Kempt Falls with all our friends, but it wasn’t just the place that made it special. We shared little adventures, laughs, and moments that brought us closer in the most unexpected ways.",
    media: {
      type: "image",
      url: "/src/assets/places/May222024.jpg",
      thumbnail: "/src/assets/places/May222024.jpg",
    },
  },
  {
    date: "May 21, 2024",
    title: "Our First Unofficial Date",
    description: "Isse humne date toh nahi kaha, par feel waise hi tha — sirf hum dono, bina kisi friends ke. Raipur ke Shiv Mandir jaana tha, par uss din main tumhein ek naye tareeke mein samajh paya. Tumhare thoughts itne soulful the... aur tumhare jawab un sawaalon ke liye the jo shayad main khud bhi samajh nahi paaya tha.",
    media: {
      type: "image",
      url: "/src/assets/IMG_4303.JPG",
      thumbnail: "/src/assets/IMG_4303.JPG",
    },
  },
  {
    date: "May 21, 2024",
    title: "Gazing at the moon together",
    description: "You knew I loved anime, and with that soft smile, you looked at me and said, 'Isn’t the moon beautiful?' — a line so simple, yet filled with meaning. I did not realize it then… that you were actually proposing to me in the most subtle, heartfelt way. And like a fool, I missed the moment — but still, unintentionally, I looked at you and replied, Yes, it is. Funny how even without knowing, my heart said yes.",
    media: {
      type: "image",
      url: "/src/assets/moon-4k.jpg",
      thumbnail: "/src/assets/moon-4k.jpg",
    },
  },
  {
    date: "August 1, 2024",
    title: "I Proposed to you",
    description: "Maine finally himmat karke chat pe propose kiya. Dil tez tez dhadak raha tha, par main apni feelings bata hi di. Jab tumne haan kaha, dono thoda shocked the. 💌🌟 Thoda awkward bhi the, par sach mein yeh sab real lag raha tha. 📞💞",
    media: {
      type: "image",
      url: "/src/assets/IMG-20241212-WA0001.jpg",
      thumbnail: "/src/assets/IMG-20241212-WA0001.jpg",
    },
  },
  {
    date: "August 24, 2024",
    title: "Long Distance and Us",
    description: "Phir humne date karna start kiya, though long distance thi, par distance ne hamari baatein kam nahi hone di. Roz subah ek dusre ko good morning bolte, din bhar ki choti-choti updates, videos aur photos share karte rahe. Raat ko late tak batein hoti, kabhi hasi-mazaak, kabhi serious baatein — sab kuch share karte rahe, apni feelings ko aur understand karte hue.",
    media: {
      type: "video",
      url: "/src/assets/VID_20550821_063547_594.mp4",
      thumbnail: "https://images.pexels.com/photos/1033729/pexels-photo-1033729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    },
  },
  {
    date: "August 27, 2024",
    title: "Kuttu's Birthday",
    description: "Aur phir August 27, 2024 — tumhara birthday tha. Hum abhi bhi long distance mein. Din mein maine kuch phool tod ke ek chhoti si video banayi — simple si, bas isliye because i missed you. Caption diya tha: 'Not the flowers you like, but by the man you love'. Thoda corny hai shayad ye line.",
    media: {
      type: "video",
      url: "/src/assets/VID_48980607_135117_551.mp4",
      thumbnail: "/src/assets/places/flowers for you .jpg",
    },
  },
  {
    date: "August 28, 2024",
    title: "My Birthday",
    description: "Aur next day ko mera birthday tha — can you believe that coincidence? Ek din tumhara, agle din mera. Yeh cheez hamesha special rahegi. Tumne mere liye ek handmade card banaya tha, jiska title tha 'My Batman Pookie' — and honestly, mujhe woh bahut pasand aaya.",
    media: {
      type: "image",
      url: "/src/assets/IMG-20240828-WA0003.jpg",
      thumbnail: "/src/assets/IMG-20240828-WA0003.jpg",
    },
  },
  {
    date: "December 2, 2024",
    title: "Convocation Week",
    description: "December 2, 2024 ko hamare college mein convocation event tha — aur uss din humein finally ek bahana mil gaya ek dusre se milne ka. Uss long distance ke baad jab hum mile, woh moment sach mein special tha. Itne time baad saamne dekhna, bina screen ke, woh feeling alag hi thi. Sab kuch ek second ke liye ruk gaya tha.",
    media: {
      type: "image",
      url: "/src/assets/IMG-20250131-WA0001.jpg",
      thumbnail: "/src/assets/IMG-20250131-WA0001.jpg",
    },
  },
  {
    date: "December 3, 2024",
    title: "Convocation Day",
    description: "December 3, 2024 ko humein officially degree mil gayi 🎓. Kaafi shai tha, but special in its own way. Uss din I guess sabko officially pata chle gaya tha that we are dating. Humne saath mein photos liye, thoda campus ghooma, chill kiya. Ek point pe bas chup-chaap college ko dekha — socha, pata nahi phir kab aana hoga yahaan, kisi reason se bhi. 🏫💬",
    media: {
      type: "image",
      url: "/src/assets/IMG-20241203-WA0061.jpg",
      thumbnail: "/src/assets/IMG-20241203-WA0061.jpg",
    },
  },
  {
    date: "December 4, 2024",
    title: "Dhanolti Trip",
    description: "December 4, 2024 ko hum sab friends ke saath Dhanolti gaye. 🏔️ Lekin is baar trip thoda special tha — kyunki is baar tum meri scooty pe thi, aur hum sirf dost nahi, balki couple ban chuke the. 💛 Pehli baar kisi trip pe tum itne close thi — woh ride, thandi hawa, aur tumhara mere peeche baithna...",
    media: {
      type: "image",
      url: "/src/assets/IMG-20241208-WA0068.jpg",
      thumbnail: "/src/assets/IMG-20241208-WA0068.jpg",
    },
  },
  {
    date: "December 6, 2024",
    title: "Few More Trips",
    description: "Us din tak humne thode aur chhote trips kiye, just to spend a little more time together before going back home. 🧳⛰️ Hum dono ko pata tha ki fir se long distance start hone wala hai… and honestly, wohi sabse tough part hota hai. Goodbyes kabhi easy nahi hote, especially jab tumhe pata ho ki phir se screen ke peeche chala jayega sab. But even then, we tried to smile, because those last few days were ours — simple, peaceful, and full of warmth.",
    media: {
      type: "image",
      url: "/src/assets/IMG-20241208-WA0065.jpg",
      thumbnail: "/src/assets/IMG-20241208-WA0065.jpg",
    },
  },
  {
    date: "December 6, 2024",
    title: "Date and Dinner Night",
    description: "Dinner, thoda sa dressing up, thodi masti, thoda romance — sab kuch simple tha, but perfect in its own way. Us raat ka feel hi alag tha... jaise hum dono ne consciously time slow kar diya ho, taaki har moment ko ache se jee sakein. Tumhara saath, woh laughter, woh pal — everthing was magicall kuttu. ❤️ It wasn’t just about a fancy dinner, it was about celebrating us — before life phir se busy aur distant ho jaaye.",
    media: {
      type: "image",
      url: "/src/assets/places/datenight.jpg",
      thumbnail: "/src/assets/places/datenight.jpg",
    },
  },
  {
    date: "December 6, 2024",
    title: "Date and Dinner Night",
    description: "After everything — the long-distance, the wait, the calls — finally spending one peaceful evening together felt really special. Hum dono ne thoda sa time nikala sirf ek dusre ke liye. No distractions, no phone scrolls… bas hum. That night didn’t need filters, fancy lights or drama. It was real. And real is always the most romantic. 💬🌌",
    media: {
      type: "image",
      url: "/src/assets/IMG-20241208-WA0093.jpg",
      thumbnail: "/src/assets/IMG-20241208-WA0093.jpg",
    },
  },
  {
    date: "December 20, 2024",
    title: "cute photos/videos",
    description: "Tumhari cute cute photos/videos mujhe bhejna, Mujhe pareshan karna, masti karna — Jabki hum long distance mein the, Phir bhi humne har din ek doosre ke liye efforts kiye. ❤️✨ Distance ho ya doori, pyar kabhi kam nahi hota. 🌍💞",
    media: {
      type: "image",
      url: "/src/assets/IMG-20241127-WA0002.jpg",
      thumbnail: "",
    },
  },
  {
    date: "January 20, 2025",
    title: "New Year’s Promise",
    description: "Tumhara video call pe mujhse baat karte karte so jaana 😴📱 Aur fir neend mein kuch na kuch cute sa bolna 💬 Yrrrrr… kitni pyaari lagti ho tum uss waqt, kasam se! 💖😚",
    media: {
      type: "image",
      url: "/src/assets/Screenshot_20241119-002233_Instagram.png",
      thumbnail: "/src/assets/Screenshot_20241119-002233_Instagram.png",
    },
  },
  {
    date: "Feb 10, 2025",
    title: "Whispered Promises",
    description: "A quiet night where words became our forever, etched in the stars above.",
    media: {
      type: "audio",
      url: "https://example.com/audio.mp3",
      thumbnail: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    },
  },
  {
    date: "May 1, 2025",
    title: "Our Special Moment",
    description: "That day we captured forever in motion, a memory that makes my heart race every time.",
    media: {
      type: "video",
      url: "/src/assets/places/PXL_20250318_162804450~3.mp4",
      thumbnail: "/src/assets/places/PXL_20250318_162804450~3.mp4",
    },
  },
  {
    date: "May 1, 2025",
    title: "Our Special Moment",
    description: "Pehle tum mujhe virtual kisses karti this aur kabhi nahi bhoolti thi 😚💋 Par ab... sab kuch dheere dheere kam sa ho gaya hai 😞💭 Sach mein, wo chhoti chhoti cheezein bhi kitna special feel karwati thi 💌✨ Ab unki thodi kami si mehsoos hoti hai...",
    media: {
      type: "video",
      url: "/src/assets/VID-20240819-WA0016.mp4",
      thumbnail: "/src/assets/places/kuttu expression.jpg",
    },
  },
];

// Convert timeline events to albumPages format
const initialAlbumPages = timelineEvents.reduce((acc, event, index) => {
  const side = index % 2 === 0 ? 'left' : 'right';
  const pageIndex = Math.floor(index / 2);
  
  if (!acc[pageIndex]) {
    acc[pageIndex] = { left: null, right: null };
  }
  
  acc[pageIndex][side] = {
    type: event.media.type,
    url: event.media.url,
    thumbnail: event.media.thumbnail || '',
    caption: event.date,
    note: event.description,
  };
  
  return acc;
}, [] as Array<{ left: any; right: any }>);

const PhotoAlbum = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'book' | 'grid'>('book');
  const [isEditing, setIsEditing] = useState(false);
  const [showProtectionModal, setShowProtectionModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    type: string;
    url: string;
    thumbnail?: string;
    caption: string;
    note: string;
  } | null>(null);
  const [textureError, setTextureError] = useState({ rose: false, lace: false });
  const bookControls = useAnimation();
  const [albumPages, setAlbumPages] = useState(initialAlbumPages);

  const pageFlipSound = new Audio('/src/assets/page-flip-01a.mp3');

  const Modal = ({
    isOpen,
    onClose,
    media,
  }: {
    isOpen: boolean;
    onClose: () => void;
    media: { type: string; url: string; thumbnail?: string; caption: string; note: string } | null;
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

    if (!isOpen || !media) return null;

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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg max-w-lg w-full p-6 relative bg-[url('/paper-texture.jpg')] bg-cover shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-primary-700"
              aria-label="Close modal"
            >
              <Heart size={18} className="text-white" />
            </button>
            {/* Media */}
            <div className="relative w-full h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden mb-4 border-4 border-white shadow-md">
              {media.type === 'video' ? (
                <video
                  key={media.url}
                  src={media.url}
                  poster={media.thumbnail}
                  controls
                  playsInline
                  autoPlay={false}
                  muted
                  className="w-full h-full object-contain"
                  onError={() => console.error('Video load error:', media.url)}
                >
                  <p>Your browser does not support this video format.</p>
                </video>
              ) : media.type === 'audio' ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 p-4">
                  <img
                    src={media.thumbnail || 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'}
                    alt={media.caption}
                    className="w-32 h-32 object-cover rounded-full mb-4 border-2 border-primary-600"
                  />
                  <audio
                    ref={audioRef}
                    src={media.url}
                    controls
                    className="w-full"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={() => console.error('Audio load error:', media.url)}
                  />
                  <button
                    onClick={toggleAudioPlay}
                    className="mt-4 w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center hover:bg-primary-700 transition"
                    aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                  >
                    {isPlaying ? <Pause className="text-white" size={24} /> : <Play className="text-white ml-1" size={24} />}
                  </button>
                </div>
              ) : (
                <img
                  src={media.url}
                  alt={media.caption}
                  className="w-full h-full object-contain"
                  onError={() => console.error('Image load error:', media.url)}
                />
              )}
            </div>
            {/* Media details */}
            <div className="text-center">
              <p className="text-lg font-handwritten text-gray-700">{media.caption}</p>
              <p className="mt-2 text-sm font-handwritten text-primary-600 italic">{media.note}</p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  useEffect(() => {
    if (viewMode === 'book') {
      const isMobile = window.innerWidth <= 768;
      const totalPages = albumPages.length * 2 + 2;
      if (currentPage === 0) {
        bookControls.start({
          scale: 0.95,
          rotateY: -20,
          transition: { duration: 0.5 },
        });
      } else if (currentPage === totalPages) {
        bookControls.start({
          scale: isMobile ? 0.9 : 0.95,
          rotateY: isMobile ? 20 : 20,
          transition: { duration: 0.7, ease: 'easeOut' },
        });
      } else {
        bookControls.start({
          scale: 1,
          rotateY: 0,
          transition: { duration: 0.5 },
        });
      }
    }
  }, [currentPage, viewMode, bookControls, albumPages.length]);

  const handleMediaUpdate = (index: number, side: 'left' | 'right', media: any) => {
    setAlbumPages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [side]: media };
      return updated;
    });
  };

  const handleMediaDelete = (index: number, side: 'left' | 'right') => {
    setAlbumPages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleEditClick = () => {
    setShowProtectionModal(true);
  };

  const handleProtectionSubmit = (password: string) => {
    if (password === 'memories') {
      setIsEditing(true);
      setShowProtectionModal(false);
    } else {
      alert('Incorrect password');
    }
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'book' ? 'grid' : 'book'));
    setCurrentPage(0);
  };

  const openModal = (media: { type: string; url: string; thumbnail?: string; caption: string; note: string }) => {
    console.log('Opening modal for:', media); // Debug
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const handleTextureError = (type: 'rose' | 'lace') => {
    setTextureError((prev) => ({ ...prev, [type]: true }));
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-[#fff5f5] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-cover relative">
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(-2deg); }
          }
          .heart-vignette {
            background: radial-gradient(circle, transparent 40%, rgba(255, 245, 245, 0.8) 70%);
            position: absolute;
            inset: 0;
            border-radius: 8px;
          }
          .lace-overlay::after {
            content: '';
            position: absolute;
            inset: 0;
            background: ${textureError.lace ? 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))' : "url('https://www.rawpixel.com/image/4005190/lace-border-png-clipart-white-classic-fabric')"};
            opacity: 0.2;
            pointer-events: none;
            background-size: cover;
          }
          .rose-overlay {
            background: ${textureError.rose ? 'rgba(255,245,245,0.05)' : "url('https://www.rawpixel.com/image/15362528/png-background-texture-pattern')"}, rgba(255,245,245,0.05);
            opacity: 0.05;
            position: absolute;
            inset: 0;
            pointer-events: none;
            background-size: cover;
          }
          .glow {
            box-shadow: 0 0 10px rgba(255, 182, 193, 0.6);
          }
          .petal {
            position: absolute;
            width: 15px;
            height: 30px;
            background: radial-gradient(circle, #ff6b6b 30%, #ff4d4d 70%);
            border-radius: 50% 50% 0 0;
            transform-origin: bottom;
            animation: fall 5s linear infinite;
            opacity: 0.7;
            z-index: 0;
          }
          @keyframes fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
          audio {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 4px solid white;
          }
        `}
      </style>
      <img
        src="https://www.rawpixel.com/image/15362528/png-background-texture-pattern"
        alt=""
        style={{ display: 'none' }}
        onError={() => handleTextureError('rose')}
      />
      <img
        src="https://www.rawpixel.com/image/4005190/lace-border-png-clipart-white-classic-fabric"
        alt=""
        style={{ display: 'none' }}
        onError={() => handleTextureError('lace')}
      />
      <div className="rose-overlay"></div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="petal"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}
      <div className="container mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <div className="heart-vignette"></div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-display text-primary-700 text-center relative z-10"
            >
              Our Photo Album
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-handwritten text-primary-600 text-center mt-2"
            >
              Our Love in Moments
            </motion.p>
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { staggerChildren: 0.2 } }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-red-500"
                  style={{
                    left: `${Math.random() * 100 - 50}%`,
                    top: `${Math.random() * 100 - 50}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -30,
                    transition: { duration: 2, repeat: Infinity, delay: i * 0.4 },
                  }}
                >
                  <Heart size={16} />
                </motion.div>
              ))}
            </motion.div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={toggleViewMode}
              className="p-2 bg-primary-200 rounded-full shadow glow hover:bg-primary-300 transition lace-overlay"
              aria-label={viewMode === 'book' ? 'Switch to grid view' : 'Switch to book view'}
              whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
            >
              {viewMode === 'book' ? <Grid size={24} className="text-primary-700" /> : <Book size={24} className="text-primary-700" />}
            </motion.button>
            <motion.button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-4 py-2 bg-primary-200 rounded-lg shadow glow hover:bg-primary-300 transition lace-overlay"
              whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
            >
              <Heart size={18} className="text-primary-700" />
              <span className="text-primary-700 font-handwritten">Edit Album</span>
            </motion.button>
          </div>
        </div>
        {viewMode === 'book' ? (
          <motion.div
            className="relative max-w-5xl mx-auto perspective-1000 book-container"
            animate={bookControls}
          >
            <HTMLFlipBook
              width={window.innerWidth <= 768 ? 400 : 1000}
              height={window.innerWidth <= 768 ? 600 : 700}
              size="stretch"
              minWidth={300}
              maxWidth={1000}
              minHeight={400}
              maxHeight={700}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={(e) => {
                setCurrentPage(e.data);
                if ('vibrate' in navigator) {
                  navigator.vibrate(50);
                }
                pageFlipSound.play().catch((error) => console.error('Error playing page flip sound:', error));
              }}
              className="book"
            >
              <div className="page" data-page="front-cover">
                <div className="page-content bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center h-full letter-paper">
                  <div className="text-center relative z-10">
                    <h1 className="text-4xl font-display">Our Memories</h1>
                    <p className="mt-4 text-lg font-handwritten">A scrapbook of our journey</p>
                  </div>
                  <div className="paper-overlay" style={{ background: 'url(/paper-texture.jpg) repeat', opacity: 0.1 }}></div>
                  <div className="wrinkle" style={{ top: '10%', left: '5%', width: '50px', height: '5px', transform: 'rotate(-45deg)' }}></div>
                  <div className="crumple" style={{ bottom: '15%', right: '10%', width: '20px', height: '20px' }}></div>
                </div>
              </div>
              {albumPages.flatMap((spread, index) => [
                <div key={`${index}-left`} className="page" data-page="inner">
                  <div className="page-content bg-paper-texture bg-cover shadow-inner h-full p-4 letter-paper">
                    {spread.left && (
                      <>
                        {spread.left.type === 'image' ? (
                          <motion.img
                            src={spread.left.url}
                            alt={spread.left.caption}
                            className="w-full h-[70%] object-cover rounded-lg shadow-md border-4 border-white transform rotate-[-2deg] hover:shadow-xl"
                            animate={{ animation: 'float 3s ease-in-out infinite' }}
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                          />
                        ) : spread.left.type === 'video' ? (
                          <motion.video
                            src={spread.left.url}
                            poster={spread.left.thumbnail}
                            controls
                            className="w-full h-[70%] object-cover rounded-lg shadow-md border-4 border-white transform rotate-[-2deg] hover:shadow-xl"
                            animate={{ animation: 'float 3s ease-in-out infinite' }}
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                            onError={() => console.error('Video load error:', spread.left.url)}
                          >
                            <source src={spread.left.url} type="video/mp4" />
                          </motion.video>
                        ) : (
                          <motion.audio
                            src={spread.left.url}
                            controls
                            className="w-full h-[70%] transform rotate-[-2deg] hover:shadow-xl"
                            animate={{ animation: 'float 3s ease-in-out infinite' }}
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                            onError={() => console.error('Audio load error:', spread.left.url)}
                          />
                        )}
                        <p className="mt-4 text-center font-handwritten text-lg text-gray-700">{spread.left.caption}</p>
                        <p className="mt-2 text-center font-handwritten text-sm text-primary-600 italic">{spread.left.note}</p>
                      </>
                    )}
                    <div className="paper-overlay" style={{ background: 'url(/paper-texture.jpg) repeat', opacity: 0.1 }}></div>
                    <div className="wrinkle" style={{ top: '10%', left: '5%', width: '50px', height: '5px', transform: 'rotate(-45deg)' }}></div>
                    <div className="crumple" style={{ bottom: '15%', right: '10%', width: '20px', height: '20px' }}></div>
                  </div>
                </div>,
                <div key={`${index}-right`} className="page" data-page="inner">
                  <div className="page-content bg-paper-texture bg-cover shadow-inner h-full p-4 letter-paper">
                    {spread.right && (
                      <>
                        {spread.right.type === 'image' ? (
                          <motion.img
                            src={spread.right.url}
                            alt={spread.right.caption}
                            className="w-full h-[70%] object-cover rounded-lg shadow-md border-4 border-white transform rotate-[2deg] hover:shadow-xl"
                            animate={{ animation: 'float 3s ease-in-out infinite' }}
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                          />
                        ) : spread.right.type === 'video' ? (
                          <motion.video
                            src={spread.right.url}
                            poster={spread.right.thumbnail}
                            controls
                            className="w-full h-[70%] object-cover rounded-lg shadow-md border-4 border-white transform rotate-[2deg] hover:shadow-xl"
                            animate={{ animation: 'float 3s ease-in-out infinite' }}
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                            onError={() => console.error('Video load error:', spread.right.url)}
                          >
                            <source src={spread.right.url} type="video/mp4" />
                          </motion.video>
                        ) : (
                          <motion.audio
                            src={spread.right.url}
                            controls
                            className="w-full h-[70%] transform rotate-[2deg] hover:shadow-xl"
                            animate={{ animation: 'float 3s ease-in-out infinite' }}
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                            onError={() => console.error('Audio load error:', spread.right.url)}
                          />
                        )}
                        <p className="mt-4 text-center font-handwritten text-lg text-gray-700">{spread.right.caption}</p>
                        <p className="mt-2 text-center font-handwritten text-sm text-primary-600 italic">{spread.right.note}</p>
                      </>
                    )}
                    <div className="paper-overlay" style={{ background: 'url(/paper-texture.jpg) repeat', opacity: 0.1 }}></div>
                    <div className="wrinkle" style={{ top: '10%', left: '5%', width: '50px', height: '5px', transform: 'rotate(-45deg)' }}></div>
                    <div className="crumple" style={{ bottom: '15%', right: '10%', width: '20px', height: '20px' }}></div>
                  </div>
                </div>,
              ])}
              <div className="page" data-page="back-cover">
                <div className="page-content bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center h-full letter-paper">
                  <div className="text-center relative z-10">
                    <p className="text-lg font-handwritten">The End</p>
                    <p className="mt-4 text-sm">Made with love</p>
                  </div>
                  <div className="paper-overlay" style={{ background: 'url(/paper-texture.jpg) repeat', opacity: 0.1 }}></div>
                  <div className="wrinkle" style={{ top: '10%', left: '5%', width: '50px', height: '5px', transform: 'rotate(-45deg)' }}></div>
                  <div className="crumple" style={{ bottom: '15%', right: '10%', width: '20px', height: '20px' }}></div>
                </div>
              </div>
            </HTMLFlipBook>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {albumPages.flatMap((spread, spreadIndex) => [
              spread.left && (
                <MediaEditor
                  key={`${spreadIndex}-left`}
                  type={spread.left.type}
                  currentMedia={{
                    url: spread.left.url,
                    thumbnail: spread.left.thumbnail,
                    caption: spread.left.caption,
                    note: spread.left.note,
                  }}
                  onSave={(media) => handleMediaUpdate(spreadIndex, 'left', media)}
                  onDelete={() => handleMediaDelete(spreadIndex, 'left')}
                  isEditing={isEditing}
                  onClick={() => openModal(spread.left)}
                />
              ),
              spread.right && (
                <MediaEditor
                  key={`${spreadIndex}-right`}
                  type={spread.right.type}
                  currentMedia={{
                    url: spread.right.url,
                    thumbnail: spread.right.thumbnail,
                    caption: spread.right.caption,
                    note: spread.right.note,
                  }}
                  onSave={(media) => handleMediaUpdate(spreadIndex, 'right', media)}
                  onDelete={() => handleMediaDelete(spreadIndex, 'right')}
                  isEditing={isEditing}
                  onClick={() => openModal(spread.right)}
                />
              ),
            ])}
          </div>
        )}
        {showProtectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#fff5f5] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] p-6 rounded-lg shadow-xl max-w-sm w-full lace-overlay relative"
            >
              <button
                onClick={() => setShowProtectionModal(false)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-primary-700"
                aria-label="Close modal"
              >
                <Heart size={18} className="text-white" />
              </button>
              <div className="flex items-center gap-2 mb-4">
                <Heart size={24} className="text-primary-700" />
                <h2 className="text-xl font-display text-primary-700">Enter Password</h2>
              </div>
              <motion.input
                type="password"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full p-2 border rounded-lg mb-4 bg-white/80 text-primary-700"
                placeholder="Password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleProtectionSubmit(e.currentTarget.value);
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <motion.button
                  onClick={() => setShowProtectionModal(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-4 py-2 bg-primary-200 rounded-lg hover:bg-primary-300 glow lace-overlay text-primary-700"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => {
                    const input = document.querySelector('input[type="password"]') as HTMLInputElement;
                    handleProtectionSubmit(input.value);
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 glow lace-overlay"
                >
                  Submit
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
        <Modal isOpen={!!selectedMedia} onClose={closeModal} media={selectedMedia} />
      </div>
    </div>
  );
};

export default PhotoAlbum;