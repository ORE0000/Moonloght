import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Play, Pause, Volume2, X } from "lucide-react";
import PasswordProtection from "../components/PasswordProtection";

interface TimelineEventProps {
  date: string;
  title: string;
  description: string;
  media: { type: string; url: string; thumbnail?: string };
  align?: "left" | "right";
  delay?: number;
  onMediaClick: (event: {
    date: string;
    title: string;
    description: string;
    media: { type: string; url: string; thumbnail?: string };
  }) => void;
}

const TimelineEvent = ({
  date,
  title,
  description,
  media,
  align = "left",
  delay = 0,
  onMediaClick,
}: TimelineEventProps) => {
  const isLeft = align === "left";

  return (
    <div className="relative mb-12 md:mb-16">
      {/* Timeline center line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200 md:block hidden"></div>

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="absolute left-1/2 top-10 transform -translate-x-1/2 w-5 h-5 rounded-full bg-primary-500 border-4 border-white shadow-md z-10 md:block hidden"
      ></motion.div>

      {/* Content */}
      <div
        className={`flex flex-col md:flex-row items-center justify-center ${
          isLeft ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay, duration: 0.7 }}
          className="w-full md:w-5/12 relative z-10"
        >
          <div
            className={`bg-white p-6 rounded-lg shadow-lg border border-gray-100 transform ${
              isLeft ? "md:-rotate-2 md:mr-8" : "md:rotate-2 md:ml-8"
            } bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] m-4 md:m-0`}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-3">
              {date}
            </span>
            <h3 className="text-xl font-medium text-gray-800 mb-2 font-handwritten">
              {title}
            </h3>
            <p className="text-gray-600 font-sans">{description}</p>
            {/* Washi tape accent */}
            <div className="absolute -top-2 -left-2 w-16 h-3 bg-primary-300 rotate-45 opacity-70"></div>
          </div>
        </motion.div>

        <div className="w-full md:w-2/12 md:block hidden">
          {/* Empty space for the timeline */}
        </div>

        <motion.div
          initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, duration: 0.7 }}
          className="w-full md:w-5/12 relative z-10"
        >
          <div
            className={`bg-white p-4 rounded-lg shadow-lg transform ${
              isLeft ? "md:rotate-2 md:ml-8" : "md:-rotate-2 md:mr-8"
            } m-4 md:m-0 cursor-pointer`}
            onClick={() => onMediaClick({ date, title, description, media })}
          >
            {media.type === "video" ? (
              <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                <video
                  src={media.url}
                  poster={media.thumbnail}
                  muted
                  autoPlay={false}
                  className="w-full h-full object-cover pointer-events-none"
                  onError={() => console.error("Video load error:", media.url)}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button
                    className="w-10 h-10 rounded-full bg-primary-300 flex items-center justify-center hover:bg-primary-400 transition focus:outline-none focus:ring-2 focus:ring-primary-300"
                    aria-label="Open video"
                  >
                    <Play className="text-white ml-1" size={20} />
                  </button>
                </div>
                {/* Polaroid frame */}
                <div className="absolute inset-0 border-8 border-white shadow-md"></div>
              </div>
            ) : (
              <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={media.url}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                {/* Polaroid frame */}
                <div className="absolute inset-0 border-8 border-white shadow-md"></div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Modal = ({
  isOpen,
  onClose,
  event,
}: {
  isOpen: boolean;
  onClose: () => void;
  event: {
    date: string;
    title: string;
    description: string;
    media: { type: string; url: string; thumbnail?: string };
  } | null;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudioPlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((e) => console.error("Audio playback error:", e));
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

  if (!isOpen || !event) return null;

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
          className="bg-white rounded-lg max-w-lg w-full p-6 relative bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] border-8 border-white shadow-lg transform rotate-1"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Washi tape accent */}
          <div className="absolute -top-2 -left-2 w-16 h-3 bg-primary-300 rotate-45 opacity-70"></div>
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
            {event.media.type === "video" ? (
              <video
                key={event.media.url}
                src={event.media.url}
                poster={event.media.thumbnail}
                controls
                playsInline
                autoPlay={false}
                muted
                className="w-full h-full object-contain"
                onError={() =>
                  console.error("Video load error:", event.media.url)
                }
              >
                <p>Your browser does not support this video format.</p>
              </video>
            ) : event.media.type === "audio" ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 p-4">
                <img
                  src={
                    event.media.thumbnail ||
                    "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
                  }
                  alt={event.title}
                  className="w-32 h-32 object-cover rounded-full mb-4 border-2 border-primary-300"
                />
                <audio
                  ref={audioRef}
                  src={event.media.url}
                  controls
                  className="w-full"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={() =>
                    console.error("Audio load error:", event.media.url)
                  }
                />
                <button
                  onClick={toggleAudioPlay}
                  className="mt-4 w-12 h-12 rounded-full bg-primary-300 flex items-center justify-center hover:bg-primary-400 transition"
                  aria-label={isPlaying ? "Pause audio" : "Play audio"}
                >
                  {isPlaying ? (
                    <Pause className="text-white" size={24} />
                  ) : (
                    <Play className="text-white ml-1" size={24} />
                  )}
                </button>
              </div>
            ) : (
              <img
                src={event.media.url}
                alt={event.title}
                className="w-full h-full object-contain"
                onError={() =>
                  console.error("Image load error:", event.media.url)
                }
              />
            )}
          </div>

          {/* Event details */}
          <div className="text-center bg-white/80 rounded-md p-4">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-3">
              {event.date}
            </span>
            <h3 className="text-xl font-medium text-gray-800 mb-2 font-handwritten">
              {event.title}
            </h3>
            <p className="text-gray-600 font-sans">{event.description}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Timeline = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    date: string;
    title: string;
    description: string;
    media: { type: string; url: string; thumbnail?: string };
  } | null>(null);

  const [timelineEvents] = useState([
    {
      date: "Jan 18, 2024",
      title: "Kuttu's Humour ",
      description:
        "Ye dekho… tumne kitni funny video bheji thi us din 😂🎥 insta pe ",
      media: {
        type: "video",
        url: "../assets/VID_42880319_220630_118.mp4",
        thumbnail:
          "https://images.pexels.com/photos/1033729/pexels-photo-1033729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      },
    },
    {
      date: "March 18, 2024",
      title: "Rishikesh",
      description:
        "Our second trip together,laughter, memories, and moments we did not  realize would mean so much later. A mutual bond slowly turning into something more. 💖",
      media: {
        type: "image",
        url: "../assets/IMG_1577.JPG",
        thumbnail: "../assets/IMG-20241208-WA0068.jpg",
      },
    },
    {
      date: "March 18, 2024",
      title: "Rishikesh",
      description:
        "You were fun to be around, and I did not even know why — it just felt easy, natural, and warm. 😊🌿✨",
      media: {
        type: "image",
        url: "../assets/IMG-20240804-WA0008.jpg",
        thumbnail: "../assets/IMG-20240804-WA0008.jpg",
      },
    },
    {
      date: "March 18, 2024",
      title: "Haridwar",
      description:
        "Spending the evening with friends was special, but getting to talk to you by the riverside in Haridwar made it unforgettable. The calm water, the soft breeze, and your presence — it all just felt right. 🌅💬🌊✨",
      media: {
        type: "image",
        url: "../assets/IMG_1886-1.jpg",
        thumbnail: "",
      },
    },
    {
      date: "May 11 , 2024",
      title: "Kempt Falls",
      description:
        "We went to Kempt Falls with all our friends, but it wasn’t just the place that made it special. We shared little adventures, laughs, and moments that brought us closer in the most unexpected ways.",
      media: {
        type: "image",
        url: "../assets/places/May222024.jpg",
        thumbnail: "../assets/places/May222024.jpg",
      },
    },
    {
      date: "May 21 , 2024",
      title: "Our First Unofficial Date",
      description:
        "Isse humne date toh nahi kaha, par feel waise hi tha — sirf hum dono, bina kisi friends ke.Raipur ke Shiv Mandir jaana tha , par uss din main tumhein ek naye tareeke mein samajh paya.Tumhare thoughts itne soulful the... aur tumhare jawab un sawaalon ke liye the jo shayad main khud bhi samajh nahi paaya tha.",
      media: {
        type: "image",
        url: "../assets/IMG_4303.JPG",
        thumbnail: "../assets/IMG_4303.JPG",
      },
    },
    {
      date: "May 21 , 2024",
      title: "Gazing at the moon together",
      description:
        'Later that night, we found ourselves quietly gazing at the moon together.You knew I loved anime, and with that soft smile, you looked at me and said, "Isn’t the moon  beautiful? — a line so simple, yet filled with meaning.I did not  realize it then… that you were actually proposing to me in the most subtle, heartfelt way.And like a fool, I missed the moment — but still, unintentionally, I looked at you and replied, Yes, it is.Funny how even without knowing, my heart said yes.',
      media: {
        type: "image",
        url: "../assets/moon-4k.jpg",
        thumbnail: "../assets/moon-4k.jpg",
      },
    },
    {
      date: "August 1 , 2024",
      title: "I Proposed to you ",
      description:
        "Maine finally himmat karke chat pe propose kiya. Dil tez tez dhadak raha tha, par main apni feelings bata hi di. Jab tumne haan kaha, dono thoda shocked the, soch rahe the ki yeh sab sach ho raha hai — hamari feelings finally clear ho gayi. 💌🌟Phir hum dono thodi der tak bas messages karte rahe, samajhne ki koshish kar rahe the ki abhi kya hua ye yrrr . Raat ko finally call pe baat hui, jo itne dino baad thi. Tumhari awaaz mein wohi khushi aur excitement thi jo mujhe feel ho rahi thi. Hum has rahe the, thoda awkward bhi the, par sach mein yeh sab real lag raha tha. 📞💞",
      media: {
        type: "image",
        url: "../assets/IMG-20241212-WA0001.jpg",
        thumbnail: "../assets/IMG-20241212-WA0001.jpg",
      },
    },
    {
      date: "August 24, 2024",
      title: "Long Distance and Us",
      description:
        "Phir humne date karna start kiya, though long distance thi, par distance ne hamari baatein kam nahi hone di. Roz subah ek dusre ko good morning bolte, din bhar ki choti-choti updates, videos aur photos share karte rahe. Raat ko late tak batein hoti, kabhi hasi-mazaak, kabhi serious baatein — sab kuch share karte rahe, apni feelings ko aur understand karte hue.",
      media: {
        type: "video",
        url: "../assets/VID_20550821_063547_594.mp4",
        thumbnail:
          "https://images.pexels.com/photos/1033729/pexels-photo-1033729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      },
    },
    {
      date: "August 27, 2024",
      title: "Kuttu's Birthday",
      description:
        'Aur phir August 27, 2024 — tumhara birthday tha. Hum abhi bhi long distance mein .Din mein maine kuch phool tod ke ek chhoti si video banayi — simple si, bas isliye because i missed you . Caption diya tha: “Not the flowers you like, but by the man you love".Thoda corny hai shayad ye line ',
      media: {
        type: "video",
        url: "../assets/VID_48980607_135117_551.mp4",
        thumbnail: "../assets/places/flowers for you .jpg",
      },
    },
    {
      date: "August 28, 2024",
      title: "My  Birthday",
      description:
        "Aur next day ko mera birthday tha — can you believe that coincidence? Ek din tumhara, agle din mera. Yeh cheez hamesha special rahegi. Tumne mere liye ek handmade card banaya tha, jiska title tha “My Batman Pookie” — and honestly, mujhe woh bahut pasand aaya.",
      media: {
        type: "image",
        url: "../assets/IMG-20240828-WA0003.jpg",
        thumbnail: "../assets/IMG-20240828-WA0003.jpg",
      },
    },
    {
      date: "December 2, 2024",
      title: "Convocation Week ",
      description:
        "December 2, 2024 ko hamare college mein convocation event tha — aur uss din humein finally ek bahana mil gaya ek dusre se milne ka. Uss long distance ke baad jab hum mile, woh moment sach mein special tha. Itne time baad saamne dekhna, bina screen ke, woh feeling alag hi thi. Sab kuch ek second ke liye ruk gaya tha.Aur yaad hai Yash ka reaction? 😳😂 Vo literally shock ho gaya tha humein saath dekh ke — uska expression aaj bhi yaad karte hi hassi aati hai.",
      media: {
        type: "image",
        url: "../assets/IMG-20250131-WA0001.jpg",
        thumbnail: "../assets/IMG-20250131-WA0001.jpg",
      },
    },
    {
      date: "December 3, 2024",
      title: "Convocation Day ",
      description:
        "December 3, 2024 ko humein officially degree mil gayi 🎓. Kaafi shai  tha, but  special in its own way.Uss Din I guess sabko officially pata chle gaya tha that we are dating. Humne saath mein photos liye, thoda campus ghooma, chill kiya.Ek point pe bas chup-chaap college ko dekha — socha, pata nahi phir kab aana hoga yahaan, kisi reason se bhi. 🏫💬",
      media: {
        type: "image",
        url: "../assets/IMG-20241203-WA0061.jpg",
        thumbnail: "../assets/IMG-20241203-WA0061.jpg",
      },
    },
    {
      date: "December 4, 2024",
      title: "Dhanolti Trip",
      description:
        "December 4, 2024 ko hum sab friends ke saath Dhanolti gaye. 🏔️ Lekin is baar trip thoda special tha — kyunki is baar tum meri scooty pe thi, aur hum sirf dost nahi, balki couple ban chuke the. 💛Pehli baar kisi trip pe tum itne close thi — woh ride, thandi hawa, aur tumhara mere peeche baithna... ",
      media: {
        type: "image",
        url: "../assets/IMG-20241208-WA0068.jpg",
        thumbnail: "../assets/IMG-20241208-WA0068.jpg",
      },
    },
    {
      date: "December 6, 2024",
      title: "Few More Trips",
      description:
        "Us din tak humne thode aur chhote trips kiye, just to spend a little more time together before going back home. 🧳⛰️ Hum dono ko pata tha ki fir se long distance start hone wala hai… and honestly, wohi sabse tough part hota hai.Goodbyes kabhi easy nahi hote, especially jab tumhe pata ho ki phir se screen ke peeche chala jayega sab. But even then, we tried to smile, because those last few days were ours — simple, peaceful, and full of warmth.",
      media: {
        type: "image",
        url: "../assets/IMG-20241208-WA0065.jpg",
        thumbnail: "../assets/IMG-20241208-WA0065.jpg",
      },
    },
    {
      date: "December 6, 2024",
      title: "Date and Dinner Night ",
      description:
        "Dinner, thoda sa dressing up, thodi masti, thoda romance — sab kuch simple tha, but perfect in its own way.Us raat ka feel hi alag tha... jaise hum dono ne consciously time slow kar diya ho, taaki har moment ko ache se jee sakein. Tumhara saath, woh laughter, woh pal — everthing was magicall kuttu. ❤️It wasn’t just about a fancy dinner, it was about celebrating us — before life phir se busy aur distant ho jaaye.",
      media: {
        type: "image",
        url: "../assets/places/datenight.jpg",
        thumbnail: "../assets/places/datenight.jpg",
      },
    },
    {
      date: "December 6, 2024",
      title: "Date and Dinner Night ",
      description:
        "After everything — the long-distance, the wait, the calls — finally spending one peaceful evening together felt really special.Hum dono ne thoda sa time nikala sirf ek dusre ke liye. No distractions, no phone scrolls… bas hum.That night didn’t need filters, fancy lights or drama. It was real.And real is always the most romantic. 💬🌌",
      media: {
        type: "image",
        url: "../assets/IMG-20241208-WA0093.jpg",
        thumbnail: "../assets/IMG-20241208-WA0093.jpg",
      },
    },

    {
      date: "December 20, 2024",
      title: "cute photos/videos",
      description:
        "Tumhari cute cute photos/videos mujhe bhejna,Mujhe pareshan karna, masti karna —Jabki hum long distance mein the,Phir bhi humne har din ek doosre ke liye efforts kiye. ❤️✨Distance ho ya doori, pyar kabhi kam nahi hota. 🌍💞",
      media: {
        type: "image",
        url: "../assets/IMG-20241127-WA0002.jpg",
        thumbnail: "",
      },
    },
    {
      date: "January 20, 2025",
      title: "New Year’s Promise",
      description:
        "Tumhara video call pe mujhse baat karte karte so jaana 😴📱Aur fir neend mein kuch na kuch cute sa bolna 💬Yrrrrr… kitni pyaari lagti ho tum uss waqt, kasam se! 💖😚",
      media: {
        type: "image",
        url: "../assets/Screenshot_20241119-002233_Instagram.png",
        thumbnail: "../assets/Screenshot_20241119-002233_Instagram.png",
      },
    },
    {
      date: "Feb 10, 2025",
      title: "Whispered Promises",
      description:
        "A quiet night where words became our forever, etched in the stars above.",
      media: {
        type: "audio",
        url: "https://example.com/audio.mp3",
        thumbnail:
          "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      },
    },
    {
      date: "May 1, 2025",
      title: "Our Special Moment",
      description:
        "That day we captured forever in motion, a memory that makes my heart race every time.",
      media: {
        type: "video",
        url: "../assets/places/PXL_20250318_162804450~3.mp4",
        thumbnail:
          "../assets/places/PXL_20250318_162804450~3.mp4",
      },
    },
    {
      date: "May 1, 2025",
      title: "Our Special Moment",
      description:
        "Pehle tum mujhe virtual kisses karti this aur kabhi  nahi bhoolti thi 😚💋Par ab... sab kuch dheere dheere kam sa ho gaya hai 😞💭Sach mein, wo chhoti chhoti cheezein bhi kitna special feel karwati thi 💌✨Ab unki thodi kami si mehsoos hoti hai...",
      media: {
        type: "video",
        url: "../assets/VID-20240819-WA0016.mp4",
        thumbnail:
          "../assets/places/kuttu expression.jpg",
      },
    },
  ]);

  const handleUnlock = () => {
    setIsEditing(true);
  };

  const handleMediaClick = (event: {
    date: string;
    title: string;
    description: string;
    media: { type: string; url: string; thumbnail?: string };
  }) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-[url('https://www.transparenttextures.com/patterns/cork-board.png')] bg-cover bg-center">
      <div className="container mx-auto max-w-5xl relative">
        {/* Pinned note title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white p-6 rounded-lg shadow-lg border border-gray-100 text-center mb-12 transform -rotate-1 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"
        >
          <h1 className="text-3xl md:text-4xl font-handwritten text-gray-800">
            Our Love Timeline
          </h1>
          {/* Pushpin effect */}
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-red-500 rounded-full shadow-md"></div>
        </motion.div>

        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition font-handwritten text-gray-800"
          >
            <Edit2 size={18} />
            <span>Customize Our Story</span>
          </button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 max-w-2xl mx-auto mb-12 font-handwritten text-lg bg-white p-4 rounded-lg shadow-sm border border-gray-100 transform rotate-1"
        >
          A scrapbook of our cherished moments, woven together with love and
          memories.
        </motion.p>

        <div className="relative pb-12">
          {timelineEvents.map((event, index) => (
            <TimelineEvent
              key={index}
              {...event}
              align={index % 2 === 0 ? "left" : "right"}
              delay={index * 0.1}
              onMediaClick={handleMediaClick}
            />
          ))}
        </div>

        {isEditing && <PasswordProtection onUnlock={handleUnlock} />}
        <Modal
          isOpen={!!selectedEvent}
          onClose={closeModal}
          event={selectedEvent}
        />
      </div>
    </div>
  );
};

export default Timeline;
