// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Learning from '~~/app/components/Quest/Test/Learning.vue'
import type { RepeatableQuest } from '#shared/schemas'

vi.mock('~~/app/utils/getImageUrl', () => ({
  default: (key: string | null) => key ?? null,
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

describe('Quest/Test/Learning', () => {
  it('отображает слово и перевод', () => {
    const wrapper = mount(Learning, { props: { quest: quest() }, global: { stubs } })
    const texts = wrapper.findAll('.learning__text').map((p) => p.text())
    expect(texts).toEqual(['hello', 'Привет'])
  })

  it('показывает подсказку и пример при наличии', () => {
    const wrapper = mount(Learning, { props: { quest: quest({ hint: 'подсказка', exampleInText: 'пример' }) }, global: { stubs } })
    expect(wrapper.find('.learning__hint').text()).toBe('Подсказка: подсказка')
    expect(wrapper.find('.learning__example').text()).toBe('Пример: пример')
  })

  it('отображает изображение при наличии questImgName', () => {
    const wrapper = mount(Learning, { props: { quest: quest({ questImgName: 'img.png' }) }, global: { stubs } })
    expect(wrapper.find('.learning__img').attributes('src')).toBe('img.png')
  })

  it('эмитит learned(true) по кнопке «Запомнил»', async () => {
    const wrapper = mount(Learning, { props: { quest: quest() }, global: { stubs } })
    await wrapper.find('.learning__learned').trigger('click')
    expect(wrapper.emitted('learned')?.[0]).toEqual([true])
  })
})
