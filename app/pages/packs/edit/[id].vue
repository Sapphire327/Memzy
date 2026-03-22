<template>
  <div >
    <PackEditor class='editor' v-if='packId':packId></PackEditor>
  </div>
</template>

<script lang="ts" setup>
  const route = useRoute();
  const packId = computed<number|null>(() => {
    if(route.params.id && typeof route.params.id === 'string')
      return parseInt(route.params.id); 
    else
      return null
  });
</script>

<style>
.editor{
  margin-top: 20px;
}
</style>