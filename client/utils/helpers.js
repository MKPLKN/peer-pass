import { format, utcToZonedTime } from 'date-fns-tz'
import { formatDistanceToNow } from 'date-fns'

export const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

export function time (time, f = 'yyyy-MM-dd HH:mm') {
  return format(utcToZonedTime(time, userTimezone), f)
}

export function timeAgo (date) {
  return formatDistanceToNow(date, { addSuffix: true })
}
