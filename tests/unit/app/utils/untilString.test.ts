import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import untilString from '~~/app/utils/untilString'

const MIN = 60 * 1000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

describe('untilString', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-17T00:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('просроченная дата', () => {
    const overdue = new Date(Date.now() - MIN)
    expect(untilString(overdue)).toBe('Повторить сейчас')
  })

  it('дата сейчас', () => {
    expect(untilString(new Date(Date.now()))).toBe('Повторить сейчас')
  })

  it('менее минуты', () => {
    expect(untilString(new Date(Date.now() + 45 * 1000))).toBe('менее минуты')
  })

  it('минуты', () => {
    expect(untilString(new Date(Date.now() + 30 * MIN))).toBe('через 30 минут')
    expect(untilString(new Date(Date.now() + 22 * MIN))).toBe('через 22 минуты')
    expect(untilString(new Date(Date.now() + MIN))).toBe('через 1 минуту')
  })

  it('часы', () => {
    expect(untilString(new Date(Date.now() + HOUR))).toBe('через 1 час')
    expect(untilString(new Date(Date.now() + 5 * HOUR))).toBe('через 5 часов')
    expect(untilString(new Date(Date.now() + 2 * HOUR))).toBe('через 2 часа')
  })

  it('дни', () => {
    expect(untilString(new Date(Date.now() + DAY))).toBe('через 1 день')
    expect(untilString(new Date(Date.now() + 3 * DAY))).toBe('через 3 дня')
    expect(untilString(new Date(Date.now() + 5 * DAY))).toBe('через 5 дней')
    expect(untilString(new Date(Date.now() + 21 * DAY))).toBe('через 21 день')
  })

  it('месяцы', () => {
    expect(untilString(new Date(Date.now() + 60 * DAY))).toBe('через 2 месяца')
    expect(untilString(new Date(Date.now() + 30 * DAY))).toBe('через 1 месяц')
  })
})