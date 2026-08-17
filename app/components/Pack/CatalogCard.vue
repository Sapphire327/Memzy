<template>
  <div class='catalog-pack' @click='open'>
    <p class='catalog-pack__name'>{{ pack.name }}</p>
    <p v-if='pack.description' class='catalog-pack__description'>{{ pack.description }}</p>
    <ul class='catalog-pack__tag-list'>
      <li v-for='tag in pack.tags' :key='tag.id'>
        <Tag :font-size='12' :tag='tag' :show-delete-button='false'></Tag>
      </li>
    </ul>
    <FormButton
      v-if='canSubscribe'
      class='catalog-pack__subscribe'
      :class='{ "catalog-pack__subscribe--active": pack.isSubscribed }'
      @click.stop='toggle'
    >{{ pack.isSubscribed ? 'Отписаться' : 'Подписаться' }}</FormButton>
  </div>
</template>

<script lang="ts" setup>
import type { CatalogPack } from '#shared/schemas'

const props = defineProps<{ pack: CatalogPack, canSubscribe: boolean }>()
const emit = defineEmits<{
  (e: 'subscribe', pack: CatalogPack): void
}>()

function open() {
  navigateTo('/packs/' + props.pack.id)
}
function toggle() {
  emit('subscribe', props.pack)
}
</script>

<style scoped lang='scss'>
.catalog-pack{
  cursor: pointer;
  position: relative;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 14px 14px;
  border: 3px solid rgb(230, 230, 230);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 150px;
  transition: all 0.3s ease;

  &:hover{
    border: 3px solid white;
  }
  &__name{
    font-size: 20px;
    color: var(--dark-text);
  }
  &__description{
    font-size: 16px;
    color: var(--dark-text);
    opacity: 0.9;
  }
  &__tag-list{
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: auto;
  }
  &__subscribe{
    font-size: 14px;
    padding: 8px 14px;

    &--active{
      background-color: #888;
      &:hover{
        background-color: #666;
      }
    }
  }
}
</style>