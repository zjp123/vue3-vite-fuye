<template>
  <div class="app-layout">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/logo.svg" alt="Logo" />
          <span>Vue3 Admin666</span>
        </router-link>
      </div>

      <div class="nav-menu">
        <template v-for="route in mainRoutes" :key="route.path">
          <router-link
            v-if="!route.meta?.hideInMenu && hasPermission(route)"
            :to="route.path"
            class="nav-item"
          >
            <i v-if="route.meta?.icon" class="nav-icon">{{ getIcon(route.meta.icon) }}</i>
            <span>{{ route.meta?.title || route.name }}</span>
          </router-link>
        </template>
      </div>

      <div class="user-menu">
        <template v-if="userStore.isLoggedIn">
          <div class="user-info" @click="toggleUserDropdown">
            <img src="https://via.placeholder.com/36" alt="用户头像" class="avatar" />
            <span>{{ userStore.userInfo?.name }}</span>
            <i class="dropdown-icon">▼</i>

            <div v-if="showUserDropdown" class="dropdown-menu">
              <router-link to="/profile" class="dropdown-item"> <i>👤</i> 个人中心 </router-link>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item" @click="handleLogout"><i>🚪</i> 退出登录</div>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="login-btn">登录</router-link>
          <router-link to="/register" class="register-btn">注册</router-link>
        </template>
      </div>
    </header>

    <!-- 内容区域 -->
    <div class="app-content">
      <!-- 侧边栏 - 仅在管理页面显示 -->
      <aside v-if="showSidebar" class="app-sidebar">
        <div class="sidebar-menu">
          <template v-for="route in sidebarRoutes" :key="route.path">
            <div v-if="!route.meta?.hideInMenu && hasPermission(route)" class="sidebar-item">
              <router-link :to="route.path" class="sidebar-link">
                <i v-if="route.meta?.icon" class="sidebar-icon">{{ getIcon(route.meta.icon) }}</i>
                <span>{{ route.meta?.title || route.name }}</span>
              </router-link>

              <!-- 子菜单 -->
              <div v-if="route.children && route.children.length" class="sidebar-submenu">
                <template v-for="child in route.children" :key="child.path">
                  <router-link
                    v-if="!child.meta?.hideInMenu && hasPermission(child)"
                    :to="`${route.path}/${child.path}`"
                    class="sidebar-sublink"
                  >
                    <i v-if="child.meta?.icon" class="sidebar-icon">{{
                      getIcon(child.meta.icon)
                    }}</i>
                    <span>{{ child.meta?.title || child.name }}</span>
                  </router-link>
                </template>
              </div>
            </div>
          </template>
        </div>
      </aside>

      <!-- 主内容区域 -->
      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- 页脚 -->
    <footer class="app-footer">
      <p>© {{ new Date().getFullYear() }} Vue3 Admin. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import type { AppRouteRecordRaw } from '@/router/types'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

// 用户下拉菜单状态
const showUserDropdown = ref(false)

// 计算主要路由（顶部导航）
const mainRoutes = computed(() => {
  const routes = [...permissionStore.dynamicRoutes]
  return routes.filter((route) => !route.meta?.hideInMenu)
})

// 计算侧边栏路由
const sidebarRoutes = computed(() => {
  // 如果当前路由是管理路由，则显示其子路由
  const adminRoute = permissionStore.dynamicRoutes.find((route) => route.path === '/admin')
  return adminRoute?.children || []
})

// 是否显示侧边栏
const showSidebar = computed(() => {
  return route.path.startsWith('/admin')
})

// 切换用户下拉菜单
const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

// 处理退出登录
const handleLogout = () => {
  userStore.logout()
  permissionStore.resetRoutes(router)
  router.push('/login')
}

// 检查用户是否有权限访问路由
const hasPermission = (route: AppRouteRecordRaw) => {
  if (!route.meta?.requiresAuth) return true
  if (!route.meta?.roles) return true
  return userStore.userRole && route.meta.roles.includes(userStore.userRole)
}

// 获取图标
const getIcon = (icon: any): string => {
  // 如果icon不是字符串，返回默认图标
  if (typeof icon !== 'string') {
    return '📄'
  }

  // 这里可以根据图标名称返回对应的图标
  const iconMap: Record<string, string> = {
    home: '🏠',
    user: '👤',
    setting: '⚙️',
    info: 'ℹ️',
    // 添加更多图标映射
  }

  return iconMap[icon] || '📄' // 默认图标
}

// 点击页面其他地方关闭下拉菜单
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.user-info')) {
      showUserDropdown.value = false
    }
  })
})

// 路由变化时关闭下拉菜单
watch(
  () => route.path,
  () => {
    showUserDropdown.value = false
  },
)
</script>

<style lang="less" scoped>
.app-layout {
  // display: flex;
  // flex-direction: column;
  // min-height: 100vh;

  .app-header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 20px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgb(0 0 0 / 10%);

    .logo {
      margin-right: 40px;

      a {
        display: flex;
        align-items: center;
        color: #333;
        text-decoration: none;

        img {
          height: 32px;
          margin-right: 10px;
        }

        span {
          font-size: 18px;
          font-weight: bold;
        }
      }
    }

    .nav-menu {
      display: flex;
      flex: 1;

      .nav-item {
        display: flex;
        align-items: center;
        height: 60px;
        padding: 0 15px;
        color: #333;
        text-decoration: none;
        transition: all 0.3s;

        &:hover,
        &.router-link-active {
          color: #42b983;
        }

        .nav-icon {
          margin-right: 5px;
          font-size: 16px;
        }
      }
    }

    .user-menu {
      display: flex;
      align-items: center;

      .user-info {
        position: relative;
        display: flex;
        align-items: center;
        height: 60px;
        padding: 0 10px;
        cursor: pointer;

        &:hover {
          background-color: #f5f5f5;
        }

        .avatar {
          width: 36px;
          height: 36px;
          margin-right: 8px;
          border-radius: 50%;
        }

        .dropdown-icon {
          margin-left: 5px;
          font-size: 12px;
        }

        .dropdown-menu {
          position: absolute;
          top: 60px;
          right: 0;
          z-index: 10;
          overflow: hidden;
          width: 160px;
          border-radius: 4px;
          background-color: #fff;
          box-shadow: 0 2px 10px rgb(0 0 0 / 10%);

          .dropdown-item {
            display: flex;
            align-items: center;
            padding: 10px 15px;
            color: #333;
            text-decoration: none;

            &:hover {
              background-color: #f5f5f5;
            }

            i {
              margin-right: 8px;
            }
          }

          .dropdown-divider {
            height: 1px;
            background-color: #eee;
            margin: 5px 0;
          }
        }
      }

      .login-btn,
      .register-btn {
        margin-left: 10px;
        padding: 6px 15px;
        border-radius: 4px;
        text-decoration: none;
      }

      .login-btn {
        border: 1px solid #42b983;
        color: #42b983;

        &:hover {
          background-color: #f0f9f5;
        }
      }

      .register-btn {
        background-color: #42b983;
        color: white;

        &:hover {
          background-color: #36a573;
        }
      }
    }
  }

  .app-content {
    display: flex;
    flex: 1;

    .app-sidebar {
      width: 220px;
      padding: 20px 0;
      color: white;
      background-color: #2c3e50;

      .sidebar-menu {
        .sidebar-item {
          margin-bottom: 5px;

          .sidebar-link {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: #ddd;
            text-decoration: none;
            transition: background-color 0.3s;

            &:hover,
            &.router-link-active {
              background-color: #3a526b;
              color: white;
            }

            .sidebar-icon {
              margin-right: 10px;
              font-size: 16px;
            }
          }

          .sidebar-submenu {
            padding-left: 20px;

            .sidebar-sublink {
              display: flex;
              align-items: center;
              padding: 10px 20px;
              color: #bbb;
              font-size: 14px;
              text-decoration: none;

              &:hover,
              &.router-link-active {
                color: white;
              }

              .sidebar-icon {
                margin-right: 8px;
                font-size: 14px;
              }
            }
          }
        }
      }
    }

    .app-main {
      flex: 1;
      min-height: calc(100vh - 60px - 50px); // 减去header和footer的高度
      padding: 20px;
      background-color: #f5f5f5;
    }
  }

  .app-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    background-color: #fff;
    border-top: 1px solid #eee;

    p {
      color: #666;
      font-size: 14px;
    }
  }
}

// 路由过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
