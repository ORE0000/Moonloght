import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Heart, BookOpen, Clock, MessageSquare, Film, Stars, Map, Sparkles, Lock } from 'lucide-react';

const featureCards = [
  { 
    to: '/album', 
    icon: <BookOpen className="text-primary-500" />, 
    title: 'Photo Album', 
    description: 'Flip through our memories together' 
  },
  { 
    to: '/timeline', 
    icon: <Clock className="text-primary-500" />, 
    title: 'Our Timeline', 
    description: 'The journey of our love story' 
  },
  { 
    to: '/kuttubot', 
    icon: <MessageSquare className="text-primary-500" />, 
    title: 'KuttuBot', 
    description: 'Chat with your digital companion' 
  },
  { 
    to: '/media', 
    icon: <Film className="text-primary-500" />, 
    title: 'Media Messages', 
    description: 'Watch and listen to my messages' 
  },
  { 
    to: '/starmap', 
    icon: <Stars className="text-primary-500" />, 
    title: 'Star Map', 
    description: 'The night sky of our special moment' 
  },
  { 
    to: '/places', 
    icon: <Map className="text-primary-500" />, 
    title: 'Places We\'ve Been', 
    description: 'Explore our favorite spots together' 
  },
  { 
    to: '/future', 
    icon: <Sparkles className="text-primary-500" />, 
    title: 'Our Future', 
    description: 'A glimpse into our journey ahead' 
  },
  { 
    to: '/secret', 
    icon: <Lock className="text-primary-500" />, 
    title: 'Secret Diary', 
    description: 'Unlock special memories with puzzles' 
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-scrapbook bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-100/70 to-secondary-100/70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, delay: 0.3 }}
              className="inline-block"
            >
              <Heart className="mx-auto text-primary-500 fill-primary-500 mb-6" size={48} />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-display text-gray-800 mb-6"
            >
              Dear <span className="text-primary-600 font-handwritten">Kuttu</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl md:text-2xl font-handwritten text-secondary-700 max-w-2xl mx-auto mb-8"
            >
              A digital scrapbook filled with memories, love, and everything that makes us special.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <NavLink
                to="/album"
                className="inline-block bg-primary-500 text-white px-8 py-3 rounded-full shadow-lg font-medium hover:bg-primary-600 transition transform hover:scale-105"
              >
                Start Exploring
              </NavLink>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-display text-center text-gray-800 mb-12"
          >
            Explore Our Love Journey
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink to={card.to} className="block">
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-lg p-6 shadow border border-gray-100 h-full transition"
                  >
                    <div className="mb-4">{card.icon}</div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </motion.div>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Love Note */}
      <section className="py-16 bg-gradient-to-r from-secondary-50 to-primary-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, rotate: -2 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg border-2 border-primary-200 transform rotate-1"
          >
            <h2 className="text-2xl font-handwritten text-primary-600 mb-4">My Dearest Kuttu,</h2>
            <p className="font-handwritten text-lg text-gray-700 mb-4">
              This digital scrapbook is a testament to our love, filled with memories we've created together.
              Each page is crafted with love, just like the moments we've shared.
            </p>
            <p className="font-handwritten text-lg text-gray-700 mb-6">
              I hope this brings a smile to your face, just like you bring to mine every day.
            </p>
            <p className="font-handwritten text-xl text-primary-600 text-right">
              Forever yours, Ashu ❤️
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;