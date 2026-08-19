<template>
  <form class='change-password' @submit.prevent='submit'>
    <h3 class='change-password__title'>Смена пароля</h3>
    <FormInput v-model='currentPassword' type='password' placeholder='Текущий пароль'></FormInput>
    <FormInput v-model='newPassword' type='password' placeholder='Новый пароль (минимум 8 символов)'></FormInput>
    <FormInput v-model='confirmPassword' type='password' placeholder='Повторите новый пароль'></FormInput>
    <p v-if='confirmError' class='change-password__error'>Пароли не совпадают</p>
    <FormButton class='change-password__submit' type='submit' :disabled='!valid'>Сменить пароль</FormButton>
  </form>
</template>

<script lang="ts" setup>
import type { FetchError } from 'ofetch'
import { computed, ref } from 'vue'
import isApiError from '~/utils/isApiError'

const emit = defineEmits<{
  (e: 'changed'): void
}>()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const submitting = ref(false)

const confirmError = computed(() =>
  confirmPassword.value.length > 0 && confirmPassword.value !== newPassword.value
)
const valid = computed(() => {
  return currentPassword.value.length > 0
    && newPassword.value.length >= 8
    && confirmPassword.value === newPassword.value
    && !submitting.value
})

async function submit() {
  if (!valid.value) return
  submitting.value = true
  const toast = useToast()
  try {
    await $fetch('/api/profile/password', {
      method: 'PUT',
      body: { currentPassword: currentPassword.value, newPassword: newPassword.value },
    })
    toast.success({
      title: 'Готово',
      message: 'Пароль изменён',
    })
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    emit('changed')
  } catch (e) {
    const fetchError = e as FetchError
    toast.error({
      title: 'Ошибка',
      message: isApiError(fetchError.data) ? (fetchError.data.message || 'Не удалось изменить пароль') : 'Не удалось изменить пароль',
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang='scss'>
.change-password{
  max-width: 420px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  border: 3px solid rgb(230, 230, 230);
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__title{
    font-size: 18px;
    color: var(--main-second-darker);
  }
  &__error{
    font-size: 14px;
    color: #C2185B;
  }
  &__submit{
    padding: 12px 24px;
    font-size: 18px;
  }
}
</style>