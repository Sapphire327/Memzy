<template>
  <div class='main'>
    <AppModal v-model:is-open='isOpen' ><PackCreateForm></PackCreateForm></AppModal>
    <div class='main__top'>
      <FormButton class='main__create-btn' @click="openPopup">Создать пак</FormButton>
      <FormButton class='main__create-btn'>Каталог паков</FormButton>
    </div>
    <div class='main__packs'>
      <PackLinkInfo v-if='data?.packs' v-for="pack in data?.packs" :pack='pack'></PackLinkInfo>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UsersPack } from '#shared/schemas'
import authMiddleware from '~/middleware/auth'
definePageMeta({
 middleware: authMiddleware,
})

const { data,error } = await useFetch<{packs:UsersPack[]}>(`/api/packs/`,)

// const pack = {
//   name:'Дни недели по грузински',
//   description:'Список для изучения дней недели на грузинском',
//   tags:['Weeks','Georgian'],
//   lastRepeat:new Date(2026,2,2,19,0,0)
// }
function openPopup(){
  isOpen.value=true
  console.log(isOpen.value);
  
}
const isOpen = ref(false)
</script>

<style lang='scss' scoped>
.main__create-btn{
  width: 260px;
}
.main{
  max-width: 1200px;
  margin: auto;
}
.main__top{
  margin-top: 50px;
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  
}
.main__packs{
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;

  justify-content: flex-start
}
</style>