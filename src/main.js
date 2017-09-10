// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ChatWidget from './components/ChatWidget.vue'
import ChatAdapterActionCable from 'chat-adapter-actioncable'

export function Widget (config) {
  // Package name UniversalChatWidget defined in webpack.base.conf.js to be able to use window.UniversalChatWidget
  // var _name = 'UniversalChatWidget'
  let _template = '<chat-widget/>'
  let _adapter = new ChatAdapterActionCable()
  console.log(_adapter)

  // init (element, position, appToken)
  // rid of element. Use body. add div

  if (config.position === 'embedded') {
    _template = `<chat-widget position="embedded"/>`
  }
  Vue.config.productionTip = false

  /* eslint-disable no-new */
  let _widget = new Vue({
    el: config.element,
    template: _template,
    components: {ChatWidget}
  })

  this.open = function () {
    console.log(_widget)
    _widget.vue.open()
  }
}
