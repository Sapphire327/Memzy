// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PackCard from '~~/app/components/Pack/Card.vue'
import type { UsersPack } from '#shared/schemas'

vi.mock('~~/app/utils/daysAgoString', () => ({
  default: () => '5 дней назад',
}))
vi.mock('~~/app/utils/untilString', () => ({
  default: () => 'через 3 дня',
}))

const stubs = {
  NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
  Tag: { props: ['tag'], template: '<span class="tag-stub">{{ tag.name }}</span>' },
}

function pack(overrides: Partial<UsersPack> = {}): UsersPack {
  return {
    id: 1,
    name: 'пак',
    description: 'описание',
    isPublic: true,
    tags: [{ id: 1, name: 'метка' }],
    authorId: 1,
    ...overrides,
  }
}

describe('Pack/Card', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('отображает название, описание и теги', () => {
    const wrapper = mount(PackCard, { props: { pack: pack() }, global: { stubs } })
    expect(wrapper.find('.pack__name').text()).toBe('пак')
    expect(wrapper.find('.pack__description').text()).toBe('описание')
    expect(wrapper.find('.tag-stub').text()).toBe('метка')
  })

  it('ссылка ведёт на страницу пака', () => {
    const wrapper = mount(PackCard, { props: { pack: pack() }, global: { stubs } })
    expect(wrapper.find('a').attributes('href')).toBe('/packs/1')
  })

  it('показывает повторения только при наличии дат', () => {
    const wrapper = mount(PackCard, { props: { pack: pack() }, global: { stubs } })
    expect(wrapper.find('.pack__last-repeat').exists()).toBe(false)

    const withDates = mount(PackCard, {
      props: { pack: pack({ lastRepeat: new Date('2024-01-01'), nextRepeat: new Date('2024-02-01') }) },
      global: { stubs },
    })
    const texts = withDates.findAll('.pack__last-repeat').map((p) => p.text())
    expect(texts[0]).toBe('Последнее повторение: 5 дней назад')
    expect(texts[1]).toBe('Следующее повторение: через 3 дня')
  })

  it('включает анимацию при наведении и выключает через 800мс', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PackCard, { props: { pack: pack() }, global: { stubs } })
    expect(wrapper.find('.reflect').classes()).not.toContain('reflectAnimation')

    await wrapper.find('.pack').trigger('mouseenter')
    expect(wrapper.find('.reflect').classes()).toContain('reflectAnimation')

    await vi.advanceTimersByTimeAsync(800)
    expect(wrapper.find('.reflect').classes()).not.toContain('reflectAnimation')
  })
})
