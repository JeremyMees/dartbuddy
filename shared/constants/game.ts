export const gameTypes = [
  'aroundTheClock',
  'singlesTraining',
  'doublesTraining',
  'scoreTraining',
] as const

export const gameTypeOptions = [
  { value: 'aroundTheClock', label: 'Around the Clock' },
  { value: 'singlesTraining', label: 'Singles Training' },
  { value: 'doublesTraining', label: 'Doubles Training' },
  { value: 'scoreTraining', label: 'Score Training' },
]

export const gameRanges = ['allTime', 'lastMonth', 'lastWeek', 'today'] as const

export const gameRangeOptions = [
  { value: 'allTime', label: 'All Time' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'lastWeek', label: 'Last Week' },
  { value: 'today', label: 'Today' },
]
