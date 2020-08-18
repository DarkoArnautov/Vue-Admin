<template>
  <div id="map-wrap" style="height: 100%;">
    <no-ssr>
      <div :style="`height: 100%; position: sticky; margin-left: ${showMapMenu ? '80' : '0'}px`"
           @contextmenu.prevent="$refs.menu.open">
        <l-map id="map" ref="map" :zoom="zoom" :min-zoom="minZoom" :center="center" :worldCopyJump="worldCopyJump"
               :maxBoundsViscosity="maxBoundsViscosity" :options="mapOptions">
          <l-control-zoom position="topright"/>
          <l-control-layers position="topright" ref="layerControl"/>
          <l-control-scale :imperial="true" :metric="true" position="bottomright"/>
          <l-tile-layer
              v-for="(tileProvider, index) in tileProviders.filter(function(tile) { return !tile.wms })"
              :key="'ltile'+index"
              :name="tileProvider.name"
              :url="tileProvider.url" :attribution="tileProvider.attribution"
              :visible="tileProvider.visible"
              layerType="base"></l-tile-layer>
          <l-wms-tile-layer
              v-for="(tileProvider, index) in tileProviders.filter(function(tile) { return tile.wms })"
              :key="'wmstile'+index"
              :name="tileProvider.name"
              :baseUrl="tileProvider.url"
              :layers="tileProvider.layers"
              :format="tileProvider.format"
              :visible="tileProvider.visible"
              layerType="base"></l-wms-tile-layer>
          <l-layer-group :visible="options.show_vessels">
            <v-marker-cluster ref="clusterVessels">
              <!--              <l-rotated-marker v-for="(vessel, index) in vessels" :key="index"-->
              <!--                                :lat-lng="[vessel[1], vessel[2]]"-->
              <!--                                :icon="vesselIcon(vessel[5], vessel[4])"-->
              <!--                                :rotationAngle="vessel[3]"-->
              <!--                                @click="infoDrawerShow(vessel[0], 'vessel')"-->
              <!--                                @mouseover="vesselTooltip(vessel[0])"-->
              <!--                                :ref="'vessel'+vessel[0]">-->
              <!--              </l-rotated-marker>-->
            </v-marker-cluster>
          </l-layer-group>
          <l-layer-group ref="zones">
            <l-geo-json v-for="zone in zones" :key="zone.id" v-if="zone.geojson && zone.visible"
                        :geojson="zone.geojson" :options="geoJsonOptions">
            </l-geo-json>
          </l-layer-group>
          <l-layer-group ref="layerCompanies" :visible="options.show_companies"></l-layer-group>
          <l-layer-group ref="layerIndividuals" :visible="options.show_individuals"></l-layer-group>
          <l-feature-group ref="drawnItems"></l-feature-group>
        </l-map>
      </div>
      <vue-context ref="menu">
        <ul>
          <li @click="copyCoordinates">Copy coordinates</li>
          <li @click="toggleRuler">{{ rulerControl.active ? 'Clear measurement' : 'Measure distance' }}</li>
        </ul>
      </vue-context>
    </no-ssr>
    <v-navigation-drawer
        v-model="showMapMenu"
        :mini-variant.sync="mapMenuMini"
        floating
        width="280"
        mini-variant-width="80"
        hide-overlay
        stateless absolute>
      <v-list dense>
        <v-list-item @click="showMapMenu = false" v-show="showMapMenu && mapMenuMini">
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on">
                  Hide
                </v-btn>
              </template>
              <span>Hide Toolbar</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
        <v-list-item @click="">
          <v-list-item-action v-show="mapMenuMini">
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>fa-chevron-right fa-fw</v-icon>
                </v-btn>
              </template>
              <span>Expand Toolbar</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="pl-4">Map Options</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
                icon
                @click.stop="mapMenuMini = !mapMenuMini"
            >
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list class="pt-0" dense>

        <v-list-item @click="">
          <v-list-item-action>
            <v-tooltip right :disabled="!mapMenuMini">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">fa-search fa-fw</v-icon>
              </template>
              <span>Search</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-content>
            <map-search></map-search>
          </v-list-item-content>
        </v-list-item>

        <v-list-group prepend-icon="fa-tv fa-fw" no-action>
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Display</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item @click="options.grid = !options.grid" v-show="!mapMenuMini">
            <div>
              <v-switch v-model="options.grid" readonly></v-switch>
            </div>
            <v-list-item-content>
              <v-list-item-title>Grid</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="options.show_vessels = !options.show_vessels" v-show="!mapMenuMini">
            <div>
              <v-switch v-model="options.show_vessels" readonly></v-switch>
            </div>
            <v-list-item-content>
              <v-list-item-title>Vessels</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="options.show_individuals = !options.show_individuals" v-show="!mapMenuMini">
            <div>
              <v-switch v-model="options.show_individuals" readonly></v-switch>
            </div>
            <v-list-item-content>
              <v-list-item-title>Individuals</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="options.show_companies = !options.show_companies" v-show="!mapMenuMini">
            <div>
              <v-switch v-model="options.show_companies" readonly></v-switch>
            </div>
            <v-list-item-content>
              <v-list-item-title>Companies</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="options.map_grouping = !options.map_grouping" v-show="!mapMenuMini">
            <div>
              <v-switch v-model="options.map_grouping" readonly></v-switch>
            </div>
            <v-list-item-content>
              <v-list-item-title>Grouping</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group prepend-icon="fa-map-marked-alt fa-fw" no-action>
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>OPA-90 Zones</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item v-for="zone in zones" :key="zone.id" @click="loadZone(zone)" v-show="!mapMenuMini">
            <div>
              <v-switch v-model="zone.visible" readonly></v-switch>
            </div>
            <v-list-item-content>
              <v-list-item-title>{{ zone.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group prepend-icon="fa-ship fa-fw" no-action>
          <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>Fleets</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-for="fleet in fleets" :key="fleet.id" v-show="!mapMenuMini"
                       @click.prevent="selectedFleets.indexOf(fleet.id) === -1 ? selectedFleets.push(fleet.id): selectedFleets.splice(selectedFleets.indexOf(fleet.id),1)">
            <div>
              <v-switch v-model="selectedFleets" :value="fleet.id" readonly></v-switch>
            </div>
            <v-list-item-content>
              <v-list-item-title>{{ fleet.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group prepend-icon="fa-network-wired fa-fw" no-action>
          <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>Networks</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-for="network in networks" :key="network.id" v-show="!mapMenuMini"
                       @click.prevent="selectedNetworks.indexOf(network.id) === -1 ? selectedNetworks.push(network.id): selectedNetworks.splice(selectedNetworks.indexOf(network.id),1)">
            <div>
              <v-switch v-model="selectedNetworks" :value="network.id" readonly></v-switch>
            </div>
            <v-list-item-content>
              <v-list-item-title>{{ network.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group prepend-icon="fa-tools fa-fw" no-action>
          <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>SMFF Capabilities</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-show="!mapMenuMini">
            <v-list-item-content>
              <v-radio-group v-model="smffFilter.operator" row>
                <v-radio label="AND" value="and"></v-radio>
                <v-radio label="OR" value="or"></v-radio>
              </v-radio-group>
            </v-list-item-content>
          </v-list-item>
          <v-autocomplete label="SMFF Services" :items="itemsServices" v-model="smffFilter.selected"
                          item-text="name"
                          item-value="id"
                          multiple
                          dense
                          box
                          :allow-overflow="false"
                          full-width hide-details clearable v-show="!mapMenuMini">
          </v-autocomplete>
        </v-list-group>

        <v-list-group prepend-icon="fa-bookmark fa-fw" no-action disabled>
          <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>Saved Places</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group prepend-icon="fa-share-alt fa-fw" no-action>
          <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>Share/Export</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="printMap" v-show="!mapMenuMini">
            <v-list-item-content>
              <v-list-item-title>PNG Format</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="downloadKML" v-show="!mapMenuMini">
            <v-list-item-content>
              <v-list-item-title>KML Format</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-divider></v-divider>
        <v-list-item @click.stop="toggleRuler" :color="rulerControl.active ? 'red' : ''">
          <v-list-item-action>
            <v-tooltip right :disabled="!mapMenuMini">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" :color="rulerControl.active ? 'red' : ''">fas fa-ruler-horizontal fa-fw</v-icon>
              </template>
              <span>{{ rulerControl.active ? 'Clear measurement' : 'Measure distance' }}</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ rulerControl.active ? 'Clear measurement' : 'Measure distance' }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click.stop="options.draw = !options.draw" :color="options.draw ? 'red' : ''">
          <v-list-item-action>
            <v-tooltip right :disabled="!mapMenuMini">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" :color="options.draw ? 'red' : ''">fas fa-draw-polygon fa-fw</v-icon>
              </template>
              <span>Drawing Toolbox</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Drawing Toolbox</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
        v-model="infoDrawer.show"
        absolute
        temporary
        width="300"
        floating 
        touchless>
      <vessel-info-card v-if="infoDrawer.type === 'vessel'" :id="infoDrawer.id"></vessel-info-card>
      <company-info-card v-if="infoDrawer.type === 'company'" :id="infoDrawer.id"
                         :address_id="infoDrawer.addressID"></company-info-card>
      <individual-info-card v-if="infoDrawer.type === 'individual'" :id="infoDrawer.id"
                            :address_id="infoDrawer.addressID"></individual-info-card>
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" text block @click="infoDrawer.show = false" class="right">Close</v-btn>
        </template>
        Close the sidebar
      </v-tooltip>
    </v-navigation-drawer>
    <v-dialog
        v-model="loadingVessels"
        persistent
        width="300">
      <v-card
          color="primary"
          dark>
        <v-card-text>
          Loading vessels data
          <v-progress-linear
              indeterminate
              color="white"
              class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import download from 'downloadjs'
  import VueContext from '../../../components/map/vue-context'
  import {
    getPrimaryServiceIcon,
    getVesselIcon,
    numberFormatter,
    prettyDate,
    toDMS,
    validateAISStatusID
  } from '../../../utils/map/helpers'
  import { tiles } from '../../../utils/map/tiles'
  import vesselInfoCard from '../../../components/map/info_cards/vesselInfoCard'
  import companyInfoCard from '../../../components/map/info_cards/companyInfoCard'
  import individualInfoCard from '../../../components/map/info_cards/individualInfoCard'
  import search from '../../../components/map/search'
  import { getItemsServices } from '../../../utils/smff/itemsServices'

  export default {
    name: 'indexMap',
    layout: 'home',
    head () {
      return {
        meta: [
          {
            hid: 'viewport',
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
          }
        ]
      }
    },
    components: {
      VueContext,
      vesselInfoCard,
      companyInfoCard,
      individualInfoCard,
      'map-search': search
    },
    data () {
      return {
        map: null,
        L: null,
        center: [47.413220, -1.219482],
        zoom: 3,
        minZoom: 3,
        worldCopyJump: true,
        maxBoundsViscosity: 0.0,
        mapOptions: {
          attributionControl: false,
          zoomControl: false,
          updateWhenZooming: false,
          updateWhenIdle: false,
          touchZoom: true
        },
        x: null,
        y: null,
        tileProviders: tiles,
        updateInterval: null,
        showMapMenu: false,
        mapMenuMini: true,
        infoDrawer: {
          show: false,
          id: null,
          type: null,
          addressID: null
        },
        options: {
          grid: false,
          show_vessels: true,
          show_individuals: true,
          show_companies: true,
          wind: false,
          waves: false,
          draw: false,
          map_grouping: true
        },
        latLonGrid: null,
        windLayer: null,
        waveLayer: null,
        zones: null,
        fleets: null,
        networks: null,
        selectedFleets: [],
        selectedNetworks: [],
        vessels: {},
        companies: [],
        individuals: [],
        icons: {},
        addressRenderer: null,
        loadingVessels: false,
        itemsServices: getItemsServices().filter(function (item) {
          return item.db === 1
        }),
        smffFilter: {
          operator: 'and',
          selected: []
        },
        rulerControl: {
          mapObject: null,
          active: false
        },
        drawControl: null,
        drawnItems: null,
        layerControl: null,
        easyPrint: null,
        clusterCompaniesIndividuals: null,
        ciLayer: null
      }
    },
    computed: {
      geoJsonOptions () {
        return {
          onEachFeature: function (feature, layer) {
            if (feature.properties.ZoneName) {
              layer.bindPopup(
                '<div><b>Zone:</b> ' + feature.properties.ZoneName +
                '</div><div><b>Area:</b> ' + feature.properties.AreaName + '</div>' +
                '</div><div><b>Office:</b> ' + feature.properties.Office + '</div>' +
                '</div><div><b>Address:</b> ' + feature.properties.Address + '</div>' +
                '</div><div><b>Enforcemnt:</b> ' + feature.properties.Enforcemnt + '</div>' +
                '</div><div><b>Primary:</b> ' + feature.properties.Primary + '</div>' +
                '</div><div><b>Response:</b> ' + feature.properties.Response + '</div>' +
                '</div><div><b>Prevention:</b> ' + feature.properties.Prevention + '</div>', {
                  permanent: false,
                  sticky: true,
                  className: 'address-popup'
                })
            }
          }
        }
      },
      selectedFleetsLength () {
        return this.selectedFleets.length
      },
      selectedNetworksLength () {
        return this.selectedNetworks.length
      },
      selectedSMFFLength () {
        return this.smffFilter.selected.length
      }
    },
    watch: {
      showMapMenu () {
        if (!this.showMapMenu) {
          this.$store.dispatch('map/showMapMenu', false)
        }
      },
      selectedFleetsLength () {
        console.log('FLEETS filter applied')
        this.renderVessels(1)
      },
      selectedNetworksLength () {
        console.log('NETWORKS filter applied')
        this.renderVessels(1)
        this.renderCompanies()
        this.renderIndividuals()
      },
      'smffFilter.operator' () {
        console.log('SMFF filter for operator applied')
        // console.log(this.smffFilter)
        this.renderVessels(1)
        this.renderCompanies()
        this.renderIndividuals()
      },
      'selectedSMFFLength' () {
        console.log('SMFF filter for selected fleets applied')
        this.renderVessels(1)
        this.renderCompanies()
        this.renderIndividuals()
      },
      'options.grid' () {
        console.log('GRID Watcher Activated')
        this.options.grid ? this.latLonGrid.addTo(this.map) : this.map.removeLayer(this.latLonGrid)
      },
      'options.wind' () {
        console.log('WIND Watcher Activated')
        this.renderWind()
      },
      'options.waves' () {
        console.log('WAVES Watcher Activated')
        this.renderWaves()
      },
      'options.draw' () {
        console.log('DRAW Watcher Activated')
        this.options.draw ? this.map.addControl(this.drawControl) : this.map.removeControl(this.drawControl)
        if (this.options.draw) {
          this.mapMenuMini = true
        }
      },
      'options.map_grouping' () {
        console.log('Cluster Toggle')
        if (this.options.map_grouping) {
          this.clusterCompaniesIndividuals.checkIn(this.$refs.layerCompanies.mapObject)
          this.clusterCompaniesIndividuals.checkIn(this.$refs.layerIndividuals.mapObject)
        } else {
          this.clusterCompaniesIndividuals.checkOut(this.$refs.layerCompanies.mapObject)
          this.clusterCompaniesIndividuals.checkOut(this.$refs.layerIndividuals.mapObject)
        }
        if (this.options.show_companies) {
          this.$refs.layerCompanies.mapObject.addTo(this.map)
        }
        if (this.options.show_individuals) {
          this.$refs.layerIndividuals.mapObject.addTo(this.map)
        }
        this.renderVessels(1)
      }
    },
    methods: {
      makeIcons () {
        this.icons = {
          selected: this.$L.divIcon({
            className: 'selected-vessel',
            iconSize: [16, 16]
          }),
          hovered: this.$L.divIcon({
            className: 'hovered-vessel',
            iconSize: [16, 16]
          })
        }
      },
      copyCoordinates () {
        let vm = this
        this.$copyText(vm.x + ', ' + vm.y).then(function (e) {
          vm.$store.dispatch('notification/message', {
            message: 'Coordinates copied',
            color: 'rgba(30, 43, 81, 0.71)'
          })
        }, function (e) {
          vm.$store.dispatch('notification/message', {
            message: 'Can not copy',
            color: 'rgba(30, 43, 81, 0.71)'
          })
        })
      },
      toggleRuler () {
        if (!this.rulerControl.active) {
          this.$store.dispatch('notification/message', {
            message: 'Click on the map to trace a path you want to measure',
            color: 'rgba(30, 43, 81, 0.71)'
          })
          this.rulerControl.mapObject.addTo(this.map)
        } else {
          this.map.removeControl(this.rulerControl.mapObject)
        }
        this.rulerControl.active = !this.rulerControl.active
      },
      renderLatLonGrid () {
        let options = {
          interval: 20,
          showOriginLabel: true,
          redraw: 'move',
          zoomIntervals: [
            { start: 2, end: 3, interval: 20 },
            { start: 4, end: 4, interval: 10 },
            { start: 5, end: 7, interval: 5 },
            { start: 8, end: 10, interval: 1 }
          ]
        }
        this.latLonGrid = this.$L.simpleGraticule(options)
      },
      renderWind () {
        let vm = this
        if (vm.windLayer) {
          this.map.removeLayer(vm.windLayer)
        }
        if (vm.options.wind) {
          fetch('/storage/wind-global.json')
            .then(r => r.json())
            .then(json => {
              vm.windLayer = vm.L.velocityLayer({
                displayValues: true,
                displayOptions: {
                  velocityType: 'Wind',
                  emptyString: 'No wind data',
                  displayEmptyString: 'No wind data',
                  angleConvention: 'bearingCW',
                  speedUnit: 'kt'
                },
                data: json
              })
              if (vm.windLayer) {
                vm.windLayer.addTo(vm.map)
              }
            })
        }
      },
      renderWaves () {
        let vm = this
        if (vm.waveLayer) {
          this.map.removeLayer(vm.waveLayer)
        }
        if (vm.options.waves) {
          fetch('/storage/wave-global.json')
            .then(r => r.json())
            .then(json => {
              vm.waveLayer = vm.L.velocityLayer({
                displayValues: true,
                displayOptions: {
                  velocityType: 'Wave',
                  emptyString: 'No wave data',
                  displayEmptyString: 'No wave data',
                  angleConvention: 'bearingCW',
                  speedUnit: 'kt'
                },
                data: json
              })
              if (vm.waveLayer) {
                vm.waveLayer.addTo(vm.map)
              }
            })
        }
      },
      getFleets () {
        let vm = this
        axios.get('/map/fleets')
          .then(function (response) {
            vm.fleets = response.data
          })
      },
      getNetworks () {
        let vm = this
        axios.get('/map/networks')
          .then(function (response) {
            vm.networks = response.data
          })
      },
      loadZone (zone) {
        if (!zone.geojson) {
          fetch(zone.url_geojson)
            .then(r => r.json())
            .then(json => {
              zone.geojson = json
              zone.visible = !zone.visible
            })
        } else {
          zone.visible = !zone.visible
        }
      },
      renderZones () {
        let vm = this
        axios.get('/map/zones')
          .then(response => {
            vm.zones = response.data.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      renderVessels (hard = 0) {
        let vm = this
        let filters = {
          'fleets': this.selectedFleets,
          'networks': this.selectedNetworks,
          'smff_selected': this.smffFilter.selected,
          'smff_operator': this.smffFilter.operator
        }
        if (!this.loadingVessels) {
          if (hard) {
            this.loadingVessels = true
            axios.get('/map/vessels/' + JSON.stringify(filters))
              .then(response => {
                vm.vessels = response.data
                vm.$refs.clusterVessels.mapObject.clearLayers()
                vm.ciLayer.clearLayers()
                if (vm.options.map_grouping) {
                  for (let i = 0; i < vm.vessels.length; i++) {
                    let marker = vm.L.marker([vm.vessels[i][1], vm.vessels[i][2]], {
                      icon: vm.vesselIcon(vm.vessels[i][5], vm.vessels[i][4]),
                      rotationAngle: vm.vessels[i][3]
                    }).addTo(vm.$refs.clusterVessels.mapObject).on('click', function (e) {
                      vm.infoDrawerShow(vm.vessels[i][0], 'vessel')
                    }).on('mouseover', function (e) {
                      if (marker.getTooltip() === undefined) {
                        axios.get('/map/vessels/tooltip/' + vm.vessels[i])
                          .then(response => {
                            let data = response.data
                            let today = new Date()
                            today.setMinutes(today.getMinutes() + today.getTimezoneOffset())
                            let content = `<b>${data.name} [${data.imo || '--'}]</b> / ${data.speed} knots / ${data.course}&deg;<br>AIS Status: <strong>${data.nav_status.value}</strong><br>Position received: ${prettyDate(today, new Date(data.ais_last_update))}<br>Destination: <b>${data.destination || 'Unknown'}<br>ETA: <b>${data.eta || 'Unknown'}</b>`
                            marker.bindTooltip(content, { className: 'vessel-tooltip' }).openTooltip()
                          })
                          .catch(error => {
                            console.log(error)
                          })
                      } else {
                        marker.openTooltip()
                      }
                    })
                  }
                } else {
                  for (let i = 0; i < vm.vessels.length; i++) {
                    let marker = vm.L.marker([vm.vessels[i][1], vm.vessels[i][2]], {
                      icon: vm.vesselIcon(vm.vessels[i][5], vm.vessels[i][4]),
                      rotationAngle: vm.vessels[i][3]
                    })
                    vm.ciLayer.addMarker(marker)
                  }
                  vm.ciLayer.redraw()
                }
                vm.loadingVessels = false
              })
              .catch(error => {
                console.log(error)
              })
          } else {

          }
        }
      },
      vesselIcon (vesselType, aisStatusId) {
        return this.L.icon(getVesselIcon(vesselType, aisStatusId))
      },
      // vesselTooltip (id) {
      //   let vessel = this.$refs['vessel' + id][0].mapObject
      //   if (vessel.getTooltip() === undefined) {
      //     axios.get('/map/vessels/tooltip/' + id)
      //       .then(response => {
      //         let data = response.data
      //         let today = new Date()
      //         today.setMinutes(today.getMinutes() + today.getTimezoneOffset())
      //         let content = `<b>${data.name} [${data.imo || '--'}]</b> / ${data.speed} knots / ${data.course}&deg;<br>AIS Status: <strong>${data.nav_status.value}</strong><br>Position received: ${prettyDate(today, new Date(data.ais_last_update))}<br>Destination: <b>${data.destination || 'Unknown'}<br>ETA: <b>${data.eta || 'Unknown'}</b>`
      //         vessel.bindTooltip(content, { className: 'vessel-tooltip' }).openTooltip()
      //       })
      //       .catch(error => {
      //         console.log(error)
      //       })
      //   } else {
      //     vessel.openTooltip()
      //   }
      // },
      infoDrawerShow (id, type, addressID = null) {
        this.infoDrawer.id = id
        this.infoDrawer.type = type
        this.infoDrawer.addressID = addressID
        this.infoDrawer.show = true
      },
      renderCompanies () {
        let vm = this
        let filters = {
          'networks': this.selectedNetworks,
          'smff_selected': this.smffFilter.selected,
          'smff_operator': this.smffFilter.operator
        }
        axios.get('/map/companies/' + JSON.stringify(filters))
          .then(function (response) {
            vm.companies = response.data.data
            vm.$refs.layerCompanies.mapObject.clearLayers()
            for (let i = 0; i < vm.companies.length; i += 1) {
              vm.L.marker(vm.L.latLng(vm.companies[i].latlng), {
                renderer: vm.addressRenderer,
                icon: getPrimaryServiceIcon(vm.companies[i].primary_service)
              }).addTo(vm.$refs.layerCompanies.mapObject).bindTooltip(vm.companies[i].text, { className: 'vessel-tooltip' }).on('click', function (e) {
                vm.infoDrawerShow(vm.companies[i].company_id, 'company', vm.companies[i].id)
              })
            }
          })
      },
      renderIndividuals () {
        let vm = this
        let filters = {
          'networks': this.selectedNetworks,
          'smff_selected': this.smffFilter.selected,
          'smff_operator': this.smffFilter.operator
        }
        axios.get('/map/individuals/' + JSON.stringify(filters))
          .then(function (response) {
            vm.individuals = response.data.data
            vm.$refs.layerIndividuals.mapObject.clearLayers()
            for (let i = 0; i < vm.individuals.length; i += 1) {
              vm.L.marker(vm.L.latLng(vm.individuals[i].latlng), {
                renderer: vm.addressRenderer,
                radius: 5,
                icon: getPrimaryServiceIcon(vm.individuals[i].primary_service)
              }).addTo(vm.$refs.layerIndividuals.mapObject).bindTooltip(vm.individuals[i].text, { className: 'vessel-tooltip' }).on('click', function (e) {
                vm.infoDrawerShow(vm.individuals[i].user_id, 'individual', vm.individuals[i].id)
              })
            }
          })
      },
      renderControls () {
        let vm = this
        // Fullscreen
        this.map.addControl(new this.L.Control.Fullscreen())
        // Controls
        let controls = [
          this.L.easyButton({
            states: [{
              stateName: 'activate-wind',
              icon: '<i class="fas fa-wind"></i>',
              title: 'Show Wind',
              onClick: function (btn, map) {
                vm.options.wind = true
                btn.state('deactivate-wind')
              }
            }, {
              stateName: 'deactivate-wind',
              icon: '<i class="fas fa-wind" style="color: #ff920b;"></i>',
              title: 'Hide Wind',
              onClick: function (btn, map) {
                vm.options.wind = false
                btn.state('activate-wind')
              }
            }],
            position: 'topright'
          }),
          this.L.easyButton({
            states: [{
              stateName: 'activate-wave',
              icon: '<i class="fas fa-water"></i>',
              title: 'Show Waves',
              onClick: function (btn, map) {
                vm.options.waves = true
                btn.state('deactivate-wave')
              }
            }, {
              stateName: 'deactivate-wave',
              icon: '<i class="fas fa-water" style="color: #ff920b;"></i>',
              title: 'Hide Waves',
              onClick: function (btn, map) {
                vm.options.waves = false
                btn.state('activate-wave')
              }
            }],
            position: 'topright'
          }),
          this.L.easyButton('fa-temperature-low', function (btn, map) {
          }).disable(),
          this.L.easyButton('fa-tint', function (btn, map) {
          }).disable(),
          this.L.easyButton('fa-cloud-sun-rain', function (btn, map) {
          }).disable(),
          this.L.easyButton('fa-bolt', function (btn, map) {
          }).disable(),
          this.L.easyButton('fa-chevron-left', function (btn, map) {
          }).disable()
        ]
        this.L.easyBar(controls, { position: 'topright' }).addTo(this.map)
        // ruler
        this.rulerControl.mapObject = this.L.control.ruler()
        // draw
        this.drawControl = new this.L.Control.Draw({
          position: 'topleft',
          edit: {
            featureGroup: this.drawnItems,
            poly: {
              allowIntersection: false
            },
            remove: true
          },
          draw: {
            polyline: {
              metric: false,
              feet: false,
              nautic: true
            },
            polygon: {
              allowIntersection: false,
              showArea: true
            },
            circle: {
              metric: false,
              feet: false,
              nautic: true
            }
          }
        })
        this.layerControl.addOverlay(this.drawnItems, 'Drawn Items')
        // easyPrint
        this.easyPrint = this.L.easyPrint({
          title: 'Print map',
          position: 'topright',
          sizeModes: ['A4Landscape', 'A4Portrait'],
          filename: 'CDT_Map',
          exportOnly: true,
          hideControlContainer: true,
          hidden: true
        }).addTo(this.map)
      },
      printMap () {
        this.easyPrint.printMap('A4Landscape', 'CDT_Map_Export')
      },
      downloadKML () {
        axios.get('map/export/CDT-Earth.kml', {
          responseType: 'arraybuffer'
        })
          .then(downloadRes => {
            download(downloadRes.data, 'CDT-Earth.kml')
            this.$store.dispatch('notification/message', { message: 'Download started' })
          })
          .catch(error => {
            this.$store.dispatch('notification/message', { message: 'Can not download' })
          })
      }
    }
    ,
    created () {
      this.$store.watch(() => {
        return this.$store.state.map.showMapMenu
      }, (newValue) => {
        if (newValue) {
          this.showMapMenu = newValue
        }
      }, { deep: true })

      this.$root.$on('search_value', (searched) => {
        if (searched.type === 'location') {
          this.L.marker([searched.latitude, searched.longitude]).addTo(this.drawnItems)
        } else {
          this.infoDrawerShow(searched.id, searched.type, searched.address_id)
        }
        this.map.setView([searched.latitude, searched.longitude], 17, { animation: true })
      })
    }
    ,
    mounted () {
      let vm = this
      this.$store.dispatch('map/showMapMenu', this.showMapMenu)
      this.getFleets()
      this.getNetworks()

      this.$nextTick(() => {
        console.log('MAP LOADED...')
        this.map = this.$refs.map.mapObject
        this.layerControl = this.$refs.layerControl.mapObject
        this.drawnItems = this.$refs.drawnItems.mapObject
        this.L = this.$L
        this.map.setMaxBounds([[-90, -180], [90, 180]])
        this.addressRenderer = this.$L.canvas({ padding: 0.5 })
        this.ciLayer = this.$L.canvasIconLayer()
        this.ciLayer.addTo(this.map)
        this.makeIcons()
        this.renderLatLonGrid()
        this.renderZones()
        this.renderVessels(1)
        this.clusterCompaniesIndividuals = this.$L.markerClusterGroup.layerSupport()
        this.clusterCompaniesIndividuals.addLayer(vm.$refs.layerCompanies.mapObject)
        this.clusterCompaniesIndividuals.addLayer(vm.$refs.layerIndividuals.mapObject)
        this.clusterCompaniesIndividuals.addTo(this.map)
        this.renderCompanies()
        this.renderIndividuals()
        this.renderControls()
        this.map.on('mousemove', function (event) {
          let pos = event.latlng
          if (pos) {
            pos = pos.wrap()
            vm.x = numberFormatter(pos.lat, 4, '.')
            vm.y = numberFormatter(pos.lng, 4, '.')
            let xy = toDMS(vm.x, vm.y) + '<br>(' + vm.x + ', ' + vm.y + ')'
            vm.$store.dispatch('map/coordinates', xy)
          }
        })
        this.map.on(this.L.Draw.Event.CREATED, function (event) {
          let layer = event.layer
          let type = event.layerType
          if (type === 'marker' || type === 'circlemarker') {//the marker does not have area
            vm.drawnItems.addLayer(layer)
          } else {
            layer.addTo(vm.drawnItems).showMeasurements({ imperial: true })
          }
        })
      })

      this.updateInterval = setInterval(function () {
        console.log('UPDATING LIVE DATA...')
      }.bind(this), 60000)
    }
    ,
    beforeDestroy () {
      clearInterval(this.updateInterval)
    }
  }
</script>

<style lang="scss" scoped>
  .vue2leaflet-map {
    z-index: 0 !important;
  }
</style>
