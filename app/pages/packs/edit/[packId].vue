<template>
  <div >
    <PackEditor class='editor' v-if='packId':packId></PackEditor>
  </div>
</template>

<script lang="ts" setup>
  const route = useRoute();
  const packId = computed<number|null>(() => {
    if(route.params.packId && typeof route.params.packId === 'string')
      return parseInt(route.params.packId); 
    else
      return null
  });
</script>

<style>
.editor{
  margin-top: 20px;
}
</style>