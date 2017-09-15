<template>
  <div :class="classObject">
    <transition name="fade">
      <div id="chat-121" v-show="isVisible">
        <header class="clearfix" @click="toggleVisibility">
          <a v-if="!isEmbedded" href="#" class="chat-close">X</a>
          <h4>{{displayName}}</h4>
        </header>
        <div class="chat">
          <div class="chat-history" ref="chatHistory" @scroll="onScroll">
            <chat-message v-for="message in messages" :key="message.id" :message="message"
                          :showAvatar="showAvatars"></chat-message>
            <typing-indicator v-if="isTyping && isVisible"></typing-indicator>
          </div>
          <div class="inputs">
            <textarea placeholder="Type your message…" ref="textArea" @keydown="handleInput"/>
            <button v-if="allowUploads" class="upload" @click="trigger">
              <input class="upload-input" type="file" ref="fileInput"/>
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
                <path fill="none" fill-rule="evenodd" stroke="#212126"
                      d="M11.312 6.213l-6.103 6.486c-1.612 1.726-1.612 4.498 0 6.224 1.61 1.728 4.198 1.728 5.808 0l8.78-8.751c.977-1.046 1.344-2.36.578-3.61C20.007 5.963 18.937 5 17.656 5a3.39 3.39 0 0 0-2.593 1.213s-4.938 5.287-5.36 5.756c-.422.469-.656 1.172-.515 1.656.14.484.812.969 1.28.969.47 0 1.313-.313 1.648-.64l3.759-4.028"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="powered-by">
          <a href="https://121.services/chat?utm_source=chat_window&utm_medium=referral&partner=www.yoursite.com&utm_campaign=121.services&utm_term=none"
             target="_blank">Powered by 121 Services</a>
        </div>
      </div>
    </transition>
    <template v-if="!isEmbedded">
      <transition name="fade">
        <div id="chat-121-avatar" v-show="!isOpen">
          <span class="chat-message-counter" v-if="unreadCount > 0">{{unreadCount}}</span>
          <img :src=avatarUrl @click="toggleVisibility"/>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
  import uidv4 from 'uuid/v4'
  import ChatMessage from './ChatMessage'
  import TypingIndicator from './TypingIndicator'

  export default {
    name: 'ChatWidget',
    components: {
      ChatMessage,
      TypingIndicator
    },
    updated: function () {
      if (this.$refs.chatHistory !== undefined) {
        // scroll to last message
        this.$refs.chatHistory.scrollTop = this.$refs.chatHistory.scrollHeight
      }
      if (this.$refs.textArea !== undefined) {
        this.$refs.textArea.focus()
      }
    },
    props: {
      position: {
        type: String,
        default: 'bottom-right'
      },
      showAvatars: {
        type: Boolean,
        default: true
      },
      allowUploads: {
        type: Boolean,
        default: true
      },
      name: {
        type: String,
        default: 'chat'
      },
      displayName: {
        type: String,
        default: 'Chat'
      },
      avatarUrl: {
        type: String,
        default: 'https://storage.googleapis.com/static-121/diego-blink.gif'
      },
      newUsersIntro: {
        type: String,
        default: ''
      },
      messages: {
        type: Array
      },
      isOpen: {
        type: Boolean,
        default: false
      },
      isTyping: {
        type: Boolean,
        default: false
      },
      messageCount: {
        type: Number,
        default: 0
      },
      unreadCount: {
        type: Number,
        default: 0
      }
    },
    computed: {
      classObject () {
        return {
          'bottom-right': (this.position.toLowerCase() === 'bottom-right'),
          'embedded': (this.position.toLowerCase() === 'embedded')
        }
      },
      isEmbedded () {
        return (this.position.toLowerCase() === 'embedded')
      },
      isVisible () {
        return (this.isOpen || this.position.toLowerCase() === 'embedded')
      }
    },
    methods: {
      toggleVisibility () {
        if (!(this.position.toLowerCase() === 'embedded')) {
          this.$emit('toggleVisibility')
        }
      },
      trigger () {
        this.$refs.fileInput.click()
      },
      handleInput (e) {
        if (e.keyCode === 13) {
          var textArea = e.target
          if (textArea.value.trim() !== '') {
            var newMessage = {
              id: uidv4().replace(/-/g, ''),
              time: new Date().toISOString(),
              text: textArea.value.trim(),
              direction: '1'
            }
            this.$emit('newUserMessage', newMessage)
          }
          textArea.value = ''
          textArea.setSelectionRange(0, 0)
          textArea.blur()
//        this.isTyping = false
        }
      },
      onScroll (e) {
        if (e.target.scrollTop === 0) {
          // see if there are older messages to read from server
          if (this.messageCount > this.messages.length) {
            // refresh older messages
            this.$emit('requestOlderMessages')
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* ---------- GENERAL ---------- */

  h4, h5 {
    line-height: 1.5em;
    margin: 0;
  }

  img {
    border: 0;
    display: block;
    height: auto;
    max-width: 100%;
  }

  .clearfix {
    *zoom: 1;
  }

  /* For IE 6/7 */
  .clearfix:before, .clearfix:after {
    content: "";
    display: table;
  }

  .clearfix:after {
    clear: both;
  }

  /* ---------- 121-CHAT ---------- */

  .bottom-right {
    position: fixed;
    bottom: 0;
    right: 0;
  }

  .embedded {
    position: inherit;
  }

  #chat-121 {
    width: 300px;
    height: 500px;
    font-size: 12px;
    z-index: 0;
    display: flex;
    flex-direction: column;
    font-family: Raleway, Arial, Helvetica, sans-serif;
  }

  #chat-121 header {
    background: #EA883B;
    border-radius: 5px 5px 0 0;
    color: #fff;
    cursor: pointer;
    padding: 12px 24px;
  }

  #chat-121 h4 {
    font-size: 12px;
  }

  #chat-121 h5 {
    font-size: 10px;
  }

  .chat-message-counter {
    background: #e62727;
    border: 1px solid #fff;
    color: #fff;
    border-radius: 50%;
    font-size: 12px;
    font-weight: bold;
    height: 28px;
    left: 0;
    line-height: 28px;
    margin: -10px 0 0 -10px;
    position: absolute;
    text-align: center;
    top: 0;
    width: 28px;
    z-index: -10;
    font-family: Raleway, Arial, Helvetica, sans-serif;
  }

  #chat-121 .chat-close {
    background: #EA883B;
    border-radius: 50%;
    color: #fff;
    display: block;
    float: right;
    font-size: 12px;
    height: 16px;
    line-height: 16px;
    margin: 2px 0 0 0;
    text-align: center;
    width: 16px;
    text-decoration: none;
  }

  #chat-121 .chat-close:hover {
    background: #de261d;
  }

  #chat-121 .chat {
    background: #fff;
    flex: 1;
  }

  #chat-121 .chat-history {
    height: 375px;
    overflow-y: scroll;
  }

  #chat-121 .chat-feedback {
    font-style: italic;
    margin: 0 0 0 80px;
  }

  #chat-121 .inputs {
    padding: 8px;
    position: relative;
  }

  #chat-121 .inputs textarea {
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 8px;
    padding-right: 22px;
    outline: none;
    width: 100%;
    height: 50px;
    overflow-y: hidden;
    resize: none;
    box-sizing: border-box;
  }

  #chat-121 .inputs .upload {
    position: absolute;
    right: 15px;
    top: 10px;
    z-index: 2;
    background-color: hsla(0, 0%, 100%, .9);
    border-radius: 50%;
    width: 26px;
    height: 26px;
    cursor: pointer;
    border: none;
  }

  #chat-121 .inputs .upload-input {
    display: none;
  }

  #chat-121-avatar {
    position: fixed;
    bottom: 0;
    right: 0;
    cursor: pointer;
    z-index: 0;
    max-width: 58px;
    height: auto;
  }

  #chat-121 .powered-by {
    background: #fff;
    margin-top: auto;
    font-size: .7rem;
    color: #fff;
    text-shadow: 0 .1rem .6rem rgba(0, 0, 0, .7);
    z-index: 0;
    padding-right: 1em;
  }

  #chat-121 .powered-by a {
    float: right;
  }

  /* TRANSITIONS */

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0
  }

</style>
