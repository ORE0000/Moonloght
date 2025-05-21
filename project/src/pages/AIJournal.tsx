import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Send, Mic, Save, X } from 'lucide-react';
import { pipeline } from '@xenova/transformers';
import RecordRTC from 'recordrtc';

const AIJournal = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sentiment, setSentiment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // Load saved entries from localStorage
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const analyzeSentiment = async (text) => {
    try {
      setIsProcessing(true);
      const classifier = await pipeline('sentiment-analysis');
      const result = await classifier(text);
      setSentiment(result[0]);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
      });
      
      mediaRecorderRef.current.startRecording();
      setIsRecording(true);
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stopRecording(() => {
        const blob = mediaRecorderRef.current.getBlob();
        const url = URL.createObjectURL(blob);
        
        // Save the audio URL with the entry
        const newAudioEntry = {
          type: 'audio',
          content: url,
          timestamp: new Date().toISOString(),
        };
        
        setEntries(prev => {
          const updated = [...prev, newAudioEntry];
          localStorage.setItem('journalEntries', JSON.stringify(updated));
          return updated;
        });
        
        setIsRecording(false);
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate([50, 100, 50]);
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    const entry = {
      type: 'text',
      content: newEntry,
      timestamp: new Date().toISOString(),
    };

    setEntries(prev => {
      const updated = [...prev, entry];
      localStorage.setItem('journalEntries', JSON.stringify(updated));
      return updated;
    });

    await analyzeSentiment(newEntry);
    setNewEntry('');
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50]);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-display text-center text-gray-800 mb-4"
        >
          AI-Powered Love Journal
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 max-w-2xl mx-auto mb-8 font-handwritten text-lg"
        >
          Write or record your thoughts, and let AI help understand your emotions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Write your thoughts..."
                className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-handwritten text-lg"
              />
              <Pencil className="absolute top-4 right-4 text-gray-400" size={20} />
            </div>
            
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={!newEntry.trim() || isProcessing}
                className="flex-1 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={18} />
                <span>Save Entry</span>
              </button>
              
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full ${
                  isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-secondary-500 hover:bg-secondary-600'
                } text-white transition`}
              >
                {isRecording ? <X size={20} /> : <Mic size={20} />}
              </button>
            </div>
          </form>
        </motion.div>

        <div className="space-y-6">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.timestamp}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              {entry.type === 'text' ? (
                <p className="font-handwritten text-lg text-gray-700">{entry.content}</p>
              ) : (
                <audio src={entry.content} controls className="w-full" />
              )}
              <div className="mt-4 text-sm text-gray-500">
                {new Date(entry.timestamp).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIJournal;