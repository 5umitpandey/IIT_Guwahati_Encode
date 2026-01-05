import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';


interface FollowUpChipsProps {
  onSelect: (questionId: string) => void;
  onCustomQuestion: (question: string) => void;
  activeId?: string;
  disabled?: boolean;
}

const FOLLOW_UP_QUESTIONS = [
  { id: "mainConcern", label: "Explain the main concern" },
  { id: "dailyUse", label: "Is this okay for daily use?" },
  { id: "watchOut", label: "What should I watch out for?" }
]

const followUpQuestions = FOLLOW_UP_QUESTIONS;
export function FollowUpChips({ onSelect, onCustomQuestion, activeId, disabled }: FollowUpChipsProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuestion.trim() && !disabled) {
      onCustomQuestion(customQuestion.trim());
      setCustomQuestion('');
      setShowCustomInput(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="w-full max-w-2xl mx-auto px-4 mt-6"
    >
      <p className="text-xs text-muted-foreground/70 text-center mb-3 font-medium tracking-wide">
        Explore further
      </p>
      
      {/* Suggestion Chips */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {followUpQuestions.map((question, index) => (
          <motion.button
            key={question.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
            whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2 }}
            whileTap={{ scale: disabled ? 1 : 0.97 }}
            onClick={() => onSelect(question.id)}
            disabled={disabled}
            className={`
              group relative px-4 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-300 ease-out
              ${activeId === question.id
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'bg-card hover:bg-card text-foreground border border-border/60 hover:border-primary/40 hover:shadow-soft'
              }
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              {question.label}
              <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${
                activeId === question.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5'
              }`} />
            </span>
          </motion.button>
        ))}
      </div>

      {/* Escape Hatch - Custom Question */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
        className="mt-6"
      >
        <AnimatePresence mode="wait">
          {!showCustomInput ? (
            <motion.button
              key="trigger"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setShowCustomInput(true)}
              disabled={disabled}
              className={`
                w-full flex items-center justify-center gap-2 py-3 px-4
                text-sm text-muted-foreground hover:text-foreground
                transition-colors duration-200
                ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask anything else about this product</span>
            </motion.button>
          ) : (
            <motion.form
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleCustomSubmit}
              className="relative"
            >
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="For example: is this okay for kids?"
                disabled={disabled}
                autoFocus
                className={`
                  w-full px-4 py-3.5 pr-12 rounded-xl
                  bg-card border border-border/60 
                  text-foreground placeholder:text-muted-foreground/60
                  focus:outline-none focus:border-primary/50 focus:shadow-soft
                  transition-all duration-200
                  ${disabled ? 'opacity-60' : ''}
                `}
              />
              <button
                type="submit"
                disabled={disabled || !customQuestion.trim()}
                className={`
                  absolute right-2 top-1/2 -translate-y-1/2
                  w-8 h-8 rounded-lg flex items-center justify-center
                  transition-all duration-200
                  ${customQuestion.trim() && !disabled
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomQuestion('');
                }}
                className="absolute -top-8 right-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
