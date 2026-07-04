export function formatRelativeTime(iso: string, locale: string): string {
  const date = new Date(iso)
  const now = Date.now()
  const diffSec = Math.floor((now - date.getTime()) / 1000)

  if (diffSec < 60) {
    return locale.startsWith('th') ? 'เมื่อสักครู่' : 'just now'
  }

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) {
    return locale.startsWith('th') ? `${diffMin} นาทีที่แล้ว` : `${diffMin}m ago`
  }

  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) {
    return locale.startsWith('th') ? `${diffHr} ชั่วโมงที่แล้ว` : `${diffHr}h ago`
  }

  const diffDay = Math.floor(diffHr / 24)
  return locale.startsWith('th') ? `${diffDay} วันที่แล้ว` : `${diffDay}d ago`
}
