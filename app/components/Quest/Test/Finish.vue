<template>
  <div class='finish'>
    <h2 class='finish__title'>Тренировка пройдена!</h2>
    <p class='finish__subtitle'>{{ subtitle }}</p>

    <div class='finish__score'>
      <p class='finish__accuracy'>{{ percent }}%</p>
      <p class='finish__text'>Верно {{ rightCount }} из {{ total }}</p>
    </div>

    <NuxtLink class='finish__link' :to='backTo'>
      <FormButton class='finish__btn'>К списку</FormButton>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import type { RepeatableQuest } from '#shared/schemas'
import { computed } from 'vue'

const props = defineProps<{
  quests: RepeatableQuest[]
  results: Map<number, boolean>
  backTo: string
}>()

const total = computed(() => props.quests.length)
const rightCount = computed(() =>
  props.quests.filter((quest) => props.results.get(quest.id) === true).length
)
const percent = computed(() =>
  total.value ? Math.round((rightCount.value / total.value) * 100) : 0
)
const subtitle = computed(() => {
  if (percent.value >= 90) return 'Отлично!'
  if (percent.value >= 70) return 'Хорошая работа!'
  if (percent.value >= 50) return 'Неплохо, но есть над чем поработать'
  return 'Попробуй ещё раз — получится!'
})
</script>

<style scoped lang='scss'>
.finish{
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &__title{
    font-size: 28px;
    color: var(--main-second-darker);
  }
  &__subtitle{
    margin-top: 10px;
    font-size: 18px;
    opacity: 0.8;
  }
  &__score{
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  &__accuracy{
    font-size: 56px;
    font-weight: 600;
    color: var(--main-second-darker);
    line-height: 1;
  }
  &__text{
    font-size: 20px;
  }
  &__wrong{
    font-size: 16px;
    color: #C2185B;
  }
  &__link{
    margin-top: 30px;
  }
  &__btn{
    padding: 12px 32px;
    font-size: 18px;
  }
}
</style>