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
    <MainPageHowItWorks class='how-it-works'></MainPageHowItWorks>
  </div> 
</template>

<script lang="ts" setup>
  useHead({ title: 'Memzy' })
  const words = [
    'Resourceful - находчивый',
    'Wise - мудрый',
    'Joy - Радость',
    'Conclusion - заключение',
    'Easy - легко',
    'Simply - просто',
    'Owl - сова']
    
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
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
  
</style>