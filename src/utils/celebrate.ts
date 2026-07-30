import confetti from 'canvas-confetti'
import type { KidColor } from '../types'

export const KID_CONFETTI_COLORS: Record<KidColor, string[]> = {
  pink: ['#f8408c', '#ff96c4', '#ffe0ee', '#ffffff'],
  purple: ['#8a44ed', '#bd96ff', '#ece0ff', '#ffffff'],
}

export const celebrate = (colors: string[]) => {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors,
  })
}
