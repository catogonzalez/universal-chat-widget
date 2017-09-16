<template>
  <div class="btns">
    <div v-for="button in buttonsArray" key="$index" class="btn">
      <a v-if="button.type !== 'postback'" :href="button.action" target="_blank">
        {{button.text}}
      </a>
      <a v-if="button.type === 'postback'" :data-text="button.text" :data-action="button.action"
         @click.prevent="postback">
        {{button.text}}
      </a>
    </div>
  </div>
</template>

<script>
  //  Sample button
  //  [{"type": "url", "text": "Go", "action": "https://support.apple.com/kb/PH19630"}]
  //  type can be: postback | url | phone_number

  export default {
    name: 'ChatButtons',
    data () {
      return {
        buttonsArray: []
      }
    },
    props: ['buttons'],
    created: function () {
      if (this.buttons !== undefined && this.buttons !== null) {
        if (typeof this.buttons === 'string') {
          if (this.buttons !== '') {
            try {
              this.buttonsArray = JSON.parse(this.buttons)
            } catch (e) {
              console.debug('Invalid JSON for buttons', this.buttons)
            }
          }
        } else {
          this.buttonsArray = this.buttons
        }
      }
      // remove items with no text or action
      this.buttonsArray = this.buttonsArray.filter(function (btn) {
        return btn.text.length > 0 && btn.action.length > 0
      })
    },
    methods: {
      postback: function (e) {
        // notify parent component of button action
        var buttonAction = {text: e.target.dataset.text, userAction: e.target.dataset.action}
        this.$emit('postback', buttonAction)
      }
    }
  }
</script>`

<style scoped>
  .btns {
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 5px
  }

  .btn a {
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
    color: #ffffff;
    font-size: 1em;
    background: #3b8bc7;
    padding: 8px 12px 8px 12px;
    text-decoration: none;
    cursor: pointer;
    flex: 1 1 auto;
    margin: 5px;
    line-height: 33px;
  }

  .btn a:hover {
    background: #3cb0fd;
    text-decoration: none;
  }
</style>
