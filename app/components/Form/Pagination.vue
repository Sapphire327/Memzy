<template>
  <div class='pagination'>
    <button v-for="value in pages" @click="$emit('onPageChange', value);currentPage=value" key={value} class='btn' :class='{selectedBtn:value===currentPage}'>{{ value }}</button>
  </div>
</template>

<script lang="ts" setup>

  const {maxPageCount,pageCount} = defineProps<{pageCount:number;maxPageCount:number;}>()
  const currentPage = defineModel<number>({ required: true,default:1 })

  const emit = defineEmits<{(e: 'onPageChange', page: number): void}>()
  const count = computed(()=>{
    return pageCount<maxPageCount?pageCount:maxPageCount
  })
  const from = computed(()=>{
    if(currentPage.value<=maxPageCount/2){
        return 1;
    }else if (pageCount-currentPage.value<maxPageCount/2){
        if(count.value>=maxPageCount)
            return pageCount-maxPageCount+1;
        else
            return 1;
    }else{
        return currentPage.value-Math.floor(maxPageCount/2)
    }
  })
  const pages = computed(()=>{
    const temp = []
    for (let i = 0;i<count.value;i++){
        temp.push(from.value+i)
    }
    return temp
  })
  
  
</script>

<style scoped lang='scss'>

.pagination{
  display: flex;
  justify-content: center;
  gap: 10px;
}
.btn{
  display: block;
  border: 4px solid var(--main-second); 
  background: var(--main-second);
  border-radius: 5px;
  font-size: 15px;
  padding: 10px;
  color: white;
  min-width: 37px;
  transition: all 300ms ease;
  &:hover{
    transform: scale(1.1);
  }
}
.selectedBtn{

  background-color: var(--main-second-darker);
  border: 4px solid var(--main-second-darker);
}
</style>