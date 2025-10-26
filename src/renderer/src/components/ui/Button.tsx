import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

function Button({ children, className = '', ...rest }: Props) {
  return (
    <button
      className={`inline-flex items-center px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-sm text-gray-100 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
