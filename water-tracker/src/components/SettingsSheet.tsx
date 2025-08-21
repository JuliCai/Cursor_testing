import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, GlassWater, Minus, Plus } from 'lucide-react'
import { useWaterStore } from '../store/waterStore'

type SettingsSheetProps = {
  open: boolean
  onClose: () => void
}

export function SettingsSheet({ open, onClose }: SettingsSheetProps) {
  const { goalMl, sipMl, setGoalMl, setSipMl } = useWaterStore()

  const [goal, setGoal] = useState(goalMl)
  const [sip, setSip] = useState(sipMl)

  const apply = () => {
    setGoalMl(goal)
    setSipMl(sip)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />

          {/* Sheet */}
          <motion.div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-t border-black/10 p-6"
            initial={{ y: 400 }}
            animate={{ y: 0 }}
            exit={{ y: 400 }}
            transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          >
            <div className="mx-auto max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-sky-600" />
                <h3 className="text-lg font-semibold">Settings</h3>
              </div>

              {/* Goal */}
              <div className="mb-4">
                <label className="text-sm text-slate-500 dark:text-slate-400">Daily goal (ml)</label>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
                    onClick={() => setGoal(Math.max(250, goal - 100))}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
                    value={goal}
                    onChange={e => setGoal(parseInt(e.target.value || '0', 10))}
                  />
                  <button
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
                    onClick={() => setGoal(Math.min(10000, goal + 100))}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sip */}
              <div className="mb-6">
                <label className="text-sm text-slate-500 dark:text-slate-400">Default sip (ml)</label>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
                    onClick={() => setSip(Math.max(50, sip - 50))}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
                    value={sip}
                    onChange={e => setSip(parseInt(e.target.value || '0', 10))}
                  />
                  <button
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
                    onClick={() => setSip(Math.min(1000, sip + 50))}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <GlassWater className="w-4 h-4" />
                  <span className="text-sm">Stay hydrated 💧</span>
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    className="px-4 py-3 rounded-xl bg-sky-600 text-white shadow-lg"
                    onClick={apply}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

