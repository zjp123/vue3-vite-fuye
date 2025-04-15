<template>
  <div class="profile-container">
    <h1>个人中心</h1>

    <div class="profile-card" v-if="userStore.userInfo">
      <div class="avatar">
        <img
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          alt="用户头像"
        />
        <button class="change-avatar">更换头像</button>
      </div>

      <div class="user-info">
        <h2>{{ userStore.userInfo.name }}</h2>
        <p class="email">{{ userStore.userInfo.email }}</p>
        <p class="role">角色: {{ userStore.userInfo.role === 'admin' ? '管理员' : '普通用户' }}</p>
      </div>

      <div class="actions">
        <button class="edit-btn">编辑资料</button>
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const permissionStore = usePermissionStore()
const router = useRouter()

// 退出登录
const handleLogout = () => {
  userStore.logout()
  permissionStore.resetRoutes(router)
  router.push('/login')
}
</script>

<style lang="less" scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .profile-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);

    @media (width >=768px) {
      flex-direction: row;
      align-items: flex-start;
    }

    .avatar {
      margin-bottom: 20px;
      text-align: center;

      @media (width >=768px) {
        margin-right: 30px;
        margin-bottom: 0;
      }

      img {
        width: 100px;
        height: 100px;
        border: 3px solid #f0f0f0;
        border-radius: 50%;
        object-fit: cover;
      }

      .change-avatar {
        margin-top: 10px;
        padding: 5px 10px;
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;

        &:hover {
          background-color: #e8e8e8;
        }
      }
    }

    .user-info {
      flex: 1;

      h2 {
        margin-top: 0;
        margin-bottom: 5px;
        color: #333;
      }

      .email {
        margin-bottom: 10px;
        color: #666;
      }

      .role {
        display: inline-block;
        padding: 3px 10px;
        border-radius: 4px;
        color: #1890ff;
        font-size: 14px;
        background-color: #e6f7ff;
      }
    }

    .actions {
      display: flex;
      margin-top: 20px;

      button {
        margin-right: 10px;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &.edit-btn {
          background-color: #42b983;
          color: white;

          &:hover {
            background-color: #36a573;
          }
        }

        &.logout-btn {
          border: 1px solid #ddd;
          color: #666;
          background-color: #f5f5f5;

          &:hover {
            background-color: #e8e8e8;
          }
        }
      }
    }
  }
}
</style>
