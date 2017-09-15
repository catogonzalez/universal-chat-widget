<template>
  <div>
    <time class="message-time">
      <timeago :since="message.time" :max-time="3600 * 24" :auto-update="60" :format="formatTime"></timeago>
    </time>
    <div class="chat-entry" :class="{remote: message.direction == 2}">
      <avatar v-if="showAvatar" username="message.from.username" :src="message.from.avatar" :size=32></avatar>
      <p class="message-body message-text">
        {{message.text}}
      </p>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueTimeago from 'vue-timeago'
  import Avatar from 'vue-avatar/dist/Avatar'

  var locale;
  locale = navigator.language.startsWith('es') ? 'es-ES' : 'en-US';


  Vue.use(VueTimeago, {
    name: 'timeago',
    locale: locale,
    locales: {
      'en-US': require('vue-timeago/locales/en-US.json'),
      'es-ES': require('vue-timeago/locales/es-ES.json')
    }
  });

  export default {
    name: 'ChatMessage',
    components: {
      Avatar,
      VueTimeago
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
        const d = new Date(time);
        return d.toLocaleString()
      }
    }
  }
</script>`

<style scoped>
  .chat-entry {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    max-width: 100%;
    margin: .5em;
  }

  .chat-entry.remote {
    flex-direction: row-reverse;
  }

  .chat-avatar {
    flex-shrink: 0;
    flex-grow: 0;
    z-index: 1;
    height: 32px;
    width: 32px;
    border-radius: 50%;
  }

  .chat-entry .message-body {
    position: relative;
    margin: 0 12px;
  }

  .chat-entry .message-body::before {
    position: absolute;
    right: auto;
    bottom: .6em;
    left: -12px;
    height: 0;
    content: '';
    border: 6px solid transparent;
    border-right-color: #ddd;
    z-index: 2;
  }

  .chat-entry.remote .message-body::before {
    right: -12px;
    bottom: .6em;
    left: auto;
    border: 6px solid transparent;
    border-left-color: #08f;
  }

  .message-body {
    background-color: #ddd;
    padding: .5em;
    border-radius: 4px;
    font-weight: lighter;
    width: fit-content;
    width: -moz-fit-content;
    max-width: 90%;
  }

  .chat-entry.remote .message-body {
    border-top: 1px solid #07f;
    border-bottom: 1px solid #07f;
    background-color: #08f;
    color: #fff;
  }

  .message-text {
    margin-top: 2px !important;
    margin-bottom: 2px !important;
  }

  .message-time {
    font-size: x-small;
    margin-left: 1em;
  }

</style>
