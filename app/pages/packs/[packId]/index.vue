<template>
  <div class='main'>
    <div class='pack-info'>
      <div class='pack-info__text'>
        <h1 class='pack-info__name'>{{ data?.pack.name }}</h1>
        <p v-if='data?.pack.description' class='pack-info__description'>{{ data?.pack.description }}</p>
        <ul class='pack-info__tag-list'>
          <li v-for="tag in data?.pack.tags" :key="tag.id">
            <Tag :font-size='14' :tag='tag' :show-delete-button='false'></Tag>
          </li>
        </ul>
      </div>
      <NuxtLink v-if='isOwner' :to="'/packs/edit/' + route.params.packId">
        <FormButton class='pack-info__edit-btn'>Редактировать</FormButton>
      </NuxtLink>
    </div>

    <div class='main__top-buttons'>
      <template v-if='isOwner || isSubscribed'>
        <NuxtLink :to="`/packs/${packId}/repeat`"><FormButton class='form__button'>Изучить</FormButton></NuxtLink>
        <NuxtLink :to="`/packs/${packId}/repeat?practice=true`"><FormButton class='form__button'>Повторить все</FormButton></NuxtLink>
      </template>
      <template v-else>
        <FormButton class='form__button' @click='subscribe'>Подписаться</FormButton>
      </template>
      <FormButton v-if='isOwner' class='form__button' @click='openCreatePopup'>Добавить слово</FormButton>
    </div>

    <AppModal v-model:is-open='isOpen'>
      <QuestCreateForm v-if='packId' :pack-id='packId' :quest='editingQuest' @created='onQuestCreated' @updated='onQuestUpdated'></QuestCreateForm>
    </AppModal>

    <AppConfirm v-model:is-open='deleteConfirmOpen' title='Удалить слово?' :message='deleteQuest?.quest || undefined' @confirm='onConfirmDelete'></AppConfirm>

    <div class='main__quests'>
      <QuestCard v-if='questsData?.quests?.length' v-for="quest in questsData?.quests" :quest='quest' :editable='isOwner' @edit='openEditPopup' @delete='openDeletePopup'></QuestCard>
      <p v-else class='main__empty'>В этом паке пока нет слов</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Quest, RepeatableQuest } from '#shared/schemas'
import type { FetchError } from 'ofetch'
import authMiddleware from '~/middleware/auth'

definePageMeta({
 middleware: authMiddleware,
})

const route = useRoute();
const packId = computed<number|null>(() => {
  if(route.params.packId && typeof route.params.packId === 'string')
    return parseInt(route.params.packId);
  else
    return null
});

const { user } = useUserSession()
const isOwner = computed(() => {
  return !!user.value?.id && !!data.value?.pack && user.value.id === data.value.pack.authorId
});
const isSubscribed = computed(() => !!data.value?.pack?.isSubscribed)

const { data, refresh } = await useFetch<{ pack: UsersPack }>(`/api/pack/${packId.value}`)
useHead(() => ({ title: data.value?.pack.name ?? 'Пак' }))
const { data: questsData, refresh: refreshQuests } = await useFetch<{ quests: RepeatableQuest[] }>(`/api/pack/${packId.value}/quests`)

const isOpen = ref(false)
const editingQuest = ref<Quest | null>(null)

function openCreatePopup(){
  editingQuest.value = null
  isOpen.value = true
}

function openEditPopup(quest: Quest){
  editingQuest.value = quest
  isOpen.value = true
}

function onQuestCreated(quest: Quest){
  isOpen.value = false
  refreshQuests()
}

function onQuestUpdated(quest: Quest){
  isOpen.value = false
  refreshQuests()
}

async function subscribe(){
  if(!packId.value) return
  try{
    await $fetch(`/api/packs/${packId.value}/subscribe`,{
      method:'POST'
    })
    const toast = useToast()
    toast.success({
      title: 'Подписано',
      message: 'Вы подписались на пак',
    })
    await refresh()
  }
  catch(e){
    const fetchError = e as FetchError
    const toast = useToast()
    toast.error({
      title: 'Ошибка',
      message: isApiError(fetchError.data) ? (fetchError.data.message || 'Не удалось подписаться') : 'Не удалось подписаться',
    })
  }
}

const deleteConfirmOpen = ref(false)
const deleteQuest = ref<RepeatableQuest | null>(null)

function openDeletePopup(quest: RepeatableQuest){
  deleteQuest.value = quest
  deleteConfirmOpen.value = true
}

async function onConfirmDelete(){
  if(!deleteQuest.value || !packId.value) return
  try{
    await $fetch(`/api/pack/${packId.value}/quests/${deleteQuest.value.id}`,{
      method:'DELETE'
    })
    const toast = useToast()
    toast.success({
      title: 'Удалено',
      message: 'Слово удалено',
    })
    deleteConfirmOpen.value = false
    deleteQuest.value = null
    refreshQuests()
  }
  catch(e){
    const fetchError = e as FetchError
    const toast = useToast()
    toast.error({
      title: 'Ошибка',
      message: isApiError(fetchError.data) ? (fetchError.data.message || 'Не удалось удалить слово') : 'Не удалось удалить слово',
    })
  }
}
</script>

<style scoped lang='scss'>
.main{
  max-width: 1200px;
  margin: auto;
  &__top-buttons{
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  &__quests{
    margin-top: 30px;
    // justify-content: start;
    // flex-wrap: wrap;
    display: grid;
    gap: 15px;
    grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); 
  }
  &__empty{
    text-align: center;
    font-size: 20px;
    margin-top: 20px;
  }
}
.pack-info{
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  @media (max-width: 400px) {
    flex-direction: column;
  }
  &__name{
    font-size: 28px;
  }
  &__description{
    font-size: 18px;
    margin-top: 6px;
  }
  &__tag-list{
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  &__edit-btn{
    padding: 10px 14px;
    font-size: 16px;
  }
}
</style>