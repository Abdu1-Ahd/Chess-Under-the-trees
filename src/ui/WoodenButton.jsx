import React from 'react'

export default function WoodenButton({ children, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`wooden-panel cursor-pointer select-none text-center hover:scale-105 active:scale-95 transition-transform duration-200 ${className}`}
      style={{ padding: '12px 24px', display: 'inline-block' }}
    >
      {children}
    </div>
  )
}
