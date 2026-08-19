// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import PackProgress from '~~/app/components/Profile/PackProgress.vue'
import type { ProfilePackProgress } from '#shared/schemas'

vi.mock('~~/app/utils/untilString', () => ({
  default: () => 'через 3 дня',
}))

const stubs = {
  NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
}

function pack(overrides: Partial<ProfilePackProgress> = {}): ProfilePackProgress {
  return {
    id: 1,
    name: 'пак',
    isPublic: true,
    totalQuests: 10,
    learnedQuests: 4,
    ...overrides,
  }
}

function mountProgress(packs: ProfilePackProgress[]) {
  return mount(PackProgress, { props: { packs }, global: { stubs } })
}

describe('Profile/PackProgress', () => {
  it('рендерит строку пака со счётом и следующим повторением', () => {
    const wrapper = mountProgress([pack({ id: 2, name: 'английский', nextRepeat: new Date() })])
    const row = wrapper.find('.pack-progress__row')
    expect(row.attributes('href')).toBe('/packs/2')
    expect(row.find('.pack-progress__name').text()).toBe('английский')
    expect(row.find('.pack-progress__count').text()).toBe('4 / 10')
    expect(row.find('.pack-progress__next').text()).toBe('через 3 дня')
  })

  it('без следующего повторения показывает «—»', () => {
    const wrapper = mountProgress([pack()])
    expect(wrapper.find('.pack-progress__next').text()).toBe('—')
  })

  it('показывает пустое состояние', () => {
    const wrapper = mountProgress([])
    expect(wrapper.find('.pack-progress__empty').text()).toBe('Нет паков')
  })
})