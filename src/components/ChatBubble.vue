<template>
  <a href='#' @click.prevent="onToggleVisibility">
    <svg height='85px' version='1.1' viewbox='0 0 85 85' width='85px' xmlns:xlink='http://www.w3.org/1999/xlink'
         xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <circle cx='35.5' cy='35.5' id='chat-path-1' r='35.5'></circle>
        <filter filterunits='objectBoundingBox' height='139.4%' id='filter-2' width='139.4%' x='-19.7%' y='-9.9%'>
          <feoffset dx='0' dy='7' in='SourceAlpha' result='shadowOffsetOuter1'></feoffset>
          <fegaussianblur in='shadowOffsetOuter1' result='shadowBlurOuter1' stddeviation='3.5'></fegaussianblur>
          <fecolormatrix in='shadowBlurOuter1' type='matrix'
                         values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.068897192 0'></fecolormatrix>
        </filter>
      </defs>
      <g fill-rule='evenodd' fill='none' id='final' stroke-width='1' stroke='none'>
        <g id='desktop-chat-2' transform='translate(-1318.000000, -712.000000)'>
          <g id='chat-straightforward' transform='translate(1325.000000, 712.000000)'>
            <g id='Oval'>
              <use fill-opacity='1' fill='black' filter='url(#filter-2)' xlink:href='#chat-path-1'></use>
              <use fill-rule='evenodd' fill="#be721c" xlink:href='#chat-path-1'></use>
            </g>
            <g fill-rule='nonzero' fill='#FFFFFF' id='speech-bubbles.1' transform='translate(14.000000, 19.000000)'>
              <path
                  d='M31.5333333 13.6C31.5333333 6.10158333 24.4598333 0 15.7666667 0 7.0735 0 0 6.10158333 0 13.6 0 17.612 2.01096667 21.34775 5.5427 23.94025L2.95266667 28.7059167C2.79356667 29.0005833 2.86236667 29.36325 3.11893333 29.58 3.25223333 29.6933333 3.4185 29.75 3.58476667 29.75 3.7367 29.75 3.88863333 29.7018333 4.01763333 29.6055L9.245 25.6855833C11.3161667 26.503 13.5077333 26.9166667 15.7666667 26.9166667 24.6074667 26.9166667 31.5333333 21.06725 31.5333333 13.6ZM37.4573 28.19025C40.9890333 25.59775 43 21.862 43 17.85 43 11.6506667 38.1352667 6.24041667 31.1721333 4.69341667 30.8797333 4.62966667 30.5844667 4.74725 30.4210667 4.98808333 30.2562333 5.23033333 30.2576667 5.54766667 30.4268 5.78708333 32.0880333 8.15575 32.9666667 10.8573333 32.9666667 13.6 32.9666667 20.6635 27.3924333 26.588 19.4116333 28.0103333 19.1077667 28.0641667 18.8741333 28.305 18.8297 28.60675 18.7867 28.9085 18.9429333 29.2045833 19.2195667 29.342 23.5883667 31.4939167 29.1024 31.7701667 33.755 29.937L38.9823667 33.8569167C39.1128 33.9518333 39.2647333 34 39.4166667 34 39.5829333 34 39.7477667 33.9433333 39.8825 33.83 40.1390667 33.61325 40.2078667 33.2505833 40.0487667 32.9559167L37.4573 28.19025Z'
                  id='Shape'></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </a>
</template>

<script>
  export default {
    name: 'ChatBubble',
    methods: {
      onToggleVisibility: function () {
        // re-emit the event for the parent element to handle
        this.$emit('toggleVisibility')
      }
    }
  }
</script>
