import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface PasswordProtectionProps {
  onUnlock: () => void;
  isProtected?: boolean;
}

const PasswordProtection = ({ onUnlock, isProtected = true }: PasswordProtectionProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const correctPassword = 'Aurum2728';

  useEffect(() => {
    // Check if already unlocked in this session
    const isUnlocked = sessionStorage.getItem('isUnlocked') === 'true';
    if (isUnlocked || !isProtected) {
      onUnlock();
    }
  }, [isProtected, onUnlock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      sessionStorage.setItem('isUnlocked', 'true');
      onUnlock();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
      >
        <div className="text-center mb-6">
          <Lock className="mx-auto text-primary-500 mb-2" size={32} />
          <h2 className="text-2xl font-medium text-gray-800">Protected Content</h2>
          <p className="text-gray-600 mt-2">Please enter the password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition"
          >
            Unlock
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PasswordProtection;