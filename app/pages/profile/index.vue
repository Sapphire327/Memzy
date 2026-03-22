<template>
  <div>
    <FormButton @click='exit'>Выйти</FormButton>
  </div>
</template>

<script setup lang="ts">
import authMiddleware from '~/middleware/auth'
definePageMeta({
 middleware: authMiddleware,
})
async function exit(){
const {fetch,clear} = useUserSession()
  await $fetch('/api/auth/logout',{method:'POST'})
  await clear()
  await fetch();
  return navigateTo('/')

}
</script>


<style>

</style>