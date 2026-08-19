<template>
  <div class='stat-card'>
    <p class='stat-card__value'>{{ value }}</p>
    <p class='stat-card__label'>{{ label }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ value: string | number, label: string }>()
</script>

<style scoped lang='scss'>
.stat-card{
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  border: 3px solid rgb(230, 230, 230);
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;

  &__value{
    font-size: 32px;
    font-weight: 600;
    color: var(--main-second-darker);
    line-height: 1;
  }
  &__label{
    font-size: 14px;
    color: var(--dark-text);
    opacity: 0.8;
  }
}
</style>