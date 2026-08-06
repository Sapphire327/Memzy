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
    <div class='quest__actions'>
      <FormButton v-if='editable' class='quest__edit' @click='emit("edit", quest)'>Редактировать</FormButton>
      <FormButton class='quest__show-answer' @click='()=>{showAnswer=!showAnswer}'>{{showAnswer?"Скрыть ответ":"Показать ответ"}}</FormButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Quest } from '#shared/schemas'
import getImageUrl from '~/utils/getImageUrl'

const props = withDefaults(defineProps<{ quest: Quest, editable?: boolean }>(), {
  editable: false
})
const emit = defineEmits<{
  (e: 'edit', quest: Quest): void
}>()
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
  container-type: inline-size;
  container-name: quest-container;
  &__top{
    display: flex;
    gap: 6px;
    @container  quest-container (max-width: 350px) {
      flex-direction: column;
    }
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
    width: 170px;
    object-fit: cover;
    border-radius: 16px;
    aspect-ratio: 16/9;
  }
  &__show-answer{
    font-size: 14px;
    padding:8px;
  }
  &__actions{
    position: absolute;
    bottom: 5px;
    left: 5px;
    right: 5px;
    display: flex;
    gap: 6px;
  }
  &__edit{
    font-size: 14px;
    padding:8px;
    margin-right: auto;
  }
  &__answer,&__question{
    flex: 1 1 50%;
  }
}
</style>