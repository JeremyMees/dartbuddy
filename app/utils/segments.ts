import { segments } from '~~/constants/segments'

export type Segment = (typeof segments)[number]
export type SegmentMultiplier = 'S' | 'D' | 'T'

export function getSegmentPrefix(multiplier: number): SegmentMultiplier {
  let prefix: SegmentMultiplier = 'S'
  if (multiplier === 2) {
    prefix = 'D'
  } else if (multiplier === 3) {
    prefix = 'T'
  }

  return prefix
}

export function isValidSegment(s: string): s is Segment {
  return (segments as readonly string[]).includes(s)
}

export function calculateSegment(
  number: number | null,
  multiplier: number,
): Segment {
  if (number === null) return 'MISS'

  if (number === 25 && multiplier <= 2) {
    return multiplier === 1 ? 'SB' : 'DB'
  }

  const prefix = getSegmentPrefix(multiplier)
  const concatenatedSegment = `${prefix}${number}`

  return isValidSegment(concatenatedSegment) ? concatenatedSegment : 'MISS'
}

export function calculateSegmentScore(segment: Segment): number {
  if (segment === 'MISS') return 0
  if (segment === 'SB') return 25
  if (segment === 'DB') return 50

  const multiplier = segment[0]
  const number = +segment.slice(1)

  let score = number
  if (multiplier === 'D') {
    score *= 2
  } else if (multiplier === 'T') {
    score *= 3
  }

  return score
}
