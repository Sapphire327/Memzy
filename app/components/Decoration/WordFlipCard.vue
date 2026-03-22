<template>
  <div class='flip'>
    <div class='flip__body'>
      <div class='flip__top'>
        <p class='flip__text'>{{ props.topText }}</p>
      </div>
        <div class='flip__bottom'>
          <p class='flip__text'>{{ props.bottomText }}</p>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  interface Props {
    topText:string,
    bottomText:string,
    textAlign?:'left'|'right'|'center'|'justify'|'start'|'end'|'inherit',
    verticalAlign?:'start'|'center'|'end',
    verticalFlip?:boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    textAlign:'start',
    verticalAlign:'start',
    verticalFlip:false
  })
  const WordPos = computed(() => {
    return props.topText.length>props.bottomText.length?
    {top:'relative',bottom:'absolute'}:
    {top:'absolute',bottom:'relative'}
  })
  
</script>

<style scoped lang='scss'>
.flip{
  display: inline-block;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  &:hover{
    .flip__body{
      transform: rotateY(180deg);
    }
  }
  &__body{
    position: relative;
    width: 100%;
    height: 100%;
    transition: all 0.5s ease;
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }
  &__top,&__bottom{
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    align-items: v-bind('props.verticalAlign'); ;
    justify-content: stretch;
    width: 100%;
    top: 0;
    left: 0;
    background-color: rgba($color: #ffffff, $alpha: 0.2);
    border: 3px solid white;
    color: var(--dark-text);
    border-radius: 8px;
    backface-visibility: hidden;
  }
  &__top{
    position: v-bind('WordPos.top');
  }
  &__bottom{
    position: v-bind('WordPos.bottom');
    transform: rotateY(180deg);
    z-index: 3;
  }
  &__text{
    text-align: v-bind('props.textAlign');
    font-size: 24px;
    padding: 10px 10px;
    width: 100%;
    @media (max-width: 500px) {
     font-size: 18px;
    }
  }
}
</style>