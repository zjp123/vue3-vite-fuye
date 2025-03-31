import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { basicRoutes } from './routes'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import NProgress from '@/utils/nprogress'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: basicRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 白名单路由 - 不需要登录也可以访问
const whiteList = ['/login', '/register', '/404']

// 路由守卫
router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // 开始进度条
    NProgress.start()

    // 设置页面标题
    document.title = to.meta.title ? `${to.meta.title} - 应用名称` : '应用名称'

    // 获取用户和权限存储
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    // 初始化用户状态
    if (!userStore.isLoggedIn) {
      userStore.initUserState()
    }

    // 判断用户是否已登录
    if (userStore.isLoggedIn) {
      // 已登录状态访问登录页，重定向到首页
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        // 判断是否已加载动态路由
        if (!permissionStore.isDynamicRoutesLoaded && userStore.userRole) {
          // 加载动态路由
          const success = await permissionStore.buildRoutes(userStore.userRole, router)

          if (success) {
            // 动态路由加载成功，重新导航到目标路由
            // hack: 确保路由已经被正确添加
            next({ ...to, replace: true })
          } else {
            // 动态路由加载失败，登出并重定向到登录页
            userStore.logout()
            next({ path: '/login', query: { redirect: to.fullPath } })
          }
        } else {
          // 检查用户是否有权限访问该路由
          if (
            to.meta.requiresAuth === false ||
            !to.meta.roles ||
            (userStore.userRole &&
              Array.isArray(to.meta.roles) &&
              to.meta.roles.includes(userStore.userRole))
          ) {
            next()
          } else {
            // 无权限访问，重定向到404页面
            next({ path: '/404' })
          }
        }
      }
    } else {
      // 未登录状态
      if (whiteList.includes(to.path)) {
        // 白名单路由，直接访问
        next()
      } else {
        // 非白名单路由，重定向到登录页
        next({ path: '/login', query: { redirect: to.fullPath } })
      }
    }
  },
)

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})

export default router
