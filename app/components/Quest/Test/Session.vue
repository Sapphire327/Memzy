<template>
  <div class='session'>
    <QuestTestFinish v-if='isFinished' :quests='quests' :results='resultAnswers' :back-to='backTo'></QuestTestFinish>
    <div v-else>
      <QuestTestLearning v-if='currentLevel===null||currentLevel<2' @learned='onAnswer' :quest='currentQuestData!'></QuestTestLearning>
      <QuestTestWordle v-else-if='currentLevel>=2 && currentLevel<=3' @learned='onAnswer' :quest='currentQuestData!'></QuestTestWordle>
      <QuestTestTyping v-else-if='currentLevel>=4' @learned='onAnswer' :quest='currentQuestData!'></QuestTestTyping>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RepeatableQuest } from '#shared/schemas'
import type { FetchError } from 'ofetch'

const props = withDefaults(defineProps<{
  quests: RepeatableQuest[]
  save: (results: Map<number, boolean>) => Promise<void>
  backTo?: string
}>(), {
  backTo: '/packs'
})

const currentQuest = ref(0)
const isFinished = computed(() => {
  return props.quests.length <= currentQuest.value
})
const currentLevel = computed(() => {
  return props.quests[currentQuest.value]?.level || null
})
const currentQuestData = computed(() => props.quests[currentQuest.value])
const resultAnswers = ref(new Map<number, boolean>())

function onAnswer(isRight: boolean) {
  if (isFinished.value) {
    return
  }
  resultAnswers.value.set(props.quests[currentQuest.value].id, isRight)
  currentQuest.value++
  if (isFinished.value) {
    sendResults()
  }
}

const sentResults = ref(false)
async function sendResults() {
  if (sentResults.value) return
  const results = new Map(resultAnswers.value)
  if (!results.size) return
  sentResults.value = true
  try {
    await props.save(results)
  } catch (e) {
    sentResults.value = false
    const fetchError = e as FetchError
    const toast = useToast()
    toast.error({
      title: 'Ошибка',
      message: isApiError(fetchError.data) ? (fetchError.data.message || 'Не удалось сохранить результат') : 'Не удалось сохранить результат',
    })
  }
}
</script>

<style scoped lang='scss'>
.session{
  max-width: 1200px;
  margin: auto;
}
</style>
