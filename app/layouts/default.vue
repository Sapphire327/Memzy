<template>
  <div class='wrapper'>
    <AppHeader></AppHeader>
      <div class='container main'>
        <slot />
      </div>
      <footer>Подвал</footer>
  </div>
  
</template>

<script lang="ts" setup>

</script>

<style>
  .wrapper{
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    min-height: 100%;
        align-items: stretch;
    background:linear-gradient(to right,var(--main-bg-1), var(--main-bg-2));
  }
  .main{
    flex: 1 1 auto;
    width: 100%;
  }
</style>