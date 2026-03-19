// import { createApp } from "vue";
// import { Quasar, Notify } from "quasar";
// import "./style.css";
// import "./styles/main.css";
// import App from "./App.vue";

// import router from "./router/routes.js";

// import "@quasar/extras/material-icons/material-icons.css";
// import "quasar/src/css/index.sass";

// import { createPinia } from "pinia";
// import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// // 1. Crear la instancia de la App
// const myApp = createApp(App);

// // 2. Configurar Pinia
// const pinia = createPinia();
// pinia.use(piniaPluginPersistedstate);

// // 3. Usar los plugins en la App
// myApp.use(pinia);
// myApp.use(router);
// myApp.use(Quasar, {
//   plugins: { Notify },
// });

// // 4. Montar
// myApp.mount("#app");

import { createApp } from "vue";
import { Quasar, Notify, Loading, Dialog } from "quasar"; // Añadimos Loading y Dialog (muy útil)
import "./style.css";
import "./styles/main.css";
import App from "./App.vue";

import router from "./router/routes.js";

import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// 1. Crear la instancia de la App
const myApp = createApp(App);

// 2. Configurar Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 3. Usar los plugins en la App
myApp.use(pinia);
myApp.use(router);
myApp.use(Quasar, {
  plugins: {
    Notify,
    Loading, // ¡Esto activa las pantallas de carga!
    Dialog   // ¡Esto activa las ventanas de confirmación!
  },
  config: {
    loading: {
      // Configuración por defecto opcional
      spinnerColor: 'orange-8',
      backgroundColor: 'black'
    }
  }
});

// 4. Montar
myApp.mount("#app");
