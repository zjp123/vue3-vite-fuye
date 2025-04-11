// 按需引入样式
// https://blog.csdn.net/linyiwei314247870/article/details/142461495?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7EPaidSort-1-142461495-blog-132646196.235%5Ev43%5Epc_blog_bottom_relevance_base1&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7EPaidSort-1-142461495-blog-132646196.235%5Ev43%5Epc_blog_bottom_relevance_base1&utm_relevant_index=2
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { registerLazyLoad } from './directives/lazyload'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 注册懒加载指令
registerLazyLoad(app)

app.mount('#app')
