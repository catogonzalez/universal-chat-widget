// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ChatWidget from './components/ChatWidget.vue'

import ChatAdapterActionCable from 'chat-adapter-actioncable'

var adapter = new ChatAdapterActionCable()

console.log(adapter)
console.log(adapter.name)
console.log(adapter.ping())

export function init (config) {
  this._name = 'UniversalChatWidget'
  Vue.config.productionTip = false
  // Package name UniversalChatWidget defined in webpack.base.conf.js to be able to use window.UniversalChatWidget
  /* eslint-disable no-new */
  new Vue({
    el: config,
    template: '<chat-widget/>',
    components: {ChatWidget}
  })
}

