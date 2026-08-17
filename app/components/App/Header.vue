<template>
  <header class='header'>
      <nav class='header__list'>
        <NuxtLink class='header__link' to='/'>Memzy</NuxtLink>
        <NuxtLink class='header__link' to='/packs'>Мои списки</NuxtLink>
        <NuxtLink v-if='!loggedIn' class='header__link' to='/auth/signin'>Вход</NuxtLink>
        <NuxtLink  v-else class='header__link' to='/profile'>{{ user?.name }}</NuxtLink>
      </nav>
  </header>
</template>

<script lang="ts" setup>
const {loggedIn,user,fetch} = useUserSession()
onMounted(async()=>{
  await fetch();
})

</script>

<style lang='scss' scoped>
.header{
  width: 100%;
  background-color: white;
  &__list{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: stretch;
  }
  &__link{
    display: flex;
    align-items: center;
    font-size: 28px;
    color: #621114;
    // padding: 10px 0 10px 0;
    transition: all 0.3s ease;
    flex: 0 1 260px;
    text-align: center;
    justify-content: center;
    white-space: nowrap;
    height: 60px;
    &:first-child,&:last-child{  
      flex: 1 1 140px;
      padding:0 36px;
      @media (max-width: 600px) {
        padding:0 10px;
      }
    }

    &:first-child{
      justify-content: right;
    }
    &:last-child{
      justify-content: left;
    }
    &:hover{
      background-color: var(--main-second);
      color: white;
    }
    @media (max-width: 450px) {
      font-size: 20px;
    }
  }
}


</style>