import { get } from '@/utils/http'
import type { RequestOptions } from '@/utils/http/types'

export function getResourcesApi(data: any, options?: RequestOptions) {
  return get<any>(`/api/resources`, data, options)
}
