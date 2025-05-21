import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Heart } from 'lucide-react';

// Import assets (ensure these files are in your project/src/assets folder)
import blankLetterImage from '/src/assets/blank-letter.png';
import dragonImage from '/src/assets/dragon.png';
import penWriteSound from '/src/assets/Sounds/pen-write-35730.mp3';

interface Letter {
  id: string;
  content: string;
  date: string;
}

const VintageLetter: React.FC<{
  letters: Letter[];
  currentLetterId: string;
  setLetters: React.Dispatch<React.SetStateAction<Letter[]>>;
  setCurrentLetterId: React.Dispatch<React.SetStateAction<string>>;
  setShowLetterList: React.Dispatch<React.SetStateAction<boolean>>;
  useTypingEffect: boolean;
}> = ({ letters, currentLetterId, setLetters, setCurrentLetterId, setShowLetterList, useTypingEffect }) => {
  const letterRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(useTypingEffect);
  const [currentContent, setCurrentContent] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCursorPosition = useRef<number | null>(null);

  const currentLetter = letters.find((letter) => letter.id === currentLetterId) || letters[0];

  // Initialize content when letter changes
  useEffect(() => {
    setCurrentContent(currentLetter.content);
    if (!isEditing) {
      setDisplayedContent(currentLetter.content);
    }
  }, [currentLetter, isEditing]);

  // Typing effect with sound
  useEffect(() => {
    if (isEditing || !useTypingEffect) {
      setDisplayedContent(currentContent);
      setIsTyping(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    setDisplayedContent('');
    setIsTyping(true);
    let index = 0;
    const plainText = currentLetter.content.replace(/<[^>]+>/g, ''); // Strip HTML tags for typing
    const interval = setInterval(() => {
      if (index < plainText.length) {
        setDisplayedContent((prev) => prev + plainText[index]);
        index++;
        if (audioRef.current && useTypingEffect) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((e) => console.log('Audio play failed:', e));
        }
      } else {
        clearInterval(interval);
        setDisplayedContent(currentLetter.content); // Restore full HTML content
        setIsTyping(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    }, 50); // Typing speed (50ms per character)

    return () => {
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [currentLetter, isEditing, useTypingEffect]);

  // Handle pen sound during editing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isEditing &&
        contentRef.current &&
        contentRef.current.contains(e.target as Node) &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        e.key.length === 1
      ) {
        if (audioRef.current && useTypingEffect) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((e) => console.log('Audio play failed:', e));
        }
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }, 300);
      }
    };

    if (isEditing) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isEditing, useTypingEffect]);

  // Handle content input - fixed to prevent cursor jumping
  const handleContentInput = (e: React.SyntheticEvent<HTMLDivElement>) => {
    if (contentRef.current) {
      // Save selection before updating content
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const offset = range?.startOffset;
      const node = range?.startContainer;
      
      setCurrentContent(contentRef.current.innerHTML);
      
      // Restore selection after updating content
      if (selection && range && node && offset !== undefined) {
        const newRange = document.createRange();
        newRange.setStart(node, offset);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  };

  // Save content to letters when sealing
  const saveContent = () => {
    if (contentRef.current) {
      setLetters((prev) =>
        prev.map((letter) =>
          letter.id === currentLetterId
            ? { ...letter, content: contentRef.current!.innerHTML }
            : letter
        )
      );
    }
  };

  const createNewLetter = () => {
    const newId = `letter-${Date.now()}`;
    const newLetter: Letter = {
      id: newId,
      content: `
        <p class="mb-4">My Dearest Kuttu,</p>
        <p class="mb-4">Penned beneath the shadow of the old keep, my heart speaks...</p>
        <p class="mb-4">Yours in eternity,</p>
        <div class="signature text-2xl sm:text-3xl mt-8 underline">With all my valor</div>
      `,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    setLetters((prev) => [...prev, newLetter]);
    setCurrentLetterId(newId);
    setCurrentContent(newLetter.content);
    setIsEditing(true);
    setIsTyping(false);
    
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(contentRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 50);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-6 bg-black bg-opacity-50" style={{ backgroundImage: `url(${dragonImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Letter Container */}
      <div
        ref={letterRef}
        className="relative w-full max-w-[95vw] h-[90vh] sm:w-[736px] sm:max-w-[700px] sm:h-[1046px] sm:max-h-[90vh] bg-no-repeat bg-center z-10"
        style={{ backgroundImage: `url(${blankLetterImage})`, backgroundSize: '100% 100%' }}
      >
        {/* Letter Content */}
        <div className="absolute inset-0 pt-6 sm:pt-14 pl-3 sm:pl-8 pr-2 sm:pr-8 pb-2 sm:pb-8 flex flex-col">
          <div className="handwriting text-[#000000] text-sm sm:text-2xl leading-loose flex-grow" style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 1px 2px rgba(0,0,0,0.3)', wordWrap: 'break-word' }}>
            <div className="date text-[#000000] text-right mb-2 sm:mb-4" style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              {currentLetter.date}
            </div>

            <div
              ref={contentRef}
              contentEditable={isEditing}
              onInput={handleContentInput}
              onBlur={saveContent}
              className={`flex-grow focus:outline-none overflow-y-auto ${isEditing ? 'border border-dashed border-gray-400 p-1 sm:p-3' : ''} ${isTyping ? 'after:content-["|"] after:animate-pulse' : ''}`}
              style={{ fontFamily: "'Dancing Script', cursive", wordWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: isEditing ? currentContent : displayedContent }}
              onKeyDown={(e) => {
                if (isEditing) {
                  e.stopPropagation();
                }
              }}
              suppressContentEditableWarning={true}
            />
          </div>
        </div>
        <audio ref={audioRef} src={penWriteSound} loop />
      </div>

      {/* External Button Container */}
      <div className="mt-2 sm:mt-6 w-full max-w-[95vw] sm:max-w-[700px] bg-[#121212] p-2 sm:p-6 rounded-lg shadow-lg border border-[#d4b874] z-40 pointer-events-auto" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/dark-wood.png)', backgroundSize: 'cover' }}>
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center items-center">
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setIsTyping(false);
              if (!isEditing && contentRef.current) {
                contentRef.current.focus();
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(contentRef.current);
                range.collapse(false);
                selection?.removeAllRanges();
                selection?.addRange(range);
              }
            }}
            className="bg-[#8b1e1e] hover:bg-[#6b1515] text-beige-100 px-2 sm:px-4 py-1 sm:py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-[#6b1515] text-xs sm:text-base shadow-md pointer-events-auto"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            {isEditing ? 'Seal Letter' : 'Unseal Letter'}
          </button>
          <button
            onClick={createNewLetter}
            className="bg-[#8b1e1e] hover:bg-[#6b1515] text-beige-100 px-2 sm:px-4 py-1 sm:py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-[#6b1515] text-xs sm:text-base shadow-md pointer-events-auto"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            New Letter
          </button>
          <button
            onClick={() => {
              setShowLetterList(true);
            }}
            className="bg-[#8b1e1e] hover:bg-[#6b1515] text-beige-100 px-2 sm:px-4 py-1 sm:py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-[#6b1515] text-xs sm:text-base shadow-md pointer-events-auto"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            View Letters
          </button>
        </div>
      </div>
    </div>
  );
};

const LetterList: React.FC<{
  letters: Letter[];
  setCurrentLetterId: React.Dispatch<React.SetStateAction<string>>;
  setShowLetterList: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ letters, setCurrentLetterId, setShowLetterList }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-2 sm:p-6 bg-black bg-opacity-50" style={{ backgroundImage: `url(${dragonImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="bg-[#121212] w-full max-w-[95vw] sm:max-w-lg p-4 sm:p-8 rounded-lg shadow-lg border border-[#d4b874] z-10" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/parchment.png)', backgroundSize: 'cover' }}>
        <h2 className="text-xl sm:text-3xl mb-4 sm:mb-6 text-center text-[#d4b874]" style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          Letters Penned
        </h2>
        <div className="space-y-2 sm:space-y-3 max-h-[60vh] overflow-y-auto">
          {letters.map((letter, index) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center bg-[#2e2e2e] p-2 sm:p-3 rounded border border-[#d4b874] shadow-sm"
            >
              <div>
                <p className="text-sm sm:text-lg text-[#d4b874]" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  Letter {index + 1}
                </p>
                <p className="text-xs sm:text-sm text-gray-300" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  {letter.date}
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentLetterId(letter.id);
                  setShowLetterList(false);
                }}
                className="bg-[#8b1e1e] hover:bg-[#6b1515] text-beige-100 px-2 sm:px-3 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-[#6b1515] text-xs sm:text-base shadow-md"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Read
              </button>
            </motion.div>
          ))}
        </div>
        <button
          onClick={() => {
            setShowLetterList(false);
          }}
          className="mt-4 sm:mt-6 bg-[#8b1e1e] hover:bg-[#6b1515] text-beige-100 px-3 sm:px-4 py-1 sm:py-2 rounded transition w-full focus:outline-none focus:ring-2 focus:ring-[#6b1515] text-sm sm:text-base shadow-md"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Return to Letter
        </button>
      </div>
    </div>
  );
};

const SecretDiary = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [puzzleState, setPuzzleState] = useState({
    answer1: '',
    answer2: '',
    answer3: '',
  });
  const [showHints, setShowHints] = useState(false);
  const [letters, setLetters] = useState<Letter[]>([
    {
      id: 'letter-1',
      content: `
        <p class="mb-4">My Dearest Kuttu,</p>
        <p class="mb-4">
          By the dim light of a single candle, with the wind howling beyond the stone walls of this ancient keep, 
          I set quill to parchment. The night is fierce, yet my heart burns fiercer for you.
        </p>
        <p class="mb-4">
          Recall that eve atop the tower, watching the sun bleed into the horizon? I nearly spoke my love then, 
          but my tongue faltered, and I hid my truth behind a jest. Know now, I have loved you since that hour.
        </p>
        <p class="mb-4">Yours in eternity,</p>
        <div class="signature text-2xl sm:text-3xl mt-8 underline">With all my valor</div>
      `,
      date: 'June 12, 1292',
    },
  ]);
  const [currentLetterId, setCurrentLetterId] = useState(letters[0].id);
  const [showLetterList, setShowLetterList] = useState(false);
  const [useTypingEffect, setUseTypingEffect] = useState(true);

  const correctAnswers = {
    answer1: 'coffee',
    answer2: 'stars',
    answer3: 'forever',
  };

  const puzzles = [
    {
      id: 'answer1',
      question: 'What Will I order to drink? (Hint: It will be  hot and keep me awake, much like thoughts of you)',
      hint: 'It begins with a "c" and I take it with two sugars.',
    },
    {
      id: 'answer2',
      question: 'What were we doing on the night of May 21, 2024? Gazing at the ______ together, side by side.(Hint: It glows in the night sky but still is not as bright as your eyes.) ',
      hint: 'Look up at the sky after sunset—it is the one that follows us everywhere.',
    },
    {
      id: 'answer3',
      question: 'Complete our vow: "You and me, ______."',
      hint: 'It surpasses "always" and has seven letters.',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPuzzleState({
      ...puzzleState,
      [e.target.name]: e.target.value.toLowerCase(),
    });
  };

  const checkAnswers = () => {
    const allCorrect = Object.keys(correctAnswers).every(
      (key) => puzzleState[key].toLowerCase() === correctAnswers[key]
    );

    if (allCorrect) {
      setIsUnlocked(true);
    }
  };

  return (
    <div
      className={`min-h-screen py-4 sm:py-12 px-2 sm:px-6 transition-all duration-1000 ${
        isUnlocked ? 'bg-black bg-opacity-50' : 'bg-[#121212]'
      }`}
      style={isUnlocked ? { backgroundImage: `url(${dragonImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}}
    >
      <div className="container mx-auto max-w-4xl relative z-10">
        {isUnlocked && (
          <Heart className="absolute top-2 sm:top-6 right-2 sm:right-6 text-[#d4b874] opacity-50" size={24} />
        )}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-4xl text-center mb-4 sm:mb-8 text-[#d4b874]"
          style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          My Secret Chronicle
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center max-w-md sm:max-w-2xl mx-auto mb-6 sm:mb-12 text-sm sm:text-lg text-[#d4b874]"
          style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          Unravel the riddles to behold the secrets of my heart.
        </motion.p>

        {!isUnlocked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-[#121212] w-full max-w-[95vw] sm:max-w-lg p-4 sm:p-8 rounded-lg shadow-xl border-2 border-[#d4b874] z-10 relative"
            style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/parchment.png)', backgroundSize: 'cover' }}
          >
            <div className="absolute inset-0 border-4 border-[#8b1e1e] rounded-lg opacity-20 pointer-events-none" style={{ borderStyle: 'double' }} />
            <div className="text-center mb-4 sm:mb-6">
              <Lock className="inline-block text-[#d4b874] mb-2 sm:mb-3 animate-pulse" size={24} />
              <h2 className="text-xl sm:text-2xl mb-2 text-[#d4b874]" style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                Unbind My Heart
              </h2>
              <p className="text-[#d4b874] text-xs sm:text-base" style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                Answer these riddles of our love to unveil my chronicles.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {puzzles.map((puzzle, index) => (
                <motion.div
                  key={puzzle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.2, duration: 0.6 }}
                >
                  <label className="block text-[#d4b874] mb-1 sm:mb-2 text-xs sm:text-base" style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {puzzle.question}
                  </label>
                  <motion.input
                    type="text"
                    name={puzzle.id}
                    value={puzzleState[puzzle.id]}
                    onChange={handleInputChange}
                    className="w-full px-2 sm:px-4 py-1 sm:py-2 border border-[#d4b874] rounded bg-[#1e1e1e] text-[#f5f5d5] text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-[#d4b874] focus:border-[#d4b874] transition-all duration-300"
                    style={{ fontFamily: "'Dancing Script', cursive", boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5), 0 0 5px rgba(212,184,116,0.3)' }}
                    placeholder="Your answer..."
                    whileFocus={{ scale: 1.02 }}
                  />
                  {showHints && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs sm:text-sm text-[#d4b874] italic mt-1"
                      style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      {puzzle.hint}
                    </motion.p>
                  )}
                </motion.div>
              ))}

              <div className="flex justify-between mt-4 sm:mt-8">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(212,184,116,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowHints(!showHints);
                  }}
                  className="text-[#d4b874] hover:text-[#f5f5d5] transition focus:outline-none focus:ring-2 focus:ring-[#d4b874] text-xs sm:text-base border border-[#d4b874] px-2 sm:px-4 py-1 sm:py-2 rounded shadow-md"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {showHints ? 'Conceal Hints' : 'Reveal Hints'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(139,30,30,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={checkAnswers}
                  className="bg-[#8b1e1e] hover:bg-[#6b1515] text-beige-100 px-3 sm:px-6 py-1 sm:py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-[#6b1515] text-xs sm:text-base shadow-md"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  Unlock
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : showLetterList ? (
          <LetterList
            letters={letters}
            setCurrentLetterId={setCurrentLetterId}
            setShowLetterList={setShowLetterList}
          />
        ) : (
          <div className="flex flex-col items-center">
            <VintageLetter
              letters={letters}
              currentLetterId={currentLetterId}
              setLetters={setLetters}
              setCurrentLetterId={setCurrentLetterId}
              setShowLetterList={setShowLetterList}
              useTypingEffect={useTypingEffect}
            />
            {/* Checkbox for Typing Effect */}
            <div className="mt-2 sm:mt-4 w-full max-w-[95vw] sm:max-w-[700px] flex justify-center">
              <motion.label
                className="flex items-center gap-2 text-[#d4b874] text-xs sm:text-base"
                style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="checkbox"
                  checked={useTypingEffect}
                  onChange={(e) => {
                    setUseTypingEffect(e.target.checked);
                  }}
                  className="h-3 w-3 sm:h-5 sm:w-5 rounded border-[#d4b874] bg-[#1e1e1e] text-[#d4b874] focus:ring-[#d4b874] focus:ring-2 cursor-pointer"
                />
                Use Typing Effect
              </motion.label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretDiary;