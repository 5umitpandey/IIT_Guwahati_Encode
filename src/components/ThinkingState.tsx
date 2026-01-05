import { motion } from 'framer-motion';

const thinkingSteps = [
  "Reading the label…",
  "Identifying ingredients…",
  "Checking for concerns…",
  "Making sense of this label…",
];

export function ThinkingState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 md:p-8">
        {/* Animated thinking indicator */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary"
              />
            </div>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-primary/5"
            />
          </div>
          <div>
            <h3 className="font-display text-lg text-foreground">Analyzing</h3>
            <p className="text-sm text-muted-foreground">This usually takes a few seconds</p>
          </div>
        </div>

        {/* Thinking steps */}
        <div className="space-y-3">
          {thinkingSteps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.5, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.5 + 0.2, duration: 0.3, type: 'spring' }}
                className="w-1.5 h-1.5 rounded-full bg-primary/40"
              />
              <motion.span
                className="text-muted-foreground animate-thinking"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                {step}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Shimmer effect */}
        <div className="mt-6 h-1 rounded-full overflow-hidden">
          <div className="h-full animate-shimmer rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}
