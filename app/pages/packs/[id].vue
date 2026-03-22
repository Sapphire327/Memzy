<template>
  <div>
  </div>
</template>

<script lang="ts" setup>
import authMiddleware from '~/middleware/auth'
const route = useRoute();
definePageMeta({
 middleware: authMiddleware,
})
</script>

<style>

</style>