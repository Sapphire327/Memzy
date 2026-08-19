<template>
  <footer class='footer'>
    <div class='footer__inner'>
      <NuxtLink class='footer__logo' to='/'>Memzy</NuxtLink>
      <ul class='footer__list'>
        <li><NuxtLink class='footer__link' to='/packs'>Мои списки</NuxtLink></li>
        <li v-if='!loggedIn'><NuxtLink class='footer__link' to='/auth/signin'>Вход</NuxtLink></li>
        <li v-else><NuxtLink class='footer__link' to='/profile'>{{ user?.login }}</NuxtLink></li>
      </ul>
    </div>
    <p class='footer__copyright'>© 2026 Memzy</p>
  </footer>
</template>

<script lang="ts" setup>
const { loggedIn, user } = useUserSession()
</script>

<style scoped lang='scss'>
.footer{
  margin-top: 40px;
  border-top: 2px solid var(--main-second);
  padding: 20px 16px;

  &__inner{
    max-width: 1200px;
    margin: auto;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  &__logo{
    font-size: 24px;
    color: var(--main-second-darker);
    font-weight: 600;
  }
  &__list{
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-left: auto;
  }
  &__link{
    display: block;
    font-size: 16px;
    color: var(--dark-text);
    padding: 6px 12px;
    border-radius: 8px;
    transition: background-color 0.3s ease, color 0.3s ease;
    white-space: nowrap;

    &:hover{
      background-color: var(--main-second);
      color: white;
    }
  }
  &__copyright{
    max-width: 1200px;
    margin: auto;
    margin-top: 14px;
    font-size: 14px;
    opacity: 0.7;
  }
}
</style>