import confetti from 'canvas-confetti'

export function celebrateGoal() {
  const durationMs = 1400
  const animationEnd = Date.now() + durationMs
  const defaults = { startVelocity: 35, spread: 360, ticks: 80, zIndex: 9999 }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      return clearInterval(interval)
    }
    const particleCount = 50 * (timeLeft / durationMs)
    confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } })
  }, 200)
}

