import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { format, subDays, isSameDay, parseISO } from 'date-fns'

export type WaterTrackerState = {
  goalMl: number
  sipMl: number
  intakeByDay: Record<string, number>
  daysGoalMet: Record<string, boolean>
  streakCount: number
  lastOpenDate: string

  getTodayKey: () => string
  getConsumedToday: () => number
  getProgressToday: () => number
  addIntake: (amountMl?: number) => { goalJustReached: boolean }
  resetToday: () => void
  setGoalMl: (goalMl: number) => void
  setSipMl: (sipMl: number) => void
  ensureDayRollover: () => void
}

const todaysKey = (): string => format(new Date(), 'yyyy-MM-dd')

const recalcStreak = (
  daysGoalMet: Record<string, boolean>,
  referenceDateKey: string
): number => {
  let currentStreak = 0
  let cursorDate = parseISO(referenceDateKey)
  while (true) {
    const key = format(cursorDate, 'yyyy-MM-dd')
    if (daysGoalMet[key]) {
      currentStreak += 1
      cursorDate = subDays(cursorDate, 1)
      continue
    }
    break
  }
  return currentStreak
}

export const useWaterStore = create<WaterTrackerState>()(
  persist(
    (set, get) => ({
      goalMl: 2500,
      sipMl: 250,
      intakeByDay: {},
      daysGoalMet: {},
      streakCount: 0,
      lastOpenDate: todaysKey(),

      getTodayKey: () => todaysKey(),
      getConsumedToday: () => {
        const key = get().getTodayKey()
        return get().intakeByDay[key] ?? 0
      },
      getProgressToday: () => {
        const consumed = get().getConsumedToday()
        return Math.min(1, consumed / Math.max(1, get().goalMl))
      },

      ensureDayRollover: () => {
        const currentKey = todaysKey()
        const { lastOpenDate } = get()
        if (!isSameDay(parseISO(lastOpenDate), parseISO(currentKey))) {
          set({ lastOpenDate: currentKey })
          const newStreak = recalcStreak(get().daysGoalMet, currentKey)
          set({ streakCount: newStreak })
        }
      },

      addIntake: (amountMl = get().sipMl) => {
        get().ensureDayRollover()
        const key = get().getTodayKey()
        const previousAmount = get().intakeByDay[key] ?? 0
        const nextAmount = Math.max(0, previousAmount + amountMl)

        const goalBefore = previousAmount >= get().goalMl
        const goalAfter = nextAmount >= get().goalMl

        set(state => ({
          intakeByDay: { ...state.intakeByDay, [key]: nextAmount },
        }))

        // Update goal met map and streak if newly reached
        if (!goalBefore && goalAfter) {
          set(state => ({
            daysGoalMet: { ...state.daysGoalMet, [key]: true },
          }))
          const newStreak = recalcStreak(get().daysGoalMet, key)
          set({ streakCount: newStreak })
        }

        return { goalJustReached: !goalBefore && goalAfter }
      },

      resetToday: () => {
        const key = get().getTodayKey()
        set(state => ({
          intakeByDay: { ...state.intakeByDay, [key]: 0 },
          daysGoalMet: { ...state.daysGoalMet, [key]: false },
        }))
        const newStreak = recalcStreak(get().daysGoalMet, key)
        set({ streakCount: newStreak })
      },

      setGoalMl: (goalMl: number) => {
        set({ goalMl: Math.max(250, Math.min(goalMl, 10000)) })
        // Re-evaluate today's goal-met status and streak after changing the goal
        const key = get().getTodayKey()
        const amount = get().intakeByDay[key] ?? 0
        set(state => ({
          daysGoalMet: {
            ...state.daysGoalMet,
            [key]: amount >= get().goalMl,
          },
        }))
        const newStreak = recalcStreak(get().daysGoalMet, key)
        set({ streakCount: newStreak })
      },

      setSipMl: (sipMl: number) => set({ sipMl: Math.max(50, Math.min(sipMl, 1000)) }),
    }),
    {
      name: 'water-tracker-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, _version: number) => {
        return persistedState
      },
      partialize: (state) => ({
        goalMl: state.goalMl,
        sipMl: state.sipMl,
        intakeByDay: state.intakeByDay,
        daysGoalMet: state.daysGoalMet,
        streakCount: state.streakCount,
        lastOpenDate: state.lastOpenDate,
      }),
    }
  )
)

