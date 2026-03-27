<template>
  <div class='pack' @mouseenter=startAnimation>
    <div class='reflect'  :class={reflectAnimation:isAnimationPlaying}></div>
    <p class='pack__name'>{{ pack.name}}</p>
    <p class='pack__description'>{{ pack.description}}</p>
    <ul class='pack__tag-list'>
      <li  v-for="tag in pack.tags">
        <Tag :fontSize='12' class='pack__tag' :tag='tag' :show-delete-button=false></Tag>
      </li>
    </ul>
    <p v-if='pack.lastRepeat' class='pack__last-repeat'>Последнее повторение {{ daysAgoString(pack.lastRepeat) }}</p>
  </div>
</template>

<script lang="ts" setup>
import type { UsersPack } from '#shared/schemas'
const {pack} = defineProps<{pack:UsersPack}>()
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
  padding: 8px 8px;
  border: 3px solid rgb(230, 230, 230);
  max-width: 260px;
  width: 260px;
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
    font-size: 20px;
  }
  &__tag-list{
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 5px 5px;
  }
  &__description{
    font-size: 18px;
  }

}

</style>