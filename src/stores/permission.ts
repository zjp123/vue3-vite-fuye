import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'
import { getRoutesByRole } from '@/api/route'
import type { AppRouteRecordRaw, UserRole } from '@/router/types'
import { basicRoutes, errorRoutes } from '@/router/routes'

/**
 * 加载组件
 * @param componentPath 组件路径
 */
function loadComponent(componentPath: string) {
  // 处理路径格式，确保路径正确
  // 移除开头的 @ 或 src，并添加正确的相对路径前缀
  const path = componentPath.replace(/^@\//g, '../').replace(/^src\//g, '../')
  // 返回动态导入函数 这种方式动态路径Vite无法在构建时确定具体导入哪些模块
  // return () => import(`${path}`)
  const modules = import.meta.glob('../views/**/*.{vue,tsx}')
  return () => modules[path]()
}

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

      // 处理路由组件，将字符串路径转换为实际组件
      const processedRoutes = routes.map((route: AppRouteRecordRaw) => {
        // 处理当前路由的组件
        if (typeof route.component === 'string') {
          // 将字符串路径转换为动态导入函数
          ;(route as RouteRecordRaw).component = loadComponent(
            (route as RouteRecordRaw).component as unknown as string,
          )
        }

        // 处理子路由的组件
        if (route.children && route.children.length > 0) {
          route.children = route.children.map((child) => {
            if (typeof child.component === 'string') {
              ;(child as RouteRecordRaw).component = loadComponent(
                (child as RouteRecordRaw).component as unknown as string,
              )
            }
            return child
          })
        }

        return route
      })

      // 添加动态路由
      processedRoutes.forEach((route) => {
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
