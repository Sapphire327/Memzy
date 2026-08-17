// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FormInput from '~~/app/components/Form/Input.vue'

describe('Form/Input', () => {
  it('отображает переданное значение', () => {
    const wrapper = mount(FormInput, { props: { modelValue: 'hello' } })
    expect((wrapper.element as HTMLInputElement).value).toBe('hello')
  })

  it('эмитит update:modelValue при вводе', async () => {
    const wrapper = mount(FormInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('world')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['world'])
  })

  it('пробрасывает атрибуты на input', () => {
    const wrapper = mount(FormInput, { props: { modelValue: '' }, attrs: { placeholder: 'Введи текст' } })
    expect(wrapper.attributes('placeholder')).toBe('Введи текст')
  })
})
