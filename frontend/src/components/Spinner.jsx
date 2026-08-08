import { CircleNotch } from '@phosphor-icons/react'

export default function Spinner({ size = 20, className = '' }) {
  return (
    <CircleNotch
      size={size}
      weight="bold"
      className={`animate-spin ${className}`}
    />
  )
}
