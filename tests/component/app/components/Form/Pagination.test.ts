// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Pagination from '~~/app/components/Form/Pagination.vue'

function pageLabels(wrapper: ReturnType<typeof mount>): string[] {
  return wrapper.findAll('button').map((button) => button.text())
}

function mountPagination(props: { pageCount: number; maxPageCount: number; modelValue?: number }) {
  return mount(Pagination, { props: { ...props, 'onUpdate:modelValue': () => {} } })
}

describe('Form/Pagination', () => {
  it('рендерит первые страницы при маленьком currentPage', () => {
    const wrapper = mountPagination({ pageCount: 10, maxPageCount: 7, modelValue: 1 })
    expect(pageLabels(wrapper)).toEqual(['1', '2', '3', '4', '5', '6', '7'])
  })

  it('смещает окно в середине списка', () => {
    const wrapper = mountPagination({ pageCount: 10, maxPageCount: 7, modelValue: 5 })
    expect(pageLabels(wrapper)).toEqual(['2', '3', '4', '5', '6', '7', '8'])
  })

  it('смещает окно к концу списка', () => {
    const wrapper = mountPagination({ pageCount: 10, maxPageCount: 7, modelValue: 9 })
    expect(pageLabels(wrapper)).toEqual(['4', '5', '6', '7', '8', '9', '10'])
  })

  it('не выходит за пределы при маленьком pageCount', () => {
    const wrapper = mountPagination({ pageCount: 3, maxPageCount: 7, modelValue: 2 })
    expect(pageLabels(wrapper)).toEqual(['1', '2', '3'])
  })

  it('клик по странице эмитит onPageChange и обновляет модель', async () => {
    const wrapper = mountPagination({ pageCount: 10, maxPageCount: 7, modelValue: 1 })
    await wrapper.findAll('button')[2].trigger('click')

    expect(wrapper.emitted('onPageChange')).toEqual([[3]])
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
  })

  it('выделяет текущую страницу классом', () => {
    const wrapper = mountPagination({ pageCount: 10, maxPageCount: 7, modelValue: 3 })
    const selected = wrapper.findAll('button').filter((button) => button.classes().includes('selectedBtn'))
    expect(selected).toHaveLength(1)
    expect(selected[0].text()).toBe('3')
  })
})
