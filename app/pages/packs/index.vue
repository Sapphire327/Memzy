<template>
  <div class='main'>
    <AppModal v-model:is-open='isOpen' ><PackCreateForm></PackCreateForm></AppModal>
    <div class='main__top'>
      <FormButton class='main__create-btn' @click="openPopup">Создать пак</FormButton>
      <FormButton class='main__create-btn' @click="openCatalog">Каталог паков</FormButton>
    </div>
    <h2 v-if='data?.myPacks && data.myPacks.length' class='main__section-title'>Мои паки</h2>
    <div v-if='data?.myPacks && data.myPacks.length' class='main__packs'>
      <PackCard v-for="pack in data.myPacks" :key='pack.id' :pack='pack'></PackCard>
    </div>
    <h2 v-if='data?.subscribedPacks && data.subscribedPacks.length' class='main__section-title'>Подписки</h2>
    <div v-if='data?.subscribedPacks && data.subscribedPacks.length' class='main__packs'>
      <PackCard v-for="pack in data.subscribedPacks" :key='pack.id' :pack='pack'></PackCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UsersPack } from '#shared/schemas'
import authMiddleware from '~/middleware/auth'
useHead({ title: 'Мои списки' })
definePageMeta({
 middleware: authMiddleware,
})

const { data,error } = await useFetch<{myPacks:UsersPack[], subscribedPacks:UsersPack[]}>(`/api/packs/`,)

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
function openCatalog(){
  navigateTo('/packs/catalog')
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
.main__section-title{
  margin-top: 40px;
  font-size: 24px;
  color: var(--dark-text);
}
.main__top{
  margin-top: 24px;
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  @media (max-width: 600px) {
    margin-top: 10px;
    flex-direction: column;
    gap: 5px;
    align-items: center;
  }
}
.main__packs{
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;

  justify-content: flex-start
}
</style>