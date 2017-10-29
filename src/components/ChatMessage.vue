<template>
  <div class="chat-message">
    <time class="message-time">
      <timeago :since="message.time" :max-time="3600 * 24" :auto-update="60" :format="formatTime"></timeago>
    </time>
    <div class="chat-entry" :class="{remote: message.direction == 2}">
      <avatar v-if="showAvatar && message.from.avatar !== null && message.from.avatar.trim() !== ''" :username="message.from.username"
              :src="message.from.avatar" :size=32></avatar>
      <avatar v-if="showAvatar && (message.from.avatar === null || message.from.avatar.trim() === '')" :username="message.from.username" :size=32></avatar>
      <p v-if="message.text !== null && message.text.trim() !==''" class="message-body message-text">
        {{message.text}}
      </p>
    </div>
    <chat-carousel v-if="message.elements !== undefined && message.elements !== null && message.elements !==''"
                   :slides="message.elements"></chat-carousel>
    <chat-buttons v-if="message.buttons !== undefined && message.buttons !== null && message.buttons !==''"
                  :buttons="message.buttons"
                  @postback="onPostback"></chat-buttons>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueTimeago from 'vue-timeago'
  import Avatar from 'vue-avatar/dist/Avatar'
  import ChatCarousel from './ChatCarousel'
  import ChatButtons from './ChatButtons'

  var locale
  locale = navigator.language.startsWith('es') ? 'es-ES' : 'en-US'

  Vue.use(VueTimeago, {
    name: 'timeago',
    locale: locale,
    locales: {
      'en-US': require('vue-timeago/locales/en-US.json'),
      'es-ES': require('vue-timeago/locales/es-ES.json')
    }
  })

  export default {
    name: 'ChatMessage',
    components: {
      Avatar,
      VueTimeago,
      ChatCarousel,
      ChatButtons
    },
    data () {
      return {}
    },
    props: {
      message: {
        default: null,
        type: Object
      },
      showAvatar: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      formatTime: function (time) {
        const d = new Date(time)
        return d.toLocaleString()
      },
      onPostback: function (data) {
        // re-emit the event for the parent element to handle
        this.$emit('postback', data)
      }
    }
  }
</script>`

<style scoped>
  .chat-message {
    font-size: 0.8em;
    flex-direction: column;
    font-family: Raleway, Arial, Helvetica, sans-serif;
    padding-top: 1em;
  }

  .chat-entry {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    max-width: 100%;
    margin: .2em;
  }

  .chat-entry.remote {
    flex-direction: row-reverse;
  }

  .chat-avatar {
    flex-shrink: 0;
    flex-grow: 0;
    z-index: 1;
    height: 3em;
    width: 3em;
    border-radius: 50%;
  }

  .chat-entry .message-body {
    position: relative;
    margin: 0 1em;
  }

  .chat-entry .message-body::before {
    position: absolute;
    right: auto;
    bottom: 0.6em;
    left: -0.9em;
    height: 0;
    content: '';
    border: 6px solid transparent;
    border-right-color: #ddd;
    z-index: 2;
  }

  .chat-entry.remote .message-body::before {
    right: -0.9em;
    bottom: 0.6em;
    left: auto;
    border: 6px solid transparent;
    border-left-color: #08f;
  }

  .chat-entry.remote .message-body {
    border-top: 1px solid #07f;
    border-bottom: 1px solid #07f;
    background-color: #08f;
    color: #fff;
  }

  p.message-body {
    background-color: #ddd;
    padding: .5em;
    border-radius: 4px;
    font-weight: lighter;
    width: fit-content;
    width: -moz-fit-content;
    max-width: 90%;
  }

  p.message-text {
    margin-top: 2px !important;
    margin-bottom: 2px !important;
  }

  .message-time {
    font-size: 0.8em;
    margin-left: 1em;
  }

</style>
