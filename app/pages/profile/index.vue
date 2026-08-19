<template>
  <div class='profile'>
    <section class='profile__header'>
      <div class='profile__avatar'>{{ avatarLetter }}</div>
      <div class='profile__info'>
        <h1 class='profile__name'>{{ data?.user?.name }}</h1>
        <p class='profile__login'>{{ data?.user?.login }}</p>
        <p v-if='registeredString' class='profile__created'>Зарегистрирован {{ registeredString }}</p>
      </div>
    </section>

    <section class='profile__section'>
      <h2 class='profile__title'>Сегодня</h2>
      <div class='profile__today'>
        <div class='profile__due'>
          <p class='profile__due-count'>{{ data?.dueCount ?? 0 }}</p>
          <p class='profile__due-label'>карточек к повторению</p>
          <NuxtLink to='/packs/repeat'>
            <FormButton class='profile__repeat-btn'>Повторить всё</FormButton>
          </NuxtLink>
        </div>
        <ProfileStatCard :value='learningCount' label='Всего изучено'></ProfileStatCard>
        <ProfileStatCard :value='inProgressCount' label='В работе'></ProfileStatCard>
        <ProfileStatCard :value='fullyLearnedCount' label='Выучено полностью'></ProfileStatCard>
        <ProfileStatCard :value='lastTrainingString' label='Последняя тренировка'></ProfileStatCard>
      </div>
    </section>

    <section class='profile__section'>
      <h2 class='profile__title'>Статистика</h2>
      <div class='profile__stats'>
        <ProfileLevelDistribution
          title='Уровни'
          :items='levelDistribution'
          :label-map='levelLabels'
          description='Уровень последнего пройденного задания'
        ></ProfileLevelDistribution>
        <ProfileLevelDistribution
          title='Этапы повторения'
          :items='stageDistribution'
          :label-map='stageLabels'
          description='Интервал до следующего повторения'
        ></ProfileLevelDistribution>
      </div>
    </section>

    <section class='profile__section'>
      <h2 class='profile__title'>Мои паки</h2>
      <ProfilePackProgress :packs='packs'></ProfilePackProgress>
    </section>

    <section class='profile__section'>
      <ProfileChangePassword @changed='refresh'></ProfileChangePassword>
    </section>

    <section class='profile__section'>
      <FormButton class='profile__logout' @click='exit'>Выйти</FormButton>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ProfileDashboard } from '#shared/schemas'
import { computed } from 'vue'
import authMiddleware from '~/middleware/auth'
import daysAgoString from '~/utils/daysAgoString'

useHead({ title: 'Профиль' })
definePageMeta({
  middleware: authMiddleware,
})

const { data, refresh } = await useFetch<ProfileDashboard>('/api/profile')
const { user } = useUserSession()

const avatarLetter = computed(() =>
  (data.value?.user?.name?.[0] ?? user.value?.name?.[0] ?? '?').toUpperCase()
)
const registeredString = computed(() => {
  const createdAt = data.value?.user?.createdAt
  return createdAt ? daysAgoString(new Date(createdAt)) : ''
})
const learningCount = computed(() => data.value?.learningCount ?? 0)
const inProgressCount = computed(() => data.value?.inProgressCount ?? 0)
const fullyLearnedCount = computed(() => data.value?.fullyLearnedCount ?? 0)
const levelDistribution = computed(() => data.value?.levelDistribution ?? [])
const stageDistribution = computed(() => data.value?.stageDistribution ?? [])
const packs = computed(() => data.value?.packs ?? [])
const lastTrainingString = computed(() => {
  const last = data.value?.lastTraining
  return last ? daysAgoString(new Date(last)) : '—'
})

const levelLabels: Record<number, string> = {
  1: 'Просмотр карточки',
  2: 'Собрать слово',
  3: 'Собрать слово',
  4: 'Написать слово',
}
const stageLabels: Record<number, string> = {
  1: '25 минут',
  2: '1 день',
  3: '3 дня',
  4: '1 неделя',
  5: '2 недели',
  6: '1 месяц',
}

async function exit() {
  const { fetch, clear } = useUserSession()
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  await fetch()
  return navigateTo('/')
}
</script>

<style scoped lang='scss'>
.profile{
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 28px;

  &__header{
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 10px;
    border: 3px solid rgb(230, 230, 230);
    padding: 20px 24px;
  }
  &__avatar{
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background-color: var(--main-second);
    color: white;
    font-size: 36px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  &__name{
    font-size: 28px;
    color: var(--dark-text);
  }
  &__login{
    font-size: 16px;
    color: var(--dark-text);
    opacity: 0.8;
  }
  &__created{
    font-size: 14px;
    color: var(--dark-text);
    opacity: 0.7;
  }
  &__section{
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  &__title{
    font-size: 24px;
    color: var(--main-second-darker);
  }
  &__today{
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: stretch;
  }
  &__due{
    flex: 1 1 200px;
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 10px;
    border: 3px solid var(--main-second);
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
  }
  &__due-count{
    font-size: 48px;
    font-weight: 600;
    color: var(--main-second-darker);
    line-height: 1;
  }
  &__due-label{
    font-size: 15px;
    color: var(--dark-text);
    opacity: 0.9;
  }
  &__repeat-btn{
    padding: 10px 20px;
    font-size: 16px;
  }
  &__stats{
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  &__logout{
    padding: 12px 32px;
    font-size: 18px;
  }
}
</style>