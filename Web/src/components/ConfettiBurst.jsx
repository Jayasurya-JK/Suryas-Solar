import { useEffect, useRef } from 'react'

const COLORS = ['#0f4bd6', '#D6006F', '#facc15', '#22c55e', '#f97316', '#38bdf8']

// Lightweight full-screen confetti burst (no dependency). Skipped for reduced-motion users.
export default function ConfettiBurst({ duration = 3500 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const pieces = []
    const burst = (x, count) => {
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6
        const speed = 14 + Math.random() * 12
        pieces.push({
          x,
          y: canvas.height + 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          w: 6 + Math.random() * 6,
          h: 8 + Math.random() * 8,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }
    }
    burst(canvas.width * 0.2, 90)
    burst(canvas.width * 0.8, 90)
    const second = setTimeout(() => burst(canvas.width * 0.5, 80), 350)

    const start = performance.now()
    let frame
    const tick = (now) => {
      const elapsed = now - start
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = elapsed > duration - 800 ? Math.max(0, (duration - elapsed) / 800) : 1
      pieces.forEach((p) => {
        p.vy += 0.35
        p.vx *= 0.99
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      if (elapsed < duration) frame = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(second)
      window.removeEventListener('resize', resize)
    }
  }, [duration])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[70] pointer-events-none" aria-hidden="true" />
}
