import type { Frame } from '../types'

interface Props {
  frame: Frame
  className?: string
}

const LEFT_CX = 68
const RIGHT_CX = 172
const CY = 52

function Lens({ cx, shape, tinted }: { cx: number; shape: Frame['frameShape']; tinted: boolean }) {
  const fill = tinted ? 'currentColor' : 'none'
  const fillOpacity = tinted ? 0.28 : 0
  const stroke = 'currentColor'

  switch (shape) {
    case 'round':
      return <circle cx={cx} cy={CY} r={35} fill={fill} fillOpacity={fillOpacity} stroke={stroke} strokeWidth={6} />
    case 'oversized':
      return (
        <rect
          x={cx - 42}
          y={CY - 38}
          width={84}
          height={76}
          rx={22}
          fill={fill}
          fillOpacity={fillOpacity}
          stroke={stroke}
          strokeWidth={7}
        />
      )
    case 'square':
      return (
        <rect
          x={cx - 34}
          y={CY - 30}
          width={68}
          height={60}
          rx={10}
          fill={fill}
          fillOpacity={fillOpacity}
          stroke={stroke}
          strokeWidth={6}
        />
      )
    case 'rectangle':
      return (
        <rect
          x={cx - 38}
          y={CY - 24}
          width={76}
          height={48}
          rx={8}
          fill={fill}
          fillOpacity={fillOpacity}
          stroke={stroke}
          strokeWidth={6}
        />
      )
    case 'geometric':
      return (
        <polygon
          points={`${cx},${CY - 34} ${cx + 30},${CY - 14} ${cx + 22},${CY + 30} ${cx - 22},${CY + 30} ${cx - 30},${CY - 14}`}
          fill={fill}
          fillOpacity={fillOpacity}
          stroke={stroke}
          strokeWidth={6}
          strokeLinejoin="round"
        />
      )
    case 'aviator':
      return (
        <path
          d={`M ${cx - 34} ${CY - 18}
              C ${cx - 34} ${CY - 32}, ${cx - 12} ${CY - 36}, ${cx} ${CY - 32}
              C ${cx + 12} ${CY - 36}, ${cx + 34} ${CY - 32}, ${cx + 34} ${CY - 18}
              C ${cx + 34} ${CY + 6}, ${cx + 20} ${CY + 34}, ${cx} ${CY + 34}
              C ${cx - 20} ${CY + 34}, ${cx - 34} ${CY + 6}, ${cx - 34} ${CY - 18} Z`}
          fill={fill}
          fillOpacity={fillOpacity}
          stroke={stroke}
          strokeWidth={6}
          strokeLinejoin="round"
        />
      )
    case 'cat-eye':
      return (
        <path
          d={`M ${cx - 36} ${CY + 6}
              C ${cx - 38} ${CY - 18}, ${cx - 20} ${CY - 34}, ${cx + 4} ${CY - 32}
              L ${cx + 38} ${CY - 40}
              C ${cx + 30} ${CY - 26}, ${cx + 36} ${CY - 10}, ${cx + 32} ${CY + 8}
              C ${cx + 28} ${CY + 30}, ${cx + 6} ${CY + 34}, ${cx - 10} ${CY + 30}
              C ${cx - 26} ${CY + 26}, ${cx - 34} ${CY + 16}, ${cx - 36} ${CY + 6} Z`}
          fill={fill}
          fillOpacity={fillOpacity}
          stroke={stroke}
          strokeWidth={6}
          strokeLinejoin="round"
        />
      )
    case 'browline':
      return (
        <g>
          <circle cx={cx} cy={CY + 2} r={32} fill={fill} fillOpacity={fillOpacity} stroke={stroke} strokeWidth={4} />
          <path
            d={`M ${cx - 33} ${CY - 16} C ${cx - 20} ${CY - 34}, ${cx + 20} ${CY - 34}, ${cx + 33} ${CY - 16}`}
            fill="none"
            stroke={stroke}
            strokeWidth={9}
            strokeLinecap="round"
          />
        </g>
      )
    case 'rimless':
      return (
        <circle
          cx={cx}
          cy={CY}
          r={35}
          fill={fill}
          fillOpacity={Math.max(fillOpacity, 0.14)}
          stroke={stroke}
          strokeOpacity={0.35}
          strokeWidth={2.5}
        />
      )
    default:
      return <circle cx={cx} cy={CY} r={35} fill={fill} fillOpacity={fillOpacity} stroke={stroke} strokeWidth={6} />
  }
}

export function FrameGlyph({ frame, className }: Props) {
  const tinted = frame.type === 'sunglasses'
  const bridgeY = frame.frameShape === 'aviator' ? CY - 22 : CY - 2

  return (
    <svg
      viewBox="0 0 240 104"
      className={className}
      style={{ color: frame.accentColor }}
      aria-hidden="true"
    >
      <Lens cx={LEFT_CX} shape={frame.frameShape} tinted={tinted} />
      <Lens cx={RIGHT_CX} shape={frame.frameShape} tinted={tinted} />
      <path
        d={`M ${LEFT_CX + 36} ${bridgeY} Q 120 ${bridgeY - 8} ${RIGHT_CX - 36} ${bridgeY}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <line x1={LEFT_CX - 34} y1={CY - 6} x2={12} y2={CY - 16} stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
      <line x1={RIGHT_CX + 34} y1={CY - 6} x2={228} y2={CY - 16} stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
    </svg>
  )
}
