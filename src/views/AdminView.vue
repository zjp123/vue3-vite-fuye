<template>
  <div class="admin-container">
    <div class="admin-sidebar">
      <h2>管理控制台</h2>
      <ul class="admin-menu">
        <li>
          <router-link to="/admin/users">
            <i class="menu-icon">👥</i>
            用户管理
          </router-link>
        </li>
        <li>
          <router-link to="/admin/settings">
            <i class="menu-icon">⚙️</i>
            系统设置
          </router-link>
        </li>
      </ul>
    </div>
    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
// 管理页面组件
</script>

<style lang="less" scoped>
.admin-container {
  display: flex;
  min-height: calc(100vh - 60px);

  .admin-sidebar {
    width: 220px;
    padding: 20px 0;
    background-color: #2c3e50;
    color: white;

    h2 {
      margin-bottom: 20px;
      padding: 0 20px;
      font-size: 1.2rem;
    }

    .admin-menu {
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        margin-bottom: 5px;

        a {
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

          .menu-icon {
            margin-right: 10px;
            font-size: 18px;
          }
        }
      }
    }
  }

  .admin-content {
    flex: 1;
    padding: 20px;
    background-color: #f5f5f5;
  }
}
</style>
