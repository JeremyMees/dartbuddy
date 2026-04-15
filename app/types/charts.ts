type SortFunction = (a: [string, number], b: [string, number]) => number

export interface LineDataSet {
  label: string
  data: Record<string, number>
  borderColor?: string
  pointBackgroundColor?: string
  sort?: SortFunction
}
