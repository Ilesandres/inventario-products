type Props = {
  title: string
  value: string | number
  hint?: string
  className?: string
}

function CardMetric({ title, value, hint, className = '' }: Props) {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded p-4 ${className}`}>
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </div>
  )
}

export default CardMetric
