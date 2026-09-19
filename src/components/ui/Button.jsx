export default function Button({
  children,
  variant = '',
  size = 'md',
  className = '',
  type = 'button',
  ...rest
}) {
  const sizes = {
    sm: 'h-10 !px-4 text-xs',
    md: 'h-[54px] !px-[26px] text-[15px]',
  }
  return (
    <button
      type={type}
      className={`bl-btn cursor-pointer ${sizes[size]} ${variant ? `bl-btn-${variant}` : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}