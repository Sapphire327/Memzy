<template>
  <div class='main'>
    <div v-if='data?.quests?.length' class='main__list'>
      <QuestTestFinish v-if='isFinished' :quests='data.quests' :results='resultAnswers' :pack-id='packId!'></QuestTestFinish>
      <div v-else>
        <QuestTestLearning @learned='onAnswer' v-if='currentLevel===null||currentLevel<2' :quest='data.quests[currentQuest]!' ></QuestTestLearning>
        <QuestTestWordle @learned='onAnswer' v-else-if='currentLevel>=2 && currentLevel<=3' :quest='data.quests[currentQuest]!' ></QuestTestWordle>
        <QuestTestTyping @learned='onAnswer' v-else-if='currentLevel>=4' :quest='data.quests[currentQuest]!' ></QuestTestTyping>
      </div>
      </div>
    <p v-else class='main__empty'>Слов для повторения пока нет</p>
  </div>
</template>

<script lang="ts" setup>
import type { RepeatableQuest } from '#shared/schemas'
import type { FetchError } from 'ofetch'
import authMiddleware from '~/middleware/auth'

definePageMeta({
 middleware: authMiddleware,
})
useHead({ title: 'Повторение' })
const route = useRoute();
const packId = computed<number|null>(() => {
  if(route.params.packId && typeof route.params.packId === 'string')
    return parseInt(route.params.packId);
  else
    return null
});
const practiceMode = computed(() => route.query.practice === 'true')
const currentQuest = ref(0)
const isFinished = computed(()=>{
  return data.value?.quests.length!<=currentQuest.value
})
const currentLevel = computed(()=>{
  
  return data.value?.quests[currentQuest.value]?.level || null
})
// key - id, value result
const resultAnswers = ref(new Map<number,boolean>())
function onAnswer(isRight:boolean){
  if(isFinished.value){
    return
  }
  resultAnswers.value.set(data.value?.quests[currentQuest.value]?.id!,isRight)
  currentQuest.value++
  if(isFinished.value){
    sendResults()
  }
}
const sentResults = ref(false)
async function sendResults(){
  if(sentResults.value || !packId.value) return
  if(practiceMode.value) return
  const answers = [...resultAnswers.value.entries()].map(([questId, isRight])=>({ questId, isRight }))
  if(!answers.length) return
  sentResults.value = true
  try{
    await $fetch(`/api/pack/${packId.value}/repeat`,{
      method:'POST',
      body:answers
    })
  }
  catch(e){
    sentResults.value = false
    const fetchError = e as FetchError
    const toast = useToast()
    toast.error({
      title: 'Ошибка',
      message: isApiError(fetchError.data) ? (fetchError.data.message || 'Не удалось сохранить результат') : 'Не удалось сохранить результат',
    })
  }
}
const { data } = await useFetch<{ quests: RepeatableQuest[] }>(`/api/pack/${packId.value}/repeat?practice=${practiceMode.value}`, {
  watch: [practiceMode]
})
watch(practiceMode, () => {
  currentQuest.value = 0
  resultAnswers.value = new Map()
  sentResults.value = false
})
</script>

<style scoped lang='scss'>
.main{
  max-width: 1200px;
  margin: auto;
  &__list{
    margin-top: 30px;
    display: grid;
    gap: 15px;
    grid-template-columns: repeat(auto-fit, minmax(300px,1fr));
  }
  &__item{
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 10px;
    padding: 16px 20px;
  }
  &__answer{
    margin-top: 6px;
  }
  &__meta{
    margin-top: 10px;
    font-size: 14px;
    opacity: 0.8;
  }
  &__empty{
    text-align: center;
    font-size: 20px;
    margin-top: 20px;
  }
}
</style>