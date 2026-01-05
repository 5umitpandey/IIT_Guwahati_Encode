import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center py-12 md:py-16"
    > 
    <div className="flex justify-center mb-4">
  <img
    src="/header-image.png"
    alt="Food Copilot"
    className="h-32 w-auto opacity-90"
  />
</div>

      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground tracking-tight mb-3">
        Food Copilot
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground font-body">
        Helping you decide what's right for you.
      </p>
    </motion.header>
  );
}
