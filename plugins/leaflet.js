import 'leaflet/dist/leaflet.css'
import '../assets/style/map/map.css'
import '../assets/style/map/graticule.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import '../utils/map/leaflet_extensions/easy_button/easy-button.css'
import '../utils/map/leaflet_extensions/control-center/leaflet-control-topcenter.css'
import '../utils/map/leaflet_extensions/leaflet-ruler/leaflet-ruler.css'
import '../assets/style/map/draw/leaflet.draw-src.css'
import '../utils/map/leaflet_extensions/measure-path/leaflet-measure-path.css'
import '../utils/map/leaflet_extensions/fullscreen/leaflet.fullscreen.css'
import Vue from 'vue'
import * as Vue2Leaflet from 'vue2-leaflet'
import Vue2LeafletRotatedMarker from '../components/map/leaflet_extensions/Vue2LeafletRotatedMarkerV2'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import '../utils/map/leaflet_extensions/leaflet.canvas-markers'

require('../utils/map/graticule')
require('../utils/map/velocity')
require('../utils/map/leaflet_extensions/easy_button/easy-button')
require('../utils/map/leaflet_extensions/control-center/leaflet-control-topcenter')
require('../utils/map/leaflet_extensions/leaflet-ruler/leaflet-ruler')
require('leaflet-draw')
require('../utils/map/leaflet_extensions/measure-path/leaflet-measure-path')
require('../utils/map/leaflet_extensions/leaflet-easyPrint/index')
require('../utils/map/leaflet_extensions/fullscreen/Leaflet.fullscreen')
require('../utils/map/leaflet_extensions/layersupport')
// require('../utils/map/leaflet_extensions/leaflet.boatmarker')
// require('../utils/map/leaflet_extensions/freezable')

Vue.component('l-circle', Vue2Leaflet.LCircle)
Vue.component('l-circle-marker', Vue2Leaflet.LCircleMarker)
Vue.component('l-control', Vue2Leaflet.LControl)
Vue.component('l-control-attribution', Vue2Leaflet.LControlAttribution)
Vue.component('l-control-layers', Vue2Leaflet.LControlLayers)
Vue.component('l-control-scale', Vue2Leaflet.LControlScale)
Vue.component('l-control-zoom', Vue2Leaflet.LControlZoom)
Vue.component('l-feature-group', Vue2Leaflet.LFeatureGroup)
Vue.component('l-geo-json', Vue2Leaflet.LGeoJson)
Vue.component('l-icon', Vue2Leaflet.LIcon)
Vue.component('l-icon-default', Vue2Leaflet.LIconDefault)
Vue.component('l-image-overlay', Vue2Leaflet.LImageOverlay)
Vue.component('l-layer-group', Vue2Leaflet.LLayerGroup)
Vue.component('l-map', Vue2Leaflet.LMap)
Vue.component('l-marker', Vue2Leaflet.LMarker)
Vue.component('l-polygon', Vue2Leaflet.LPolygon)
Vue.component('l-polyline', Vue2Leaflet.LPolyline)
Vue.component('l-popup', Vue2Leaflet.LPopup)
Vue.component('l-rectangle', Vue2Leaflet.LRectangle)
Vue.component('l-tile-layer', Vue2Leaflet.LTileLayer)
Vue.component('l-tooltip', Vue2Leaflet.LTooltip)
Vue.component('l-wms-tile-layer', Vue2Leaflet.LWMSTileLayer)
Vue.component('l-rotated-marker', Vue2LeafletRotatedMarker)
Vue.component('v-marker-cluster', Vue2LeafletMarkerCluster)

// Build icon assets.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.imagePath = ''
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
})

const LeafletPlugin = {
  install (Vue, options) {
    // Expose Leaflet
    Vue.prototype.$L = L
  }
}

Vue.use(LeafletPlugin)

export default async function ({ router, store }) {

}
