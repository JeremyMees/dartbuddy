export const gameTypes = [
  'aroundTheClock',
  'singlesTraining',
  'doublesTraining',
  'scoreTraining',
  'matchGame',
] as const

export const gameTypeOptions: {
  value: (typeof gameTypes)[number]
  label: string
}[] = [
  { value: 'aroundTheClock', label: 'Around the Clock' },
  { value: 'singlesTraining', label: 'Singles Training' },
  { value: 'doublesTraining', label: 'Doubles Training' },
  { value: 'scoreTraining', label: 'Score Training' },
  { value: 'matchGame', label: 'Match Game' },
]

export const gameRanges = ['allTime', 'lastMonth', 'lastWeek', 'today'] as const

export const gameRangeOptions: {
  value: (typeof gameRanges)[number]
  label: string
}[] = [
  { value: 'allTime', label: 'All Time' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'lastWeek', label: 'Last Week' },
  { value: 'today', label: 'Today' },
]
