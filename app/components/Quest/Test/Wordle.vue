<template>
  <div class='wordle' :class='{ "wordle--win": won }'>
    <h2 class='wordle__title'>Собери слово из букв</h2>

    <div class='wordle__top'>
      <div class='wordle__side'>
        <p class='wordle__label'>Слово</p>
        <p class='wordle__text'>{{ quest.quest }}</p>
      </div>
    </div>

    <div class='wordle__cell-row'>
      <template v-for='(slot, index) in slots' :key='index'>
        <span v-if='slot.type === "space"' class='wordle__space'></span>
        <button
          v-else
          class='wordle__cell'
          :class='cellClass(slot)'
          :style='{ "--i": index }'
          @click='removeTile(slot)'
        >{{ cellValue(slot) }}</button>
      </template>
    </div>
    <p v-if='!slots.length' class='wordle__empty'>Нечего собирать</p>

    <img v-if='questImg' :src='questImg' class='wordle__img' alt=''>

    <div class='wordle__bank'>
      <button
        v-for='tile in tiles'
        :key='tile.id'
        class='wordle__tile'
        :class='{ "wordle__tile--used": tile.used }'
        :disabled='tile.used'
        @click='putTile(tile)'
      >{{ tile.char }}</button>
    </div>

    <div class='wordle__bottom'>
      <p v-if='quest.hint' class='wordle__hint'>Подсказка: {{ quest.hint }}</p>
      <p v-if='quest.exampleInText' class='wordle__example'>Пример: {{ quest.exampleInText }}</p>
    </div>

    <div class='wordle__actions'>
      <FormButton class='wordle__reset' @click='init'>Заново</FormButton>
      <FormButton class='wordle__check' @click='check'>Проверить</FormButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RepeatableQuest } from '#shared/schemas'
import getImageUrl from '~/utils/getImageUrl'
const props = defineProps<{ quest: RepeatableQuest }>()
const emit = defineEmits<{
  (e: 'learned', isRight: boolean): void
}>()
const withFirstAttempt = ref(true)
const questImg = computed(() => getImageUrl(props.quest.questImgName))

interface CellSlot {
  type: 'cell'
  char: string
  charId: number | null
  result: 'right' | 'wrong' | null
}
interface SpaceSlot {
  type: 'space'
}
type Slot = CellSlot | SpaceSlot
interface Tile {
  id: number
  char: string
  used: boolean
}

const slots = ref<Slot[]>([])
const tiles = ref<Tile[]>([])
const checked = ref(false)
const checkedResult = ref(false)
const won = ref(false)

const targetLetters = computed(() =>
  Array.from(props.quest.answer ?? '').filter((char) => char !== ' ')
)

function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = copy[i]!
    copy[i] = copy[j]!
    copy[j] = tmp
  }
  return copy
}

function isCell(slot: Slot): slot is CellSlot {
  return slot.type === 'cell'
}

function init() {
  withFirstAttempt.value=true
  checked.value = false
  checkedResult.value = false
  won.value = false
  slots.value = Array.from(props.quest.answer ?? '').map((char) => {
    if (char === ' ') return { type: 'space' } as SpaceSlot
    return { type: 'cell', char, charId: null, result: null } as CellSlot
  })
  tiles.value = shuffle(targetLetters.value.map((char, i) => ({ id: i, char, used: false })))
}

function resetChecks() {
  checked.value = false
  checkedResult.value = false
  won.value = false
  for (const slot of slots.value) {
    if (isCell(slot)) slot.result = null
  }
}

watch(() => props.quest.answer, init, { immediate: true })

function firstFreeSlot(): CellSlot | null {
  for (const slot of slots.value) {
    if (isCell(slot) && slot.charId === null) return slot
  }
  return null
}

function getTile(id: number): Tile | null {
  return tiles.value.find((tile) => tile.id === id) ?? null
}

function putTile(tile: Tile) {
  if (tile.used) return
  const slot = firstFreeSlot()
  if (!slot) return
  resetChecks()
  slot.charId = tile.id
  tile.used = true
}

function removeTile(slot: Slot) {
  if (!isCell(slot) || slot.charId === null) return
  const tile = getTile(slot.charId)
  if (tile) tile.used = false
  resetChecks()
  slot.charId = null
}

function cellValue(slot: Slot): string {
  if (!isCell(slot) || slot.charId === null) return ''
  return tiles.value.find((tile) => tile.id === slot.charId)?.char ?? ''
}

function isLetter(char: string): boolean {
  return char.length === 1 && /\p{L}/u.test(char)
}

function tryPlaceChar(char: string) {
  const slot = firstFreeSlot()
  if (!slot) return
  const tile = tiles.value.find(
    (t) => !t.used && t.char.toLowerCase() === char.toLowerCase()
  )
  if (!tile) return
  putTile(tile)
}

function removeLastLetter() {
  for (let i = slots.value.length - 1; i >= 0; i--) {
    const slot = slots.value[i]
    if (slot && isCell(slot) && slot.charId !== null) {
      removeTile(slot)
      return
    }
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey || event.altKey) return
  const target = event.target as HTMLElement | null
  if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
  if (event.key === 'Backspace') {
    event.preventDefault()
    removeLastLetter()
    return
  }
  if (event.key === 'Enter') {
    event.preventDefault()
    check()
    return
  }
  if (event.key === ' ') {
    event.preventDefault()
    return
  }
  if (isLetter(event.key)) {
    event.preventDefault()
    tryPlaceChar(event.key)
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

function cellClass(slot: Slot) {
  if (!isCell(slot)) return {}
  const filled = slot.charId !== null
  return {
    'wordle__cell--filled': filled,
    'wordle__cell--right': slot.result === 'right',
    'wordle__cell--wrong': slot.result === 'wrong',
  }
}


function check() {
  if (checked.value) return
  const expected = targetLetters.value
  let rightCount = 0
  let cellIndex = 0
  for (const slot of slots.value) {
    if (!isCell(slot)) continue
    const char = slot.charId === null ? '' : tiles.value.find((tile) => tile.id === slot.charId)?.char ?? ''
    const isRight = char !== '' && char.toLowerCase() === (expected[cellIndex] ?? '').toLowerCase()
    slot.result = isRight ? 'right' : 'wrong'
    if (isRight) rightCount++
    cellIndex++
  }
  checked.value = true
  checkedResult.value = rightCount === expected.length
  won.value = checkedResult.value
  if (checkTimer.value) clearTimeout(checkTimer.value)
  if(!won.value){
    withFirstAttempt.value=false
    console.log("Ошибка была");
    
  }
  if(won.value)
  checkTimer.value = setTimeout(() => {
    emit('learned', withFirstAttempt.value)
    checkTimer.value = null
  }, 1200)
}

const checkTimer = ref<ReturnType<typeof setTimeout> | null>(null)
</script>

<style scoped lang='scss'>
.wordle{
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
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  &__side{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__label{
    font-size: 14px;
    opacity: 0.6;
    margin-bottom: 4px;
    text-align: center;
  }
  &__text{
    font-size: 20px;
    color: var(--main-second-darker);
    text-align: center;
  }
  &__cell-row{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
    max-width: 100%;
  }
  &__space{
    width: 14px;
  }
  &__cell{
    width: 40px;
    height: 46px;
    border: 2px solid var(--main-second);
    border-radius: 8px;
    font-size: 24px;
    font-weight: 600;
    color: var(--dark-text);
    background-color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    &--filled{
      cursor: pointer;
    }
    &--right{
      background-color: #8BC34A;
      border-color: #7CB342;
      color: white;
    }
    &--wrong{
      background-color: #F06292;
      border-color: #EC5E88;
      color: white;
    }

    @media (max-width: 500px) {
      width: 32px;
      height: 38px;
      font-size: 20px;
    }
  }
  &.wordle--win .wordle__cell--right{
    animation: wordle-pop 0.6s ease-out calc(var(--i) * 50ms) both;
  }
  &__empty{
    font-size: 18px;
    opacity: 0.7;
  }
  &__img{
    width: 100%;
    max-width: 360px;
    object-fit: cover;
    border-radius: 16px;
    aspect-ratio: 16/9;
    margin-bottom: 16px;
    margin-top: 16px;
  }
  &__bank{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
    margin-bottom: 16px;
    max-width: 100%;
  }
  &__tile{
    width: 42px;
    height: 46px;
    border: 2px solid var(--main-second);
    border-radius: 8px;
    font-size: 24px;
    font-weight: 600;
    color: var(--dark-text);
    background-color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, opacity 0.3s ease;

    &--used{
      background-color: rgba(209, 129, 131, 0.15);
      opacity: 0.4;
      cursor: default;
    }

    @media (max-width: 500px) {
      width: 34px;
      height: 38px;
      font-size: 20px;
    }
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
  &__result{
    margin-top: 12px;
    font-size: 18px;
    font-weight: 600;

    &--right{
      color: #558B2F;
      animation: wordle-result 0.6s ease 0.25s both;
    }
    &--wrong{
      color: #C2185B;
    }
  }
  &__actions{
    margin-top: 20px;
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
  &__check, &__reset{
    padding: 10px 24px;
    font-size: 16px;
  }
}

@keyframes wordle-pop {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.3) rotate(-4deg);
  }
  70% {
    transform: scale(0.92);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes wordle-result {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  60% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>