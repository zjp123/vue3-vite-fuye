<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'
// import ResponsiveImage from '../components/ResponsiveImage.vue'
import UpLoadCom from '@/components/UpLoad.vue'
import { getResourcesApi } from '@/api'
const centerDialogVisible = ref(false)
const uploadRef = ref()
let dataList = reactive([])

onMounted(async () => {
  const response = await getResourcesApi({}, { showLoading: true })
  dataList = Object.assign(dataList, response.data)
})

const handleClick = () => {
  console.log('click')
}
const openModal = () => {
  centerDialogVisible.value = true
}

const submit = () => {
  console.log('uploadRef', uploadRef)
  uploadRef.value.submit()
}
</script>

<template>
  <main id="home-main">
    <div style="display: flex; justify-content: space-between; padding: 10px">
      <div class="table-title">资源列表</div>
      <div>
        <el-button plain @click="openModal"> 上传资源 </el-button>
      </div>
    </div>
    <section>
      <el-table :data="dataList" class="table-box">
        <el-table-column fixed prop="created_at" label="时间" width="150">
          <template #default="{ row }">
            {{ new Date(row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="file_name" label="名称" />
        <el-table-column prop="file_path" label="路径" />
        <el-table-column prop="file_size" label="类型" />
        <el-table-column prop="file_type" label="大小" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default>
            <el-button :disabled="true" link type="primary" size="small" @click="handleClick">
              详情
            </el-button>
            <el-button :disabled="true" link type="primary" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="image-examples">
      <!-- 1. 使用响应式图片组件 -->
      <!-- <div class="example-card">
        <h3>响应式懒加载图片</h3>
        <ResponsiveImage src="/src/assets/logo.svg" alt="响应式图片示例" width="100%" height="300px" lazy webp />
      </div> -->

      <!-- 2. 使用图片懒加载指令 -->
      <!-- <div class="example-card">
        <h3>使用指令懒加载</h3>
        <img v-lazy="'/src/assets/example.webp'" alt="懒加载示例" class="lazy-image" />
      </div> -->
    </section>
    <el-dialog destroy-on-close v-model="centerDialogVisible" title="上传" width="500" align-center>
      <div>
        <UpLoadCom ref="uploadRef" :action="'/api/upload'" :autoUpload="false" :headers="{}" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </main>
</template>

<style lang="less">
main {
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;

  .table-title {
    font-size: 16px;
    font-weight: bold;
  }

  .table-box {
    width: auto;
  }

  .image-examples {
    margin-top: 40px;

    h2 {
      margin-bottom: 20px;
      color: #42b983;
    }

    .example-card {
      margin-bottom: 30px;
      padding: 20px;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);

      h3 {
        margin-bottom: 15px;
        color: #333;
      }
    }

    .lazy-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      background-color: #f0f0f0;
      transition: opacity 0.3s;
      opacity: 0;

      &.loaded {
        opacity: 1;
      }

      &.error {
        opacity: 0.5;
      }
    }
  }
}
</style>
