<template>
  <div class='quest'>
    <div class="quest__main">
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
      <div class='quest__repeat'>
          <p class='quest__repeat-text'>Повторено: {{ lastRepeatedString }}</p>
          <p class='quest__repeat-text'>Следующее повторение: {{ nextRepeatString }}</p>
      </div>
    </div>
    <div class='quest__actions'>
      <FormButton v-if='editable' class='quest__edit' @click='emit("edit", quest)'>Редактировать</FormButton>
      <FormButton v-if='editable' class='quest__delete' @click='emit("delete", quest)'>Удалить</FormButton>
      <FormButton class='quest__show-answer' @click='()=>{showAnswer=!showAnswer}'>{{showAnswer?"Скрыть ответ":"Показать ответ"}}</FormButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RepeatableQuest } from '#shared/schemas'
import daysAgoString from '~/utils/daysAgoString'
import getImageUrl from '~/utils/getImageUrl'
import untilString from '~/utils/untilString'

const props = withDefaults(defineProps<{ quest: RepeatableQuest, editable?: boolean }>(), {
  editable: false
})
const emit = defineEmits<{
  (e: 'edit', quest: RepeatableQuest): void
  (e: 'delete', quest: RepeatableQuest): void
}>()
const showAnswer = ref(false)
const questImg = computed(() => getImageUrl(props.quest.questImgName))
const answerImg = computed(() => getImageUrl(props.quest.answerImgName))
const lastRepeatedString = computed(() => {
  if (!props.quest.lastRepeated) return 'никогда'
  return daysAgoString(new Date(props.quest.lastRepeated))
})
const nextRepeatString = computed(() => {
  if (!props.quest.NextRepeated) return 'сейчас'
  return untilString(new Date(props.quest.NextRepeated))
})
</script>

<style lang='scss' scoped>

.quest{
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  // flex-direction: column;
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
  &__main{
    flex: 1 1 auto;
  }
  &__answer-text,&__question-text{
    font-size: 20px;
    margin-bottom: 5px;
    color: var(--main-second-darker);
    flex-grow: 1;
  }
  &__hint, &__example{
    margin-top: 10px;
    font-size: 16px;
    color: var(--dark-text);
    opacity: 0.8;
  }
  &__repeat{
    margin-top: 10px;
    font-size: 14px;
    color: var(--dark-text);
    opacity: 0.7;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  &__img{
    width: 170px;
    object-fit: cover;
    border-radius: 16px;
    aspect-ratio: 16/9;
  }
  &__show-answer, &__delete,  &__edit{
    font-size: 14px;
    padding:8px;
    @container  quest-container (max-width: 290px) {
      width: 100%;
    }
  }
  &__actions{
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
    gap: 6px;
  }
  &__delete{
    margin-right: auto;
  }

  &__answer,&__question{
    flex: 1 1 50%;
    display: flex;
    flex-direction: column;
  }
}
</style>