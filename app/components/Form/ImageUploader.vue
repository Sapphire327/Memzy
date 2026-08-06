<template>
  <div class='image-uploader'>
    <p v-if='props.label' class='image-uploader__label'>{{ props.label }}</p>
    <label v-if='!file && !(initialSrc && !removed)' class='image-uploader__picker'>
      <input type='file' accept='image/*' class='image-uploader__input' @change='onFileChange'>
      <span class='image-uploader__placeholder'>Выбрать картинку</span>
    </label>
    <div v-if='file || (initialSrc && !removed)' class='image-uploader__preview'>
      <img :src='file ? previewUrl || undefined : initialSrc || undefined' class='image-uploader__img' alt=''>
      <FormButton type='button' class='image-uploader__remove' @click='removeImage'>Убрать</FormButton>
    </div>
    <p v-if='errorMsg' class='image-uploader__error'>{{ errorMsg }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{ label?: string, initialSrc?: string | null }>(), {
  label: '',
  initialSrc: null
})
const file = defineModel<File | null>('file', { default: null })
const removed = defineModel<boolean>('removed', { default: false })

const errorMsg = ref('')
let objectUrl: string | null = null
const previewUrl = ref<string | null>(null)

watch(() => props.initialSrc, () => {
  removed.value = false
})
watch(() => file.value, (newFile) => {
  if (newFile) removed.value = false
  updatePreview()
}, { immediate: true })

function updatePreview() {
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = null
  if (file.value) {
    objectUrl = URL.createObjectURL(file.value)
    previewUrl.value = objectUrl
  } else {
    previewUrl.value = null
  }
}
onBeforeUnmount(() => {
  if (objectUrl) URL.revokeObjectURL(objectUrl)
})

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const selected = input.files?.[0]
  input.value = ''
  if (!selected) return
  errorMsg.value = ''
  try {
    if (selected.type === 'image/gif') {
      file.value = selected
      return
    }
    const img = await loadImage(selected)
    const outputType = 'image/webp'
    let blob: Blob
    try {
      blob = await compressImage(img, outputType, 0.85)
    } catch {
      blob = await compressImage(img, 'image/jpeg', 0.85)
    }
    const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
    const newName = selected.name.replace(/\.[^.]+$/, '') + '.' + ext
    file.value = new File([blob], newName, { type: blob.type })
  } catch (e) {
    errorMsg.value = (e as Error).message || 'Не удалось обработать картинку'
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Не удалось прочитать картинку')) }
    img.src = url
  })
}

function compressImage(img: HTMLImageElement, outputType: string, quality: number): Promise<Blob> {
  const maxDim = 1024
  let width = img.naturalWidth
  let height = img.naturalHeight
  const scale = Math.min(1, maxDim / Math.max(width, height))
  width = Math.round(width * scale)
  height = Math.round(height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.reject(new Error('Не удалось сжать картинку'))
  ctx.drawImage(img, 0, 0, width, height)
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Не удалось сжать картинку'))
    }, outputType, quality)
  })
}

function clearFile() {
  file.value = null
  errorMsg.value = ''
}

function removeImage() {
  if (file.value) {
    clearFile()
  } else {
    removed.value = true
  }
}
</script>

<style scoped lang='scss'>
.image-uploader{
  display: flex;
  flex-direction: column;
  gap: 6px;
  &__label{
    font-size: 15px;
  }
  &__picker{
    cursor: pointer;
    border: 2px dashed var(--main-second);
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    transition: all 0.3s ease;
    &:hover{
      background-color: rgba(255, 255, 255, 0.6);
    }
  }
  &__input{
    display: none;
  }
  &__placeholder{
    font-size: 15px;
    color: var(--main-second-darker);
  }
  &__preview{
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  &__img{
    max-width: 100%;
    max-height: 180px;
    border-radius: 8px;
    object-fit: contain;
  }
  &__remove{
    padding: 6px 10px;
    font-size: 14px;
    align-self: flex-start;
  }
  &__error{
    font-size: 13px;
    color: black;
  }
}
</style>