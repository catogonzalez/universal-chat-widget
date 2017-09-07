<template>
  <div class="params">
    <h1>Chat widget development page</h1>
    <h2>Widget parameters</h2>

    <input v-model="title" placeholder="Title for the widget">
  </div>
</template>

<script>
  export default {
    name: 'params',
    data () {
      return {
        title: ''
//        if participants are more than 2, show avatar/name in each message. Otherwise, show remote party avatar in header
      }
    }
  }
</script>

