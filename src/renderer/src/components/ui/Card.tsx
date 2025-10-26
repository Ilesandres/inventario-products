import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
}

function Card({ children, className = '' }: Props) {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 ${className}`}>
      {children}
    </div>
  )
}

export default Card
