import { get, post } from '@/utils/http'

// 用户接口返回类型
interface User {
  id: number
  name: string
  email: string
}

// 登录参数类型
interface LoginParams {
  username: string
  password: string
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
  return post<LoginResult>('/user/login', params)
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
