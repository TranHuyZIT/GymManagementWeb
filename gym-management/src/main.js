import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import { createPinia } from "pinia";
import { createApp } from "vue";
import "./assets/css/bootstrap.min.css";
import "./assets/css/element-variables.css";
import "./assets/css/font-awesome.css";
import "./assets/css/templatemo-training-studio.css";
import ElementPlus from "element-plus";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(ElementPlus);
for (const [key, component] of Object.entries(
	ElementPlusIconsVue
)) {
	app.component(key, component);
}

app.use(autoAnimatePlugin);
app.use(createPinia());
app.use(router);

app.mount("#app");
