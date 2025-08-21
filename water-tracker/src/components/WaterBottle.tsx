import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

type WaterBottleProps = {
  progress: number // 0..1
  consumedMl: number
  goalMl: number
  className?: string
}

export function WaterBottle({ progress, consumedMl, goalMl, className }: WaterBottleProps) {
  const clamped = Math.max(0, Math.min(1, progress))
  const heightPercent = clamped * 100

  return (
    <div className={cn(
      'relative w-full max-w-xs aspect-[3/5]',
      'rounded-[36px] p-3',
      'bg-gradient-to-b from-slate-800/50 to-slate-900/50 dark:from-slate-900/60 dark:to-black/60',
      'border border-white/10 backdrop-blur-md shadow-2xl shadow-sky-900/20',
      className,
    )}>
      <div className="absolute inset-0 pointer-events-none rounded-[36px] overflow-hidden">
        {/* Gloss highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10" />
        {/* Subtle inner vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      </div>

      <div className="relative h-full w-full rounded-[28px] overflow-hidden border border-white/10">
        {/* Water fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          initial={{ height: `${heightPercent}%` }}
          animate={{ height: `${heightPercent}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          {/* Water body */}
          <div className="relative h-full w-full bg-gradient-to-b from-sky-300/70 to-sky-600/80 dark:from-sky-400/70 dark:to-sky-700/90">
            {/* Wave top */}
            <motion.div
              className="absolute -top-3 left-0 right-0 h-6 overflow-hidden"
              initial={{ x: 0 }}
              animate={{ x: [-24, 24, -24] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 120 12" className="w-[200%] h-full opacity-70">
                <path
                  d="M0 6 Q 10 0 20 6 T 40 6 T 60 6 T 80 6 T 100 6 T 120 6 V12 H0 Z"
                  fill="url(#watergrad)"
                />
                <defs>
                  <linearGradient id="watergrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(186,230,253,0.9)" />
                    <stop offset="100%" stopColor="rgba(2,132,199,0.9)" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Caustics shimmer */}
            <motion.div
              className="absolute inset-0"
              style={{ backgroundImage: 'radial-gradient(transparent 60%, rgba(255,255,255,0.08) 61%)' }}
              animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            />
          </div>
        </motion.div>

        {/* Level markers */}
        <div className="absolute inset-0 p-3 text-[10px] text-white/60">
          <div className="absolute left-2 right-2 top-1/4 border-t border-white/10" />
          <div className="absolute left-2 right-2 top-2/4 border-t border-white/10" />
          <div className="absolute left-2 right-2 top-3/4 border-t border-white/10" />
        </div>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-white/60">Consumed</div>
            <div className="text-4xl font-extrabold text-white drop-shadow-[0_1px_8px_rgba(56,189,248,0.45)]">
              {Math.round(consumedMl)} ml
            </div>
            <div className="mt-1 text-white/70">Goal: {goalMl} ml</div>
          </div>
        </div>
      </div>
    </div>
  )
}

