import React from 'react'

export default function WoodenButton({ children, onClick, className = '', active = false, compact = false, style = {} }) {
  return (
    <div
      onClick={onClick}
      className={[
        'wooden-panel cursor-pointer select-none transition-all duration-200',
        active
          ? 'bg-[var(--wood-light)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.55)] scale-100'
          : 'hover:scale-[1.02] active:scale-[0.98]',
        className,
      ].join(' ')}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '44px',
        width: '100%',
        padding: '0 16px',
        backgroundColor: active ? 'var(--wood-light)' : 'var(--wood-medium)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
