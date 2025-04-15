<template>
  <div class="upload-component">
    <el-upload
      ref="uploadRef"
      :action="action"
      :headers="headers"
      :multiple="multiple"
      :limit="limit"
      :file-list="fileList"
      :list-type="listType"
      :auto-upload="autoUpload"
      :show-file-list="showFileList"
      :drag="drag"
      :accept="accept"
      :disabled="disabled"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :http-request="httpRequest ? httpRequest : customHttpRequest"
      :name="name"
      :data="data"
      :with-credentials="withCredentials"
    >
      <!-- 上传按钮插槽 -->
      <template #default>
        <slot>
          <div v-if="drag">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
          </div>
          <el-button v-else type="primary">
            <el-icon><upload-filled /></el-icon>
            <span>点击上传</span>
          </el-button>
        </slot>
      </template>

      <!-- 文件列表插槽 -->
      <template v-if="$slots.file" #file="{ file }">
        <slot name="file" :file="file"></slot>
      </template>

      <!-- 提示插槽 -->
      <template v-if="$slots.tip" #tip>
        <slot name="tip"></slot>
      </template>
      <template v-else-if="tip" #tip>
        <div class="el-upload__tip">{{ tip }}</div>
      </template>
    </el-upload>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewVisible" title="预览" width="50%">
      <img :src="previewUrl" alt="Preview Image" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { post } from '@/utils/http'
import { ref, watch } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import type {
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadRequestOptions,
  UploadUserFile,
} from 'element-plus'
const uploadRef = ref<UploadInstance>()
interface Props {
  // 上传的地址
  action: string
  // 设置上传的请求头部
  headers?: Record<string, string>
  // 是否支持多选文件
  multiple?: boolean
  // 最大允许上传个数
  limit?: number
  // 上传的文件列表
  fileList?: UploadUserFile[]
  // 文件列表的类型
  listType?: 'text' | 'picture' | 'picture-card'
  // 是否在选取文件后立即进行上传
  autoUpload?: boolean
  // 是否显示已上传文件列表
  showFileList?: boolean
  // 是否启用拖拽上传
  drag?: boolean
  // 接受上传的文件类型
  accept?: string
  // 是否禁用
  disabled?: boolean
  // 上传时的文件名
  name?: string
  // 上传时附带的额外参数
  data?: Record<string, any>
  // 支持发送 cookie 凭证信息
  withCredentials?: boolean
  // 提示说明文字
  tip?: string
  // 文件大小限制（单位：MB）
  maxSize?: number
  // 自定义上传方法
  httpRequest?: (options: UploadRequestOptions) => XMLHttpRequest | Promise<unknown>
}

const props = withDefaults(defineProps<Props>(), {
  headers: () => ({}),
  multiple: false,
  limit: 5,
  fileList: () => [],
  listType: 'text',
  autoUpload: true,
  showFileList: true,
  drag: false,
  accept: '',
  disabled: false,
  name: 'file',
  data: () => ({}),
  withCredentials: false,
  tip: '',
  maxSize: 10, // 默认10MB
  httpRequest: undefined,
})

const emit = defineEmits<{
  'update:fileList': [files: UploadUserFile[]]
  success: [response: any, uploadFile: UploadFile, uploadFiles: UploadFiles]
  error: [error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles]
  progress: [evt: ProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles]
  change: [uploadFile: UploadFile, uploadFiles: UploadFiles]
  remove: [uploadFile: UploadFile, uploadFiles: UploadFiles]
  preview: [uploadFile: UploadFile]
  exceed: [files: File[], uploadFiles: UploadFiles]
}>()

// 内部状态
const fileList = ref<UploadUserFile[]>(props.fileList || [])
const previewVisible = ref(false)
const previewUrl = ref('')

// 监听外部fileList变化
watch(
  () => props.fileList,
  (newVal) => {
    if (newVal && newVal !== fileList.value) {
      fileList.value = newVal
    }
  },
  { deep: true },
)
// 处理文件预览
const handlePreview = (uploadFile: UploadFile) => {
  // 尝试从多个可能的来源获取URL
  previewUrl.value = uploadFile.url || ''

  // 如果没有URL但有response，尝试从response中获取URL
  if (!previewUrl.value && uploadFile.response) {
    const response = uploadFile.response as any
    // 根据后端API的返回结构提取URL
    if (response.data && response.data.url) {
      previewUrl.value = response.data.url
    } else if (response.url) {
      previewUrl.value = response.url
    }
  }

  // 如果有原始文件对象，创建一个临时URL
  if (!previewUrl.value && uploadFile.raw) {
    try {
      previewUrl.value = URL.createObjectURL(uploadFile.raw)
    } catch (error) {
      console.error('创建预览URL失败:', error)
    }
  }

  previewVisible.value = true
  emit('preview', uploadFile)
}

// 处理文件移除
const handleRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  emit('update:fileList', uploadFiles)
  emit('remove', uploadFile, uploadFiles)
}

// 处理上传成功
const handleSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  // 尝试从响应中提取URL
  if (response && typeof response === 'object') {
    // 根据后端API的返回结构提取URL
    if (response.data && response.data.url) {
      uploadFile.url = response.data.url
    } else if (response.url) {
      uploadFile.url = response.url
    }
  }

  // 如果响应中没有URL，但有原始文件，创建一个临时URL
  if (!uploadFile.url && uploadFile.raw) {
    try {
      uploadFile.url = URL.createObjectURL(uploadFile.raw)
    } catch (error) {
      console.error('创建预览URL失败:', error)
    }
  }

  emit('update:fileList', uploadFiles)
  emit('success', response, uploadFile, uploadFiles)
}

// 处理上传失败
const handleError = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  emit('error', error, uploadFile, uploadFiles)
}

// 处理上传进度
const handleProgress = (evt: ProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  emit('progress', evt, uploadFile, uploadFiles)
}

// 处理文件超出限制
const handleExceed = (files: File[], uploadFiles: UploadFiles) => {
  emit('exceed', files, uploadFiles)
}

// 处理文件状态改变
const handleChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  emit('update:fileList', uploadFiles)
  emit('change', uploadFile, uploadFiles)
}

// 上传前检查文件大小
const beforeUpload = (file: File) => {
  // 检查文件大小
  if (props.maxSize) {
    const isLessThanMaxSize = file.size / 1024 / 1024 < props.maxSize
    if (!isLessThanMaxSize) {
      ElMessage.error(`上传文件大小不能超过 ${props.maxSize}MB!`)
      return false
    }
  }
  return true
}

// 自定义上传方法
const customHttpRequest = (options: UploadRequestOptions) => {
  const { file, onProgress, onSuccess, onError, action } = options

  // 创建FormData对象
  const formData = new FormData()
  formData.append(props.name, file)

  // 添加额外的数据
  if (props.data) {
    Object.keys(props.data).forEach((key) => {
      formData.append(key, props.data[key])
    })
  }

  // 使用项目封装的post方法发送请求
  return post(action, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...props.headers,
    },
    withCredentials: props.withCredentials,
    // 监听上传进度
    onUploadProgress: (progressEvent: any) => onProgress(progressEvent),
  })
    .then((response: any) => {
      onSuccess(response)
      return response
    })
    .catch((error) => {
      onError(error)
      return Promise.reject(error)
    })
}

// 暴露方法给父组件
defineExpose({
  // 清空已上传的文件列表
  clearFiles: () => {
    fileList.value = []
    emit('update:fileList', [])
  },
  // 取消上传请求
  abort: (file: UploadFile) => {
    if (uploadRef.value) {
      uploadRef.value.abort(file)
    }
  },
  // 手动上传文件列表
  submit: () => {
    if (uploadRef.value) {
      uploadRef.value.submit()
    }
  },
})
</script>

<style scoped>
.upload-component {
  width: 100%;
}
</style>
