<template>
  <div class='sticker'>
    <div class='sticker__body'>
      <NuxtImg class='sticker__button' width='53' height='53' src="/images/decoration/button.png"></NuxtImg>
      <p v-for="value,index in props.words" :key="index">{{ words[index] }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{words:string[]}>()
  const words = ref<string[]>([])

  let intervalId:NodeJS.Timeout|null = null
  onMounted(() => {
    for (let index = 0; index < props.words.length; index++) {
      words.value.push('');
    }
    let currentWord = 0;
    let currentChar = 0;
    intervalId = setInterval(() => {
      let propsCurrentWord = props.words[currentWord]
      if(currentWord<props.words.length &&propsCurrentWord){
        words.value[currentWord]=propsCurrentWord.slice(0,currentChar)
        currentChar++
        if(currentChar>propsCurrentWord.length){
          currentWord++;
          currentChar=0
        }
      }else{
        if (intervalId !== null) {
          clearInterval(intervalId)
          intervalId = null
        }
      }
      
    }, 80)
  })

  onUnmounted(() => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  })

</script>

<style scoped lang='scss'>

  .sticker{
    width: 250px;
    border-radius: 8px;
    transform: rotate(15deg);
    aspect-ratio: 1/1;
    background-color: var(--main-second);
    box-shadow:4px 10px 6px 0px rgba(34, 60, 80, 0.2);
    &__body{
      position: relative;
      padding: 20px 20px;
      &>p{
        color: white;
        font-size: inherit;
        // font-size: 18px;
        line-height: 1.5em;
      }
    }
    &__button{
        top: -30px;
        left: 30px;
        position: absolute;
      }
  }
</style>