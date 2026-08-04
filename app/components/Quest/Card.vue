<template>
  <div class='quest'>
    <div class='quest__top'>
      <div class='quest__question'>
        <p class='quest__question-text'>{{ quest.quest }}</p>
        <img v-if='questImg' :src='questImg' class='quest__img' alt=''>

      </div>
      <div v-if='showAnswer' class='quest__answer'>
        <p class='quest__answer-text'>{{ quest.answer }}</p>
        <img v-if='answerImg' :src='answerImg' class='quest__img' alt=''>
      </div> 
    </div>
    <div class="quest__bottom">
        <p v-if='quest.hint' class='quest__hint'>Подсказка: {{ quest.hint }}</p>
        <p v-if='quest.exampleInText' class='quest__example'>Пример: {{ quest.exampleInText }}</p>
    </div>
    <FormButton class='quest__show-answer' @click='()=>{showAnswer=!showAnswer}'>{{showAnswer?"Скрыть ответ":"Показать ответ"}}</FormButton>
  </div>
</template>

<script lang="ts" setup>
import type { Quest } from '#shared/schemas'
import getImageUrl from '~/utils/getImageUrl'

const props = defineProps<{ quest: Quest }>()
const showAnswer = ref(false)
const questImg = computed(() => getImageUrl(props.quest.questImgName))
const answerImg = computed(() => getImageUrl(props.quest.answerImgName))
</script>

<style lang='scss' scoped>
.quest{
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
  padding: 10px 14px;
  // flex-direction: column;
  padding-bottom: 55px;
  position: relative;

  &__top{
    display: flex;
    gap: 6px;
  }
  &__answer-text,&__question-text{
    font-size: 20px;
    margin-bottom: 5px;
    color: var(--main-second-darker);
  }
  &__hint, &__example{
    margin-top: 10px;
    font-size: 16px;
    color: var(--dark-text);
    opacity: 0.8;
  }
  &__img{
    height: 100px;
    width: fit-content;
    object-fit: contain;
    border-radius: 16px;
  }
  &__show-answer{
    font-size: 14px;
    padding:8px;
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
  &__answer,&__question{
    flex: 1 1 50%;
  }
}
</style>