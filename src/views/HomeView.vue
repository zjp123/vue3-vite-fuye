<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'
// import ResponsiveImage from '../components/ResponsiveImage.vue'
import { getResourcesApi } from '@/api'
watchEffect(() => {
  getResourcesApi({})
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
})

const handleClick = () => {
  console.log('click')
}

const tableData = reactive([
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office',
  },
])
</script>

<template>
  <main id="home-main">
    <div class="table-title">资源列表</div>
    <section>
      <el-table :data="tableData" class="table-box">
        <el-table-column fixed prop="date" label="时间" width="150" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="state" label="State" width="120" />
        <el-table-column prop="city" label="City" width="120" />
        <el-table-column prop="address" label="Address" width="600" />
        <el-table-column prop="zip" label="Zip" width="120" />
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default>
            <el-button link type="primary" size="small" @click="handleClick"> 详情 </el-button>
            <el-button link type="primary" size="small">编辑</el-button>
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
  </main>
</template>

<style lang="less">
main {
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;

  .table-title {
    padding: 10px;
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
