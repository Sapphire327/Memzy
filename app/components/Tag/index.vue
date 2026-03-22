<template>
  <div class='tag'>
    <p class='tag__name'>{{ props.tag.name }}</p>
    <button @click='clickHandle' class='tag__close-btn'><Icon name="akar-icons:cross" size='10' style="color: white" /></button>
  </div>
</template>

<script lang="ts" setup>
  import type { Tag } from '#shared/schemas/pack.schema'
  const props = defineProps<{tag:Tag;}>()
  function clickHandle(){
    emits('onRemoveClick',props.tag)
  }
  const emits = defineEmits<{
    (e: 'onRemoveClick',tag:Tag): void
  }>()

</script>

<style lang='scss' scoped>
.tag{
    padding: 5px 20px 5px 10px;
    background-color: var(--main-second);
    border-radius: 10px;
    position: relative;

  &__name{
    font-size: 16px;
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