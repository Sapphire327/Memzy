<template>
  <div class='main-page'>
    <section class='top-section main-page__top'>
      <div class='flipWords'>
        <DecorationWordFlipCard class='flip-card' text-align='center' top-text='Создавай' bottom-text='Create'></DecorationWordFlipCard>
        <DecorationWordFlipCard class='flip-card' text-align='center' top-text='Учи' bottom-text='Learn'></DecorationWordFlipCard>
        <DecorationWordFlipCard class='flip-card' text-align='center' top-text='Запоминай' bottom-text='Remember'></DecorationWordFlipCard>
      </div>
      <div class='top-section__desc'>
        <div class='desc'>
          <ul class='desc__list'>
            <li>Создавай интерактивные карточки.</li>
            <li>Используй готовые наборы или придумывай свои</li>
            <li>Закрепляй материал с помощью тестов.</li>
            <li>Отслеживайте свой прогресс.</li>
          </ul>
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
    height: 500px;
    @media (max-width: 380px) {
      height: 550px;
    }
  }
}
.flipWords{
  display: flex;
  justify-content: center;
  gap: 40px;
  @media (max-width: 500px) {
    gap: 10px;
  }
}
.flip-card{
  width: 140px;
    @media (max-width: 500px) {
      width: 120px;
    }
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
    position: absolute;
    bottom: -170%;
    right: -15%;
    font-size: 18px;
    @media (max-width: 880px) {
      bottom: -181%;
      right: 3%;
    }
    @media (max-width: 660px) {
      bottom: -200px;
      right: 10%;
      width: 200px !important;
      font-size: 13px !important;
    }
     @media (max-width: 530px) {
      right: auto;
      left: 30px;
      bottom: -225px;
      font-size: 16px !important;
      width: 230px !important;
    }
    @media (max-width: 300px) {
      right: auto;
      left: 30px;
      bottom: -245px;
      font-size: 16px !important;
      width: 200px !important;
    }
  }
}
.how-it-works{
    margin-top: 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
  
</style>