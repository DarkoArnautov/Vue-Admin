<script>
  import 'leaflet-rotatedmarker'
  import { propsBinder, findRealParent } from 'vue2-leaflet'
  import Layer from '../../../node_modules/vue2-leaflet/src/mixins/Layer.js'
  import Options from '../../../node_modules/vue2-leaflet/src/mixins/Options.js'
  import { marker, DomEvent, Icon, latLng } from 'leaflet'

  const debounce = (fn, time) => {
    let timeout

    return function (...args) {
      const context = this
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        fn.apply(context, args)
        timeout = null
      }, time)
    }
  }

  const collectionCleaner = (options) => {
    const result = {}
    for (let key in options) {
      const value = options[key]
      if (value !== null && value !== undefined) {
        result[key] = value
      }
    }
    return result
  }

  const optionsMerger = (props, instance) => {
    const options = instance.options && instance.options.constructor === Object ? instance.options : {}
    props = props && props.constructor === Object ? props : {}
    const result = collectionCleaner(options)
    props = collectionCleaner(props)
    const defaultProps = instance.$options.props
    for (let key in props) {
      const def = defaultProps[key] ? defaultProps[key].default : Symbol('unique')
      if (result[key] && def !== props[key]) {
        console.warn(`${key} props is overriding the value passed in the options props`)
        result[key] = props[key]
      } else if (!result[key]) {
        result[key] = props[key]
      }
    }

    return result
  }

  export default {
    name: 'LRotatedMarker',
    mixins: [Layer, Options],
    props: {
      pane: {
        type: String,
        default: 'markerPane'
      },
      draggable: {
        type: Boolean,
        custom: true,
        default: false
      },
      latLng: {
        type: [Object, Array],
        custom: true,
        default: null
      },
      icon: {
        type: [Object],
        custom: false,
        default: () => new Icon.Default()
      },
      zIndexOffset: {
        type: Number,
        custom: false,
        default: null
      },
      rotationAngle: {
        type: Number,
        default: () => 0
      }
    },
    data () {
      return {
        ready: false
      }
    },
    mounted () {
      const options = optionsMerger({
        ...this.layerOptions,
        icon: this.icon,
        zIndexOffset: this.zIndexOffset,
        draggable: this.draggable,
        rotationAngle: this.rotationAngle ? this.rotationAngle : 0
      }, this)
      this.mapObject = marker(this.latLng, options)
      DomEvent.on(this.mapObject, this.$listeners)
      this.mapObject.on('move', debounce(this.latLngSync, 100))
      propsBinder(this, this.mapObject, this.$options.props)
      this.parentContainer = findRealParent(this.$parent)
      this.parentContainer.addLayer(this, !this.visible)
      this.ready = true
    },
    methods: {
      setDraggable (newVal, oldVal) {
        if (this.mapObject.dragging) {
          newVal ? this.mapObject.dragging.enable() : this.mapObject.dragging.disable()
        }
      },
      setLatLng (newVal) {
        if (newVal == null) {
          return
        }

        if (this.mapObject) {
          const oldLatLng = this.mapObject.getLatLng()
          const newLatLng = latLng(newVal)
          if (newLatLng.lat !== oldLatLng.lat || newLatLng.lng !== oldLatLng.lng) {
            this.mapObject.setLatLng(newLatLng)
          }
        }
      },
      latLngSync (event) {
        this.$emit('update:latLng', event.latlng)
      }
    },
    render: function (h) {
      if (this.ready && this.$slots.default) {
        return h('div', { style: { display: 'none' } }, this.$slots.default)
      }
      return null
    }
  }
</script>
