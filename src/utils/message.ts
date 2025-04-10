// 这里使用你项目中的 UI 组件库
// 例如使用 Element Plus、Ant Design Vue 等

import { ElLoading, ElMessage } from 'element-plus'
import type { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'

let loadingInstance: LoadingInstance | null = null

export const showLoadingSpinner = (text: string = '加载中...') => {
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
}

export const hideLoadingSpinner = () => {
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

export const showErrorMessage = (message: string) => {
  ElMessage({
    message,
    type: 'error',
    duration: 3000,
  })
}
