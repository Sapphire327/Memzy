<template>
  <div class='pack-progress'>
    <NuxtLink
      v-for='pack in packs'
      :key='pack.id'
      class='pack-progress__row'
      :to="'/packs/' + pack.id"
    >
      <span class='pack-progress__name'>{{ pack.name }}</span>
      <span class='pack-progress__count'>{{ pack.learnedQuests }} / {{ pack.totalQuests }}</span>
      <span class='pack-progress__next'>{{ nextRepeatText(pack.nextRepeat) }}</span>
    </NuxtLink>
    <p v-if='!packs.length' class='pack-progress__empty'>Нет паков</p>
  </div>
</template>

<script lang="ts" setup>
import type { ProfilePackProgress } from '#shared/schemas'
import untilString from '~/utils/untilString'

defineProps<{ packs: ProfilePackProgress[] }>()

function nextRepeatText(nextRepeat?: Date): string {
  if (!nextRepeat) return '—'
  return untilString(new Date(nextRepeat))
}
</script>

<style scoped lang='scss'>
.pack-progress{
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  border: 3px solid rgb(230, 230, 230);
  padding: 6px 14px;

  &__row{
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid rgb(230, 230, 230);
    &:last-child{
      border-bottom: none;
    }
    &:hover .pack-progress__name{
      color: var(--main-second-darker);
    }
  }
  &__name{
    flex: 1;
    font-size: 18px;
    color: var(--dark-text);
    transition: color 0.3s ease;
  }
  &__count{
    font-size: 16px;
    color: var(--dark-text);
  }
  &__next{
    font-size: 14px;
    color: var(--dark-text);
    opacity: 0.8;
    white-space: nowrap;
  }
  &__empty{
    padding: 14px 0;
    font-size: 15px;
    color: var(--dark-text);
    opacity: 0.7;
  }
}
</style>