import { createApp } from 'vue';
import Toast, { PluginOptions, POSITION } from 'vue-toastification';
import App from './App.vue';
import router from './router';
import { store } from './app/store';
import 'vue-toastification/dist/index.css';
import './styles.css';

const options: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  newestOnTop: true,
  timeout: 5000,
  hideProgressBar: true,
};

createApp(App).use(router).use(store).use(Toast, options).mount('#app');
