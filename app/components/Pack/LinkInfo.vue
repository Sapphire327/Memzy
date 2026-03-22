<template>
  <div class='pack' @mouseenter=startAnimation>
    <div class='reflect'  :class={reflectAnimation:isAnimationPlaying}></div>
    <p class='pack__name'>{{ pack.name}}</p>
    <p class='pack__description'>{{ pack.description}}</p>
    <ul class='pack__tag-list'>
      <li class='pack__tag' v-for="tag in pack.tags">{{ tag }}</li>
    </ul>
    <p class='pack__last-repeat'>Последнее повторение {{ daysAgoString(pack.lastRepeat) }}</p>
  </div>
</template>

<script lang="ts" setup>
interface PackInfo{
  name:string,
  description:string,
  tags:string[],
  lastRepeat:Date
}
const {pack} = defineProps<{pack:PackInfo}>()
const isAnimationPlaying = ref(false)
const timeoutId = ref<null| NodeJS.Timeout>(null);
function startAnimation(){
  if(!isAnimationPlaying.value){
    isAnimationPlaying.value=true
    timeoutId.value = setTimeout(()=>isAnimationPlaying.value=false,800)
  }
}
onBeforeUnmount(()=>{
  if(timeoutId.value)
  clearTimeout(timeoutId.value)
})
</script>

<style lang='scss' scoped>
.reflect{
  background-color: white;
  opacity: 0.7;
  filter: blur(2px);
  left: -100%;
  bottom: -50%;
  position: absolute;
  height: 50px;
  width: 200%;
  transition: all 0.8s ease;
  transform: rotate(30deg) ;
}
@keyframes reflect {
  0% { left: -100%;bottom:-50% }
  100% { left: 50%;bottom:100% } 
}
.pack{
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 8px 16px;
  border: 3px solid rgb(230, 230, 230);
  max-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;
  &:hover{
    border: 3px solid white;
  }
  .reflectAnimation{
      animation: reflect 0.8s 1;
  }
  &__name{
    font-size: 24px;
  }
  &__tag-list{
    margin-top: 30px;
    margin-left: 10px;
    display: flex;
    gap: 15px;
  }
  &__description{
    font-size: 20px;
  }
  &__tag{
    font-size: 20px;
    position: relative;
    &::after{
      content: '';
      position: absolute;
      background-color: var(--dark-text);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      left: -8px;
      top: 50%;
    }
  }
}

</style>