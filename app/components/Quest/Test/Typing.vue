<template>
  <div class='typing' :class='{ "typing--revealed": revealed }'>
    <h2 class='typing__title'>Напиши слово</h2>

    <div class='typing__top'>
      <p class='typing__label'>Слово</p>
      <p class='typing__text'>{{ quest.quest }}</p>
      <img v-if='questImg' :src='questImg' class='typing__img' alt=''>
    </div>

    <form class='typing__form' @submit.prevent='onSubmit'>
      <FormInput
        ref='inputRef'
        v-model='input'
        class='typing__input'
        :class='inputClass'
        placeholder='Введи перевод'
        :disabled='revealed'
      ></FormInput>
      <FormButton v-if='!revealed' class='typing__check' type='submit' :disabled='revealed'>Проверить</FormButton>
    </form>

    <div class='typing__bottom'>
      <p v-if='quest.hint' class='typing__hint'>Подсказка: {{ quest.hint }}</p>
    </div>

    <Transition name='typing-feedback' mode='out-in'>
      <p v-if='status === "wrong"' class='typing__feedback typing__feedback--wrong' :key='"wrong"'>
        Неверно, осталось {{ attemptsLeft }} {{ attemptsWord }}
      </p>
      <p v-else-if='status === "success"' class='typing__feedback typing__feedback--right' :key='"right"'>
        Верно!
      </p>
    </Transition>

    <Transition name='typing-reveal'>
      <div v-if='revealed' class='typing__reveal'>
        <p class='typing__reveal-label'>Правильный ответ</p>
        <p class='typing__reveal-text'>{{ quest.answer }}</p>
        <img v-if='answerImg' :src='answerImg' class='typing__img' alt=''>
        <FormButton class='typing__next' @click='next'>Далее</FormButton>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import type { RepeatableQuest } from '#shared/schemas'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import getImageUrl from '~/utils/getImageUrl'

const props = defineProps<{ quest: RepeatableQuest }>()
const emit = defineEmits<{
  (e: 'learned', isRight: boolean): void
}>()
const MAX_ATTEMPTS = 3

const questImg = computed(() => getImageUrl(props.quest.questImgName))
const answerImg = computed(() => getImageUrl(props.quest.answerImgName))

const input = ref('')
const inputRef = ref<{ $el: HTMLInputElement } | null>(null)
function focusInput() {
  nextTick(() => inputRef.value?.$el?.focus())
}
const attemptsLeft = ref(MAX_ATTEMPTS)
const status = ref<'idle' | 'wrong' | 'success'>('idle')
const revealed = ref(false)
const won = ref(false)

const attemptsWord = computed(() => {
  const n = attemptsLeft.value
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'попытка'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'попытки'
  return 'попыток'
})

const inputClass = computed(() => ({
  'typing__input--wrong': status.value === 'wrong',
  'typing__input--right': status.value === 'success',
}))

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

function onSubmit() {
  if (revealed.value) next()
  else check()
}

function check() {
  if (revealed.value) return
  if (!input.value.trim()) return
  const isRight = normalize(input.value) === normalize(props.quest.answer ?? '')
  if (isRight) {
    won.value = true
    status.value = 'success'
    revealed.value = true
    return
  }
  attemptsLeft.value--
  if (attemptsLeft.value <= 0) {
    status.value = 'wrong'
    revealed.value = true
    return
  }
  status.value = 'wrong'
}

function next() {
  emit('learned', won.value)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.repeat) return
  const target = event.target as HTMLElement | null
  if (target && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName)) return
  if (event.key === 'Enter' && revealed.value) next()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  focusInput()
})
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

watch(() => props.quest.id, () => {
  input.value = ''
  attemptsLeft.value = MAX_ATTEMPTS
  status.value = 'idle'
  revealed.value = false
  won.value = false
  focusInput()
}, { immediate: true })
</script>

<style scoped lang='scss'>
.typing{
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title{
    font-size: 16px;
    margin-bottom: 24px;
  }
  &__top{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  &__label{
    font-size: 14px;
    opacity: 0.6;
    margin-bottom: 4px;
  }
  &__text{
    font-size: 22px;
    color: var(--main-second-darker);
    text-align: center;
  }
  &__img{
    width: 100%;
    max-width: 360px;
    object-fit: cover;
    border-radius: 16px;
    aspect-ratio: 16/9;
    margin-top: 16px;
  }
  &__form{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 100%;
    max-width: 360px;
  }
  &__input{
    width: 100%;
    font-size: 20px;
    padding: 10px 12px;
    text-align: center;
    border: 2px solid var(--main-second);
    border-radius: 8px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &--wrong{
      border-color: #F06292;
      animation: typing-shake 0.4s ease;
    }
    &--right{
      border-color: #8BC34A;
    }
  }
  &__check{
    padding: 10px 24px;
    font-size: 16px;
  }
  &__bottom{
    width: 100%;
    text-align: center;
    min-height: 40px;
  }
  &__hint, &__example{
    margin-top: 12px;
    font-size: 16px;
    color: var(--dark-text);
    opacity: 0.8;
  }
  &__feedback{
    margin-top: 16px;
    font-size: 18px;
    font-weight: 600;

    &--right{
      color: #558B2F;
    }
    &--wrong{
      color: #C2185B;
    }
  }
  &__reveal{
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(139, 195, 74, 0.12);
    border: 2px solid rgba(139, 195, 74, 0.5);
    border-radius: 10px;
    padding: 20px;
    width: 100%;
    max-width: 420px;
  }
  &__reveal-label{
    font-size: 14px;
    opacity: 0.7;
    margin-bottom: 6px;
  }
  &__reveal-text{
    font-size: 24px;
    font-weight: 600;
    color: var(--main-second-darker);
    text-align: center;
  }
  &__next{
    margin-top: 16px;
    padding: 10px 32px;
    font-size: 16px;
  }
}

@keyframes typing-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

.typing-feedback-enter-active,
.typing-feedback-leave-active{
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.typing-feedback-enter-from,
.typing-feedback-leave-to{
  opacity: 0;
  transform: translateY(-8px);
}

.typing-reveal-enter-active{
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.typing-reveal-enter-from{
  opacity: 0;
  transform: translateY(16px);
}
</style>
