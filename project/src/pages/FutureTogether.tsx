import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const FutureMilestone = ({ year, title, description, image, align = 'left', index }) => {
  const isLeft = align === 'left';
  const ref = useRef(null);
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12 mb-24`}
    >
      <div className="md:w-1/2">
        <div className={`bg-white p-6 rounded-lg shadow-lg border-t-4 ${isLeft ? 'border-primary-500' : 'border-secondary-500'}`}>
          <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-3">
            {year}
          </span>
          <h3 className="text-2xl font-medium text-gray-800 mb-3">{title}</h3>
          <p className="text-gray-600 font-handwritten text-lg">{description}</p>
        </div>
      </div>
      
      <div className="md:w-1/2">
        <img 
          src={image} 
          alt={title} 
          className={`w-full h-64 md:h-80 object-cover rounded-lg shadow-md ${isLeft ? 'transform md:rotate-2' : 'transform md:-rotate-2'}`} 
        />
      </div>
    </motion.div>
  );
};

const FutureTogether = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.8, 1, 1, 0.8]);

  const futureMilestones = [
    {
      year: '2025 - Future',
      title: 'Our Dream Vacation',
      description: 'We finally take that trip to Switzerland we\'ve been planning. I can already picture us having a picnic by the mountains.',
      image: '/src/assets/places/Switzerland.jpg',
    },
    {
      year: '2026 - Future ',
      title: 'Our Cozy Home',
      description: 'Moving into our first home together. A small place with a garden where we can grow herbs and have Sunday brunches.',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      align: 'right'
    },
    {
      year: '2028  - Future ',
      title: 'Building Our Family',
      description: 'Welcoming a furry friend (or two) into our home. Maybe that golden retriever youve always wanted?',
      image: 'https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    },
    {
      year: '2030  - future ',
      title: 'Our Wedding Day',
      description: 'The day we officially promise forever to each other. A small ceremony with our closest friends and family, fairy lights, and lots of dancing.',
      image: 'https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      align: 'right'
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-secondary-50 to-primary-50">
      <motion.div 
        ref={containerRef}
        style={{ opacity, scale }}
        className="container mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <Sparkles className="inline-block text-secondary-500 mb-4" size={32} />
          <h1 className="text-3xl md:text-4xl font-display text-gray-800 mb-4">
            Our Future Together
          </h1>
          
          <p className="text-center text-gray-600 max-w-2xl mx-auto font-handwritten text-lg">
            A glimpse into the beautiful journey ahead of us, all the dreams we\'ll fulfill, and the memories we\'ll create.
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          {futureMilestones.map((milestone, index) => (
            <FutureMilestone
              key={index}
              year={milestone.year}
              title={milestone.title}
              description={milestone.description}
              image={milestone.image}
              align={milestone.align || 'left'}
              index={index}
            />
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center bg-white p-8 rounded-lg shadow-lg border-t-4 border-primary-500 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-medium text-gray-800 mb-4">And So Our Story Continues...</h3>
            <p className="text-gray-600 font-handwritten text-lg">
              This is just a glimpse of what our future holds. Every day with you brings new dreams and possibilities.
              I can\'t wait to create our story together, one beautiful moment at a time.
            </p>
            <div className="mt-6">
              <Sparkles className="inline-block text-primary-500" size={24} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default FutureTogether;