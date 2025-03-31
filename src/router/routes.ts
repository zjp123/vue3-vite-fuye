import type { AppRouteRecordRaw } from './types'

// 基础路由 - 不需要权限验证的路由
export const basicRoutes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
      hideInMenu: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      title: '注册',
      requiresAuth: false,
      hideInMenu: true,
    },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '404',
      requiresAuth: false,
      hideInMenu: true,
    },
  },
  // 重定向
  {
    path: '/',
    redirect: '/home',
  },
]

// 错误页面路由
export const errorRoutes: AppRouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]
