import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import setupAntd from './plugins/antd'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
setupAntd(app)

// 在应用启动时尝试从本地存储恢复用户状态
const userStore = useUserStore()
userStore.loadUserFromStorage()

app.mount('#app')
