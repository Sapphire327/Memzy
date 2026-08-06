<template>
  <div class='quest-create-form'>
    <h2 class='quest-create-form__title'>{{ isEdit ? 'Редактировать слово' : 'Новое слово' }}</h2>
    <ul class='error'>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
    <FormInput v-model="formState.quest" class='quest-create-form__input' placeholder='Вопрос'></FormInput>
    <FormImageUploader v-model:file='questImage' :initial-src='questImgSrc' v-model:removed='removeQuestImage' label='Картинка вопроса (необязательно)'></FormImageUploader>
    <FormInput v-model="formState.answer" class='quest-create-form__input' placeholder='Ответ'></FormInput>
    <FormImageUploader v-model:file='answerImage' :initial-src='answerImgSrc' v-model:removed='removeAnswerImage' label='Картинка ответа (необязательно)'></FormImageUploader>
    <FormInput v-model="formState.hint" class='quest-create-form__input' placeholder='Подсказка (необязательно)'></FormInput>
    <FormInput v-model="formState.exampleInText" class='quest-create-form__input' placeholder='Пример (необязательно)'></FormInput>
    <FormButton :disabled='loading' @click='submit'>{{ isEdit ? 'Сохранить' : 'Добавить' }}</FormButton>
  </div>
</template>

<script lang="ts" setup>
import type { Quest } from '#shared/schemas'
import { questCreateDtoSchema, questEditDtoSchema } from '#shared/schemas/pack.schema'
import type { FetchError } from 'ofetch'
import { z } from 'zod/v4'
import getImageUrl from '~/utils/getImageUrl'

const props = defineProps<{ packId: number, quest?: Quest | null }>()
const emits = defineEmits<{
  (e: 'created', quest: Quest): void
  (e: 'updated', quest: Quest): void
}>()

const isEdit = computed(() => !!props.quest)
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
const removeQuestImage = ref(false)
const removeAnswerImage = ref(false)

const questImgSrc = computed(() => isEdit.value ? getImageUrl(props.quest?.questImgName) : null)
const answerImgSrc = computed(() => isEdit.value ? getImageUrl(props.quest?.answerImgName) : null)

watch(() => props.quest, (quest) => {
  formState.value = {
    quest: quest?.quest || '',
    answer: quest?.answer || '',
    hint: quest?.hint || '',
    exampleInText: quest?.exampleInText || ''
  }
  questImage.value = null
  answerImage.value = null
  removeQuestImage.value = false
  removeAnswerImage.value = false
  errors.value = []
}, { immediate: true })

async function submit(){
  const result = isEdit.value ? questEditDtoSchema.safeParse(formState.value) : questCreateDtoSchema.safeParse(formState.value);
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

    if(isEdit.value){
      if (!props.quest) return
      form.append('removeQuestImage', String(removeQuestImage.value))
      form.append('removeAnswerImage', String(removeAnswerImage.value))
      const response = await $fetch<{ quest: Quest }>(`/api/pack/${props.packId}/quests/${props.quest.id}`, {
        method: 'PUT',
        body: form
      })
      errors.value = []
      emits('updated', response.quest)
    }else{
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