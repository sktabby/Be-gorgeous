import React from 'react'

export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{ padding: '10px 14px', borderRadius: 10, cursor: 'pointer' }}
    >
      {children}
    </button>
  )
}
