// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ChatWidget from './components/ChatWidget.vue'
import ChatAdapterActionCable from 'chat-adapter-actioncable'
// import ChatAdapterRocketChat from 'chat-adapter-rocketchat'
import Fingerprint2 from 'fingerprintjs2'
import deepmerge from 'deepmerge'
import EventEmitter from 'events'
import uidv4 from 'uuid/v4'

// Package name UniversalChatWidget defined in webpack.base.conf.js to be able to use window.UniversalChatWidget
export function Widget (config) {
  // config must be a json object with this configuration
  // *adapter: one of ActionCable or RocketChat
  // *element: css selector of element to replace in DOM
  // position: embedded|*bottom-right
  // showAvatars: *true|false
  // allowUploads: *true|false
  // *adapterConfig: Object based on type of adapter. See ChatAdapterActionCable config as an example here:
  //    ChatAdapterActionCable.config:
  //    *backendUrl: 'http://localhost:3003/web'
  //    *initData: {endpoint: '/start',
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
  // a = new UniversalChatWidget.Widget({element:'#chat-2', position:'bottom-right', showAvatars: true, allowUploads: true, adapterConfig: {backendUrl: 'http://localhost:3003/web', initData: {endpoint: '/start', method: 'post', data: {appId: '63015c58-13cf-438d-b5d9-d46adcba3139'}}}})

  var _widget
  var _parent
  var _widgetData = {
    position: config.position,
    element: config.element,
    showAvatars: config.showAvatars,
    allowUploads: config.allowUploads
  }
  var _eventBus = new EventEmitter()

  // TODO: *adapter.instance: Instance of ChatAdapter{ActionCable}
  var _adapter

  switch (config.adapter.toLowerCase()) {
    case 'actioncable':
      _adapter = new ChatAdapterActionCable()
      break

    // case 'rocketchat':
    //  _adapter = new ChatAdapterRocketChat()
    //  break

    default:
      render(`Invalid adapter: ${config.adapter}. Please use either ActionCable or RocketChat`)
      break
  }

  var _adapterConfig = config.adapterConfig
  var _appId = _adapterConfig.initData.data.appId

  // retrieve device fingerprint from (browser) local storage
  var _deviceId = localStorage.getItem('ucwDeviceId')

  if (_deviceId === null || _deviceId === undefined) {
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

  function isFalsey (value) {
    return (value === 'false' || value === false || value === 0 || value === '0')
  }

  function initAdapter () {
    // Let's init the communication with the backend

    // We complement _adapterConfig.initData with further data
    var enhancedConfig = {
      deviceIsoDatetime: new Date().toISOString(),
      language: navigator.language,
      deviceId: _deviceId
    }

    if (_adapterConfig.initData.data === null) {
      _adapterConfig.initData.data = {}
    }
    _adapterConfig.initData.data = deepmerge(_adapterConfig.initData.data, enhancedConfig)
    // console.log('_adapterConfig.initData ', _adapterConfig.initData)

    _adapter.init(_adapterConfig)
        .then(json => {
          // console.log(json)
          var widgetConfig = {
            name: json.name || 'chat',
            displayName: json.display_name || 'Chat',
            avatarUrl: json.avatar_url || 'https://storage.googleapis.com/static-121/diego-blink.gif',
            newUsersIntro: json.new_users_intro || '',
            user: json.user || {id: _deviceId},
            lastMessages: json.last_messages || [],
            messageCount: json.message_count || 0,
            availableFrom: json.available_from || null,
            availableTo: json.available_to || null,
            unavailableMessage: json.unavailable_message || null
          }
          if (json.show_avatars !== undefined) {
            // showAvatars: whatever comes from the backend superseeds the initial config of the widget
            if (isFalsey(json.show_avatars)) {
              widgetConfig.showAvatars = false
              _widgetData.showAvatars = false
            } else {
              widgetConfig.showAvatars = true
              _widgetData.showAvatars = true
            }
          }
          if (json.allow_uploads !== undefined) {
            // allowUploads: whatever comes from the backend superseeds the initial config of the widget
            if (isFalsey(json.allow_uploads)) {
              widgetConfig.allowUploads = false
              _widgetData.allowUploads = false
            } else {
              widgetConfig.allowUploads = true
              _widgetData.allowUploads = true
            }
          }
          if (json.is_enabled !== undefined) {
            // isEnabled: defaults to true. Whatever comes from the backend superseeds that default
            if (isFalsey(json.is_enabled)) {
              widgetConfig.isEnabled = false
              _widgetData.isEnabled = false
            } else {
              widgetConfig.isEnabled = true
              _widgetData.isEnabled = true
            }
          }
          if (process.env.NODE_ENV === 'development' && widgetConfig.lastMessages.length === 0) {
            // use fake messages in development when there are no messages
            // widgetConfig.lastMessages = devMessages()
            devMessages()
          }

          widgetConfig = deepmerge(widgetConfig, _widgetData)
          render(widgetConfig)
        })
        .catch(error => {
          render(error)
        })
  }

  function render (params) {
    if (typeof params !== 'object') {
      console.warn(`App ${_adapterConfig.initData.data.appId} failed to initialize: ${params}`)
      _eventBus.emit('ucw:error', `App ${_adapterConfig.initData.data.appId} failed to initialize: ${params}`)
      return false
    }
    if (params.isEnabled === false) {
      console.warn(`App ${_adapterConfig.initData.data.appId} is disabled in the backend. Widget will not show`)
      _eventBus.emit('ucw:error', `App ${_adapterConfig.initData.data.appId} is disabled in the backend. Widget will not show`)
      return false
    }

    // params contains properties to render the chat widget
    var _template = `<chat-widget ref="widget"
      @toggleVisibility="onToggleVisibility"
      @newUserMessage="onNewUserMessage"
      @requestOlderMessages="onRequestOlderMessages"
      :position="position"
      :name="name"
      :displayName="displayName"
      :showAvatars="showAvatars"
      :allowUploads="allowUploads"
      :availableFrom="availableFrom"
      :availableTo="availableTo"
      :unavailableMessage="unavailableMessage"
      :avatarUrl="avatarUrl"
      :newUsersIntro="newUsersIntro"
      :messages="messages"
      :isOpen="isOpen"
      :isTyping="isTyping"
      :messageCount="messageCount"
      :unreadCount="unreadCount"/>
      </chat-widget>`

    Vue.config.productionTip = false
    /* eslint-disable no-new */
    _parent = new Vue({
      el: params.element,
      template: _template,
      components: {ChatWidget},
      data: {
        position: params.position || 'bottom-right',
        name: params.name,
        displayName: params.displayName,
        showAvatars: params.showAvatars,
        allowUploads: params.allowUploads,
        availableFrom: params.availableFrom || null,
        availableTo: params.availableTo || null,
        unavailableMessage: params.unavailableMessage || null,
        avatarUrl: params.avatarUrl,
        newUsersIntro: params.newUsersIntro,
        messages: params.lastMessages,
        isOpen: false,
        isTyping: false,
        messageCount: params.messageCount,
        unreadCount: 0
      },
      mounted: function () {
        if (this.messages.length === 0) {
          var welcome = {
            id: uidv4().replace(/-/g, ''),
            time: new Date().toISOString(),
            text: this.newUsersIntro,
            direction: '2',
            from: {
              username: this.displayName,
              avatar: this.avatarUrl
            }
          }
          this.messages.push(welcome)
        }
      },
      methods: {
        open () {
          this.isOpen = true
        },
        close () {
          this.isOpen = false
        },
        onToggleVisibility (isClosed) {
          this.isOpen = !isClosed
        },
        onNewUserMessage (newMessage) {
          var data = {
            type: 'messages',
            appId: _appId,
            from: {id: _deviceId}
          }
          var merged = deepmerge(newMessage, data)
          // save it to local collection
          this.messages.push(merged)
          // and notify backend
          _adapter.send(merged)
        },
        onRequestOlderMessages () {
          if (this.messages[0].time !== undefined && this.messages[0].time !== null && this.messages[0].time.trim() !== '') {
            var data = {
              appId: _appId,
              deviceId: _deviceId,
              id: this.messages[0].id,
              time: this.messages[0].time
            }
            _adapter.requestOlderMessages(data)
                .then(response => {
                  if (response.status === 200) {
                    this.messages = response.data.concat(this.messages)
                  } else {
                    console.error(response)
                  }
                })
                .catch(error => {
                  console.error(error)
                })
          }
        }
      }
    })

    _widget = _parent.$refs.widget
    _adapter.on('ucw:newRemoteMessage', (data) => {
      _widget.messages.push(data)

      // re-emit the event in case there are any subscribers attached to our widget
      _eventBus.emit('ucw:newRemoteMessage', data)
    })
    // signal loaded event
    _eventBus.emit('ucw:loaded')
  }

//
// helper functions
//

// use fake messages in development when there are no messages
  function devMessages () {
    // collection of messages to use in development if messages is empty
    const now = new Date().getTime()

    return [
      {
        id: 1,
        time: now - 600000000,
        from: {username: 'Tom Anderson', avatar: null},
        text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
        direction: '1'
      },
      {
        id: 2,
        time: now - 60000000,
        from: {username: 'Tom Anderson', avatar: null},
        text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
        direction: '2'
      },
      {
        id: 3,
        time: now - 6000000,
        from: {username: 'Tom Anderson', avatar: null},
        text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
        direction: '1'
      },
      {
        id: 4,
        time: now - 600000,
        from: {username: 'Tom Anderson', avatar: null},
        text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
        direction: '2'
      },
      {
        id: 5,
        time: now - 600000,
        from: {username: 'Tom Anderson', avatar: null},
        text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
        direction: '2'
      },
      {
        id: 6,
        time: now - 600000,
        from: {username: 'Tom Anderson', avatar: null},
        text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
        direction: '1'
      },
      {
        id: 7,
        time: now,
        from: {username: 'Tom Anderson', avatar: null},
        text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
        direction: '2'
      }]
  }

//
// widget API (exposed/public) methods
//
  this.open = function () {
    _parent.open()
  }

  this.close = function () {
    _parent.close()
  }

  this.on = function (event, callback) {
    _eventBus.on(event, callback)
  }
}
