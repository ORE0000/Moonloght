import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, X, Play } from 'lucide-react';
import RecordRTC from 'recordrtc';
import Webcam from 'react-webcam';

const VideoMosaic = () => {
  const [videos, setVideos] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const videoPlayerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = webcamRef.current.stream;
      mediaRecorderRef.current = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm',
      });
      
      mediaRecorderRef.current.startRecording();
      setIsRecording(true);
      
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
        
        setVideos(prev => [...prev, {
          url,
          timestamp: new Date().toISOString(),
          thumbnail: webcamRef.current.getScreenshot(),
        }]);
        
        setIsRecording(false);
        
        if ('vibrate' in navigator) {
          navigator.vibrate([50, 100, 50]);
        }
      });
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.load();
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-display text-center text-gray-800 mb-4"
        >
          Video Messages
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 max-w-2xl mx-auto mb-8 font-handwritten text-lg"
        >
          Record and watch video messages for each other.
        </motion.p>

        {/* Recording Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
            <Webcam
              ref={webcamRef}
              audio={true}
              mirrored={true}
              className="w-full h-full object-cover"
            />
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                Recording
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 text-white transition ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-500 hover:bg-primary-600'
              }`}
            >
              {isRecording ? (
                <>
                  <X size={20} />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Video size={20} />
                  <span>Start Recording</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Video Mosaic Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video, index) => (
            <motion.div
              key={video.timestamp}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-video group cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              <img
                src={video.thumbnail}
                alt={`Video thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                <Play className="text-white" size={32} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Player Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <video
                  ref={videoPlayerRef}
                  src={selectedVideo.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full aspect-video"
                />
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 backdrop-blur-sm transition"
                >
                  <X className="text-white" size={24} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoMosaic;