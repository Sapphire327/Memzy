<template>
  <div class='create-form'>
    <p class='error'>{{ error }}</p>
    <FormInput  v-model="formState.name" maxlength='100' class='create-form__input' placeholder='Название пака'></FormInput>
    <FormInput  v-model="formState.description" maxlength='100' class='create-form__input' placeholder='Описание'></FormInput>
    <FormCheckbox :label=isPublicText v-model="formState.isPublic"></FormCheckbox>
    <FormButton @click='createPack' :disable='loading'>Создать</FormButton>
  </div>
</template> 

<script lang="ts" setup>
import { packCreateDtoSchema } from '#shared/schemas/pack.schema'
import type { FetchError } from 'ofetch'
import { z } from 'zod/v4'
import type { Pack } from './types'
const loading = ref(false)
const error = ref<string>('')
const formState = ref<z.output<typeof packCreateDtoSchema>>({
  name:'',
  description:'',
  isPublic:false
})
const isPublicText = computed(() => {
  return formState.value.isPublic ? 'Публичный' : 'Приватный'
})

async function createPack(event:SubmitEvent){
 try{
  loading.value=true;
  const result = packCreateDtoSchema.safeParse(formState.value);
  if(!result.success){
    error.value = result.error.issues[0]?.message||''
    return;
  }
  const response = await $fetch<{pack:Pack}>('/api/pack',{
    method:'POST',
    body:result.data
  })
  return navigateTo('/packs/'+response.pack.id)
 }
 catch(e){
  const fetchError = e as FetchError;
  if(isApiError(fetchError.data)){
    error.value=fetchError.data.message||''
  }else{
    error.value='Произошла непредвиденная ошибка, попробуй повторить позже'
  }
 }finally{
    loading.value=false;
 }
}
</script>

<style scoped lang='scss'>
.create-form{
  display: flex;
  flex-direction: column;
  gap: 15px;
  &__input{
    border: 2px solid var(--main-second);
  }
}
.error{
  max-width: 200px;
}
</style>