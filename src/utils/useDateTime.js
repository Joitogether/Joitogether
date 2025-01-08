import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// 計算台灣時區的 minTime 和 maxTime
export function taiwanTime() {
  const taiwanTimeOffset = 8 * 60 * 60 * 1000
  const now = new Date()
  const taiwanNow = new Date(now.getTime() + taiwanTimeOffset)

  // 計算 minTime
  const minDate = new Date(taiwanNow)
  minDate.setHours(minDate.getHours() + 12)
  const minTime = minDate.toISOString()

  // 計算 maxTime
  const maxDate = new Date(taiwanNow)
  maxDate.setDate(maxDate.getDate() + 90)
  const maxTime = maxDate.toISOString()

  return { minTime, maxTime }
}

// 格式化日期為 ISO 時區格式
export function formatToISOWithTimezone(dateString) {
  const date = new Date(dateString)

  date.setHours(date.getHours() - 8)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function formatDate(dateString) {
  const taiwanTime = dayjs.utc(dateString).tz('Asia/Taipei')

  return taiwanTime.format('YYYY-MM-DD HH:mm')
}
