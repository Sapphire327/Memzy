<template>
  <div class='tag' :class="{'tag_right-padding':props.showDeleteButton}">
    <p :style="{ fontSize: props.fontSize + 'px' }" class='tag__name'>{{ props.tag.name }}</p>
    <button v-if='props.showDeleteButton' @click='clickHandle' class='tag__close-btn'><Icon name="akar-icons:cross" size='10' style="color: white" /></button>
  </div>
</template>

<script lang="ts" setup>
  import type { Tag } from '#shared/schemas/pack.schema'
  const props = withDefaults(defineProps<{tag:Tag;showDeleteButton?:boolean,fontSize?:number}>(), {
    showDeleteButton:true,
    fontSize:16
  })
    const emits = defineEmits<{
    (e: 'onRemoveClick',tag:Tag): void
  }>()
  function clickHandle(){
    emits('onRemoveClick',props.tag)
  }


</script>

<style lang='scss' scoped>
.tag{
    padding: 5px 10px 5px 10px;
    background-color: var(--main-second);
    border-radius: 10px;
    position: relative;
  &_right-padding{
    padding-right: 20px;
  }
  &__name{
    color: white;
    white-space: nowrap;
  }
  &__close-btn{
    position: absolute;
    background-color: transparent;
    right: 4px;
    top: 4px;
  }
}
</style>