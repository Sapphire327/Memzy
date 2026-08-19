<template>
  <div class='main'>
    <QuestTestSession  v-if='data?.quests?.length' :quests='data.quests' :back-to='`/packs/${packId}`' :save='save'></QuestTestSession>
    <p v-else class='main__empty'>Слов для повторения пока нет</p>
  </div>
</template>

<script lang="ts" setup>
import type { RepeatableQuest } from '#shared/schemas'
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

const { data } = await useFetch<{ quests: RepeatableQuest[] }>(`/api/pack/${packId.value}/repeat?practice=${practiceMode.value}`, {
  watch: [practiceMode]
})

async function save(results: Map<number, boolean>) {
  if(practiceMode.value) return
  const answers = [...results.entries()].map(([questId, isRight]) => ({ questId, isRight }))
  if(!answers.length) return
  await $fetch('/api/packs/repeat',{
    method:'POST',
    body:answers
  })
}
</script>

<style scoped lang='scss'>
.main{
  max-width: 1200px;
  margin: auto;
  padding-top: 50px; 
  &__empty{
    text-align: center;
    font-size: 20px;
  }
}
</style>
