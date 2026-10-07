import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface ATSScoreGaugeProps {
  score: number
  size?: number
}

export const ATSScoreGauge: React.FC<ATSScoreGaugeProps> = ({ score, size = 160 }) => {
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getColor = (s: number) => {
    if (s >= 85) return '#22c55e' // emerald-500
    if (s >= 70) return '#3b82f6' // blue-500
    if (s >= 50) return '#f59e0b' // amber-500
    return '#ef4444' // red-500
  }

  const getLabel = (s: number) => {
    if (s >= 85) return 'Exceptional Match'
    if (s >= 70) return 'Strong Candidate'
    if (s >= 50) return 'Moderate Match'
    return 'Needs Optimization'
  }

  const color = getColor(score)

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold tracking-tight text-white"
          >
            {score}
          </motion.span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">
            ATS Score
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {score >= 70 ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : (
          <AlertCircle className="h-4 w-4 text-amber-400" />
        )}
        <span className="text-sm font-semibold" style={{ color }}>
          {getLabel(score)}
        </span>
      </div>
    </div>
  )
}
