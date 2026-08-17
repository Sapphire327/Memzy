// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Session from '~~/app/components/Quest/Test/Session.vue'
import type { RepeatableQuest } from '#shared/schemas'

const stubs = {
  QuestTestFinish: { template: '<div class="finish-stub" />' },
  QuestTestLearning: { template: '<div class="learning-stub"><button type="button" @click="$emit(\'learned\', true)">ok</button></div>' },
  QuestTestWordle: { template: '<div class="wordle-stub"><button type="button" @click="$emit(\'learned\', false)">ok</button></div>' },
  QuestTestTyping: { template: '<div class="typing-stub"><button type="button" @click="$emit(\'learned\', true)">ok</button></div>' },
}

function quest(id: number, level: number | null): RepeatableQuest {
  return {
    id,
    quest: 'q' + id,
    answer: 'a' + id,
    hint: null,
    exampleInText: null,
    questImgName: null,
    answerImgName: null,
    packId: 1,
    lastRepeated: null,
    NextRepeated: null,
    level,
    stage: null,
  }
}

afterEach(() => {
  delete globalThis.useToast
  delete globalThis.isApiError
})

describe('Quest/Test/Session', () => {
  it.each([
    [null, '.learning-stub'],
    [0, '.learning-stub'],
    [1, '.learning-stub'],
    [2, '.wordle-stub'],
    [3, '.wordle-stub'],
    [4, '.typing-stub'],
    [5, '.typing-stub'],
  ])('уровень %s рендерит %s', (level, selector) => {
    const wrapper = mount(Session, {
      props: { quests: [quest(1, level as number | null)], save: vi.fn() },
      global: { stubs },
    })
    expect(wrapper.find(selector).exists()).toBe(true)
  })

  it('проходит все вопросы и сохраняет результаты одним вызовом', async () => {
    const save = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(Session, {
      props: { quests: [quest(1, null), quest(2, 3), quest(3, 5)], save },
      global: { stubs },
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.wordle-stub').exists()).toBe(true)
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.typing-stub').exists()).toBe(true)
    await wrapper.find('button').trigger('click')

    expect(wrapper.find('.finish-stub').exists()).toBe(true)
    await flushPromises()
    expect(save).toHaveBeenCalledTimes(1)
    const results = save.mock.calls[0][0] as Map<number, boolean>
    expect([...results.entries()]).toEqual([[1, true], [2, false], [3, true]])
  })

  it('при ошибке сохранения показывает тост об ошибке', async () => {
    const toastError = vi.fn()
    globalThis.useToast = () => ({ error: toastError })
    globalThis.isApiError = () => false

    const save = vi.fn().mockRejectedValue(new Error('boom'))
    const wrapper = mount(Session, {
      props: { quests: [quest(1, null)], save },
      global: { stubs },
    })
    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(save).toHaveBeenCalledTimes(1)
    expect(toastError).toHaveBeenCalledWith({ title: 'Ошибка', message: 'Не удалось сохранить результат' })
  })
})
