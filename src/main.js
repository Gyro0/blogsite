import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import Bootstrap et BootstrapVue
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import BootstrapVue3 from 'bootstrap-vue-3';

// Import global de styles
import './assets/custom.scss';
import './assets/main.css';

const app = createApp(App);

app.use(router);
app.use(BootstrapVue3);

app.mount('#app');
