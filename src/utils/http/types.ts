import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// 自定义请求配置
export interface RequestOptions extends AxiosRequestConfig {
  // 是否显示加载中提示
  showLoading?: boolean
  // 是否显示错误提示
  showError?: boolean
  // 是否需要 token
  withToken?: boolean
  // 自定义错误处理
  customErrorHandler?: (error: any) => void
  // 是否可以取消请求
  cancelable?: boolean
  // 是否取消重复请求
  cancelDuplicate?: boolean
  // 重命名属性，避免与 Axios 内置属性冲突
  abortController?: AbortController
}

// 后端返回数据结构
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  success: boolean
}

// 请求方法类型
export type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

// 请求拦截器参数
export interface RequestInterceptors {
  // 请求拦截 - 使用 InternalAxiosRequestConfig 替代 AxiosRequestConfig
  requestInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  // 响应拦截
  responseInterceptor?: <T = any>(response: AxiosResponse<T>) => AxiosResponse<T> | T
  responseInterceptorCatch?: (error: any) => any
}
