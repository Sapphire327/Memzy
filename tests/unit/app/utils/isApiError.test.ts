import { describe, expect, it } from 'vitest'
import isApiError from '~~/app/utils/isApiError'

describe('isApiError', () => {
  it('возвращает true для корректной ошибки', () => {
    const error = { statusCode: 400, statusMessage: 'Bad request', message: 'Некорректные данные', data: ['Ошибка'] }
    expect(isApiError(error)).toBe(true)
  })

  it('возвращает true при отсутствии необязательных полей', () => {
    expect(isApiError({ statusCode: 400, statusMessage: 'x', message: 'y', data: undefined })).toBe(true)
    expect(isApiError({ statusCode: undefined, statusMessage: 'x', message: 'y', data: [] })).toBe(true)
  })

  it('возвращает false для null и undefined', () => {
    expect(isApiError(null)).toBe(false)
    expect(isApiError(undefined)).toBe(false)
  })

  it('возвращает false для примитивов', () => {
    expect(isApiError('ошибка')).toBe(false)
    expect(isApiError(42)).toBe(false)
    expect(isApiError(true)).toBe(false)
  })

  it('возвращает false при отсутствии обязательного ключа', () => {
    expect(isApiError({ statusCode: 400, statusMessage: 'x' })).toBe(false)
    expect(isApiError({ message: 'y' })).toBe(false)
  })

  it('возвращает false при неверном типе полей', () => {
    expect(isApiError({ statusCode: '400', statusMessage: 'x', message: 'y', data: [] })).toBe(false)
    expect(isApiError({ statusCode: 400, statusMessage: 5, message: 'y', data: [] })).toBe(false)
  })

  it('возвращает false, если data содержит не строки', () => {
    expect(isApiError({ statusCode: 400, statusMessage: 'x', message: 'y', data: ['a', 1] })).toBe(false)
  })
})