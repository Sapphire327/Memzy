<template>
  <div class='wrap'>
    <form class='form' @submit.prevent='onSignIn'>
      <ul class='error'>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
      <FormInput v-model='formState.email' name="email"  type='mail' class='input' placeholder='почта' autocomplete="username"></FormInput>
      <FormInput v-model='formState.password' name="password"  type='password' class='input' placeholder='пароль' autocomplete="current-password"></FormInput>
      <FormButton :disabled='loading' class='form__button'>Вход</FormButton>
      <NuxtLink class='form__link' to='/auth/signup'>Зарегистрироваться</NuxtLink>
      <NuxtLink class='form__link' to='/auth/signup'>Забыли пароль</NuxtLink>
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { FetchError } from 'ofetch'
import { z } from 'zod/v4'
const loading = ref(false)
const loginSchema = z.object({
    password:z.string(),
    email:z.email('Некорректный email адрес'),
})
type Schema = z.output<typeof loginSchema>
const formState = ref<Schema>({
  email:'',
  password:''
})
const errors = ref<string[]>([])
async function onSignIn(event:SubmitEvent){
 const result = loginSchema.safeParse(formState.value);
 if(!result.success){
  errors.value= result.error.issues.map((zError)=>{return zError.message})
  return;
 }
 try{
  loading.value=true;
  const response = await $fetch('/api/auth/login',{
    method:'POST',
    body:result.data
  })
  const session = useUserSession()
  await session.fetch();
  return navigateTo('/')
 }
 catch(e){
  const fetchError = e as FetchError;
  if(isApiError(fetchError.data)){
    errors.value=[fetchError.data.message||'',...fetchError.data.data]
  }
 }finally{
    loading.value=false;
 }
}

</script>

<style lang='scss' scoped>
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
  align-items: flex-start;
  color: var(--dark-text);
  &__button{
    width: 100%;
  }
  &__link{
  font-size: 17px;
  display: inline;
  color: var(--dark-text);
  position: relative;
  &:hover::after{
      width: 100%;
  }
    &::after{
      content: '';
      position: absolute;
      background-color: var(--dark-text);
      width: 0%;
      height: 2px;
      left: 0;
      bottom: -4px;
      transition: all 0.3s ease;
    }
  }
  /* background-color: white; */
}


.input{
  width: 100%;
  font-size: 20px;
}
.error{
  min-height: 25px;
  font-size: 16px;
  color: black;
}
</style>