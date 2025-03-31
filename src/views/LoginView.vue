<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/user'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''

    const result = await login({
      username: username.value,
      password: password.value,
    })

    // 保存 token
    localStorage.setItem('token', result.token)

    // 登录成功，跳转到首页
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <h2>用户登录</h2>

    <form @submit.prevent="handleLogin">
      <div class="form-item">
        <label for="username">用户名</label>
        <input id="username" v-model="username" type="text" placeholder="请输入用户名" />
      </div>

      <div class="form-item">
        <label for="password">密码</label>
        <input id="password" v-model="password" type="password" placeholder="请输入密码" />
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </form>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);

  h2 {
    margin-bottom: 20px;
    color: #42b983;
    text-align: center;
  }

  .form-item {
    margin-bottom: 15px;

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;

      &:focus {
        border-color: #42b983;
        outline: none;
      }
    }
  }

  .error-message {
    margin-bottom: 15px;
    color: #f56c6c;
  }

  button {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 16px;
    background-color: #42b983;
    cursor: pointer;

    &:hover {
      background-color: #36a573;
    }

    &:disabled {
      background-color: #a0cfbe;
      cursor: not-allowed;
    }
  }
}
</style>
