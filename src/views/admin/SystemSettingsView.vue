<template>
  <div class="system-settings">
    <h1>系统设置</h1>

    <div class="settings-container">
      <div class="settings-section">
        <h2>基本设置</h2>

        <div class="form-group">
          <label for="siteName">网站名称</label>
          <input id="siteName" v-model="settings.siteName" type="text" />
        </div>

        <div class="form-group">
          <label for="siteDescription">网站描述</label>
          <textarea id="siteDescription" v-model="settings.siteDescription" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label for="logo">网站Logo</label>
          <div class="file-upload">
            <input id="logo" type="file" accept="image/*" @change="handleLogoChange" />
            <button class="upload-button">选择文件</button>
          </div>
          <div v-if="settings.logo" class="preview">
            <img :src="settings.logo" alt="Logo预览" />
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2>安全设置</h2>

        <div class="form-group">
          <label>用户注册</label>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="settings.allowRegistration" :value="true" />
              允许
            </label>
            <label>
              <input type="radio" v-model="settings.allowRegistration" :value="false" />
              禁止
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="maxLoginAttempts">最大登录尝试次数</label>
          <input
            id="maxLoginAttempts"
            v-model.number="settings.maxLoginAttempts"
            type="number"
            min="1"
            max="10"
          />
        </div>

        <div class="form-group">
          <label>双因素认证</label>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="settings.twoFactorAuth" :value="true" />
              启用
            </label>
            <label>
              <input type="radio" v-model="settings.twoFactorAuth" :value="false" />
              禁用
            </label>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2>邮件设置</h2>

        <div class="form-group">
          <label for="smtpServer">SMTP服务器</label>
          <input id="smtpServer" v-model="settings.smtpServer" type="text" />
        </div>

        <div class="form-group">
          <label for="smtpPort">SMTP端口</label>
          <input id="smtpPort" v-model.number="settings.smtpPort" type="number" />
        </div>

        <div class="form-group">
          <label for="smtpUsername">SMTP用户名</label>
          <input id="smtpUsername" v-model="settings.smtpUsername" type="text" />
        </div>

        <div class="form-group">
          <label for="smtpPassword">SMTP密码</label>
          <input id="smtpPassword" v-model="settings.smtpPassword" type="password" />
        </div>

        <div class="form-group">
          <label for="senderEmail">发件人邮箱</label>
          <input id="senderEmail" v-model="settings.senderEmail" type="email" />
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="save-button" @click="saveSettings">保存设置</button>
      <button class="reset-button" @click="resetSettings">重置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface SystemSettings {
  siteName: string
  siteDescription: string
  logo: string | null
  allowRegistration: boolean
  maxLoginAttempts: number
  twoFactorAuth: boolean
  smtpServer: string
  smtpPort: number
  smtpUsername: string
  smtpPassword: string
  senderEmail: string
}

// 默认设置
const defaultSettings: SystemSettings = {
  siteName: '我的应用',
  siteDescription: '这是一个基于Vue3的应用程序',
  logo: null,
  allowRegistration: true,
  maxLoginAttempts: 5,
  twoFactorAuth: false,
  smtpServer: 'smtp.example.com',
  smtpPort: 587,
  smtpUsername: 'user@example.com',
  smtpPassword: '',
  senderEmail: 'noreply@example.com',
}

const settings = ref<SystemSettings>({ ...defaultSettings })

// 处理Logo上传
const handleLogoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      settings.value.logo = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

// 保存设置
const saveSettings = () => {
  console.log('保存设置:', settings.value)
  // 实际项目中应该调用API保存设置
  alert('设置已保存')
}

// 重置设置
const resetSettings = () => {
  settings.value = { ...defaultSettings }
}
</script>

<style lang="less" scoped>
.system-settings {
  h1 {
    margin-bottom: 20px;
    color: #333;
  }

  .settings-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .settings-section {
    padding: 20px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 1px 3px rgb(0 0 0 / 10%);

    h2 {
      margin-top: 0;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      color: #333;
      font-size: 1.2rem;
    }

    .form-group {
      margin-bottom: 15px;

      label {
        display: block;
        margin-bottom: 5px;
        color: #333;
        font-weight: 500;
      }

      input[type='text'],
      input[type='number'],
      input[type='email'],
      input[type='password'],
      textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;

        &:focus {
          outline: none;
          border-color: #42b983;
        }
      }

      .radio-group {
        display: flex;
        gap: 15px;

        label {
          display: flex;
          align-items: center;
          font-weight: normal;

          input {
            margin-right: 5px;
          }
        }
      }

      .file-upload {
        position: relative;
        display: inline-block;

        input[type='file'] {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .upload-button {
          padding: 8px 16px;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;

          &:hover {
            background-color: #e8e8e8;
          }
        }
      }

      .preview {
        margin-top: 10px;

        img {
          max-width: 100px;
          max-height: 100px;
          padding: 2px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      }
    }
  }

  .actions {
    display: flex;
    gap: 10px;

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;

      &.save-button {
        background-color: #42b983;
        color: white;

        &:hover {
          background-color: #36a573;
        }
      }

      &.reset-button {
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
</style>
