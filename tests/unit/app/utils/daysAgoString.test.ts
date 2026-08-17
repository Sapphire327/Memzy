import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import daysAgoString from '~~/app/utils/daysAgoString'

describe('daysAgoString', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-17T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('сегодня', () => {
    expect(daysAgoString(new Date('2026-08-17T10:00:00.000Z'))).toBe('Сегодня')
  })

  it('вчера', () => {
    expect(daysAgoString(new Date('2026-08-16T12:00:00.000Z'))).toBe('1 день назад')
  })

  it('2 дня назад', () => {
    expect(daysAgoString(new Date('2026-08-15T12:00:00.000Z'))).toBe('2 дня назад')
  })

  it('5 дней назад', () => {
    expect(daysAgoString(new Date('2026-08-12T12:00:00.000Z'))).toBe('5 дней назад')
  })

  it('21 день назад', () => {
    expect(daysAgoString(new Date('2026-07-27T12:00:00.000Z'))).toBe('21 день назад')
  })

  it('25 дней назад', () => {
    expect(daysAgoString(new Date('2026-07-23T12:00:00.000Z'))).toBe('25 дней назад')
  })

  it('1 месяц назад', () => {
    expect(daysAgoString(new Date('2026-07-18T12:00:00.000Z'))).toBe('1 месяц назад')
  })

  it('2 месяца назад', () => {
    expect(daysAgoString(new Date('2026-06-18T12:00:00.000Z'))).toBe('2 месяца назад')
  })

  it('более года назад', () => {
    expect(daysAgoString(new Date('2025-08-16T12:00:00.000Z'))).toBe('более года назад')
  })
})