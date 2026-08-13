<template>
  <AppModal v-model:is-open='isOpen' close-on-overlay-click>
    <div class='confirm'>
      <h3 class='confirm__title'>{{ title }}</h3>
      <p v-if='message' class='confirm__message'>{{ message }}</p>
      <div class='confirm__actions'>
        <FormButton class='confirm__cancel' @click='cancel'>{{ cancelText }}</FormButton>
        <FormButton class='confirm__accept' @click='confirm'>{{ confirmText }}</FormButton>
      </div>
    </div>
  </AppModal>
</template>

<script lang="ts" setup>
const isOpen = defineModel('isOpen', { default: false })
withDefaults(defineProps<{
  title: string,
  message?: string,
  confirmText?: string,
  cancelText?: string,
}>(), {
  message: '',
  confirmText: 'Удалить',
  cancelText: 'Отмена',
})
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function cancel() {
  isOpen.value = false
  emit('cancel')
}
function confirm() {
  emit('confirm')
}
</script>

<style scoped lang='scss'>
.confirm{
  &__title{
    font-size: 22px;
    margin-bottom: 10px;
  }
  &__message{
    font-size: 16px;
    color: var(--dark-text);
    opacity: 0.8;
    word-break: break-word;
  }
  &__actions{
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  &__cancel{
    font-size: 14px;
    padding: 8px 14px;
    background-color: #888;
  }
  &__accept{
    font-size: 14px;
    padding: 8px 14px;
    background-color: #d9534f;
  }
}
</style>
