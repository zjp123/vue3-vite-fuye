// 请求取消管理器
class RequestCanceler {
  // 存储所有请求的 Map，键为请求的唯一标识，值为 AbortController
  private pendingMap: Map<string, AbortController>

  constructor() {
    this.pendingMap = new Map<string, AbortController>()
  }

  /**
   * 生成请求的唯一键
   * @param config - 请求配置
   */
  private generateKey(config: { url?: string; method?: string; params?: any; data?: any }): string {
    const { url, method, params, data } = config
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
  }

  /**
   * 添加请求
   * @param config - 请求配置
   */
  addPending(config: { url?: string; method?: string; params?: any; data?: any }): AbortController {
    this.removePending(config)
    const controller = new AbortController()
    const key = this.generateKey(config)
    this.pendingMap.set(key, controller)
    return controller
  }

  /**
   * 移除请求
   * @param config - 请求配置
   */
  removePending(config: { url?: string; method?: string; params?: any; data?: any }): void {
    const key = this.generateKey(config)
    if (this.pendingMap.has(key)) {
      // 如果存在相同请求，则取消之前的请求
      const controller = this.pendingMap.get(key)
      controller?.abort()
      this.pendingMap.delete(key)
    }
  }

  /**
   * 清除所有请求
   */
  removeAllPending(): void {
    this.pendingMap.forEach((controller) => {
      controller.abort()
    })
    this.pendingMap.clear()
  }

  /**
   * 重置
   */
  reset(): void {
    this.pendingMap.clear()
  }
}

export const requestCanceler = new RequestCanceler()
