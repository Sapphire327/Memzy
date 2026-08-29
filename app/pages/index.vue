<template>
  <div class='main-page'>
    <section class='top-section main-page__top'>
      <div class='about'>
        <div class='about__block'>
          <DecorationWordFlipCard class='flip-card' vertical-align='center' text-align='center' top-text='Создавай' bottom-text='Create'></DecorationWordFlipCard>
          <div class='about__info'>
            <p class='about__info-title'>Интерактивные карточки</p>
            <p class='about__info-text'>Придумай свои<br> или используй <br>готовые</p>
          </div>
        </div>
        <div class='about__block'>
          <DecorationWordFlipCard class='flip-card' vertical-align='center' text-align='center' top-text='Учи' bottom-text='Learn'></DecorationWordFlipCard>
          <div class='about__info'>
            <p class='about__info-title'>Тесты <br>для обучения</p>
            <p class='about__info-text'>Закрепляй материал. <br> Отслеживай свой <br>прогресс</p>
          </div>
        </div>
        <div class='about__block'>
          <DecorationWordFlipCard class='flip-card' vertical-align='center' text-align='center' top-text='Запоминай' bottom-text='Remember'></DecorationWordFlipCard>
          <DecorationSticker :words class='desc__sticker'></DecorationSticker>
        </div>
      </div>
    </section>
    <section>
      <MainPageHowItWorks class='how-it-works container'></MainPageHowItWorks>
    </section>
    <section class='interactive container'>
      <h2 class='interactive__heading'>Наглядный пример тестов</h2>
      <div class='interactive__examples'>
        <div>
          <p class='interactive__description'>Первый взгляд на новое слово. Здесь ты просто смотришь и запоминаешь. <br>Не нужно ничего делать — просто дай мозгу время познакомиться: как пишется, что значит, как выглядит.</p>
          <QuestTestLearning class='interactive__test' :quest='quest'></QuestTestLearning>
        </div>
        <div>
          <p class='interactive__description'>На втором и третьем этапе собери перевод из перемешанных букв — как в Wordle. <br>Это активное воспоминание: ты не просто смотришь на ответ, а сам восстанавливаешь слово по буквам.</p>
          <QuestTestWordle class='interactive__test' :quest='quest'></QuestTestWordle>
        </div>
        <div>
          <p class='interactive__description'>Напиши перевод без подсказок. Три попытки — и если всё верно, слово переходит в долговременную память. Ручной ввод заставляет вспомнить не только значение, но и точное написание. Это этап, на котором знание становится прочным.</p>
          <QuestTestTyping :instant-focus='false' class='interactive__test' :quest='quest'></QuestTestTyping>
        </div>
      </div>

    </section>    
  </div> 
</template>

<script lang="ts" setup>
import type { RepeatableQuest } from '~~/shared/schemas'

  useHead({ title: 'Memzy' })
  const words = [
    'Resourceful - находчивый',
    'Wise - мудрый',
    'Joy - Радость',
    'Conclusion - заключение',
    'Easy - легко',
    'Simply - просто',
    'Owl - сова']
  const quest:RepeatableQuest={
    lastRepeated: null,
    NextRepeated: null,
    level: null,
    stage: null,
    id: 0,
    quest: 'Изучение/обучение',
    answer: 'learning',
    hint: 'Оканчивается на ing',
    exampleInText: 'Learning new words takes time and practice.',
    questImgName: 'quests/element5-digital-OyCl7Y4y0Bk-unsplash.jpg',
    answerImgName: 'quests/photo-1603205431143-ce58f21799a4.avif',
    packId: 0
  }
    
</script>

<style lang='scss'>
.main-page{
  &__top{
    margin-top: 30px;

  }
}
.about{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
  margin: 0 40px;
  &__block{
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    width: 250px;
    // @media (max-width: 1000px) {
    //   width: 200px;
    // }
  }
  &__info{
    width: 100%;
    height: 250px;
    border: 3px solid var(--main-second);
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.3);
  }
  &__info-title{
    margin-top: 20px;
    font-size: 22px;
    font-weight: bold;
    color: black;
    text-align: center;
  }
  &__info-text{
    margin-top: 40px;
    font-size: 18px;
    color: black;
    text-align: center;
  }
  @media (max-width: 768px) {
    margin: 0;
  }
}
.flip-card{
  width: 100%;
  font-size: 27px;
  height: 70px;
  color: black;
  // @media (max-width: 1000px) {
  //   font-size: 22px;
  //   height: 50px;
  // }
}
.top-section__desc{
  margin-top: 20px;
}
.desc{
  font-size: 24px;
  position: relative;
  max-width: 600px;
  background-color: white;
  border-radius: 12px;
  margin: auto;
  padding: 20px;
  @media (max-width: 660px) {
    max-width: 500px;
  }
  @media (max-width: 530px) {
    padding-bottom: 40px;
  }
  &__list{
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    font-size: 22px;
    
    @media (max-width: 660px) {
        font-size: 18px;
        gap: 4px;
    }
    &>li{
      list-style: inside;
      list-style-position: outside;
    }
  }
  &>p{
      line-height: 1.2em;
  }
  &__sticker{
    width: 260px !important;
    position: relative;
    top: -15px;
    right: -20px;
    font-size: 18px;
    z-index: 2;
    @media (max-width: 400px) {
      right: 0;
      top: -5px;
      width: 240px !important;
      font-size: 16px !important;
    }
    //  @media (max-width: 530px) {
    //   font-size: 16px !important;
    //   width: 230px !important;
    // }
  }
}
.how-it-works{
    margin-top: 80px;
}
.interactive{
  padding-top: 20px;
  &__examples{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 30px;   
  }
  .interactive__test{
    border-radius:  0 0 10px 10px; 
  }
  &__description{
    font-size: 20px;
    background-color: white;
    border-radius: 10px 10px  0 0; 
    padding: 10px;
    margin-bottom: 10px;
  }
  &__heading{
    font-size: 26px;
    color: var(--main-second-darker);
    text-align: center;
  }

}
  
</style>