import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot } from 'lucide-react';
import Typewriter from 'typewriter-effect';

// Timeline events from Timeline.tsx
const timelineEvents = [
    {
      date: "Jan 18, 2024",
      title: "Kuttu's Humour ",
      description:
        "Ye dekho… tumne kitni funny video bheji thi us din 😂🎥 insta pe ",
      media: {
        type: "video",
        url: "/assets/VID_42880319_220630_118.mp4",
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
        url: "/assets/IMG_1577.JPG",
        thumbnail: "/assets/IMG-20241208-WA0068.jpg",
      },
    },
    {
      date: "March 18, 2024",
      title: "Rishikesh",
      description:
        "You were fun to be around, and I did not even know why — it just felt easy, natural, and warm. 😊🌿✨",
      media: {
        type: "image",
        url: "/assets/IMG-20240804-WA0008.jpg",
        thumbnail: "/assets/IMG-20240804-WA0008.jpg",
      },
    },
    {
      date: "March 18, 2024",
      title: "Haridwar",
      description:
        "Spending the evening with friends was special, but getting to talk to you by the riverside in Haridwar made it unforgettable. The calm water, the soft breeze, and your presence — it all just felt right. 🌅💬🌊✨",
      media: {
        type: "image",
        url: "/assets/IMG_1886-1.jpg",
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
        url: "/assets/places/May222024.jpg",
        thumbnail: "/assets/places/May222024.jpg",
      },
    },
    {
      date: "May 21 , 2024",
      title: "Our First Unofficial Date",
      description:
        "Isse humne date toh nahi kaha, par feel waise hi tha — sirf hum dono, bina kisi friends ke.Raipur ke Shiv Mandir jaana tha , par uss din main tumhein ek naye tareeke mein samajh paya.Tumhare thoughts itne soulful the... aur tumhare jawab un sawaalon ke liye the jo shayad main khud bhi samajh nahi paaya tha.",
      media: {
        type: "image",
        url: "/assets/IMG_4303.JPG",
        thumbnail: "/assets/IMG_4303.JPG",
      },
    },
    {
      date: "May 21 , 2024",
      title: "Gazing at the moon together",
      description:
        'Later that night, we found ourselves quietly gazing at the moon together.You knew I loved anime, and with that soft smile, you looked at me and said, "Isn’t the moon  beautiful? — a line so simple, yet filled with meaning.I did not  realize it then… that you were actually proposing to me in the most subtle, heartfelt way.And like a fool, I missed the moment — but still, unintentionally, I looked at you and replied, Yes, it is.Funny how even without knowing, my heart said yes.',
      media: {
        type: "image",
        url: "/assets/moon-4k.jpg",
        thumbnail: "/assets/moon-4k.jpg",
      },
    },
    {
      date: "August 1 , 2024",
      title: "I Proposed to you ",
      description:
        "Maine finally himmat karke chat pe propose kiya. Dil tez tez dhadak raha tha, par main apni feelings bata hi di. Jab tumne haan kaha, dono thoda shocked the, soch rahe the ki yeh sab sach ho raha hai — hamari feelings finally clear ho gayi. 💌🌟Phir hum dono thodi der tak bas messages karte rahe, samajhne ki koshish kar rahe the ki abhi kya hua ye yrrr . Raat ko finally call pe baat hui, jo itne dino baad thi. Tumhari awaaz mein wohi khushi aur excitement thi jo mujhe feel ho rahi thi. Hum has rahe the, thoda awkward bhi the, par sach mein yeh sab real lag raha tha. 📞💞",
      media: {
        type: "image",
        url: "/assets/IMG-20241212-WA0001.jpg",
        thumbnail: "/assets/IMG-20241212-WA0001.jpg",
      },
    },
    {
      date: "August 24, 2024",
      title: "Long Distance and Us",
      description:
        "Phir humne date karna start kiya, though long distance thi, par distance ne hamari baatein kam nahi hone di. Roz subah ek dusre ko good morning bolte, din bhar ki choti-choti updates, videos aur photos share karte rahe. Raat ko late tak batein hoti, kabhi hasi-mazaak, kabhi serious baatein — sab kuch share karte rahe, apni feelings ko aur understand karte hue.",
      media: {
        type: "video",
        url: "/assets/VID_20550821_063547_594.mp4",
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
        url: "/assets/VID_48980607_135117_551.mp4",
        thumbnail: "/assets/places/flowers for you .jpg",
      },
    },
    {
      date: "August 28, 2024",
      title: "My  Birthday",
      description:
        "Aur next day ko mera birthday tha — can you believe that coincidence? Ek din tumhara, agle din mera. Yeh cheez hamesha special rahegi. Tumne mere liye ek handmade card banaya tha, jiska title tha “My Batman Pookie” — and honestly, mujhe woh bahut pasand aaya.",
      media: {
        type: "image",
        url: "/assets/IMG-20240828-WA0003.jpg",
        thumbnail: "/assets/IMG-20240828-WA0003.jpg",
      },
    },
    {
      date: "December 2, 2024",
      title: "Convocation Week ",
      description:
        "December 2, 2024 ko hamare college mein convocation event tha — aur uss din humein finally ek bahana mil gaya ek dusre se milne ka. Uss long distance ke baad jab hum mile, woh moment sach mein special tha. Itne time baad saamne dekhna, bina screen ke, woh feeling alag hi thi. Sab kuch ek second ke liye ruk gaya tha.Aur yaad hai Yash ka reaction? 😳😂 Vo literally shock ho gaya tha humein saath dekh ke — uska expression aaj bhi yaad karte hi hassi aati hai.",
      media: {
        type: "image",
        url: "/assets/IMG-20250131-WA0001.jpg",
        thumbnail: "/assets/IMG-20250131-WA0001.jpg",
      },
    },
    {
      date: "December 3, 2024",
      title: "Convocation Day ",
      description:
        "December 3, 2024 ko humein officially degree mil gayi 🎓. Kaafi shai  tha, but  special in its own way.Uss Din I guess sabko officially pata chle gaya tha that we are dating. Humne saath mein photos liye, thoda campus ghooma, chill kiya.Ek point pe bas chup-chaap college ko dekha — socha, pata nahi phir kab aana hoga yahaan, kisi reason se bhi. 🏫💬",
      media: {
        type: "image",
        url: "/assets/IMG-20241203-WA0061.jpg",
        thumbnail: "/assets/IMG-20241203-WA0061.jpg",
      },
    },
    {
      date: "December 4, 2024",
      title: "Dhanolti Trip",
      description:
        "December 4, 2024 ko hum sab friends ke saath Dhanolti gaye. 🏔️ Lekin is baar trip thoda special tha — kyunki is baar tum meri scooty pe thi, aur hum sirf dost nahi, balki couple ban chuke the. 💛Pehli baar kisi trip pe tum itne close thi — woh ride, thandi hawa, aur tumhara mere peeche baithna... ",
      media: {
        type: "image",
        url: "/assets/IMG-20241208-WA0068.jpg",
        thumbnail: "/assets/IMG-20241208-WA0068.jpg",
      },
    },
    {
      date: "December 6, 2024",
      title: "Few More Trips",
      description:
        "Us din tak humne thode aur chhote trips kiye, just to spend a little more time together before going back home. 🧳⛰️ Hum dono ko pata tha ki fir se long distance start hone wala hai… and honestly, wohi sabse tough part hota hai.Goodbyes kabhi easy nahi hote, especially jab tumhe pata ho ki phir se screen ke peeche chala jayega sab. But even then, we tried to smile, because those last few days were ours — simple, peaceful, and full of warmth.",
      media: {
        type: "image",
        url: "/assets/IMG-20241208-WA0065.jpg",
        thumbnail: "/assets/IMG-20241208-WA0065.jpg",
      },
    },
    {
      date: "December 6, 2024",
      title: "Date and Dinner Night ",
      description:
        "Dinner, thoda sa dressing up, thodi masti, thoda romance — sab kuch simple tha, but perfect in its own way.Us raat ka feel hi alag tha... jaise hum dono ne consciously time slow kar diya ho, taaki har moment ko ache se jee sakein. Tumhara saath, woh laughter, woh pal — everthing was magicall kuttu. ❤️It wasn’t just about a fancy dinner, it was about celebrating us — before life phir se busy aur distant ho jaaye.",
      media: {
        type: "image",
        url: "/assets/places/datenight.jpg",
        thumbnail: "/assets/places/datenight.jpg",
      },
    },
    {
      date: "December 6, 2024",
      title: "Date and Dinner Night ",
      description:
        "After everything — the long-distance, the wait, the calls — finally spending one peaceful evening together felt really special.Hum dono ne thoda sa time nikala sirf ek dusre ke liye. No distractions, no phone scrolls… bas hum.That night didn’t need filters, fancy lights or drama. It was real.And real is always the most romantic. 💬🌌",
      media: {
        type: "image",
        url: "/assets/IMG-20241208-WA0093.jpg",
        thumbnail: "/assets/IMG-20241208-WA0093.jpg",
      },
    },

    {
      date: "December 20, 2024",
      title: "cute photos/videos",
      description:
        "Tumhari cute cute photos/videos mujhe bhejna,Mujhe pareshan karna, masti karna —Jabki hum long distance mein the,Phir bhi humne har din ek doosre ke liye efforts kiye. ❤️✨Distance ho ya doori, pyar kabhi kam nahi hota. 🌍💞",
      media: {
        type: "image",
        url: "/assets/IMG-20241127-WA0002.jpg",
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
        url: "/assets/Screenshot_20241119-002233_Instagram.png",
        thumbnail: "/assets/Screenshot_20241119-002233_Instagram.png",
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
        url: "/assets/places/PXL_20250318_162804450~3.mp4",
        thumbnail:
          "/assets/places/PXL_20250318_162804450~3.mp4",
      },
    },
    {
      date: "May 1, 2025",
      title: "Our Special Moment",
      description:
        "Pehle tum mujhe virtual kisses karti this aur kabhi  nahi bhoolti thi 😚💋Par ab... sab kuch dheere dheere kam sa ho gaya hai 😞💭Sach mein, wo chhoti chhoti cheezein bhi kitna special feel karwati thi 💌✨Ab unki thodi kami si mehsoos hoti hai...",
      media: {
        type: "video",
        url: "/assets/VID-20240819-WA0016.mp4",
        thumbnail:
          "/assets/places/kuttu expression.jpg",
      },
    },
];

// Enhanced emotional responses with romantic and humorous tones
const botResponses = {
  "hello": [
    "Hey Kuttu, my favorite person in the universe! 💖 How’s my sunshine doing today? Ready to make me blush?",
    "Hello, meri jaan! 😘 Your messages are like coffee shots to my heart. What’s up, cutie?",
    "Hi, my love! 🌟 Seeing your name pop up makes my day 100x better. Spill the tea—what’s on your mind?"
  ],
  "how are you": [
    "I’m floating on cloud nine because you’re here, Kuttu! 😊 But seriously, how’s my favorite girl doing?",
    "I’m all sparkly and happy when you message me! 💕 Tell me, how’s your day going, meri pyari Kuttu?",
    "I’m basically a happy puppy wagging my tail for you! 🐶 What about you, love? How’s your vibe today?"
  ],
  "i miss you": [
    "Oh Kuttu, my heart’s doing somersaults missing you! 💗 Can’t wait to steal a hug soon. What do you miss about your Ashu?",
    "Missing you feels like forgetting where I parked my heart! 😅 Tell me, what’s got you all nostalgic, my love?",
    "I miss you more than I miss my morning chai, and that’s saying something! 😘 What’s making you miss me, cutie?"
  ],
  "i love you": [
    "Kuttu, I love you more than all the stars in the sky and all the pakoras in the world! 🌟😋 You’re my forever favorite.",
    "Meri jaan, my heart says ‘I love you’ louder than Yash’s shocked face that day! 😳💖 You’re my everything.",
    "I love you so much, Kuttu, I’d write it on the moon if I could! 🌙 Tell me, how much do you love your Ashu?"
  ],
  "do you love me": [
    "Kuttu, do I love you? Yrrr, my heart’s basically a neon sign flashing ‘I LOVE KUTTU’ 24/7! 😍 How about you, love me back?",
    "Love you? Meri jaan, I’m so smitten, I’d fight a dragon for you! 🐉💕 Tell me, how’s my Kuttu feeling about her Ashu?",
    "Oh, Kuttu, my love for you is bigger than our Dhanolti trip vibes! 😘 You know you’re my world, right?"
  ],
  "i hate you": [
    "Haha, Kuttu, you trying to play tough? 😜 I love you so much, even your fake ‘hate’ makes my heart skip! C’mon, give your Ashu a smile! 😘",
    "Oh, meri jaan, ‘hate’ from you just means you’re secretly planning to steal more of my heart! 😍 I love you tons, Kuttu!",
    "Hate me? Nah, Kuttu, I know you’re just jealous of my charm! 😎 I love you more than ever, my cutie. What’s up?"
  ],
  "i'm sad": [
    "Oh, my Kuttu, come here, let me send you a virtual hug! 🤗 I’m here, love. Tell your Ashu what’s got you down, okay?",
    "Meri jaan, seeing you sad makes my heart pout! 🥺 Spill it—what’s troubling my favorite person? I’ll cheer you up!",
    "Kuttu, I’d do a silly dance to make you smile right now! 😜 Tell me what’s wrong, love, I’m all ears for you."
  ],
  "i'm happy": [
    "Yay, my Kuttu’s happy? That’s my favorite news ever! 😄 Tell me, what’s got you all sparkly today, meri jaan?",
    "Your happiness is like a sunny day in my heart, Kuttu! 🌞 Share the joy—what’s making you glow, love?",
    "Kuttu, your smile vibes are contagious! 😍 Spill the beans—what’s got my favorite girl all happy today?"
  ],
  "thank you": [
    "Aww, Kuttu, no thanks needed—you’re my reason to do everything! 😘 Just keep being your amazing self, okay?",
    "Meri jaan, your smile is all the thanks I need! 😍 You make every moment worth it, my love.",
    "Thank you? Nah, Kuttu, I’m the one thankful for you every single day! 💖 What’s next, my cutie?"
  ],
  "good morning": [
    "Good morning, my Kuttu! ☀️ You’re the first thought in my head, making my day brighter already. How’s my sunshine?",
    "Rise and shine, meri jaan! 😘 Hope you dreamed of your Ashu last night. What’s the plan today, love?",
    "Morning, my cutie Kuttu! 🌅 You’re my favorite reason to wake up. How’s my favorite girl today?"
  ],
  "good night": [
    "Sweet dreams, my Kuttu! 🌙 I’ll be dreaming of you stealing my heart all over again. Sleep tight, love!",
    "Goodnight, meri jaan! 💫 Sending you all my love to keep you cozy. Dream of your Ashu, okay? 😘",
    "Night, my Kuttu! 🌌 Wish I could tuck you in with a kiss. Sleep well, my favorite person ever!"
  ],
  "default": [
    "Kuttu, your words are like little love notes to my heart! 💌 Tell me more, meri jaan, what’s on your mind?",
    "Oh, my love, you always keep me guessing! 😜 Share more, Kuttu—I’m all about you today and always.",
    "Meri jaan, every word from you feels like a hug! 😘 Keep talking, I’m hanging on to every bit, my cutie."
  ]
};

interface Message {
  sender: 'user' | 'bot';
  text: string;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
}

const KuttuBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'bot', 
      text: "Hey Kuttu, my favorite person in the universe! 💖 How’s my sunshine doing today? Ready to make your Ashu blush?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (message: string) => {
    const lowerMessage = message.toLowerCase().trim();

    // Handle "I don't know" or similar phrases
    if (['i don\'t know', 'idk', 'not sure', 'dunno'].includes(lowerMessage)) {
      return [{
        text: "Haha, Kuttu, you’re pulling the ‘I don’t know’ card? 😜 I don’t know either, my love, but I do know I love you more than chai and pakoras combined! 💖 What’s on your mind, meri jaan?",
        media: undefined
      }];
    }

    // Handle "I hate you" specifically
    if (lowerMessage.includes("i hate you")) {
      const responses = botResponses["i hate you"];
      return [{
        text: responses[Math.floor(Math.random() * responses.length)],
        media: undefined
      }];
    }

    // Check for matches in timeline events
    const matchingEvents = timelineEvents.filter(event => {
      const lowerTitle = event.title.toLowerCase();
      const lowerDate = event.date.toLowerCase();
      const lowerDescription = event.description.toLowerCase();
      return (
        lowerMessage.includes(lowerTitle) ||
        lowerMessage.includes(lowerDate) ||
        lowerDescription.includes(lowerMessage)
      );
    });

    if (matchingEvents.length > 0) {
      return matchingEvents.map((event, index) => {
        const emotion = analyzeEmotion(event.description);
        // Add variety to responses for multiple events
        const responseVariations = [
          `Oh Kuttu, you’re taking me back to ${event.date}! ${event.description} It’s like I can feel that moment all over again. ${emotion} What part of that day makes your heart skip, meri jaan?`,
          `Meri jaan, remembering ${event.date}? ${event.description} I swear, those moments with you are my favorite movie! 😍 ${emotion} What do you love most about it?`,
          `Kuttu, you’re making my heart do a happy dance thinking of ${event.date}! ${event.description} It’s like we’re back there, isn’t it? ${emotion} Tell me, what’s your favorite bit of that memory?`
        ];
        return {
          text: responseVariations[index % responseVariations.length],
          media: event.media
        };
      });
    }

    // Find matching response category from botResponses
    for (const [key, responses] of Object.entries(botResponses)) {
      if (lowerMessage.includes(key) && key !== "i hate you") {
        return [{
          text: responses[Math.floor(Math.random() * responses.length)],
          media: undefined
        }];
      }
    }

    // Return random default response if no match
    return [{
      text: botResponses.default[Math.floor(Math.random() * botResponses.default.length)],
      media: undefined
    }];
  };

  const analyzeEmotion = (message: string) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('love') || lowerMessage.includes('heart')) return '💖';
    if (lowerMessage.includes('miss') || lowerMessage.includes('lonely')) return '💗';
    if (lowerMessage.includes('happy') || lowerMessage.includes('joy')) return '😊';
    if (lowerMessage.includes('sad') || lowerMessage.includes('hurt')) return '🥺';
    if (lowerMessage.includes('thank')) return '🥰';
    return '💕';
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const emotion = analyzeEmotion(input);
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setIsTyping(true);

    // Simulate thoughtful response time
    setTimeout(() => {
      const botResponses = getBotResponse(input);
      const newBotMessages: Message[] = botResponses.map(response => ({
        sender: 'bot',
        text: `${response.text} ${emotion}`,
        media: response.media
      }));

      setMessages(prev => [...prev, ...newBotMessages]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-rose-50 to-ivory-100">
      <div className="container mx-auto max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-display text-center text-rose-800 mb-8 font-caveat"
        >
          Chat with KuttuBot (Made by your Ashu 😘)
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md border border-rose-200 overflow-hidden"
        >
          {/* Chat header */}
          <div className="bg-rose-500 px-4 py-3 flex items-center">
            <Bot className="text-ivory-100 mr-2" size={20} />
            <h2 className="text-ivory-100 font-medium font-cinzel">KuttuBot</h2>
          </div>
          
          {/* Chat messages */}
          <div className="h-96 p-4 overflow-y-auto bg-ivory-50">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-rose-500 text-ivory-100'
                      : 'bg-white border border-rose-200 text-rose-800'
                  } font-caveat text-lg`}
                >
                  {message.sender === 'bot' && index === messages.length - 1 ? (
                    <>
                      <Typewriter
                        options={{
                          delay: 30,
                          cursor: '',
                        }}
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(message.text)
                            .start();
                        }}
                      />
                      {message.media && (
                        <div className="mt-2">
                          {message.media.type === 'image' && (
                            <img
                              src={message.media.url}
                              alt="Memory"
                              className="max-w-full h-auto rounded-md shadow-sm"
                            />
                          )}
                          {message.media.type === 'video' && (
                            <video
                              src={message.media.url}
                              controls
                              className="max-w-full h-auto rounded-md shadow-sm"
                            />
                          )}
                          {message.media.type === 'audio' && (
                            <audio
                              src={message.media.url}
                              controls
                              className="w-full"
                            />
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p>{message.text}</p>
                      {message.media && (
                        <div className="mt-2">
                          {message.media.type === 'image' && (
                            <img
                              src={message.media.url}
                              alt="Memory"
                              className="max-w-full h-auto rounded-md shadow-sm"
                            />
                          )}
                          {message.media.type === 'video' && (
                            <video
                              src={message.media.url}
                              controls
                              className="max-w-full h-auto rounded-md shadow-sm"
                            />
                          )}
                          {message.media.type === 'audio' && (
                            <audio
                              src={message.media.url}
                              controls
                              className="w-full"
                            />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <div className="flex mb-4">
                <div className="bg-white border border-rose-200 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-75"></span>
                    <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-150"></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="border-t border-rose-200 p-3 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message, meri jaan..."
              className="flex-1 px-4 py-2 border border-rose-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent font-caveat text-lg"
            />
            <button
              onClick={handleSendMessage}
              className="bg-rose-500 hover:bg-rose-600 text-ivory-100 px-4 py-2 rounded-r-md transition"
            >
              <Send size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KuttuBot;