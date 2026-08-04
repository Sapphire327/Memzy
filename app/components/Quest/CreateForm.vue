<template>
  <div class='quest-create-form'>
    <h2 class='quest-create-form__title'>Новое слово</h2>
    <ul class='error'>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
    <FormInput v-model="formState.quest" class='quest-create-form__input' placeholder='Вопрос'></FormInput>
    <FormImageUploader v-model:file='questImage' label='Картинка вопроса (необязательно)'></FormImageUploader>
    <FormInput v-model="formState.answer" class='quest-create-form__input' placeholder='Ответ'></FormInput>
    <FormImageUploader v-model:file='answerImage' label='Картинка ответа (необязательно)'></FormImageUploader>
    <FormInput v-model="formState.hint" class='quest-create-form__input' placeholder='Подсказка (необязательно)'></FormInput>
    <FormInput v-model="formState.exampleInText" class='quest-create-form__input' placeholder='Пример (необязательно)'></FormInput>
    <FormButton :disabled='loading' @click='createQuest'>Добавить</FormButton>
  </div>
</template>

<script lang="ts" setup>
import type { Quest } from '#shared/schemas'
import { questCreateDtoSchema } from '#shared/schemas/pack.schema'
import type { FetchError } from 'ofetch'
import { z } from 'zod/v4'

const props = defineProps<{ packId: number }>()
const emits = defineEmits<{
  (e: 'created', quest: Quest): void
}>()

const loading = ref(false)
const errors = ref<string[]>([])
const formState = ref<z.output<typeof questCreateDtoSchema>>({
  quest: '',
  answer: '',
  hint: '',
  exampleInText: ''
})
const questImage = ref<File | null>(null)
const answerImage = ref<File | null>(null)

async function createQuest(){
  const result = questCreateDtoSchema.safeParse(formState.value);
  if(!result.success){
    errors.value = result.error.issues.map((zError) => zError.message)
    return;
  }
  try{
    loading.value = true;
    const form = new FormData()
    form.append('quest', result.data.quest)
    form.append('answer', result.data.answer)
    if (result.data.hint) form.append('hint', result.data.hint)
    if (result.data.exampleInText) form.append('exampleInText', result.data.exampleInText)
    if (questImage.value) form.append('questImage', questImage.value)
    if (answerImage.value) form.append('answerImage', answerImage.value)
    const response = await $fetch<{ quest: Quest }>(`/api/pack/${props.packId}/quests`, {
      method: 'POST',
      body: form
    })
    formState.value = {
      quest: '',
      answer: '',
      hint: '',
      exampleInText: ''
    }
    questImage.value = null
    answerImage.value = null
    errors.value = []
    emits('created', response.quest)
  }
  catch(e){
    const fetchError = e as FetchError;
    if(isApiError(fetchError.data)){
      errors.value = [fetchError.data.message || '', ...fetchError.data.data||[]]
    }else{
      errors.value = ['Произошла непредвиденная ошибка, попробуй повторить позже']
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang='scss'>
.quest-create-form{
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  &__title{
    font-size: 22px;
    text-align: center;
  }
  &__input{
    border: 2px solid var(--main-second);
  }
}
.error{
  font-size: 16px;
  color: black;
}
</style>