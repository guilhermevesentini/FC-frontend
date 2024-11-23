import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './core/router'
import money from 'v-money3'

import '../src/shared/assets/styles/scss/main.scss'
import '../src/shared/assets/styles/scss/theme/element-variables.scss';
import '../src/shared/assets/styles/scss/Variables.scss';
import '../src/shared/assets/styles/scss/base.scss';

import ptbr from 'element-plus/dist/locale/pt-br';

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(ElementPlus, { locale: ptbr });

app.config.globalProperties.$globalLoading = (options = {}) => {
  return app.config.globalProperties.$loading({    
    ...options,
  });
};

app.use(money)

app.mount('#app')
