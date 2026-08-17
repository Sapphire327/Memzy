// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Typing from '~~/app/components/Quest/Test/Typing.vue'
import type { RepeatableQuest } from '#shared/schemas'

vi.mock('~~/app/utils/getImageUrl', () => ({
  default: (key: string | null) => key ?? null,
}))

const stubs = {
  FormInput: {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  },
  FormButton: {
    template: '<button type="button"><slot /></button>',
  },
}

function quest(): RepeatableQuest {
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
  }
}

function mountTyping() {
  return mount(Typing, { props: { quest: quest() }, global: { stubs } })
}

async function typeAnswer(wrapper: ReturnType<typeof mountTyping>, value: string) {
  await wrapper.find('input').setValue(value)
  await wrapper.find('form').trigger('submit')
}

describe('Quest/Test/Typing', () => {
  it('отображает вопрос и поле ввода', () => {
    const wrapper = mountTyping()
    expect(wrapper.find('.typing__text').text()).toBe('hello')
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('.typing__check').exists()).toBe(true)
  })

  it('пустой ввод не тратит попытки', async () => {
    const wrapper = mountTyping()
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('.typing__feedback').exists()).toBe(false)
    expect(wrapper.emitted('learned')).toBeUndefined()
  })

  it('верный ответ показывает раскрытие и эмитит learned(true)', async () => {
    const wrapper = mountTyping()
    await typeAnswer(wrapper, 'привет')

    expect(wrapper.find('.typing__feedback--right').exists()).toBe(true)
    expect(wrapper.find('.typing__reveal').exists()).toBe(true)
    expect(wrapper.find('.typing__reveal-text').text()).toBe('Привет')

    await wrapper.find('.typing__next').trigger('click')
    expect(wrapper.emitted('learned')?.[0]).toEqual([true])
  })

  it('нормализует ответ (регистр и лишние пробелы)', async () => {
    const wrapper = mountTyping()
    await typeAnswer(wrapper, '  ПРИВЕТ   ')
    expect(wrapper.find('.typing__feedback--right').exists()).toBe(true)
  })

  it('неверные ответы уменьшают счётчик попыток', async () => {
    const wrapper = mountTyping()
    await typeAnswer(wrapper, 'неверно')
    expect(wrapper.find('.typing__feedback--wrong').text()).toBe('Неверно, осталось 2 попытки')

    await typeAnswer(wrapper, 'неверно')
    expect(wrapper.find('.typing__feedback--wrong').text()).toBe('Неверно, осталось 1 попытка')
  })

  it('после трёх ошибок раскрывает ответ и эмитит learned(false)', async () => {
    const wrapper = mountTyping()
    await typeAnswer(wrapper, 'a')
    await typeAnswer(wrapper, 'b')
    await typeAnswer(wrapper, 'c')

    expect(wrapper.find('.typing__reveal').exists()).toBe(true)
    await wrapper.find('.typing__next').trigger('click')
    expect(wrapper.emitted('learned')?.[0]).toEqual([false])
  })
})
