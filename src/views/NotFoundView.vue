<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>页面不存在</h2>
    <p>您访问的页面不存在或已被删除</p>
    <button @click="goHome">返回首页</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style lang="less" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;

  h1 {
    margin-bottom: 0;
    color: #42b983;
    font-size: 6rem;
  }

  h2 {
    margin-top: 0;
    font-size: 2rem;
  }

  p {
    margin: 1rem 0 2rem;
    color: #666;
  }

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 1rem;
    background-color: #42b983;
    cursor: pointer;

    &:hover {
      background-color: #36a573;
    }
  }
}
</style>
