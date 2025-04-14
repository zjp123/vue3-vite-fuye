import type { UserRole } from '@/router/types'
import type { AppRouteRecordRaw } from '@/router/types'

// 管理员路由
const adminRoutes: AppRouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    // component: () => import('@/views/HomeView.vue'),
    component: 'src/views/HomeView.vue' as any,
    meta: {
      title: '首页',
      requiresAuth: true,
      roles: ['admin', 'user'],
      icon: 'home',
    },
  },
  {
    path: '/about',
    name: 'About',
    // component: () => import('@/views/AboutView.vue'),
    component: 'src/views/AboutView.vue' as any,
    meta: {
      title: '关于',
      requiresAuth: true,
      roles: ['admin', 'user'],
      icon: 'info',
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    // component: () => import('@/views/AdminView.vue'),
    component: 'src/views/AdminView.vue' as any,
    meta: {
      title: '管理',
      requiresAuth: true,
      roles: ['admin'],
      icon: 'setting',
    },
    children: [
      {
        path: 'users',
        name: 'UserManagement',
        // component: () => import('@/views/admin/UserManagementView.vue'),
        component: 'src/views/admin/UserManagementView.vue' as any,
        meta: {
          title: '用户管理',
          requiresAuth: true,
          roles: ['admin'],
          icon: 'user',
        },
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        // component: () => import('@/views/admin/SystemSettingsView.vue'),
        component: 'src/views/admin/SystemSettingsView.vue',
        meta: {
          title: '系统设置',
          requiresAuth: true,
          roles: ['admin'],
          icon: 'setting',
        },
      },
    ],
  },
]

// 普通用户路由
const userRoutes: AppRouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    // component: () => import('@/views/HomeView.vue'),
    component: '@/views/HomeView.vue' as any,
    meta: {
      title: '首页',
      requiresAuth: true,
      roles: ['admin', 'user'],
      icon: 'home',
    },
  },
  {
    path: '/about',
    name: 'About',
    // component: () => import('@/views/AboutView.vue'),
    component: '@/views/AboutView.vue' as any,
    meta: {
      title: '关于',
      requiresAuth: true,
      roles: ['admin', 'user'],
      icon: 'info',
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    // component: () => import('@/views/ProfileView.vue'),
    component: 'src/views/ProfileView.vue' as any,
    meta: {
      title: '个人中心',
      requiresAuth: true,
      roles: ['user', 'admin'],
      icon: 'user',
    },
  },
]

/**
 * 模拟获取路由配置的API
 * @param role 用户角色
 */
export async function getRoutesByRole(role: UserRole): Promise<AppRouteRecordRaw[]> {
  // 模拟API请求延迟
  await new Promise((resolve) => setTimeout(resolve, 300))

  // 根据角色返回不同的路由
  switch (role) {
    case 'admin':
      return adminRoutes
    case 'user':
      return userRoutes
    default:
      return []
  }
}
