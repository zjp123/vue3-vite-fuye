import type { RouteRecordRaw } from 'vue-router'

// 用户角色类型
export type UserRole = 'admin' | 'user'

// 不要扩展 RouteRecordRaw，而是使用类型交叉
export type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: {
    // 路由标题
    title?: string
    // 是否需要登录
    requiresAuth?: boolean
    // 允许访问的角色
    roles?: UserRole[]
    // 路由图标
    icon?: string
    // 是否在菜单中隐藏
    hideInMenu?: boolean
    // 是否在面包屑中隐藏
    hideInBreadcrumb?: boolean
    // 保持组件状态
    keepAlive?: boolean
  }
}

// 路由模块
export interface RouteModule {
  routes: AppRouteRecordRaw[]
  // 其他可能的配置
}
