// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ChatWidget from './components/ChatWidget.vue'
import ChatAdapterActionCable from 'chat-adapter-actioncable'
import Fingerprint2 from 'fingerprintjs2'
import deepmerge from 'deepmerge'

// Package name UniversalChatWidget defined in webpack.base.conf.js to be able to use window.UniversalChatWidget
export function Widget (config) {
  // config must be a json object with this configuration
  // *element: css selector of element to replace in DOM
  // position: embedded|*bottom-right
  // *adapterConfig: Object based on type of adapter. See ChatAdapterActionCable config as an example here:
  //    ChatAdapterActionCable.config:
  //    *backendUrl: 'http://localhost:3003'
  //    *initData: {endpoint: '/bots/:id/start',
  //                method: 'post',
  //                data: {*appId: YYY,
  //                       startValue,
  //                       user: {
  //                              id: ZZZ,
  //                              firstName: Jane,
  //                              lastName: Doe,
  //                              email: jane@doe.com,
  //                              username: jane.doe,
  //                              phone: 12125551234,
  //                              locale: en,
  //                              timezone: -5,
  //                              gender: female,
  //                              profilePicUrl: http://lorempixel.com/32/32/people
  //                      }
  //
  // sample initilization:
  // a = new UniversalChatWidget.Widget({element:'#chat-2', position:'embedded', adapterConfig: {backendUrl: 'http://localhost:3003/web', initData: {endpoint: '/bots/63015c58-13cf-438d-b5d9-d46adcba3139/start', method: 'post',data: {}}}});
  //

  var _widget
  var _widgetData = {
    position: config.position,
    element: config.element,
    showAvatars: config.showAvatars,
    allowUploads: config.allowUploads
  }

  // TODO: *adapter.instance: Instance of ChatAdapter{ActionCable}
  var _adapter = new ChatAdapterActionCable()
  var _adapterConfig = config.adapterConfig

  // retrieve device fingerprint from (browser) local storage
  var _deviceId = localStorage.getItem('ucwDeviceId')

  if (_deviceId === null) {
    // check if config data provides a user.id
    if (_adapterConfig && _adapterConfig.initData && _adapterConfig.initData.data && _adapterConfig.initData.data.user && _adapterConfig.initData.data.user.id) {
      // TODO: implement user-merge in backend, when user.id id provided and localStorage.devideId id already set, user.id should survive the merge
      _deviceId = _adapterConfig.initData.data.user.id
      localStorage.setItem('ucwDeviceId', self._deviceId)
      initAdapter()
    } else {
      // register new device:
      // build deviceId from Fingerprint2
      new Fingerprint2().get(function (result) {
        _deviceId = result
        localStorage.setItem('ucwDeviceId', result)
        initAdapter()
      })
    }
  } else {
    initAdapter()
  }

  function initAdapter () {
    // Let's init the communication with the backend

    // We complement _adapterConfig.initData with further data
    var enhancedConfig = {
      device_iso_datetime: getISODateTimeWithUTCOffset(),
      language: navigator.language,
      device_id: _deviceId
    }

    if (_adapterConfig.initData.data === null) {
      _adapterConfig.initData.data = {}
    }
    _adapterConfig.initData.data = deepmerge(_adapterConfig.initData.data, enhancedConfig)
    console.log('_adapterConfig.initData ', _adapterConfig.initData)

    _adapter.init(_adapterConfig)
        .then(response => {
          if (response.ok) {
            response.json().then(json => {
              // console.log(json)
              var widgetConfig = {
                name: json.name || 'chat',
                displayName: json.display_name || 'Chat',
                avatarUrl: json.avatar_url || 'https://storage.googleapis.com/static-121/diego-blink.gif',
                newUsersIntro: json.new_users_intro || '',
                user: json.user || {id: _deviceId},
                lastMessages: json.last_messages || []
                //  TODO: parse newusersintro
              }
              if (json.show_avatars !== undefined) {
                // showAvatars: whatever comes from the backend superseeds the initial config of the widget
                if (json.show_avatars === 'false' || json.show_avatars === false) {
                  widgetConfig.showAvatars = false
                  _widgetData.showAvatars = false
                } else {
                  widgetConfig.showAvatars = true
                  _widgetData.showAvatars = true
                }
              }
              if (json.allow_uploads !== undefined) {
                console.log('json.allow_uploads NOT NULL', json.allow_uploads)
                // allowUploads: whatever comes from the backend superseeds the initial config of the widget
                if (json.allow_uploads === 'false' || json.allow_uploads === false) {
                  widgetConfig.allowUploads = false
                  _widgetData.allowUploads = false
                } else {
                  widgetConfig.allowUploads = true
                  _widgetData.allowUploads = true
                }
              }
              render(deepmerge(widgetConfig, _widgetData))
            })
          } else {
            render('HTTP error: ' + response.status)
          }
        })
        .catch(error => {
          render(error.message)
        })
  }

  function render (params) {
    if (typeof params === 'object') {
      // params contains properties to render the chat widget
      var _template = `<chat-widget ref="widget"
      position="${params.position || 'bottom-rigth'}"
      name="${params.name}"
      displayName="${params.displayName}"
      :showAvatars="${params.showAvatars}"
      :allowUploads="${params.allowUploads}"
      avatarUrl="${params.avatarUrl}"
      newUsersIntro="${params.newUsersIntro}"/>
      </chat-widget>`

      Vue.config.productionTip = false
      /* eslint-disable no-new */
      var _parent = new Vue({
        el: params.element,
        template: _template,
        components: {ChatWidget}
      })

      _widget = _parent.$refs.widget
    } else {

    }
  }

  //
  // helper functions
  //

  // get an ISO datetime with timezone offset
  function getISODateTimeWithUTCOffset () {
    function pad (num) {
      var norm = Math.abs(Math.floor(num))
      return (norm < 10 ? '0' : '') + norm
    }

    var now = new Date()
    var tzo = -now.getTimezoneOffset()
    var dif = tzo >= 0 ? '+' : '-'

    return now.getFullYear() +
        '-' + pad(now.getMonth() + 1) +
        '-' + pad(now.getDate()) +
        'T' + pad(now.getHours()) +
        ':' + pad(now.getMinutes()) +
        ':' + pad(now.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60)
  }

  //
  // widget API (exposed/public) methods
  //
  this.open = function () {
    _widget.open()
  }

  this.close = function () {
    _widget.close()
  }
}
