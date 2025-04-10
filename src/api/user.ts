import { get, post } from '@/utils/http'
import type { UserRole } from '@/router/types'

// 用户接口返回类型
interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

// 登录参数类型
interface LoginParams {
  // username: string
  // password: string
  email: string
  code: string
}

// 登录响应类型
interface LoginResult {
  token: string
  user: User
}

/**
 * 用户登录
 * @param params - 登录参数
 */
export function login(params: LoginParams) {
  // 模拟不同用户角色
  // 在实际项目中，这部分逻辑应该在后端处理
  // if (params.username === 'admin') {
  //   return Promise.resolve({
  //     token: 'admin-token',
  //     user: {
  //       id: 1,
  //       name: 'Admin User',
  //       email: 'admin@example.com',
  //       role: 'admin' as UserRole,
  //     },
  //   })
  // } else {
  //   return Promise.resolve({
  //     token: 'user-token',
  //     user: {
  //       id: 2,
  //       name: 'Normal User',
  //       email: 'user@example.com',
  //       role: 'user' as UserRole,
  //     },
  //   })
  // }

  // 实际项目中应该调用API
  return post<LoginResult>('/api/auth/login', params)
}

/**
 * 获取用户信息
 * @param id - 用户ID
 */
export function getUserInfo(id: number) {
  return get<User>(`/user/${id}`)
}

/**
 * 更新用户信息
 * @param id - 用户ID
 * @param data - 用户数据
 */
export function updateUser(id: number, data: Partial<User>) {
  return post<User>(`/user/${id}`, data)
}

/**
 * 获取用户列表
 * @param params - 查询参数
 */
export function getUserList(params?: { page?: number; size?: number }) {
  return get<User[]>('/user/list', params)
}
