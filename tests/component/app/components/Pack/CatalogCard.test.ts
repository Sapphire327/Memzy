// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CatalogCard from '~~/app/components/Pack/CatalogCard.vue'
import type { CatalogPack } from '#shared/schemas'

const navigateTo = vi.fn()
globalThis.navigateTo = navigateTo

const stubs = {
  Tag: { props: ['tag'], template: '<span class="tag-stub">{{ tag.name }}</span>' },
  FormButton: { template: '<button type="button"><slot /></button>' },
}

function pack(overrides: Partial<CatalogPack> = {}): CatalogPack {
  return {
    id: 2,
    name: 'публичный',
    description: null,
    isPublic: true,
    tags: [],
    authorId: 1,
    isSubscribed: false,
    ...overrides,
  }
}

describe('Pack/CatalogCard', () => {
  afterEach(() => {
    navigateTo.mockClear()
  })

  it('отображает название и описание', () => {
    const wrapper = mount(CatalogCard, { props: { pack: pack(), canSubscribe: true }, global: { stubs } })
    expect(wrapper.find('.catalog-pack__name').text()).toBe('публичный')
  })

  it('клик по карточке открывает страницу пака', async () => {
    const wrapper = mount(CatalogCard, { props: { pack: pack(), canSubscribe: true }, global: { stubs } })
    await wrapper.find('.catalog-pack').trigger('click')
    expect(navigateTo).toHaveBeenCalledWith('/packs/2')
  })

  it('скрывает кнопку подписки при canSubscribe=false', () => {
    const wrapper = mount(CatalogCard, { props: { pack: pack(), canSubscribe: false }, global: { stubs } })
    expect(wrapper.find('.catalog-pack__subscribe').exists()).toBe(false)
  })

  it('подписка эмитит subscribe и не открывает пак', async () => {
    const wrapper = mount(CatalogCard, { props: { pack: pack(), canSubscribe: true }, global: { stubs } })
    await wrapper.find('.catalog-pack__subscribe').trigger('click')
    expect(wrapper.emitted('subscribe')?.[0]?.[0]).toMatchObject({ id: 2 })
    expect(navigateTo).not.toHaveBeenCalled()
  })

  it('отображает «Отписаться» и класс активности для подписанных', () => {
    const wrapper = mount(CatalogCard, { props: { pack: pack({ isSubscribed: true }), canSubscribe: true }, global: { stubs } })
    expect(wrapper.find('.catalog-pack__subscribe').text()).toBe('Отписаться')
    expect(wrapper.find('.catalog-pack__subscribe').classes()).toContain('catalog-pack__subscribe--active')
  })
})
