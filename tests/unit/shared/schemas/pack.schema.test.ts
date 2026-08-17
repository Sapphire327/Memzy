import { describe, expect, it } from 'vitest'
import {
  packCreateDtoSchema,
  packEditDtoSchema,
  questCreateDtoSchema,
  questEditDtoSchema,
  TagSchema,
} from '#shared/schemas/pack.schema'

describe('packCreateDtoSchema', () => {
  it('принимает валидные данные', () => {
    const result = packCreateDtoSchema.safeParse({ name: 'Дни недели', description: 'На грузинском', isPublic: true })
    expect(result.success).toBe(true)
  })

  it('принимает пустое описание', () => {
    const result = packCreateDtoSchema.safeParse({ name: 'Тест', description: '', isPublic: false })
    expect(result.success).toBe(true)
  })

  it('отклоняет пустое имя', () => {
    const result = packCreateDtoSchema.safeParse({ name: '', description: '', isPublic: true })
    expect(result.success).toBe(false)
  })

  it('отклоняет имя длиннее 100 символов', () => {
    const result = packCreateDtoSchema.safeParse({ name: 'x'.repeat(101), description: '', isPublic: true })
    expect(result.success).toBe(false)
  })

  it('отклоняет описание длиннее 100 символов', () => {
    const result = packCreateDtoSchema.safeParse({ name: 'Тест', description: 'x'.repeat(101), isPublic: true })
    expect(result.success).toBe(false)
  })

  it('отклоняет отсутствие isPublic', () => {
    const result = packCreateDtoSchema.safeParse({ name: 'Тест', description: '' })
    expect(result.success).toBe(false)
  })
})

describe('TagSchema', () => {
  it('принимает валидный тег', () => {
    expect(TagSchema.safeParse({ id: 1, name: 'Georgian' }).success).toBe(true)
  })

  it('отклоняет пустое имя', () => {
    expect(TagSchema.safeParse({ id: 1, name: '' }).success).toBe(false)
  })

  it('отклоняет имя длиннее 50 символов', () => {
    expect(TagSchema.safeParse({ id: 1, name: 'x'.repeat(51) }).success).toBe(false)
  })

  it('отклоняет нечисловой id', () => {
    expect(TagSchema.safeParse({ id: '1', name: 'Georgian' }).success).toBe(false)
  })
})

describe('packEditDtoSchema', () => {
  it('принимает валидные данные со значениями по умолчанию', () => {
    const result = packEditDtoSchema.safeParse({ id: 1, name: 'Тест', description: '', isPublic: true })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.addedTags).toEqual([])
      expect(result.data.deletedTags).toEqual([])
    }
  })

  it('принимает списки тегов', () => {
    const result = packEditDtoSchema.safeParse({
      id: 1,
      name: 'Тест',
      description: '',
      isPublic: true,
      addedTags: [{ id: 2, name: 'Tag' }],
      deletedTags: [3],
    })
    expect(result.success).toBe(true)
  })

  it('отклоняет пустое имя', () => {
    const result = packEditDtoSchema.safeParse({ id: 1, name: '', description: '', isPublic: true })
    expect(result.success).toBe(false)
  })
})

describe('questCreateDtoSchema', () => {
  it('принимает только обязательные поля', () => {
    const result = questCreateDtoSchema.safeParse({ quest: 'Вопрос', answer: 'Ответ' })
    expect(result.success).toBe(true)
  })

  it('принимает все поля', () => {
    const result = questCreateDtoSchema.safeParse({
      quest: 'Вопрос',
      answer: 'Ответ',
      hint: 'Подсказка',
      exampleInText: 'Пример',
      questImgName: 'img.png',
      answerImgName: 'ans.png',
    })
    expect(result.success).toBe(true)
  })

  it('отклоняет пустой вопрос', () => {
    expect(questCreateDtoSchema.safeParse({ quest: '', answer: 'Ответ' }).success).toBe(false)
  })

  it('отклоняет пустой ответ', () => {
    expect(questCreateDtoSchema.safeParse({ quest: 'Вопрос', answer: '' }).success).toBe(false)
  })

  it('отклоняет вопрос длиннее 500 символов', () => {
    expect(questCreateDtoSchema.safeParse({ quest: 'x'.repeat(501), answer: 'Ответ' }).success).toBe(false)
  })

  it('отклоняет подсказку длиннее 200 символов', () => {
    expect(questCreateDtoSchema.safeParse({ quest: 'Вопрос', answer: 'Ответ', hint: 'x'.repeat(201) }).success).toBe(false)
  })
})

describe('questEditDtoSchema', () => {
  it('принимает валидные данные', () => {
    const result = questEditDtoSchema.safeParse({
      quest: 'Вопрос',
      answer: 'Ответ',
      hint: 'Подсказка',
      exampleInText: 'Пример',
      removeQuestImage: true,
      removeAnswerImage: false,
    })
    expect(result.success).toBe(true)
  })

  it('отклоняет пустой ответ', () => {
    expect(questEditDtoSchema.safeParse({ quest: 'Вопрос', answer: '' }).success).toBe(false)
  })
})