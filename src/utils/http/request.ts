import httpRequest from './axios'
import type { RequestOptions, ApiResponse, RequestMethod } from './types'
import { requestCanceler } from './cancelRequest'

/**
 * 创建请求
 * @param method - 请求方法
 * @param url - 请求地址
 * @param data - 请求数据
 * @param options - 请求配置
 */
function createRequest<T = any, D = any>(
  method: RequestMethod,
  url: string,
  data?: D,
  options?: RequestOptions,
): Promise<T> {
  const config = {
    method,
    url,
    ...options,
  }

  // 根据请求方法设置请求数据
  if (method.toLowerCase() === 'get' || method.toLowerCase() === 'delete') {
    config.params = data
  } else {
    config.data = data
  }

  // 处理请求头
  if (options?.headers) {
    config.headers = {
      ...config.headers,
      ...options.headers,
    }
  }

  // 处理取消请求
  if (options?.cancelable !== false) {
    // 默认可以取消请求
    let controller: AbortController

    if (options?.abortController) {
      // 使用传入的取消控制器
      controller = options.abortController
    } else if (options?.cancelDuplicate !== false) {
      // 默认取消重复请求
      controller = requestCanceler.addPending({
        url,
        method,
        params: config.params,
        data: config.data,
      })
    } else {
      // 创建新的取消控制器
      controller = new AbortController()
    }

    // 设置信号
    config.signal = controller.signal
  }

  // 发送请求
  return httpRequest
    .request<ApiResponse<T>>(config)
    .then((res) => {
      // 请求成功后，从待处理请求中移除
      if (options?.cancelDuplicate !== false) {
        requestCanceler.removePending({
          url,
          method,
          params: config.params,
          data: config.data,
        })
      }

      // 返回数据
      return res.data
    })
    .catch((error) => {
      // 请求失败后，从待处理请求中移除
      if (options?.cancelDuplicate !== false) {
        requestCanceler.removePending({
          url,
          method,
          params: config.params,
          data: config.data,
        })
      }

      // 重新抛出错误
      return Promise.reject(error)
    })
}

/**
 * GET 请求
 * @param url - 请求地址
 * @param params - 请求参数
 * @param options - 请求配置
 */
export function get<T = any, D = any>(
  url: string,
  params?: D,
  options?: RequestOptions,
): Promise<T> {
  return createRequest<T, D>('get', url, params, options)
}

/**
 * POST 请求
 * @param url - 请求地址
 * @param data - 请求数据
 * @param options - 请求配置
 */
export function post<T = any, D = any>(
  url: string,
  data?: D,
  options?: RequestOptions,
): Promise<T> {
  return createRequest<T, D>('post', url, data, options)
}

/**
 * PUT 请求
 * @param url - 请求地址
 * @param data - 请求数据
 * @param options - 请求配置
 */
export function put<T = any, D = any>(url: string, data?: D, options?: RequestOptions): Promise<T> {
  return createRequest<T, D>('put', url, data, options)
}

/**
 * DELETE 请求
 * @param url - 请求地址
 * @param params - 请求参数
 * @param options - 请求配置
 */
export function del<T = any, D = any>(
  url: string,
  params?: D,
  options?: RequestOptions,
): Promise<T> {
  return createRequest<T, D>('delete', url, params, options)
}

/**
 * PATCH 请求
 * @param url - 请求地址
 * @param data - 请求数据
 * @param options - 请求配置
 */
export function patch<T = any, D = any>(
  url: string,
  data?: D,
  options?: RequestOptions,
): Promise<T> {
  return createRequest<T, D>('patch', url, data, options)
}

// 导出取消请求的工具函数
export function cancelRequest(config: {
  url?: string
  method?: string
  params?: any
  data?: any
}): void {
  requestCanceler.removePending(config)
}

export function cancelAllRequests(): void {
  requestCanceler.removeAllPending()
}
