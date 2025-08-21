import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

type PrimaryButtonProps = {
  label: string
  onClick: () => void
  className?: string
}

export function PrimaryButton({ label, onClick, className }: PrimaryButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center',
        'px-6 py-4 rounded-2xl font-semibold',
        'bg-gradient-to-b from-sky-400 to-sky-600 text-white',
        'shadow-xl shadow-sky-700/30 hover:shadow-sky-700/50',
        'active:scale-[0.98] focus:outline-none',
        'transition-all duration-200',
        className,
      )}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
    >
      {/* glow */}
      <span className="absolute inset-0 rounded-2xl bg-sky-300/20 blur-lg" />
      <span className="relative z-10 drop-shadow-[0_1px_8px_rgba(56,189,248,0.65)]">{label}</span>
    </motion.button>
  )
}

