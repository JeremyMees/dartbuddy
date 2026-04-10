import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export function parseChartDate(label: string) {
  const parsedDate = dayjs(label, 'DD/MM/YY')

  return parsedDate.isValid() ? parsedDate.valueOf() : Number.NaN
}

export function parseNumericLabel(label: string) {
  const value = Number(label)

  return Number.isNaN(value) ? null : value
}

export function sortEntriesByDate(a: [string, number], b: [string, number]) {
  return parseChartDate(a[0]) - parseChartDate(b[0])
}

export function sortEntriesByNumericValue(
  a: [string, number],
  b: [string, number],
) {
  const leftValue = parseNumericLabel(a[0])
  const rightValue = parseNumericLabel(b[0])

  if (leftValue === null || rightValue === null) {
    return 0
  }

  return leftValue - rightValue
}

export function camelToKebab(string: string) {
  return string
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

export function kebabToCamel(string: string) {
  const parts = string.split('-').filter(Boolean)

  if (parts.length === 0) {
    return ''
  }

  return (
    parts[0] +
    parts
      .slice(1)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  )
}
