import { describe, expect, it } from 'vitest'
import type { MultiPartData } from 'h3'
import { getBoolean, getImage, getText } from '~~/server/utils/questForm'

function part(name: string, data: Buffer, extra: Partial<MultiPartData> = {}): MultiPartData {
  return { name, data, ...extra }
}

describe('getText', () => {
  it('возвращает текст части по имени', () => {
    const parts = [part('quest', Buffer.from('Вопрос'))]
    expect(getText(parts, 'quest')).toBe('Вопрос')
  })

  it('возвращает undefined, если части нет', () => {
    expect(getText([], 'quest')).toBeUndefined()
  })
})

describe('getBoolean', () => {
  it('трактует "true" и "1" как true', () => {
    expect(getBoolean([part('flag', Buffer.from('true'))], 'flag')).toBe(true)
    expect(getBoolean([part('flag', Buffer.from('1'))], 'flag')).toBe(true)
  })

  it('трактует остальное как false', () => {
    expect(getBoolean([part('flag', Buffer.from('false'))], 'flag')).toBe(false)
    expect(getBoolean([part('flag', Buffer.from('0'))], 'flag')).toBe(false)
    expect(getBoolean([], 'flag')).toBe(false)
  })
})

describe('getImage', () => {
  it('возвращает null, если части нет', () => {
    expect(getImage([], 'img')).toBeNull()
  })

  it('возвращает null без filename или с пустыми данными', () => {
    expect(getImage([part('img', Buffer.from('data'))], 'img')).toBeNull()
    expect(getImage([part('img', Buffer.alloc(0), { filename: 'a.png', type: 'image/png' })], 'img')).toBeNull()
  })

  it('возвращает буфер, тип и расширение для валидного изображения', () => {
    const data = Buffer.from('image-bytes')
    const result = getImage([part('img', data, { filename: 'photo.png', type: 'image/png' })], 'img')
    expect(result).toEqual({ buffer: data, type: 'image/png', ext: 'png' })
  })

  it('приводит расширение к нижнему регистру', () => {
    const result = getImage([part('img', Buffer.from('x'), { filename: 'PHOTO.PNG', type: 'image/png' })], 'img')
    expect(result?.ext).toBe('png')
  })

  it('отклоняет неподдерживаемое расширение', () => {
    const parts = [part('img', Buffer.from('x'), { filename: 'file.exe', type: 'application/octet-stream' })]
    expect(() => getImage(parts, 'img')).toThrowError(expect.objectContaining({ statusCode: 400 }))
  })

  it('отклоняет неподдерживаемый MIME-тип', () => {
    const parts = [part('img', Buffer.from('x'), { filename: 'file.svg', type: 'image/svg+xml' })]
    expect(() => getImage(parts, 'img')).toThrowError(expect.objectContaining({ statusCode: 400 }))
  })

  it('отклоняет изображение больше 5 МБ', () => {
    const parts = [part('img', Buffer.alloc(5 * 1024 * 1024 + 1), { filename: 'big.png', type: 'image/png' })]
    expect(() => getImage(parts, 'img')).toThrowError(expect.objectContaining({ statusCode: 400 }))
  })

  it('принимает изображение ровно 5 МБ', () => {
    const result = getImage([part('img', Buffer.alloc(5 * 1024 * 1024), { filename: 'big.png', type: 'image/png' })], 'img')
    expect(result?.ext).toBe('png')
  })
})