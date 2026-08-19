// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ChangePassword from '~~/app/components/Profile/ChangePassword.vue'

vi.mock('~~/app/utils/isApiError', () => ({
  default: () => true,
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

describe('Profile/ChangePassword', () => {
  const toastSuccess = vi.fn()
  const toastError = vi.fn()
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ success: true })
    globalThis.$fetch = fetchMock
    globalThis.useToast = () => ({ success: toastSuccess, error: toastError })
  })
  afterEach(() => {
    delete globalThis.$fetch
    delete globalThis.useToast
    toastSuccess.mockClear()
    toastError.mockClear()
  })

  function mountForm() {
    return mount(ChangePassword, { global: { stubs } })
  }

  async function fill(wrapper: ReturnType<typeof mountForm>, current: string, next: string, confirm: string) {
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue(current)
    await inputs[1].setValue(next)
    await inputs[2].setValue(confirm)
  }

  function button(wrapper: ReturnType<typeof mountForm>) {
    return wrapper.find('button')
  }

  it('кнопка отключена при пустых полях', () => {
    const wrapper = mountForm()
    expect(button(wrapper).attributes('disabled')).not.toBeUndefined()
  })

  it('кнопка отключена при коротком новом пароле', async () => {
    const wrapper = mountForm()
    await fill(wrapper, 'oldpass', 'short', 'short')
    expect(button(wrapper).attributes('disabled')).not.toBeUndefined()
  })

  it('показывает ошибку и отключает кнопку при несовпадении подтверждения', async () => {
    const wrapper = mountForm()
    await fill(wrapper, 'oldpass', 'newpassword', 'otherpassword')
    expect(wrapper.find('.change-password__error').text()).toBe('Пароли не совпадают')
    expect(button(wrapper).attributes('disabled')).not.toBeUndefined()
  })

  it('при валидных данных отправляет запрос и эмитит changed', async () => {
    const wrapper = mountForm()
    await fill(wrapper, 'oldpass', 'newpassword', 'newpassword')
    expect(button(wrapper).attributes('disabled')).toBeUndefined()

    await wrapper.find('form').trigger('submit')

    expect(fetchMock).toHaveBeenCalledWith('/api/profile/password', {
      method: 'PUT',
      body: { currentPassword: 'oldpass', newPassword: 'newpassword' },
    })
    expect(toastSuccess).toHaveBeenCalledWith({ title: 'Готово', message: 'Пароль изменён' })
    expect(wrapper.emitted('changed')).toHaveLength(1)
    const inputs = wrapper.findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('')
    expect((inputs[1].element as HTMLInputElement).value).toBe('')
    expect((inputs[2].element as HTMLInputElement).value).toBe('')
  })

  it('при ошибке показывает тост с сообщением', async () => {
    fetchMock.mockRejectedValueOnce({ data: { message: 'Неправильный текущий пароль' } })
    const wrapper = mountForm()
    await fill(wrapper, 'wrong', 'newpassword', 'newpassword')

    await wrapper.find('form').trigger('submit')

    expect(toastError).toHaveBeenCalledWith({ title: 'Ошибка', message: 'Неправильный текущий пароль' })
    expect(wrapper.emitted('changed')).toBeUndefined()
  })
})