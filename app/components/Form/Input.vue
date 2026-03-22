<template>
  <input v-model="model" type="text" class='input' v-bind="$attrs">
</template>

<script lang="ts" setup>
const model = defineModel()
</script>

<style scoped >
.input{
  display: block;
  font-size: 18px;
  border-radius: 6px;
  padding: 4px 6px;
}
</style>