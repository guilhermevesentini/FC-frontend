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
import 'dayjs/locale/pt-br';  // Importando a localização do português
import dayjs from 'dayjs'
import ptbr from 'element-plus/dist/locale/pt-br';
import VueApexCharts from "vue3-apexcharts";
import './shared/assets/styles/scss/Variables.scss';  

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(ElementPlus, { locale: ptbr });

app.config.globalProperties.$globalLoading = (options = {}) => {
  return app.config.globalProperties.$loading({    
    ...options,
  });
};

dayjs.locale('pt-br');  // Configurando o idioma globalmente

app.use(money)

app.use(VueApexCharts);

app.mount('#app')
