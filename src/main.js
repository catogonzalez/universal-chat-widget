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
  // Package name UniversalChatWidget defined in webpack.base.conf.js to be able to use window.UniversalChatWidget
  this._name = 'UniversalChatWidget'
  this._template = '<chat-widget/>'

  if (config.position === 'embedded') {
    this._template = `<chat-widget position="embedded"/>`
  }
  Vue.config.productionTip = false

  /* eslint-disable no-new */
  new Vue({
    el: config.element,
    template: this._template,
    components: {ChatWidget}
  })
}

