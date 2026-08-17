<template>
  <div class='main'>
    <div class='main__top'>
      <h1 class='main__title'>Каталог паков</h1>
      <FormInput v-model='searchInput' class='main__search' placeholder='Поиск по названию, описанию и тегам'></FormInput>
    </div>
    <div v-if='data?.packs && data.packs.length' class='main__packs'>
      <PackCatalogCard
        v-for='pack in data.packs'
        :key='pack.id'
        :pack='pack'
        :can-subscribe='canSubscribe(pack)'
        @subscribe='toggleSubscribe'
      ></PackCatalogCard>
    </div>
    <p v-else class='main__empty'>Ничего не найдено</p>
    <div v-if='pageCount > 1' class='main__pagination'>
      <FormPagination v-model='page' :page-count='pageCount' :max-page-count='7'></FormPagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CatalogPack } from '#shared/schemas'
import type { FetchError } from 'ofetch'
import authMiddleware from '~/middleware/auth'
useHead({ title: 'Каталог паков' })
definePageMeta({
  middleware: authMiddleware,
})

const { user } = useUserSession()
const toast = useToast()

const pageSize = 12
const searchInput = ref('')
const search = ref('')
const page = ref(1)

const { data, refresh } = await useFetch<{ packs: CatalogPack[], total: number, page: number, pageSize: number }>('/api/packs/catalog', {
  query: computed(() => ({ search: search.value, page: page.value, pageSize })),
  watch: [search, page],
})

let debounceId: ReturnType<typeof setTimeout> | null = null
watch(searchInput, (value) => {
  if (debounceId) clearTimeout(debounceId)
  debounceId = setTimeout(() => {
    search.value = value.trim()
    page.value = 1
  }, 300)
})

const pageCount = computed(() => {
  const total = data.value?.total ?? 0
  return total ? Math.ceil(total / pageSize) : 0
})

function canSubscribe(pack: CatalogPack) {
  return !!user.value?.id && pack.authorId !== user.value.id
}

async function toggleSubscribe(pack: CatalogPack) {
  const isSubscribed = pack.isSubscribed
  try {
    await $fetch(`/api/packs/${pack.id}/subscribe`, {
      method: isSubscribed ? 'DELETE' : 'POST',
    })
    toast.success({
      title: isSubscribed ? 'Отписано' : 'Подписано',
      message: isSubscribed ? 'Вы отписались от пака' : 'Вы подписались на пак',
    })
    refresh()
  } catch (e) {
    const fetchError = e as FetchError
    toast.error({
      title: 'Ошибка',
      message: isApiError(fetchError.data) ? (fetchError.data.message || 'Не удалось выполнить действие') : 'Не удалось выполнить действие',
    })
  }
}
</script>

<style scoped lang='scss'>
.main{
  max-width: 1200px;
  margin: auto;
  &__top{
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  &__title{
    font-size: 30px;
    color: var(--dark-text);
  }
  &__search{
    width: 400px;
    max-width: 90%;
    padding: 10px 14px;
  }
  &__packs{
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
  }
  &__empty{
    margin-top: 40px;
    text-align: center;
    font-size: 18px;
    color: var(--dark-text);
  }
  &__pagination{
    margin-top: 30px;
  }
}
</style>