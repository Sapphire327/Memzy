import { describe, expect, it } from 'vitest'
import { calculateRepeatResult, intervalMs, MAX_LEVEL, MAX_STAGE, STAGE_INTERVALS_MS } from '~~/server/utils/repeat'

const NOW = new Date('2026-08-17T00:00:00.000Z')
const MIN = 60 * 1000
const DAY = 24 * 60 * MIN

describe('intervalMs', () => {
  it('возвращает ожидаемые интервалы по стадиям', () => {
    expect(intervalMs(1)).toBe(25 * MIN)
    expect(intervalMs(2)).toBe(1 * DAY)
    expect(intervalMs(3)).toBe(3 * DAY)
    expect(intervalMs(4)).toBe(7 * DAY)
    expect(intervalMs(5)).toBe(14 * DAY)
    expect(intervalMs(6)).toBe(30 * DAY)
  })

  it('неизвестная стадия использует fallback в 30 дней', () => {
    expect(intervalMs(7)).toBe(30 * DAY)
    expect(intervalMs(0)).toBe(30 * DAY)
  })

  it('константы уровней/стадий корректны', () => {
    expect(MAX_LEVEL).toBe(4)
    expect(MAX_STAGE).toBe(6)
    expect(STAGE_INTERVALS_MS[6]).toBe(30 * DAY)
  })
})

describe('calculateRepeatResult — верный ответ', () => {
  it('первый повтор без истории: level=2, stage=1, интервал 25 минут', () => {
    const result = calculateRepeatResult(undefined, true, NOW)
    expect(result.level).toBe(2)
    expect(result.stage).toBe(1)
    expect(result.nextRepeat.getTime()).toBe(NOW.getTime() + 25 * MIN)
  })

  it('история с нулевыми значениями трактуется как первый повтор', () => {
    const result = calculateRepeatResult({ level: null, stage: null }, true, NOW)
    expect(result.level).toBe(1)
    expect(result.stage).toBe(1)
    expect(result.nextRepeat.getTime()).toBe(NOW.getTime() + 25 * MIN)
  })

  it('повышает уровень и стадию на 1', () => {
    const result = calculateRepeatResult({ level: 2, stage: 3 }, true, NOW)
    expect(result.level).toBe(3)
    expect(result.stage).toBe(4)
    expect(result.nextRepeat.getTime()).toBe(NOW.getTime() + 7 * DAY)
  })

  it('не превышает MAX_LEVEL и MAX_STAGE', () => {
    const result = calculateRepeatResult({ level: MAX_LEVEL, stage: MAX_STAGE }, true, NOW)
    expect(result.level).toBe(MAX_LEVEL)
    expect(result.stage).toBe(MAX_STAGE)
    expect(result.nextRepeat.getTime()).toBe(NOW.getTime() + 30 * DAY)
  })

  it('капит стадию при переходе с 5 на 6', () => {
    const result = calculateRepeatResult({ level: 3, stage: 5 }, true, NOW)
    expect(result.level).toBe(4)
    expect(result.stage).toBe(6)
    expect(result.nextRepeat.getTime()).toBe(NOW.getTime() + 30 * DAY)
  })
})

describe('calculateRepeatResult — неверный ответ', () => {
  it('сбрасывает стадию на 1 и понижает уровень', () => {
    const result = calculateRepeatResult({ level: 3, stage: 5 }, false, NOW)
    expect(result.level).toBe(2)
    expect(result.stage).toBe(1)
    expect(result.nextRepeat.getTime()).toBe(NOW.getTime() + 25 * MIN)
  })

  it('не опускает уровень ниже 1', () => {
    expect(calculateRepeatResult({ level: 1, stage: 2 }, false, NOW).level).toBe(1)
    expect(calculateRepeatResult(undefined, false, NOW).level).toBe(1)
    expect(calculateRepeatResult({ level: null, stage: null }, false, NOW).level).toBe(1)
  })

  it('неверный ответ всегда даёт интервал 25 минут', () => {
    const result = calculateRepeatResult({ level: 4, stage: 6 }, false, NOW)
    expect(result.stage).toBe(1)
    expect(result.nextRepeat.getTime()).toBe(NOW.getTime() + 25 * MIN)
  })
})