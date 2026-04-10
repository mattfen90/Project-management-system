import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router/index.js';
import App from './App.vue';
import { Field, Form } from 'vee-validate';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component('VForm', Form);
app.component('VField', Field);

app.mount('#app');