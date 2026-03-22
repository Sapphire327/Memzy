<template>
 <Teleport to="body">
    <div v-if='isOpen' class="modal-overlay" @click.self="props.closeOnOverlayClick ? close() : null">
      <div v-if='hasModalBody' class='modal-body'>
        <button @click='close' class='close-btn'><Icon name="akar-icons:cross" size='20' style="color: black" /></button>
        <slot></slot>
      </div>
      <slot v-else></slot>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  const isOpen = defineModel('isOpen',{default:false})
  const props = withDefaults(defineProps<{closeOnOverlayClick?:boolean,hasModalBody?:boolean}>(), {
    closeOnOverlayClick:false,
    hasModalBody:true
  })
  const updateScrollLock = () => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isOpen.value ? 'hidden' : '';
  };
  watch(() => isOpen.value, updateScrollLock, { immediate: true });
  onUnmounted(() => {
    document.body.style.overflow = '';
  });
  function close(){isOpen.value=false}
</script>

<style>
.modal-overlay{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}
.modal-body{
  position: relative;
  min-width: 250px;
  min-height: 100px;
  padding: 40px 20px 20px 20px;
  background-color: white;
  border-radius: 10px;
}
.close-btn{
    position: absolute;
   background-color: transparent;
   margin-left: auto;
   right: 10px;
   top: 10px;
}
</style>