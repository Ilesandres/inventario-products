import React from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  // keep generic, extendable
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const { className = '', ...rest } = props
  // Default classes match the dark UI in the screenshot: dark bg, subtle border, yellow focus
  const base =
    'w-full bg-gray-800 border border-gray-700 text-sm rounded px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 '

  return <input ref={ref} className={base + className} {...rest} />
})

export default Input
