<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps<{
  src: string
  alt: string
  width?: number | string
  height?: number | string
  lazy?: boolean
  placeholder?: string
  webp?: boolean
}>()

const imgRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const isInView = ref(false)

const finalSrc = computed(() => {
  // 如果支持webp且配置了webp选项
  if (props.webp && props.src) {
    // 假设你有一个webp版本的图片与原图同路径但扩展名为webp
    return props.src.replace(/\.(jpe?g|png)$/i, '.webp')
  }
  return props.src
})

// 懒加载逻辑
if (props.lazy) {
  useIntersectionObserver(imgRef, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isInView.value = true
    }
  })
} else {
  isInView.value = true
}

const displaySrc = computed(() => {
  if (!isInView.value) {
    return props.placeholder || ''
  }
  return finalSrc.value
})

const handleLoad = () => {
  isLoaded.value = true
}
</script>

<template>
  <div class="responsive-image-container" :style="{ width: width, height: height }">
    <img
      ref="imgRef"
      :src="displaySrc"
      :alt="alt"
      :class="{ 'image-loaded': isLoaded, 'image-loading': !isLoaded }"
      @load="handleLoad"
    />
    <div v-if="!isLoaded" class="image-placeholder">
      <slot name="placeholder">
        <div class="loading-spinner"></div>
      </slot>
    </div>
  </div>
</template>

<style lang="less">
.responsive-image-container {
  position: relative;
  overflow: hidden;
  background-color: #f0f0f0;
  width: 100%;
  height: auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;
    
    &.image-loading {
      opacity: 0;
    }
    
    &.image-loaded {
      opacity: 1;
    }
  }

  .image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    
    .loading-spinner {
      width: 30px;
      height: 30px;
      border: 3px solid rgb(0 0 0 / 10%);
      border-radius: 50%;
      border-top-color: #42b983;
      animation: spin 1s ease-in-out infinite;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>