<template>
  <section class='how-it-works'>
    <h2 class='how-it-works__heading'>Простой метод запоминания</h2>
    <div class='how-it-works__blocks'>
      <div class='how-it-works__block'>
        <h3 class='how-it-works__title'>Этапы изучения слова</h3>
        <ol class='how-it-works__steps'>
          <li v-for='(step, index) in steps' :key='index' class='how-it-works__step'>
            <span class='how-it-works__step-number'>{{ index + 1 }}</span>
            <span class='how-it-works__step-text'>{{ step }}</span>
          </li>
        </ol>
      </div>
      <div class='how-it-works__block'>
        <h3 class='how-it-works__title'>Интервалы повторения</h3>
        <ul class='how-it-works__intervals'>
          <li v-for='interval in intervals' :key='interval' class='how-it-works__interval'>
            <span class='how-it-works__interval-dot'></span>
            {{ interval }}
          </li>
        </ul>
        <p class='how-it-works__note'>
          Верный ответ — уровень изучения растёт, а интервал до следующего повтора увеличивается. Ошибка — сбрасывает
          интервал к началу и возвращает этап изучения на предыдущий.
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const steps = [
  'Просмотр карточки — знакомишься со словом и переводом',
  'Собери слово из букв',
  'Напиши слово по памяти',
]
const intervals = ['25 минут', '1 день', '3 дня', '1 неделя', '2 недели', '1 месяц']
</script>

<style scoped lang='scss'>
.how-it-works{


  &__heading{
    text-align: center;
    font-size: 26px;
    color: var(--main-second-darker);
        // color: var(--dark-text);
    margin-bottom: 24px;
  }
  &__blocks{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    @media (max-width: 800px) {
      grid-template-columns: 1fr;
    }
  }
  &__block{
    background-color: white;
    border-radius: 12px;
    padding: 24px;
  }
  &__title{
    font-size: 20px;
    color: var(--main-second-darker);
    margin-bottom: 16px;
  }
  &__steps{
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  &__step{
    display: flex;
    // align-items: flex-start;
    align-items: center;
    gap: 10px;
    font-size: 17px;
    color: var(--dark-text);
  }
  &__step-number{
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: var(--main-second);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
  }
  &__intervals{
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 10px 8px;
    margin-bottom: 16px;
  }
  &__interval{
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    color: var(--dark-text);
    background-color: rgba(255, 255, 255, 0.6);
    border: 2px solid var(--main-second);
    border-radius: 999px;
    padding: 6px 14px;
  }
  &__interval-dot{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--main-second);
  }
  &__note{
    font-size: 15px;
    color: var(--dark-text);
    opacity: 0.8;
    line-height: 1.4em;
  }
}
</style>