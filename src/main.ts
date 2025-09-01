import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useSettingsStore } from './stores/settingsStore'
import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const settingsStore = useSettingsStore()
settingsStore.load()

app.mount('#app')
