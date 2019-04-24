// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import store from './vuex/store'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from './http/config'
import VCharts from 'v-charts'
import BaiduMap from 'vue-baidu-map'
import VueAMap from 'vue-amap';
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VueCropper from 'vue-cropper'
import "babel-polyfill"
import promise from 'es6-promise'

promise.polyfill();

Vue.prototype.$http = axios;

Vue.use(ElementUI)
Vue.use(VCharts)
Vue.use(Vuex)
Vue.use(BaiduMap, {
  ak: 'BFmXXp7m6zfN0DgNPkfIpjut'
})
Vue.use(VueAMap);
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: 'a193b223b319b7742f1657aff8acbab0',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
});

Vue.use(Mint)
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(VueCropper)

Vue.config.productionTip = false

window.basePath="/api";

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
