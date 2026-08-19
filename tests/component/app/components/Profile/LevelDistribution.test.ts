// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LevelDistribution from '~~/app/components/Profile/LevelDistribution.vue'
import type { LevelBucket } from '#shared/schemas'

function mountLevels(items: LevelBucket[], extra: Record<string, unknown> = {}) {
  return mount(LevelDistribution, {
    props: { title: 'Уровни', items, ...extra },
  })
}

describe('Profile/LevelDistribution', () => {
  it('рендерит заголовок и строки с количеством', () => {
    const wrapper = mountLevels([{ key: 1, count: 5 }, { key: 2, count: 2 }])
    expect(wrapper.find('.levels__title').text()).toBe('Уровни')
    const keys = wrapper.findAll('.levels__key').map((node) => node.text())
    const counts = wrapper.findAll('.levels__count').map((node) => node.text())
    expect(keys).toEqual(['1', '2'])
    expect(counts).toEqual(['5', '2'])
  })

  it('масштабирует ширину полос по максимуму', () => {
    const wrapper = mountLevels([{ key: 1, count: 1 }, { key: 2, count: 2 }])
    const fills = wrapper.findAll('.levels__fill')
    expect((fills[0].element as HTMLElement).style.width).toBe('50%')
    expect((fills[1].element as HTMLElement).style.width).toBe('100%')
  })

  it('рендерит описание под заголовком', () => {
    const wrapper = mountLevels([{ key: 1, count: 1 }], { description: 'Интервал до следующего повторения' })
    expect(wrapper.find('.levels__description').text()).toBe('Интервал до следующего повторения')
  })

  it('показывает подписи из labelMap', () => {
    const wrapper = mountLevels(
      [{ key: 1, count: 5 }, { key: 2, count: 2 }],
      { labelMap: { 1: 'Просмотр карточки', 2: 'Собрать слово' } }
    )
    const labels = wrapper.findAll('.levels__label').map((node) => node.text())
    expect(labels).toEqual(['Просмотр карточки', 'Собрать слово'])
  })

  it('без подписи в labelMap показывает только номер', () => {
    const wrapper = mountLevels([{ key: 7, count: 1 }], { labelMap: {} })
    expect(wrapper.find('.levels__label').exists()).toBe(false)
    expect(wrapper.find('.levels__key').text()).toBe('7')
  })

  it('показывает пустое состояние без данных', () => {
    const wrapper = mountLevels([])
    expect(wrapper.find('.levels__empty').text()).toBe('Пока нет данных')
    expect(wrapper.find('.levels__list').exists()).toBe(false)
  })
})