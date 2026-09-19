export default function Tag({ children, accent = 'bg-peach', className = '' }) {
  return (
    <span className={`bl-tag ${accent} ${className}`}>{children}</span>
  )
}