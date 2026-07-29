import { MAX_HEARTS } from '../utils/rewards'

export default function HeartRow({ hearts, size = 'text-2xl' }: { hearts: number; size?: string }) {
  return (
    <div className={`flex gap-1 ${size}`} aria-label={`${hearts} / ${MAX_HEARTS} hearts`}>
      {Array.from({ length: MAX_HEARTS }, (_, i) => (
        <span key={i} className={i < hearts ? 'opacity-100' : 'opacity-25 grayscale'}>
          💖
        </span>
      ))}
    </div>
  )
}
