<template>
  <div class='main'>
    <QuestTestSession v-if='data?.quests?.length' :quests='data.quests' :back-to='"/packs"' :save='save'></QuestTestSession>
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

const { data } = await useFetch<{ quests: RepeatableQuest[] }>('/api/packs/repeat')

async function save(results: Map<number, boolean>) {
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
  &__empty{
    text-align: center;
    font-size: 20px;
    margin-top: 20px;
  }
}
</style>
