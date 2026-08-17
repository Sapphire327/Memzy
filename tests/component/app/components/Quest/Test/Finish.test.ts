// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Finish from '~~/app/components/Quest/Test/Finish.vue'
import type { RepeatableQuest } from '#shared/schemas'

const stubs = {
  NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
  FormButton: { template: '<button type="button"><slot /></button>' },
}

function quest(id: number): RepeatableQuest {
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
    level: null,
    stage: null,
  }
}

function mountFinish(quests: RepeatableQuest[], results: Map<number, boolean>, backTo = '/packs') {
  return mount(Finish, { props: { quests, results, backTo }, global: { stubs } })
}

describe('Quest/Test/Finish', () => {
  it('считает процент и количество правильных ответов', () => {
    const wrapper = mountFinish(
      [quest(1), quest(2), quest(3), quest(4)],
      new Map([[1, true], [2, false], [3, true], [4, true]])
    )
    expect(wrapper.find('.finish__accuracy').text()).toBe('75%')
    expect(wrapper.find('.finish__text').text()).toBe('Верно 3 из 4')
  })

  it('при отсутствии вопросов показывает 0%', () => {
    const wrapper = mountFinish([], new Map())
    expect(wrapper.find('.finish__accuracy').text()).toBe('0%')
    expect(wrapper.find('.finish__text').text()).toBe('Верно 0 из 0')
  })

  it('подбирает подзаголовок по проценту', () => {
    const allRight = mountFinish([quest(1)], new Map([[1, true]]))
    expect(allRight.find('.finish__subtitle').text()).toBe('Отлично!')

    const good = mountFinish([quest(1), quest(2), quest(3), quest(4)], new Map([[1, true], [2, true], [3, true], [4, false]]))
    expect(good.find('.finish__subtitle').text()).toBe('Хорошая работа!')

    const ok = mountFinish([quest(1), quest(2)], new Map([[1, true], [2, false]]))
    expect(ok.find('.finish__subtitle').text()).toBe('Неплохо, но есть над чем поработать')

    const bad = mountFinish([quest(1), quest(2)], new Map([[1, false], [2, false]]))
    expect(bad.find('.finish__subtitle').text()).toBe('Попробуй ещё раз — получится!')
  })

  it('ссылка «К списку» ведёт на backTo', () => {
    const wrapper = mountFinish([quest(1)], new Map(), '/packs/repeat')
    expect(wrapper.find('.finish__link').attributes('href')).toBe('/packs/repeat')
  })
})
