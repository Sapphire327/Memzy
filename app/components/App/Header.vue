<template>
  <header class='header'>
      <ul class='header__list'>
        <li><NuxtLink class='header__link' to='/'>Memzy</NuxtLink></li>
        <li><NuxtLink class='header__link' to='/packs'>Мои списки</NuxtLink></li>
        <li v-if='!loggedIn'><NuxtLink class='header__link' to='/auth/signin'>Вход</NuxtLink></li>
        <li v-else><NuxtLink class='header__link' to='/profile'>Профиль {{ user?.name }}</NuxtLink></li>
      </ul>
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
  display: flex;
  justify-items: center;
  padding-top: 10px;

  &__link{
    display: flex;
    font-size: 24px;
    color: var(--dark-text);
    transition: color 0.3s ease;
    white-space: nowrap;
    width: 100%;
    padding: 10px 20px;
    transition: all 0.3s ease;

    @media (max-width: 500px) {
      font-size: 22px;
      padding: 7px 13px;
    }
    &:hover{
      background-color: var(--main-second);
      color: white;
    }
  }
  &__list{
    margin: auto;
    background-color: white;
    display: flex;
    align-items: stretch;
    border-radius: 10px;
    @media (max-width: 430px) {
      flex-direction: column;
      width: 80%;
      text-align: center;
    }
    &>li{
      height: 100%;

      &:first-child>.header__link{
        border-radius: 10px 0 0 10px;
         @media (max-width: 430px) {
          border-radius: 10px 10px 0 0;
        }
      }
      &:last-child>.header__link{
        border-radius: 0 10px 10px 0;
        @media (max-width: 430px) {
           border-radius: 0 0 10px 10px;
        }
      }
    }
  }
}


</style>