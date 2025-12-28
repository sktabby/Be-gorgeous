import React from 'react'

export default function Input(props) {
  return (
    <input
      {...props}
      style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #ccc' }}
    />
  )
}
