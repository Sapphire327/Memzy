<template>
  <div class='levels'>
    <h3 class='levels__title'>{{ title }}</h3>
    <p v-if='description' class='levels__description'>{{ description }}</p>
    <div v-if='items.length' class='levels__list'>
      <div v-for='item in items' :key='item.key' class='levels__row'>
        <span class='levels__key'>{{ item.key }}</span>
        <span v-if='label(item.key)' class='levels__label'>{{ label(item.key) }}</span>
        <div class='levels__bar'>
          <div class='levels__fill' :style='{ width: percent(item.count) + "%" }'></div>
        </div>
        <span class='levels__count'>{{ item.count }}</span>
      </div>
    </div>
    <p v-else class='levels__empty'>Пока нет данных</p>
  </div>
</template>

<script lang="ts" setup>
import type { LevelBucket } from '#shared/schemas'
import { computed } from 'vue'

const props = defineProps<{
  title: string
  items: LevelBucket[]
  description?: string
  labelMap?: Record<number, string>
}>()

const maxCount = computed(() => Math.max(...props.items.map((item) => item.count), 0))

function label(key: number): string | null {
  return props.labelMap?.[key] ?? null
}

function percent(count: number): number {
  if (!maxCount.value) return 0
  return Math.round((count / maxCount.value) * 100)
}
</script>

<style scoped lang='scss'>
.levels{
  flex: 1 1 300px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  border: 3px solid rgb(230, 230, 230);
  padding: 16px 14px;

  &__title{
    font-size: 18px;
    color: var(--main-second-darker);
    margin-bottom: 8px;
  }
  &__description{
    font-size: 13px;
    color: var(--dark-text);
    opacity: 0.8;
    margin-bottom: 14px;
  }
  &__list{
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &__row{
    display: flex;
    align-items: center;
    gap: 10px;
  }
  &__key{
    flex: 0 0 24px;
    font-size: 16px;
    font-weight: 600;
    color: var(--main-second-darker);
    background-color: rgb(230, 230, 230);
    border-radius: 6px;
    text-align: center;
    line-height: 24px;
  }
  &__label{
    flex: 1 1 40%;
    font-size: 15px;
    color: var(--dark-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__bar{
    flex: 1 1 40%;
    height: 18px;
    background-color: rgb(230, 230, 230);
    border-radius: 6px;
    overflow: hidden;
  }
  &__fill{
    height: 100%;
    background-color: var(--main-second);
    border-radius: 6px;
    transition: width 0.3s ease;
  }
  &__count{
    flex: 0 0 30px;
    font-size: 16px;
    color: var(--dark-text);
    text-align: right;
  }
  &__empty{
    font-size: 15px;
    color: var(--dark-text);
    opacity: 0.7;
  }
}
</style>