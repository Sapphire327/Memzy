<template>
  <div class='wrap'>
    <form v-if='!registredSuccess' class='form' @submit.prevent='onSignUp'>
      <ul class='error'>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
      <FormInput v-model='formState.name' name="name"  class='inputName' placeholder='имя' autocomplete='on'></FormInput>
      <FormInput v-model='formState.email' name="email"  type='mail' class='inputName' placeholder='почта' autocomplete='on'></FormInput>
      <FormInput v-model='formState.password' name="password"  type='password' class='inputName' placeholder='пароль' autocomplete='off'></FormInput>
      <FormButton :disabled='loading'>Зарегистрироваться</FormButton>
    </form>
    <div v-else>
      <p class='reg-finished-text'>Для завершения регистрации перейдите по ссылке в письме, которое мы только что отправили на ваш email.</p>
    </div>
  </div>
</template>

<script lang="ts" setup >
import type { FetchError } from 'ofetch'
import { z } from 'zod/v4'
const { loggedIn} = useUserSession()
if(loggedIn.value){
   navigateTo('/')
}

const registerSchema = z.object({
    name:z.string().min(3,'Длина имени: от 3 символов'),
    password:z.string().min(8,'Длина пароля: от 8 символов'),
    email:z.email('Некорректный email адрес'),
})
const loading = ref(false)
const registredSuccess = ref(false)
type Schema = z.output<typeof registerSchema>
const formState = ref<Schema>({
  name:'',
  email:'',
  password:''
})
const errors = ref<string[]>([])
async function onSignUp(event:SubmitEvent){
 const result = registerSchema.safeParse(formState.value);
 if(!result.success){
  errors.value = result.error.issues.map((zError)=>{return zError.message})
  return;
 }
 try{
  loading.value=true;
  const response = await $fetch('/api/auth/registration',{
    method:'POST',
    body:result.data
  })
  registredSuccess.value=true
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

  /* background-color: white; */
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
.reg-finished-text{
  font-size: 18px;
  margin-top: 26px;
}
</style>