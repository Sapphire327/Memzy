<template>
  <div>
    <h2 class='status'>{{ message }}</h2>
  </div>
</template>

<script lang="ts" setup>
import type { FetchError } from 'ofetch'
const message = ref('')
const route = useRoute();
const tokenTerm = route.query.token;
if (!tokenTerm) {
  message.value = 'Отсутствует токен подтверждения';
} else {
try{
  const response = await $fetch('/api/auth/confirmEmail',{
    method:'POST',
    body:{token:tokenTerm}
  })
  message.value="Вы успешно подтвердили почту"
  }catch(e){
    const fetchError = e as FetchError;
    if(isApiError(fetchError.data)){
      message.value=fetchError.data.message||'Произошла ошибка'
    }
  }
}
</script>

<style scoped>
.status{
  text-align: center;
  font-size: 24px;
  margin-top: 24px;
}
</style>