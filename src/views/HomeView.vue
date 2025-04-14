<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'
// import ResponsiveImage from '../components/ResponsiveImage.vue'
</script>

<template>
  <main>
    <section class="image-examples">
      <h2>这是主页面</h2>

      <!-- 1. 使用响应式图片组件 -->
      <!-- <div class="example-card">
        <h3>响应式懒加载图片</h3>
        <ResponsiveImage src="/src/assets/logo.svg" alt="响应式图片示例" width="100%" height="300px" lazy webp />
      </div> -->

      <!-- 2. 使用图片懒加载指令 -->
      <!-- <div class="example-card">
        <h3>使用指令懒加载</h3>
        <img v-lazy="'/src/assets/example.webp'" alt="懒加载示例" class="lazy-image" />
      </div> -->
    </section>
  </main>
</template>

<style lang="less">
main {
  .image-examples {
    margin-top: 40px;

    h2 {
      margin-bottom: 20px;
      color: #42b983;
    }

    .example-card {
      margin-bottom: 30px;
      padding: 20px;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);

      h3 {
        margin-bottom: 15px;
        color: #333;
      }
    }

    .lazy-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      background-color: #f0f0f0;
      transition: opacity 0.3s;
      opacity: 0;

      &.loaded {
        opacity: 1;
      }

      &.error {
        opacity: 0.5;
      }
    }
  }
}
</style>
