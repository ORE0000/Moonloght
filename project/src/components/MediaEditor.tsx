import { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, Save, Undo, Redo, Info } from 'lucide-react';
import FileUpload from './FileUpload';
import PasswordProtection from './PasswordProtection';

// Define interfaces for type safety
interface Media {
  url: string;
  caption?: string;
  note?: string;
  metadata?: {
    size?: number;
    duration?: number;
    dimensions?: { width: number; height: number };
  };
}

interface MediaEditorProps {
  type: 'image' | 'video' | 'audio';
  currentMedia: Media;
  onSave: (media: Media) => void;
  onDelete: () => void;
  onClick: () => void; // Added for grid view modal
}

// History state for undo/redo
interface HistoryState {
  past: Media[];
  present: Media;
  future: Media[];
}

const MediaEditor = ({ type, currentMedia, onSave, onDelete, onClick }: MediaEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: currentMedia,
    future: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize media state to prevent unnecessary rerenders
  const media = useMemo(() => history.present, [history.present]);

  // Handle file selection with metadata extraction
  const handleFileSelect = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      const newMedia: Media = {
        ...media,
        url,
        metadata: {
          size: file.size,
        },
      };

      // Extract additional metadata based on type
      if (type === 'image') {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          newMedia.metadata = {
            ...newMedia.metadata,
            dimensions: { width: img.width, height: img.height },
          };
          updateHistory(newMedia);
        };
      } else if (type === 'video' || type === 'audio') {
        const mediaElement = document.createElement(type);
        mediaElement.src = url;
        mediaElement.onloadedmetadata = () => {
          newMedia.metadata = {
            ...newMedia.metadata,
            duration: mediaElement.duration,
          };
          updateHistory(newMedia);
        };
      } else {
        updateHistory(newMedia);
      }
    },
    [media, type],
  );

  // Update history for undo/redo
  const updateHistory = useCallback((newMedia: Media) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: newMedia,
      future: [],
    }));
  }, []);

  // Handle undo
  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const newPresent = prev.past[prev.past.length - 1];
      return {
        past: prev.past.slice(0, -1),
        present: newPresent,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  // Handle redo
  const handleRedo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const newPresent = prev.future[0];
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: prev.future.slice(1),
      };
    });
  }, []);

  // Handle input changes
  const handleInputChange = useCallback(
    (field: 'caption' | 'note', value: string) => {
      const newMedia = { ...media, [field]: value };
      updateHistory(newMedia);
    },
    [media, updateHistory],
  );

  // Handle save
  const handleSave = useCallback(() => {
    onSave(media);
    setIsEditing(false);
    setHistory({ past: [], present: media, future: [] }); // Reset history after save
  }, [media, onSave]);

  // Format metadata for display
  const formatMetadata = useCallback(() => {
    if (!media.metadata) return 'No metadata available';
    const { size, duration, dimensions } = media.metadata;
    const parts: string[] = [];
    if (size) parts.push(`Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
    if (duration) parts.push(`Duration: ${duration.toFixed(2)}s`);
    if (dimensions) parts.push(`Dimensions: ${dimensions.width}x${dimensions.height}`);
    return parts.join(' | ');
  }, [media.metadata]);

  if (!isUnlocked) {
    return <PasswordProtection onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="relative group">
      {/* Media Preview with Clickable Wrapper */}
      <div
        className="cursor-pointer group-hover:opacity-80 transition-opacity"
        onClick={onClick}
        role="button"
        aria-label={`View ${type}`}
      >
        {type === 'image' && (
          <img
            src={media.url}
            alt={media.caption || 'Media'}
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        )}
        {type === 'video' && (
          <video
            src={media.url}
            controls
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        )}
        {type === 'audio' && (
          <audio
            src={media.url}
            controls
            className="w-full rounded-lg"
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent modal trigger
            setIsEditing(true);
          }}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
          aria-label="Edit media"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent modal trigger
            setShowMetadata(!showMetadata);
          }}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
          aria-label="Toggle metadata"
        >
          <Info size={16} />
        </button>
      </div>

      {/* Metadata Display */}
      <AnimatePresence>
        {showMetadata && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-2 left-2 bg-white/90 rounded-lg p-2 text-sm text-gray-700"
          >
            {formatMetadata()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsEditing(false)} // Close on backdrop click
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl"
              onClick={(e) => e.stopPropagation()} // Prevent backdrop click
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Edit {type.charAt(0).toUpperCase() + type.slice(1)}
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* File Upload */}
                <FileUpload
                  onFileSelect={handleFileSelect}
                  accept={`${type}/*`}
                  ref={fileInputRef}
                />

                {/* Caption Input */}
                <input
                  type="text"
                  value={media.caption || ''}
                  onChange={(e) => handleInputChange('caption', e.target.value)}
                  placeholder="Add a caption"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />

                {/* Note Textarea */}
                <textarea
                  value={media.note || ''}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  placeholder="Add a note"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 transition"
                />

                {/* Undo/Redo and Action Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={handleUndo}
                      disabled={history.past.length === 0}
                      className="px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Undo"
                    >
                      <Undo size={16} />
                      Undo
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={history.future.length === 0}
                      className="px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Redo"
                    >
                      <Redo size={16} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={onDelete}
                      className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                      aria-label="Delete media"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                      aria-label="Save changes"
                    >
                      <Save size={16} />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaEditor;

// Example Test Cases
export const MediaEditorTestCases = () => {
  const imageMedia: Media = {
    url: 'https://example.com/image.jpg',
    caption: 'Sample Image',
    note: 'This is a test image',
    metadata: { size: 1024000, dimensions: { width: 1920, height: 1080 } },
  };

  const videoMedia: Media = {
    url: 'https://example.com/video.mp4',
    caption: 'Sample Video',
    note: 'This is a test video',
    metadata: { size: 5242880, duration: 120 },
  };

  const audioMedia: Media = {
    url: 'https://example.com/audio.mp3',
    caption: 'Sample Audio',
    note: 'This is a test audio',
    metadata: { size: 3145728, duration: 180 },
  };

  const handleSave = (media: Media) => console.log('Saved:', media);
  const handleDelete = () => console.log('Deleted');
  const handleClick = () => console.log('Clicked media');

  return (
    <div className="space-y-8 p-4">
      <MediaEditor
        type="image"
        currentMedia={imageMedia}
        onSave={handleSave}
        onDelete={handleDelete}
        onClick={handleClick}
      />
      <MediaEditor
        type="video"
        currentMedia={videoMedia}
        onSave={handleSave}
        onDelete={handleDelete}
        onClick={handleClick}
      />
      <MediaEditor
        type="audio"
        currentMedia={audioMedia}
        onSave={handleSave}
        onDelete={handleDelete}
        onClick={handleClick}
      />
    </div>
  );
};