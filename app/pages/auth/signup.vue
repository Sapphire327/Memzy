<template>
  <div class='wrap'>
    <form class='form' @submit.prevent='onSignUp'>
      <ul class='error'>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
      <FormInput v-model='formState.login' name="login" class='inputName' placeholder='логин' autocomplete='on'></FormInput>
      <FormInput v-model='formState.password' name="password" type='password' class='inputName' placeholder='пароль' autocomplete='off'></FormInput>
      <p class='warning'>Мы не храним персональные данные пользователей, поэтому восстановление пароля невозможно. Пожалуйста, не забывайте пароль.</p>
      <FormButton :disabled='loading'>Зарегистрироваться</FormButton>
    </form>
  </div>
</template>

<script lang="ts" setup >
import type { FetchError } from 'ofetch'
import { z } from 'zod/v4'

useHead({ title: 'Регистрация' })

const { loggedIn } = useUserSession()
if(loggedIn.value){
   navigateTo('/')
}

const registerSchema = z.object({
    login: z.string().min(3, 'Логин должен быть не менее 3 символов').max(50, 'Логин не может быть длиннее 50 символов'),
    password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
})

const loading = ref(false)
type Schema = z.output<typeof registerSchema>
const formState = ref<Schema>({
  login: '',
  password: ''
})
const errors = ref<string[]>([])

async function onSignUp(event: SubmitEvent){
 const result = registerSchema.safeParse(formState.value);
 if(!result.success){
  errors.value = result.error.issues.map((zError) => zError.message)
  return;
 }
 try{
  loading.value = true;
  const response = await $fetch('/api/auth/registration', {
    method: 'POST',
    body: result.data
  })
  const session = useUserSession()
  await session.fetch()
  return navigateTo('/')
 }
 catch(e){
  const fetchError = e as FetchError;
  if(isApiError(fetchError.data)){
    errors.value = [fetchError.data.message || '', ...fetchError.data.data||[]]
  }
 } finally {
    loading.value = false;
 }
}
</script>

<style scoped>
.wrap{
  width: 100%;
  display: flex;
  justify-content: center;
}
.form{
  margin: auto;
  margin-top: 25px;
  max-width: 300px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
    color: var(--dark-text);
}
.inputName{
  width: 100%;
  font-size: 20px;
}
.error{
  min-height: 25px;
  font-size: 16px;
  color: black;
}
.warning{
  font-size: 13px;
  color: var(--dark-text);
  opacity: 0.8;
  word-break: break-word;
}
</style>