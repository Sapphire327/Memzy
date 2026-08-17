// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Wordle from '~~/app/components/Quest/Test/Wordle.vue'
import type { RepeatableQuest } from '#shared/schemas'

vi.mock('~~/app/utils/getImageUrl', () => ({
  default: (key: string | null) => key ?? null,
}))

const stubs = {
  FormButton: {
    template: '<button type="button"><slot /></button>',
  },
}

const ANSWER = ['п', 'р', 'и', 'в', 'е', 'т']

function quest(): RepeatableQuest {
  return {
    id: 1,
    quest: 'приветствие',
    answer: ANSWER.join(''),
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

function mountWordle() {
  return mount(Wordle, { props: { quest: quest() }, global: { stubs } })
}

function tileByChar(wrapper: ReturnType<typeof mountWordle>, char: string) {
  return wrapper.findAll('.wordle__tile').find((tile) => tile.text() === char)
}

async function placeAll(wrapper: ReturnType<typeof mountWordle>, chars: string[]) {
  for (const char of chars) {
    const tile = tileByChar(wrapper, char)
    expect(tile).toBeDefined()
    await tile!.trigger('click')
  }
}

describe('Quest/Test/Wordle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('строит клетки из ответа и перемешивает буквы в банке', () => {
    const wrapper = mountWordle()
    expect(wrapper.findAll('.wordle__cell').length).toBe(ANSWER.length)
    expect(wrapper.findAll('.wordle__tile').length).toBe(ANSWER.length)
  })

  it('клик по букве заполняет первую свободную клетку', async () => {
    const wrapper = mountWordle()
    await tileByChar(wrapper, 'п')!.trigger('click')
    expect(wrapper.find('.wordle__cell').classes()).toContain('wordle__cell--filled')
    expect(tileByChar(wrapper, 'п')!.attributes('disabled')).not.toBeUndefined()
  })

  it('победа эмитит learned(true) после проверки', async () => {
    const wrapper = mountWordle()
    await placeAll(wrapper, ANSWER)
    await wrapper.find('.wordle__check').trigger('click')

    expect(wrapper.find('.wordle__cell--right').exists()).toBe(true)
    await vi.advanceTimersByTimeAsync(1200)
    expect(wrapper.emitted('learned')?.[0]).toEqual([true])
  })

  it('ошибка подсвечивает клетки и не эмитит learned', async () => {
    const wrapper = mountWordle()
    await placeAll(wrapper, [...ANSWER].reverse())
    await wrapper.find('.wordle__check').trigger('click')

    expect(wrapper.find('.wordle__cell--wrong').exists()).toBe(true)
    expect(wrapper.emitted('learned')).toBeUndefined()
  })

  it('кнопка «Заново» сбрасывает клетки и буквы', async () => {
    const wrapper = mountWordle()
    await placeAll(wrapper, ANSWER)
    await wrapper.find('.wordle__reset').trigger('click')

    expect(wrapper.findAll('.wordle__cell--filled')).toHaveLength(0)
    expect(wrapper.findAll('.wordle__tile:not([disabled])')).toHaveLength(ANSWER.length)
  })
})
