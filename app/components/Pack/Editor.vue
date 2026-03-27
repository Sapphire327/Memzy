<template>
  <div class='pack-editor'>
    <h2 class='pack-editor__title'>Редактор пака</h2>
    <form class='form' @submit.prevent='handleForm'>
      <FormInput  v-model="formState.name" maxlength='100' class='create-form__input' placeholder='Название пака'></FormInput>
      <FormInput  v-model="formState.description" maxlength='100' class='create-form__input' placeholder='Описание'></FormInput>
      <ul class='tag-list'>
        <li v-for="tag in currentTags" :key=tag.name>
          <Tag @onRemoveClick='deleteTag' class='tag' :tag='tag'></Tag>
        </li>
      </ul>
      <div class='pack-editor__add-tag'>
        <FormInput  maxlength='50' v-model='formState.newTag' placeholder='Тег'></FormInput>
        <FormButton @click.prevent='addTagHandle' class='pack-editor__add-tag-btn'>Добавить</FormButton>
      </div>
      <FormCheckbox :label=isPublicText v-model="formState.isPublic" id='isPublicEditForm'></FormCheckbox>
      <FormButton>Сохранить</FormButton>
    </form>
  </div>
</template>

<script lang="ts" setup>
  import type { Tag } from '#shared/schemas/pack.schema'
import { packEditDtoSchema } from '#shared/schemas/pack.schema'
import type { FetchError } from 'ofetch'
import { z } from 'zod/v4'
  const props = defineProps<{packId:number}>()
  const errors = ref<string[]>([])
  const { data,error } = await useFetch<{pack:Pack}>(`/api/pack/${props.packId}`,)
  const isLoading = ref(false)
  type packEditor = z.output<typeof packEditDtoSchema>
  const formState = ref<packEditor&{newTag:string}>({
    id:data.value?.pack.id||-1,
    name: data.value?.pack.name || '',
    description: data.value?.pack.description || '',
    isPublic: data.value?.pack.isPublic || false,
    addedTags: [],
    deletedTags: [],
    newTag: ''
  })
  const isPublicText = computed(() => {
  return formState.value.isPublic ? 'Публичный' : 'Приватный'
  })
  function deleteTag(tag:Tag){
    if(tag.id)
      formState.value.deletedTags.push(tag.id)
    else{
      formState.value.addedTags=formState.value.addedTags.filter((currentTag)=>{
       return !(currentTag.id==null&&currentTag.name==tag.name)
      })
    }
  }
  function addTagHandle(){
    if(formState.value.newTag.length<1||currentTags.value?.some(tag=>tag.name===formState.value.newTag))
      return;
    formState.value.addedTags.push({
      id: null,
      name: formState.value.newTag
    })
    formState.value.newTag=''
  }
  async function handleForm(event:SubmitEvent){
    const result = packEditDtoSchema.safeParse(formState.value);
    if(!result.success){
      errors.value= result.error.issues.map((zError)=>{return zError.message})
      return;
    }
    try{
      isLoading.value=true;
      const response = await $fetch('/api/pack/',{
        method:'PUT',
        body:result.data
      })
    }
    catch(e){
      const fetchError = e as FetchError;
      if(isApiError(fetchError.data)){
        errors.value=[fetchError.data.message||'',...fetchError.data.data||[]]
      }
    }finally{
        isLoading.value=false;
    }
  }
  const currentTags = computed(()=>{
    return data.value?.pack.tags.filter(tag=>{
      return !formState.value.deletedTags.some(tagId=>tagId==tag.id)
    }).concat(formState.value.addedTags)
  })

  
  onMounted(()=>{
    
  })
</script>

<style scoped lang='scss'>
.form{
  margin: auto;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-self: start;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.4);
  padding: 10px;
  border-radius: 10px;
}
.pack-editor{
  &__title{
    text-align: center;
    font-size: 24px;
    padding-bottom: 10px;
  }
  &__add-tag{
    display: flex;
    gap: 10px;
  }
  &__add-tag-btn{
    font-size: 16px;
    padding: 8px;
  }
}
.tag-list{
  display: flex;
  gap: 5px;
  flex-wrap: wrap;

}
</style>