import httpRequest from './axios'
import { get, post, put, del, patch, cancelRequest, cancelAllRequests } from './request'
import { requestCanceler } from './cancelRequest'

export {
  httpRequest,
  get,
  post,
  put,
  del,
  patch,
  cancelRequest,
  cancelAllRequests,
  requestCanceler,
}

// 默认导出所有请求方法
export default {
  get,
  post,
  put,
  delete: del,
  patch,
  cancel: cancelRequest,
  cancelAll: cancelAllRequests,
}
