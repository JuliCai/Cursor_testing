import { useEffect, useMemo, useState } from 'react'
import { useWaterStore } from './store/waterStore'
import { WaterBottle } from './components/WaterBottle'
import { PrimaryButton } from './components/PrimaryButton'
import { Settings } from 'lucide-react'
import { celebrateGoal } from './utils/confetti'
import { SettingsSheet } from './components/SettingsSheet'

function App() {
  const {
    goalMl,
    sipMl,
    getConsumedToday,
    getProgressToday,
    addIntake,
    streakCount,
    ensureDayRollover,
  } = useWaterStore()

  const [settingsOpen, setSettingsOpen] = useState(false)
  const consumed = getConsumedToday()
  const progress = getProgressToday()

  useEffect(() => {
    ensureDayRollover()
  }, [ensureDayRollover])

  const handleSip = () => {
    const result = addIntake()
    if (result.goalJustReached) celebrateGoal()
  }

  const progressText = useMemo(() => Math.round(progress * 100) + '%', [progress])

  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100">
      <div className="mx-auto max-w-md px-5 pt-10 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-sky-400/80">Daily Water</div>
            <h1 className="text-2xl font-extrabold">Hydroflow</h1>
          </div>
          <button
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Streak + Progress */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-white/70">Streak: <span className="font-semibold text-white">{streakCount} days</span></div>
          <div className="text-sm text-white/70">Progress: <span className="font-semibold text-white">{progressText}</span></div>
        </div>

        {/* Bottle */}
        <div className="flex items-center justify-center">
          <WaterBottle progress={progress} consumedMl={consumed} goalMl={goalMl} />
        </div>

        {/* Action */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <PrimaryButton label={`I drank ${sipMl} ml`} onClick={handleSip} />
          <div className="text-xs text-white/60">Tap whenever you take a sip</div>
        </div>

        {/* Footer spacing */}
      </div>
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default App
