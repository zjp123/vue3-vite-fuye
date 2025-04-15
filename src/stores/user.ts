import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserRole } from '@/router/types'
import { login as apiLogin, apiAdminLogin } from '@/api/user'

interface UserInfo {
  id: number
  name: string
  email: string
  role: UserRole
  isAdmin: number
}

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserInfo | null>(null)
  // 登录状态
  const isLoggedIn = ref(false)
  // 用户角色
  const userRole = ref<UserRole | null>(null)
  // 用户token
  const token = ref<string | null>(null)

  /**
   * 初始化用户状态
   */
  function initUserState() {
    // 从本地存储获取用户信息
    const storedToken = localStorage.getItem('token')
    const storedUserInfo = localStorage.getItem('userInfo')

    if (storedToken && storedUserInfo) {
      token.value = storedToken
      userInfo.value = JSON.parse(storedUserInfo)
      userRole.value = userInfo.value?.role || null
      isLoggedIn.value = true
    }
  }

  /**
   * 管理员用户登录
   * @param username 用户名
   * @param password 密码
   */
  async function adminLogin(email: string, code: string) {
    try {
      // const result = await apiLogin({ username, password })
      const result: any = await apiAdminLogin(
        { email, code },
        {
          showLoading: true,
        },
      )
      console.log(result, '管理员登录结果')
      // 保存token
      token.value = result.data
      // localStorage.setItem('token', result.token)
      localStorage.setItem('token', result.data)

      // 保存用户信息--标准版
      // userInfo.value = {
      //   id: result.user.id,
      //   name: result.user.name,
      //   email: result.user.email,
      //   role: result.user.role || 'user', // 默认为普通用户
      // }

      /** 非标准版 */
      userInfo.value = {
        id: result.data,
        name: '',
        email: '',
        role: 'admin', // 默认为普通用户
        isAdmin: 1,
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))

      // 更新状态
      userRole.value = userInfo.value.role
      isLoggedIn.value = true

      return true
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   */
  async function login(email: string, code: string) {
    try {
      // const result = await apiLogin({ username, password })
      const result: any = await apiLogin(
        { email, code },
        {
          showLoading: true,
        },
      )
      console.log(result, '登录结果')
      // 保存token
      token.value = result.data
      // localStorage.setItem('token', result.token)
      localStorage.setItem('token', result.data)

      // 保存用户信息--标准版
      // userInfo.value = {
      //   id: result.user.id,
      //   name: result.user.name,
      //   email: result.user.email,
      //   role: result.user.role || 'user', // 默认为普通用户
      // }

      /** 非标准版 */
      userInfo.value = {
        id: result.data,
        name: '',
        email: '',
        role: 'user', // 默认为普通用户
        isAdmin: 0,
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))

      // 更新状态
      userRole.value = userInfo.value.role
      isLoggedIn.value = true

      return true
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  /**
   * 用户登出
   */
  function logout() {
    // 清除token
    token.value = null
    localStorage.removeItem('token')

    // 清除用户信息
    userInfo.value = null
    localStorage.removeItem('userInfo')

    // 更新状态
    userRole.value = null
    isLoggedIn.value = false
  }

  return {
    userInfo,
    isLoggedIn,
    userRole,
    token,
    initUserState,
    login,
    logout,
    adminLogin,
  }
})
