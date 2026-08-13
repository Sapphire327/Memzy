export default (date: Date) => {
  const diffInMs = date.getTime() - new Date().getTime()
  if (diffInMs <= 0) return 'Повторить сейчас'

  const minutes = Math.floor(diffInMs / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)

  const plural = (n: number, one: string, few: string, many: string) => {
    const mod10 = n % 10
    const mod100 = n % 100
    if (mod10 === 1 && mod100 !== 11) return one
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
    return many
  }

  if (months > 0) return 'через ' + months + ' ' + plural(months, 'месяц', 'месяца', 'месяцев')
  if (days > 0) return 'через ' + days + ' ' + plural(days, 'день', 'дня', 'дней')
  if (hours > 0) return 'через ' + hours + ' ' + plural(hours, 'час', 'часа', 'часов')
  if (minutes > 0) return 'через ' + minutes + ' ' + plural(minutes, 'минуту', 'минуты', 'минут')
  return 'менее минуты'
}
