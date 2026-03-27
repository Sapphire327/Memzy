<template>
  <div class="custom-checkbox">
    <input :id='props.id' v-model="isChecked" type="checkbox" class="custom-checkbox__input" :disabled="props.disabled"/>
    <div @click='toggleCheckbox'  class='custom-checkbox__box'>
      <div class='custom-checkbox__body' :class={active:isChecked}></div>
    </div>
    <label :for='props.id' class="custom-checkbox__label">{{ props.label }}</label>
  </div>
</template>

<script setup lang="ts">
const isChecked = defineModel()
const props = defineProps<{
  label?: string;
  id:string;
  disabled?: boolean;
}>();
function toggleCheckbox(){
  isChecked.value=!isChecked.value
}
</script>

<style scoped lang='scss'>
.custom-checkbox{
  display: flex;
  align-items: center;
  gap: 5px;
  &__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    transition: all 0.6s ease;
  }
  &__box{
    width: 40px;
    height: 20px;
    border: 2px solid var(--main-second);
    border-radius: 20px;
    align-items: center;
    padding: 2px;
    position: relative;
    transition: all 0.6s ease;
  }
  &__body{
    background-color: var(--main-second);
    border-radius: 50%;
    width: 13px;
    height: 13px;
    position: absolute;
    left: 3px;
    transition: all 0.3s ease;
    &.active{
      left: 21px;
    }
  }
  &__label{
    font-size: 18px;
  }
}


</style>
