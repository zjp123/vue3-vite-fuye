<template>
  <div class="user-management">
    <h1>用户管理</h1>

    <div class="toolbar">
      <div class="search-box">
        <input v-model="searchQuery" type="text" placeholder="搜索用户..." @input="handleSearch" />
      </div>
      <button class="add-button" @click="handleAddUser">添加用户</button>
    </div>

    <div class="user-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-tag', user.role]">
                {{ user.role === 'admin' ? '管理员' : '普通用户' }}
              </span>
            </td>
            <td>
              <span :class="['status-tag', user.status]">
                {{ user.status === 'active' ? '正常' : '禁用' }}
              </span>
            </td>
            <td class="actions">
              <button class="edit-button" @click="handleEditUser(user)">编辑</button>
              <button class="delete-button" @click="handleDeleteUser(user)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)">
        上一页
      </button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="handlePageChange(currentPage + 1)">
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserRole } from '@/router/types'

interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: 'active' | 'disabled'
}

const users = ref<User[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)

// 模拟获取用户数据
const fetchUsers = () => {
  // 模拟API请求
  setTimeout(() => {
    users.value = [
      { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
      { id: 2, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
      { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
      { id: 4, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'disabled' },
      { id: 5, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active' },
    ]
    totalPages.value = 3 // 模拟总页数
  }, 500)
}

// 处理搜索
const handleSearch = () => {
  // 实际项目中应该调用API进行搜索
  console.log('搜索:', searchQuery.value)
}

// 处理添加用户
const handleAddUser = () => {
  console.log('添加用户')
}

// 处理编辑用户
const handleEditUser = (user: User) => {
  console.log('编辑用户:', user)
}

// 处理删除用户
const handleDeleteUser = (user: User) => {
  console.log('删除用户:', user)
}

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchUsers() // 重新获取数据
}

onMounted(() => {
  fetchUsers()
})
</script>

<style lang="less" scoped>
.user-management {
  h1 {
    margin-bottom: 20px;
    color: #333;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .search-box {
      input {
        width: 250px;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;

        &:focus {
          outline: none;
          border-color: #42b983;
        }
      }
    }

    .add-button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      color: white;
      background-color: #42b983;
      cursor: pointer;

      &:hover {
        background-color: #36a573;
      }
    }
  }

  .user-table {
    overflow: hidden;
    margin-bottom: 20px;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0 1px 3px rgb(0 0 0 / 10%);

    table {
      width: 100%;
      border-collapse: collapse;

      th,
      td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #eee;
      }

      th {
        color: #333;
        font-weight: 600;
        background-color: #f9f9f9;
      }

      tr:last-child td {
        border-bottom: none;
      }

      .role-tag,
      .status-tag {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
      }

      .role-tag {
        &.admin {
          background-color: #e6f7ff;
          color: #1890ff;
        }

        &.user {
          background-color: #f6ffed;
          color: #52c41a;
        }
      }

      .status-tag {
        &.active {
          background-color: #f6ffed;
          color: #52c41a;
        }

        &.disabled {
          background-color: #fff1f0;
          color: #f5222d;
        }
      }

      .actions {
        button {
          margin-right: 8px;
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;

          &.edit-button {
            background-color: #e6f7ff;
            color: #1890ff;

            &:hover {
              background-color: #bae7ff;
            }
          }

          &.delete-button {
            background-color: #fff1f0;
            color: #f5222d;

            &:hover {
              background-color: #ffa39e;
            }
          }
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;

    button {
      padding: 6px 12px;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;

      &:hover:not(:disabled) {
        border-color: #42b983;
        color: #42b983;
      }

      &:disabled {
        background-color: #f5f5f5;
        color: #ccc;
        cursor: not-allowed;
      }
    }

    span {
      margin: 0 15px;
      color: #666;
    }
  }
}
</style>
