import Vue from 'vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import'./style.css'

// const app = new Vue({
//   el: "#app",
//   data: {
//     message: "Hello World"
//   }
// })

import App from './components/App.vue'

new Vue({
  components: { App },
  template: '<App ref="app"></App>'
}).$mount('#app')