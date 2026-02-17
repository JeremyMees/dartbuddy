export const segments = [
  'MISS',
  'SB',
  'DB',
  'S1',
  'D1',
  'T1',
  'S2',
  'D2',
  'T2',
  'S3',
  'D3',
  'T3',
  'S4',
  'D4',
  'T4',
  'S5',
  'D5',
  'T5',
  'S6',
  'D6',
  'T6',
  'S7',
  'D7',
  'T7',
  'S8',
  'D8',
  'T8',
  'S9',
  'D9',
  'T9',
  'S10',
  'D10',
  'T10',
  'S11',
  'D11',
  'T11',
  'S12',
  'D12',
  'T12',
  'S13',
  'D13',
  'T13',
  'S14',
  'D14',
  'T14',
  'S15',
  'D15',
  'T15',
  'S16',
  'D16',
  'T16',
  'S17',
  'D17',
  'T17',
  'S18',
  'D18',
  'T18',
  'S19',
  'D19',
  'T19',
  'S20',
  'D20',
  'T20',
] as const

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
