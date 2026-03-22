<template>
  <button class='button'><slot></slot></button>
</template>

<script lang="ts" setup>

</script>

<style scoped>
  .button{
    display: block;
    font-size: 18px;
    border-radius: 6px;
    padding: 16px 16px;
    color: var(--dark-text);
    color: white;
    background-color: var(--main-second);
    transition: background-color 0.3s ease;
  }
  .button:hover{
    background-color:var(--main-second-darker)
  }
  .button:disabled{
    background-color: gray;
    color: white;
  }
</style>