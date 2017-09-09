<template>
  <div>
    <transition name="fade">
      <div id="chat-121" v-if="isOpen">
        <header class="clearfix" @click="isOpen = !isOpen">
          <a href="#" class="chat-close">X</a>
          <h4>{{params.remotePartyName}}</h4>
        </header>
        <div class="chat">
          <div class="chat-history" ref="chatHistory">
            <chat-message v-for="message in messages" :key="message.id" :message="message"></chat-message>
            <typing-indicator v-if="isTyping"></typing-indicator>
          </div>
          <div class="inputs">
            <textarea id="pepe" placeholder="Type your message…" ref="textArea" @keydown="handleInput"/>
            <button class="upload" @click="trigger">
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
    <transition name="fade">
      <div id="chat-121-avatar" v-if="!isOpen">
        <span class="chat-message-counter" v-if="unreadCount > 0">{{unreadCount}}</span>
        <img src="../assets/diego-blink.gif" @click="isOpen = !isOpen"/>
      </div>
    </transition>
  </div>
</template>

<script>
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
        this.$refs.chatHistory.scrollTop = this.$refs.chatHistory.scrollHeight
      }
      if (this.$refs.textArea !== undefined) {
        this.$refs.textArea.focus()
      }
    },
    methods: {
      trigger () {
        this.$refs.fileInput.click()
      },
      handleInput (e) {
        if (e.keyCode === 13) {
          var textArea = e.target
          if (textArea.value.trim() !== '') {
            var newMessage = {
              time: new Date().getTime(),
              from: 'Me',
              text: textArea.value.trim(),
              direction: '1'
            }
            this.messages.push(newMessage)
          }
          textArea.value = ''
          textArea.setSelectionRange(0, 0)
          textArea.blur()
//          this.isTyping = false
        }
      }
    },
    data () {
      const now = new Date().getTime()

      return {
        params: {remotePartyName: '121 Chat'},
        isOpen: false,
        unreadCount: 1,
        isTyping: false,
        messages: [
          {
            time: now - 600000000,
            from: 'Tom Anderson',
            text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
            direction: '1'
          },
          {
            time: now - 60000000,
            from: 'Tom Anderson',
            text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
            direction: '2'
          },
          {
            time: now - 6000000,
            from: 'Tom Anderson',
            text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
            direction: '1'
          },
          {
            time: now - 600000,
            from: 'Tom Anderson',
            text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
            direction: '2'
          },
          {
            time: now - 600000,
            from: 'Tom Anderson',
            text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
            direction: '2'
          },
          {
            time: now - 600000,
            from: 'Tom Anderson',
            text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
            direction: '1'
          },
          {
            time: now,
            from: 'Tom Anderson',
            text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
            direction: '2'
          }]
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* ---------- GENERAL ---------- */

  body {
    background: #e9e9e9;
    color: #9a9a9a;
    font: 100%/1.5em "Droid Sans", sans-serif;
    margin: 0;
  }

  a {
    text-decoration: none;
  }

  h4, h5 {
    line-height: 1.5em;
    margin: 0;
  }

  hr {
    background: #e9e9e9;
    border: 0;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    height: 1px;
    margin: 0;
    min-height: 1px;
  }

  img {
    border: 0;
    display: block;
    height: auto;
    max-width: 100%;
  }

  input {
    border: 0;
    color: inherit;
    font-family: inherit;
    font-size: 100%;
    line-height: normal;
    margin: 0;
  }

  p {
    margin: 0;
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

  #chat-121 {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 300px;
    height: 500px;
    font-size: 12px;
    z-index: 0;
    display: flex;
    flex-direction: column;
  }

  #chat-121 header {
    background: #EA883B;
    border-radius: 5px 5px 0 0;
    color: #fff;
    cursor: pointer;
    padding: 12px 24px;
  }

  /*!* green dot *!*/
  /*#chat-121 h4:before {*/
  /*background: #1a8a34;*/
  /*border-radius: 50%;*/
  /*content: "";*/
  /*display: inline-block;*/
  /*height: 8px;*/
  /*margin: 0 8px 0 0;*/
  /*width: 8px;*/
  /*}*/

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