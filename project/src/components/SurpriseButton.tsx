import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

interface SurpriseButtonProps {
  onTrigger: () => void;
}

const SurpriseButton = ({ onTrigger }: SurpriseButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onTrigger}
      className="p-2 sm:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
      aria-label="Surprise message"
    >
      <motion.div
        animate={{
          rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0,
        }}
        transition={{ duration: 0.6 }}
      >
        <Gift size={18} className="text-teal-600 sm:size-[18px] size-[20px]" />
      </motion.div>
    </motion.button>
  );
};

export default SurpriseButton;