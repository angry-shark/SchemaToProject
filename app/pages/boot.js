import { createApp } from "vue";

//引入组件库
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/dark/css-vars.css'


//引入自定义全局样式
import '$pages/asserts/custom.css'

//引入状态管理
import pinia from "$store";

//引入页面路由（前端SPA路由）
import { createRouter, createWebHashHistory } from "vue-router";
/**
 * Vue 的页面的主入口， 用于启动vue
 * @params pageComponent vue 的入口组件
 * @params selector 要挂载的css 选择器
 * @params routes 前端路由数组
 * @params libs 依赖 的三方库
 */
export default (pageComponent, { routes, selector = "#root", libs = [] } = {}) => {
  const app = createApp(pageComponent);
  app.use(ElementPlus);
  app.use(pinia);

  //引入的第三方包
  libs.forEach((lib) => app.use(lib))

  if (routes && routes.length > 0) {
    //引入路由
    const router = createRouter({
      history: createWebHashHistory(), //采用 hash 模式
      routes,
    });
    app.use(router);

    router.isReady().then(() => {
      app.mount(selector);
    });
  } else {
    app.mount(selector);
  }
};
