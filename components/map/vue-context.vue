<template>
  <div class="v-context"
       v-show="show"
       :style="style"
       tabindex="-1"
       v-on-clickaway="close"
       @click="onClick"
       @contextmenu.capture.prevent
  >
    <slot :data="data"></slot>
  </div>
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway'

  export default {
    mixins: [clickaway],

    props: {
      /**
       * Close the menu on click.
       *
       * @type {boolean}
       */
      closeOnClick: {
        type: Boolean,
        default: true
      },

      /**
       * Close the menu automatically on window scroll.
       *
       * @type {boolean}
       */
      closeOnScroll: {
        type: Boolean,
        default: true
      }
    },

    computed: {
      /**
       * Generate the CSS styles for positioning the context menu.
       *
       * @returns {object|null}
       */
      style () {
        return this.show
          ? { top: `${this.top}px`, left: `${this.left}px` }
          : null
      }
    },

    data () {
      return {
        top: null,
        left: null,
        show: false,
        data: null
      }
    },

    beforeDestroy () {
      if (this.closeOnScroll) {
        this.removeScrollEventListener()
      }
    },

    methods: {
      /**
       * Add scroll event listener to close context menu.
       */
      addScrollEventListener () {
        if (process.client) {
          window.addEventListener('scroll', this.close)
        }
      },

      /**
       * Close the context menu.
       *
       * @param {boolean|Event} emit Used to prevent event being emitted twice from when menu is clicked and closed
       */
      close (emit = true) {
        if (!this.show) {
          return
        }

        this.top = null
        this.left = null
        this.data = null
        this.show = false

        if (this.closeOnScroll) {
          this.removeScrollEventListener()
        }

        if (emit) {
          this.$emit('close')
        }
      },

      /**
       * Close the menu if `closeOnClick` is set to true.
       */
      onClick () {
        if (this.closeOnClick) {
          this.close(false)
        }
      },

      /**
       * Open the context menu.
       *
       * @param {MouseEvent} event
       * @param {array|object|string} data User provided data for the menu
       */
      open (event, data) {
        this.data = data
        this.show = true

        this.$nextTick(() => {
          this.positionMenu(event.clientY, event.clientX)
          this.$el.focus()

          if (this.closeOnScroll) {
            this.addScrollEventListener()
          }

          this.$emit('open', event, this.data, this.top, this.left)
        })
      },

      /**
       * Set the context menu top and left positions.
       *
       * @param {number} top
       * @param {number} left
       */
      positionMenu (top, left) {
        const largestHeight = window.innerHeight - this.$el.offsetHeight - 25
        const largestWidth = window.innerWidth - this.$el.offsetWidth - 25

        if (top > largestHeight) {
          top = largestHeight
        }

        if (left > largestWidth) {
          left = largestWidth
        }

        this.top = top
        this.left = left
      },

      /**
       * Remove the scroll event listener to close the context menu.
       */
      removeScrollEventListener () {
        if (process.client) {
          window.removeEventListener('scroll', this.close)
        }
      }
    },

    watch: {
      /**
       * Add or remove the scroll event listener when the prop value changes.
       *
       * @param {boolean} closeOnScroll
       * @param {boolean} oldValue
       */
      closeOnScroll (closeOnScroll, oldValue) {
        if (closeOnScroll === oldValue) {
          return
        }

        if (closeOnScroll && this.show) {
          this.addScrollEventListener()
        } else {
          this.removeScrollEventListener()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .v-context {
    background-color: rgba(30, 43, 81, 0.71) !important;
    color: #ffffff !important;
    border: none !important;
    box-shadow: none !important;
    display: block;
    margin: 0;
    padding: 0;
    width: auto !important;
    position: fixed;
    z-index: 99999;

    ul {
      list-style: none;
      padding: 1px !important;
      margin: 0;
      font-size: 12px !important;
      font-weight: 600;

      li {
        margin: 0;
        padding: 5px 10px !important;
        cursor: pointer;

        &:hover {
          background: rgba(179, 179, 179, 0.5) !important;
          color: #ffffff !important;
        }
      }
    }
  }
</style>
