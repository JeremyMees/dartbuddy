import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function formatDate(date: Date | string) {
  return dayjs(date).format('DD/MM/YY')
}

export function formatReadDate(date: Date | string) {
  return dayjs(date).format('DD MMM, HH:mm')
}

export function timeAgo(date: Date | string, withoutSuffix?: boolean) {
  return dayjs(date).fromNow(withoutSuffix)
}
