<template>
  <div class="card">
    <div class="products">
      <div v-for="slide, index in slidesArray"
           :class="{product: true, active:currentItem === index}"
           :slide="slide" :key="index" ref="items">
        <div class="thumbnail"><img :src="slide.image_url" alt="Image not found"/></div>
        <h1 class="title">{{slide.title}}</h1>
        <p class="description">{{slide.subtitle}}</p>
        <chat-buttons v-if="slide.buttons !== null && slide.buttons !==''"
                      :buttons="slide.buttons"
                      @postback="onPostback">
        </chat-buttons>
      </div>
    </div>
    <div class="buttons">
      <button v-if="currentItem > 0" class="btn-prev" @click.prevent="prev" href="#">&larr;</button>
      <button v-if="currentItem < slidesArray.length" class="btn-next" @click.prevent="next" href="#">&rarr;</button>
    </div>
  </div>
</template>

<script>
  import ChatButtons from './ChatButtons'

  //  Sample carousel item (messages.elements[0])
  //  [{
  //    "title": "iTunes for Mac: Pre-order items from the iTunes Store",
  //    "subtitle": "Mar 28, 2017 ... If an item isn't yet available, you may be able to pre-order and then..."
  //    "image_url": "",
  //    "buttons": [{"type": "url", "text": "Go", "action": "https://support.apple.com/kb/PH19630"}]
  //  }]

  export default {
    name: 'ChatCarousel',
    components: {
      ChatButtons
    },
    data () {
      return {
        currentItem: 0,
        slidesArray: []
      }
    },
    props: ['slides'],
    created: function () {
      if (this.slides !== undefined && this.slides !== null) {
        if (typeof this.slides === 'string') {
          if (this.slides !== '') {
            try {
              this.slidesArray = JSON.parse(this.slides)
            } catch (e) {
              console.debug('Invalid JSON for carousel slides', this.slides)
            }
          }
        } else {
          this.slidesArray = this.slides
        }
      }
      // remove items with no text
      this.slidesArray = this.slidesArray.filter(function (slide) {
        return slide.title.length > 1
      })
    },
    methods: {
      next () {
        if (this.currentItem + 1 < this.slidesArray.length) {
          this.currentItem += 1
        }
      },
      prev () {
        if (this.currentItem > 0) {
          this.currentItem -= 1
        }
      },
      onPostback: function (data) {
        // re-emit the event for the parent element to handle
        this.$emit('postback', data)
      }
    }
  }
</script>`

<style scoped>

  .card {
    font-size: 12px;
    font-family: Raleway, Arial, Helvetica, sans-serif;
    background: #FFFFFF;
    width: 320px;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    box-sizing: border-box;
    padding: 12px;
    text-align: center;
    margin-left: 12px;
    margin-bottom: 12px;
  }

  .products {
    position: relative;
    overflow: hidden;
    -webkit-transition: 0.5s ease;
    transition: 0.5s ease;
    height: 280px;
  }

  .product {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    visibility: hidden;
    -webkit-transition: 0.5s ease;
    transition: 0.5s ease;
  }

  .product.active {
    opacity: 1;
    visibility: visible;
  }

  .card .product h1 {
    font-size: 1.2em;
  }

  .thumbnail {
    margin: 0 0 12px;
  }

  .thumbnail img {
    height: 100px;
    width: auto;
  }

  .title {
    margin: 0 0 12px;
    color: #D18B49;
    font-size: 24px;
    -webkit-transition: 0.5s ease;
    transition: 0.5s ease;
  }

  .description {
    margin: 0 0 15px;
    text-align: start;
  }

  .products .buttons {
    bottom: 20%;
    pointer-events: all;
  }

  .buttons button {
    transition: ease .4s;
  }

  .btn-prev {
    float: left;
  }

  .btn-next {
    float: right;
  }

  .btn-prev,
  .btn-next {
    width: 30px;
    height: 30px;
    margin-left: 10px;
    border: none;
    outline: none;
    border-radius: 50%;
    color: #FFFFFF;
    background: linear-gradient(to bottom, #F5515F, #ea883b);
    cursor: pointer;
  }

  .buttons button:hover {
    box-shadow: 0px 3px 30px 3px rgba(234, 136, 59, .8);
  }
</style>
