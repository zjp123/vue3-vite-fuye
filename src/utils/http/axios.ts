import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { RequestInterceptors, ApiResponse } from './types'

// 创建 Axios 类
class HttpRequest {
  // axios 实例
  private instance: AxiosInstance
  // 拦截器
  private interceptors?: RequestInterceptors

  constructor(config: AxiosRequestConfig) {
    // 创建 axios 实例
    this.instance = axios.create(config)

    // 默认拦截器
    this.setupInterceptors()
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 在发送请求之前做些什么
        console.log('请求拦截器 - 成功')

        // 添加 token 到请求头
        const token = localStorage.getItem('token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error) => {
        // 对请求错误做些什么
        console.log('请求拦截器 - 错误', error)
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        console.log('响应拦截器 - 成功')

        const { data } = response

        // 根据后端返回的状态码判断请求是否成功
        if (data.code !== 200) {
          console.error(`请求失败: ${data.message}`)

          // 处理特定错误码
          if (data.code === 401) {
            // 未授权，可以在这里处理登出逻辑
            console.warn('用户未登录或 token 已过期')
            localStorage.removeItem('token')
            // 可以在这里添加重定向到登录页的逻辑
          }

          return Promise.reject(data)
        }

        // 修改这里：返回原始响应，而不是直接返回 data
        return response
      },
      (error) => {
        // 对响应错误做点什么
        console.log('响应拦截器 - 错误', error)

        // 处理网络错误
        if (!error.response) {
          console.error('网络错误，请检查您的网络连接')
          return Promise.reject(new Error('网络错误，请检查您的网络连接'))
        }

        // 处理 HTTP 状态码
        const { status } = error.response
        let message = '请求失败'

        switch (status) {
          case 400:
            message = '请求错误'
            break
          case 401:
            message = '未授权，请登录'
            // 可以在这里处理登出逻辑
            localStorage.removeItem('token')
            break
          case 403:
            message = '拒绝访问'
            break
          case 404:
            message = '请求地址出错'
            break
          case 408:
            message = '请求超时'
            break
          case 500:
            message = '服务器内部错误'
            break
          case 501:
            message = '服务未实现'
            break
          case 502:
            message = '网关错误'
            break
          case 503:
            message = '服务不可用'
            break
          case 504:
            message = '网关超时'
            break
          default:
            message = `未知错误(${status})`
        }

        console.error(message)
        return Promise.reject(new Error(message))
      },
    )
  }

  // 创建自定义拦截器
  setInterceptors(interceptors: RequestInterceptors) {
    this.interceptors = interceptors

    // 添加请求拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch,
    )

    // 添加响应拦截器
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch,
    )
  }

  // 通用请求方法
  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config)
  }
}

// 创建 axios 实例
const httpRequest = new HttpRequest({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

export default httpRequest
