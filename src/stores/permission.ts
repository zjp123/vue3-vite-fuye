import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Router } from 'vue-router'
import { getRoutesByRole } from '@/api/route'
import type { AppRouteRecordRaw, UserRole } from '@/router/types'
import { basicRoutes, errorRoutes } from '@/router/routes'

export const usePermissionStore = defineStore('permission', () => {
  // 动态路由
  const dynamicRoutes = ref<AppRouteRecordRaw[]>([])
  // 是否已加载动态路由
  const isDynamicRoutesLoaded = ref(false)

  /**
   * 构建路由
   * @param role 用户角色
   * @param router Vue Router实例
   */
  async function buildRoutes(role: UserRole, router: Router) {
    try {
      // 重置状态
      dynamicRoutes.value = []
      isDynamicRoutesLoaded.value = false

      // 移除所有动态添加的路由
      router.getRoutes().forEach((route) => {
        if (route.name && !basicRoutes.some((r) => r.name === route.name)) {
          router.removeRoute(route.name)
        }
      })

      // 获取角色对应的路由
      const routes = await getRoutesByRole(role)

      // 添加动态路由
      routes.forEach((route) => {
        router.addRoute(route)
        dynamicRoutes.value.push(route)
      })

      // 添加错误路由（必须在最后添加）
      errorRoutes.forEach((route) => {
        router.addRoute(route)
      })

      isDynamicRoutesLoaded.value = true
      return true
    } catch (error) {
      console.error('构建路由失败:', error)
      return false
    }
  }

  /**
   * 重置路由
   */
  function resetRoutes(router: Router) {
    // 移除所有动态添加的路由
    dynamicRoutes.value.forEach((route) => {
      if (route.name) {
        router.removeRoute(route.name)
      }
    })

    // 重置状态
    dynamicRoutes.value = []
    isDynamicRoutesLoaded.value = false
  }

  return {
    dynamicRoutes,
    isDynamicRoutesLoaded,
    buildRoutes,
    resetRoutes,
  }
})
