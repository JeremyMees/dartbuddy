import { segments } from '~~/constants/segments'

export type Segment = (typeof segments)[number]
export type SegmentMultiplier = 'S' | 'D' | 'T'

const segmentSet = new Set(segments as readonly string[])

const segmentScoreMap: ReadonlyMap<Segment, number> = (() => {
  const map = new Map<Segment, number>()

  for (const segment of segments) {
    if (segment === 'MISS') {
      map.set(segment, 0)
      continue
    }
    if (segment === 'SB') {
      map.set(segment, 25)
      continue
    }
    if (segment === 'DB') {
      map.set(segment, 50)
      continue
    }

    const multiplier = segment[0]
    const number = Number(segment.slice(1))
    let score = number

    if (multiplier === 'D') {
      score *= 2
    } else if (multiplier === 'T') {
      score *= 3
    }

    map.set(segment, score)
  }

  return map
})()

export function getSegmentPrefix(multiplier: number): SegmentMultiplier {
  if (multiplier === 2) return 'D'
  if (multiplier === 3) return 'T'
  return 'S'
}

export function isValidSegment(s: string): s is Segment {
  return segmentSet.has(s)
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
  return segmentScoreMap.get(segment) ?? 0
}
