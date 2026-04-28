import { motion } from 'framer-motion'

export default function Reveal({ children, delay = 0, className = '', interactive = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={interactive ? { y: -4 } : undefined}
      whileTap={interactive ? { scale: 0.995 } : undefined}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
