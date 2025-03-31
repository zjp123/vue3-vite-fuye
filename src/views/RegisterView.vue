<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  // 表单验证
  if (!username.value || !email.value || !password.value) {
    errorMessage.value = '请填写所有必填字段'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''

    // 模拟注册请求
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 注册成功，跳转到登录页
    router.push('/login')
  } catch (error: any) {
    errorMessage.value = error.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-container">
    <h2>用户注册</h2>

    <form @submit.prevent="handleRegister">
      <div class="form-item">
        <label for="username">用户名</label>
        <input id="username" v-model="username" type="text" placeholder="请输入用户名" />
      </div>

      <div class="form-item">
        <label for="email">邮箱</label>
        <input id="email" v-model="email" type="email" placeholder="请输入邮箱" />
      </div>

      <div class="form-item">
        <label for="password">密码</label>
        <input id="password" v-model="password" type="password" placeholder="请输入密码" />
      </div>

      <div class="form-item">
        <label for="confirmPassword">确认密码</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          placeholder="请再次输入密码"
        />
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>

      <div class="login-link">已有账号？<router-link to="/login">去登录</router-link></div>
    </form>
  </div>
</template>
<style lang="less" scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
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

  .login-link {
    margin-top: 15px;
    text-align: center;

    a {
      color: #42b983;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
