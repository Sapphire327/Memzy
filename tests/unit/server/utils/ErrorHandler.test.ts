import { describe, expect, it } from 'vitest'
import { createError } from 'h3'
import { z } from 'zod'
import ErrorHandler from '~~/server/utils/ErrorHandler'

describe('ErrorHandler', () => {
  it('преобразует ZodError в 400 с сообщениями валидации', () => {
    const zodError = z.object({ name: z.string().min(1) }).safeParse({ name: '' }).error!
    try {
      ErrorHandler(zodError)
      expect.unreachable('должна быть выброшена ошибка')
    } catch (e) {
      const error = e as { statusCode: number; statusMessage: string; message: string; data: string[] }
      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toBe('Validation failed')
      expect(error.message).toBe('Некорректные данные')
      expect(Array.isArray(error.data)).toBe(true)
      expect(error.data.length).toBeGreaterThan(0)
    }
  })

  it('пробрасывает H3Error без изменений и заполняет data пустым массивом', () => {
    const h3Error = createError({ statusCode: 403, statusMessage: 'Forbidden pack', message: 'Нет доступа' })
    try {
      ErrorHandler(h3Error)
      expect.unreachable('должна быть выброшена ошибка')
    } catch (e) {
      const error = e as { statusCode: number; statusMessage: string; message: string; data: unknown[] }
      expect(error.statusCode).toBe(403)
      expect(error.statusMessage).toBe('Forbidden pack')
      expect(error.message).toBe('Нет доступа')
      expect(error.data).toEqual([])
    }
  })

  it('преобразует неизвестную ошибку в 500', () => {
    try {
      ErrorHandler(new Error('boom'))
      expect.unreachable('должна быть выброшена ошибка')
    } catch (e) {
      const error = e as { statusCode: number; statusMessage: string; message: string }
      expect(error.statusCode).toBe(500)
      expect(error.statusMessage).toBe('server error')
      expect(error.message).toBe('Ошибка на стороне сервера')
    }
  })
})