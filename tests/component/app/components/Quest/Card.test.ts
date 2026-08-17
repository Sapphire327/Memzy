// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import QuestCard from '~~/app/components/Quest/Card.vue'
import type { RepeatableQuest } from '#shared/schemas'

vi.mock('~~/app/utils/getImageUrl', () => ({
  default: (key: string | null) => key ?? null,
}))
vi.mock('~~/app/utils/daysAgoString', () => ({
  default: () => '5 дней назад',
}))
vi.mock('~~/app/utils/untilString', () => ({
  default: () => 'через 3 дня',
}))

const stubs = {
  FormButton: {
    template: '<button type="button"><slot /></button>',
  },
}

function quest(overrides: Partial<RepeatableQuest> = {}): RepeatableQuest {
  return {
    id: 1,
    quest: 'hello',
    answer: 'Привет',
    hint: null,
    exampleInText: null,
    questImgName: null,
    answerImgName: null,
    packId: 1,
    lastRepeated: null,
    NextRepeated: null,
    level: null,
    stage: null,
    ...overrides,
  }
}

describe('Quest/Card', () => {
  it('отображает вопрос, подсказку и пример', () => {
    const wrapper = mount(QuestCard, {
      props: { quest: quest({ hint: 'подсказка', exampleInText: 'пример' }) },
      global: { stubs },
    })
    expect(wrapper.find('.quest__question-text').text()).toBe('hello')
    expect(wrapper.find('.quest__hint').text()).toBe('Подсказка: подсказка')
    expect(wrapper.find('.quest__example').text()).toBe('Пример: пример')
  })

  it('показывает ответ по клику и переключает текст кнопки', async () => {
    const wrapper = mount(QuestCard, { props: { quest: quest() }, global: { stubs } })
    expect(wrapper.find('.quest__answer').exists()).toBe(false)
    expect(wrapper.find('.quest__show-answer').text()).toBe('Показать\u00A0ответ')

    await wrapper.find('.quest__show-answer').trigger('click')
    expect(wrapper.find('.quest__answer').exists()).toBe(true)
    expect(wrapper.find('.quest__answer-text').text()).toBe('Привет')
    expect(wrapper.find('.quest__show-answer').text()).toBe('Скрыть\u00A0ответ')
  })

  it('без дат показывает «никогда» и «сейчас»', () => {
    const wrapper = mount(QuestCard, { props: { quest: quest() }, global: { stubs } })
    const texts = wrapper.findAll('.quest__repeat-text').map((p) => p.text())
    expect(texts[0]).toBe('Повторено: никогда')
    expect(texts[1]).toBe('Следующее повторение: сейчас')
  })

  it('с датами форматирует повторения через утилиты', () => {
    const wrapper = mount(QuestCard, {
      props: { quest: quest({ lastRepeated: new Date('2024-01-01'), NextRepeated: new Date('2024-02-01') }) },
      global: { stubs },
    })
    const texts = wrapper.findAll('.quest__repeat-text').map((p) => p.text())
    expect(texts[0]).toBe('Повторено: 5 дней назад')
    expect(texts[1]).toBe('Следующее повторение: через 3 дня')
  })

  it('отображает изображение при наличии questImgName', () => {
    const wrapper = mount(QuestCard, { props: { quest: quest({ questImgName: 'img.png' }) }, global: { stubs } })
    expect(wrapper.find('.quest__img').attributes('src')).toBe('img.png')
  })

  it('скрывает кнопки редактирования для нередактируемых карточек', () => {
    const wrapper = mount(QuestCard, { props: { quest: quest() }, global: { stubs } })
    expect(wrapper.find('.quest__edit').exists()).toBe(false)
    expect(wrapper.find('.quest__delete').exists()).toBe(false)
  })

  it('эмитит edit и delete при editable', async () => {
    const q = quest()
    const wrapper = mount(QuestCard, { props: { quest: q, editable: true }, global: { stubs } })
    await wrapper.find('.quest__edit').trigger('click')
    await wrapper.find('.quest__delete').trigger('click')
    expect(wrapper.emitted('edit')?.[0]).toEqual([q])
    expect(wrapper.emitted('delete')?.[0]).toEqual([q])
  })
})
