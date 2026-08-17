<template>
  <div class='learning'>
    <h2 class='learning__title'>На данном этапе попробуй запомнить слово</h2>
    <div class='learning__top'>
      <div class='learning__side'>
        <p class='learning__label'>Слово</p>
        <p class='learning__text'>{{ quest.quest }}</p>
        <img v-if='questImg' :src='questImg' class='learning__img' alt=''>
      </div>
      <div class='learning__side'>
        <p class='learning__label'>Перевод</p>
        <p class='learning__text'>{{ quest.answer }}</p>
        <img v-if='answerImg' :src='answerImg' class='learning__img' alt=''>
      </div>
    </div>
    <div class='learning__bottom'>
      <p v-if='quest.hint' class='learning__hint'>Подсказка: {{ quest.hint }}</p>
      <p v-if='quest.exampleInText' class='learning__example'>Пример: {{ quest.exampleInText }}</p>
    </div>
    <div class='learning__actions'>
      <FormButton class='learning__learned' @click='emit("learned", true)'>Запомнил</FormButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RepeatableQuest } from '#shared/schemas'
import { computed } from 'vue'
import getImageUrl from '~/utils/getImageUrl'

const props = defineProps<{ quest: RepeatableQuest }>()
const emit = defineEmits<{
  (e: 'learned', isRight:boolean): void
}>()
const questImg = computed(() => getImageUrl(props.quest.questImgName))
const answerImg = computed(() => getImageUrl(props.quest.answerImgName))
</script>

<style lang='scss' scoped>
.learning{
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
  padding: 16px 20px;
  &__title{
    font-size: 16px;
  }
  &__top{
    margin-top: 40px;
    display: flex;
    gap: 20px;
    @media (max-width: 500px) {
       flex-direction: column;
    }
  }
  &__side{
    flex: 1 1 50%;
    display: flex;
    flex-direction: column;

  }
  &__label{
    font-size: 14px;
    opacity: 0.6;
    margin-bottom: 4px;
    flex-shrink: 0;
  }
  &__text{
    font-size: 22px;
    color: var(--main-second-darker);
    margin-bottom: 8px;
    flex: 1;
  }
  &__img{
    width: 100%;
    object-fit: cover;
    border-radius: 16px;
    aspect-ratio: 16/9;
    flex-shrink: 0;
  }
  &__hint, &__example{
    margin-top: 12px;
    font-size: 16px;
    color: var(--dark-text);
    opacity: 0.8;
  }
  &__actions{
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  &__learned{
    padding: 10px 24px;
    font-size: 16px;
  }
}
</style>