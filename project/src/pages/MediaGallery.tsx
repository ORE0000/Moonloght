import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Play, Pause, Volume2, GripVertical, Heart } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MediaEditor from '../components/MediaEditor';

interface MediaItem {
  id: number;
  type: 'image' | 'video' | 'audio';
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  duration?: number;
}

interface MediaCardProps {
  item: MediaItem;
  index: number;
  onUpdate: (updates: Partial<MediaItem>) => void;
  onDelete: () => void;
  onOpenModal: () => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MediaItem | null;
}

const Modal = ({ isOpen, onClose, item }: ModalProps) => {
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

  if (!isOpen || !item) return null;

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
          initial={{ scale: 0.9, opacity: 0, rotate: 2 }}
          animate={{ scale: 1, opacity: 1, rotate: 2 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-cream-50 rounded-lg max-w-lg w-full p-6 relative bg-[url('https://www.transparenttextures.com/patterns/paper.png')] border-4 border-white shadow-lg transform rotate-2 border-image-[url('https://www.transparenttextures.com/patterns/torn.png')] border-image-slice-30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Washi tape accent */}
          <div className="absolute -top-2 -left-2 w-16 h-4 bg-pink-400 rounded-sm opacity-80 flex items-center justify-center">
            <div className="w-2 h-2 bg-pink-400 rotate-45 absolute -bottom-1"></div>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-red-600"
            aria-label="Close modal"
          >
            <Heart size={18} className="text-white" />
          </button>

          {/* Media */}
          <div className="relative w-full h-64 md:h-80 bg-gray-100 rounded-md overflow-hidden mb-4 border-4 border-white shadow-sm">
            {item.type === 'video' ? (
              <video
                key={item.url}
                src={item.url}
                poster={item.thumbnail}
                controls
                playsInline
                autoPlay={false}
                className="w-full h-full object-contain"
                onError={() => console.error('Video load error:', item.url)}
              >
                <p>Your browser does not support this video format.</p>
              </video>
            ) : item.type === 'audio' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 p-4">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-32 h-32 object-cover rounded-full mb-4 border-2 border-pink-400"
                />
                <audio
                  ref={audioRef}
                  src={item.url}
                  controls
                  className="w-full"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={() => console.error('Audio load error:', item.url)}
                />
                <button
                  onClick={toggleAudioPlay}
                  className="mt-4 w-12 h-12 rounded-full bg-pink-400 flex items-center justify-center hover:bg-pink-500 transition"
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                >
                  {isPlaying ? <Pause className="text-white" size={24} /> : <Play className="text-white ml-1" size={24} />}
                </button>
              </div>
            ) : (
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-contain"
                onError={() => console.error('Image load error:', item.url)}
              />
            )}
          </div>

          {/* Details */}
          <div className="text-center bg-white/80 rounded-md p-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-dancing">{item.title}</h3>
            <p className="text-gray-700 font-sans text-base font-medium">{item.description}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const MediaCard = ({ item, index, onUpdate, onDelete, onOpenModal }: MediaCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="relative bg-cream-50 p-4 rounded-lg shadow-lg border-4 border-white bg-[url('https://www.transparenttextures.com/patterns/paper.png')] cursor-pointer transform hover:scale-105 transition-transform border-image-[url('https://www.transparenttextures.com/patterns/torn.png')] border-image-slice-30"
    >
      {/* Washi tape accent */}
      <div className="absolute -top-2 -left-2 w-12 h-3 bg-pink-400 rounded-sm opacity-80 flex items-center justify-center">
        <div className="w-2 h-2 bg-pink-400 rotate-45 absolute -bottom-1"></div>
      </div>
      {/* Heart sticker */}
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-90">
        <Heart size= {14} className="text-white" />
      </div>
      <div className="relative w-full h-32 mb-4 rounded-md overflow-hidden border-2 border-white shadow-sm">
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={() => console.error('Thumbnail load error:', item.thumbnail)}
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <button
            className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center hover:bg-pink-500 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
            aria-label="Open media"
            onClick={onOpenModal}
          >
            <Play className="text-white ml-1" size={20} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
          <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs rounded uppercase font-sans">
            {item.type}
          </span>
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2 font-dancing text-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">{item.title}</h3>
      <p className="text-gray-600 font-sans text-sm line-clamp-2">{item.description}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        className="absolute top-2 left-2 p-1 bg-pink-400 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
        aria-label="Edit media"
      >
        <Edit2 size={14} className="text-white" />
      </button>
      {item.type === 'audio' && (
        <div className="absolute top-2 right-2 bg-black/40 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Volume2 className="text-white" size={14} />
        </div>
      )}
      {isEditing && (
        <MediaEditor
          type={item.type}
          currentMedia={{
            url: item.url,
            caption: item.title,
            note: item.description,
          }}
          onSave={(updatedMedia) => {
            onUpdate({
              title: updatedMedia.caption || item.title,
              description: updatedMedia.note || item.description,
              url: updatedMedia.url,
              thumbnail: item.thumbnail,
            });
            setIsEditing(false);
          }}
          onDelete={onDelete}
        />
      )}
    </motion.div>
  );
};

const MediaGallery = ({ initialItems }: { initialItems?: MediaItem[] }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialItems || [
    {
      id: 1,
      type: 'image',
      title: 'Our First Coffee Shop',
      description: 'The cozy corner café where our love story began, with your favorite book sparking our first conversation.',
      thumbnail: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      url: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    },
    {
      id: 2,
      type: 'image',
      title: 'Beach Sunset Spot',
      description: 'Our secret spot where we watched the sun melt into the sea, sharing dreams over a picnic blanket.',
      thumbnail: 'https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      url: 'https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    },
    {
      id: 3,
      type: 'image',
      title: 'Cute you ',
      description: 'Our secret spot where we watched the sun melt into the sea, sharing dreams over a picnic blanket.',
      thumbnail: '/assets/places/kuttu cute.jpeg',
      url: '/assets/places/kuttu cute.jpeg',
    },
    {
      id: 4,
      type: 'video',
      title: 'Mountain Viewpoint',
      description: 'That trail where we got lost but found a view that took our breath away, just like you do every day.',
      thumbnail: 'https://images.pexels.com/photos/1033729/pexels-photo-1033729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      url: '/assets/VID_42880319_220630_118.mp4',
      duration: 138,
    },
    {
      id: 5,
      type: 'audio',
      title: 'Starlit Whisper',
      description: 'A tender message whispered under the stars, my heart to yours, Kuttu.',
      thumbnail: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      url: 'https://example.com/audio.mp3',
      duration: 45,
    },
  ]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const handleMediaUpdate = useCallback((id: number, updates: Partial<MediaItem>) => {
    setMediaItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }, []);

  const handleMediaDelete = useCallback((id: number) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const onDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    const reorderedItems = [...mediaItems];
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);
    setMediaItems(reorderedItems);
  }, [mediaItems]);

  const handleKeyDown = (e: React.KeyboardEvent, item: MediaItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedItem(item);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-cream-50 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] bg-cover bg-center relative">
      {/* Heart pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hearts.png')] opacity-10 pointer-events-none"></div>

      <div className="container mx-auto max-w-5xl relative">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-dancing font-bold text-center text-gray-800 mb-4 flex items-center justify-center gap-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100 transform -rotate-2 text-shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
        >
          <Heart size={24} className="text-red-500" /> Our Scrapbook of Memories
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 max-w-2xl mx-auto mb-12 font-sans text-lg bg-white p-4 rounded-lg shadow-sm border border-gray-100 transform rotate-2"
        >
          A collection of our cherished moments, tucked into the pages of our love’s scrapbook.
        </motion.p>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="media-gallery">
            {(provided) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {mediaItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative group"
                        id={`media-card-${item.id}`}
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyDown(e, item)}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="absolute top-2 right-2 p-1 bg-red-500 rounded-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                        >
                          <GripVertical size={14} className="text-white" />
                        </div>
                        <MediaCard
                          item={item}
                          index={index}
                          onUpdate={(updates) => handleMediaUpdate(item.id, updates)}
                          onDelete={() => handleMediaDelete(item.id)}
                          onOpenModal={() => setSelectedItem(item)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} item={selectedItem} />
      </div>
    </div>
  );
};

export const MediaGalleryTestCases = () => {
  const testItems: MediaItem[] = [
    {
      id: 1,
      type: 'image',
      title: 'Our First Coffee Shop',
      description: 'The cozy corner café where our love story began, with your favorite book sparking our first conversation.',
      thumbnail: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      url: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    },
    {
      id: 2,
      type: 'image',
      title: 'Beach Sunset Spot',
      description: 'Our secret spot where we watched the sun melt into the sea, sharing dreams over a picnic blanket.',
      thumbnail: 'https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      url: 'https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    },
        {
      id: 3,
      type: 'image',
      title: 'Cute you ',
      description: 'Our secret spot where we watched the sun melt into the sea, sharing dreams over a picnic blanket.',
      thumbnail: '/assets/places/kuttu cute.jpeg',
      url: '/assets/places/kuttu cute.jpeg',
    },
    {
      id: 4,
      type: 'image',
      title: 'City Park Bench',
      description: 'Our beloved bench where we talked for hours, planning our future under the shade of ancient oaks.',
      thumbnail: 'https://images.pexels.com/photos/169186/pexels-photo-169186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      url: 'https://images.pexels.com/photos/169186/pexels-photo-169186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    },
    {
      id: 5,
      type: 'video',
      title: 'Mountain Viewpoint',
      description: 'That trail where we got lost but found a view that took our breath away, just like you do every day.',
      thumbnail: 'https://images.pexels.com/photos/1033729/pexels-photo-1033729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      url: '/assets/VID_42880319_220630_118.mp4',
      duration: 138,
    },
    {
      id: 6,
      type: 'audio',
      title: 'Starlit Whisper',
      description: 'A tender message whispered under the stars, my heart to yours, Kuttu.',
      thumbnail: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      url: 'https://example.com/audio.mp3',
      duration: 45,
    },
  ];

  return <MediaGallery initialItems={testItems} />;
};

export default MediaGallery;