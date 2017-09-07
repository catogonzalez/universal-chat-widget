<template>
  <div id="app">
    <img src="./assets/logo.png">
    <params></params>
    <widget></widget>
  </div>
</template>

<script>
import Params from './components/Params'
import Widget from './components/Widget'

export default {
  name: 'app',
  components: {
    Params,
    Widget
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
