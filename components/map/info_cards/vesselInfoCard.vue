<template>
  <div v-if="vessel">
    <v-card flat>
      <v-img
          :src="vessel.photo"
          lazy-src="/images/DJS-16-9.png"
          height="130px"
      >
      </v-img>
      <v-card-title>
        <div class="headline">{{ vessel.name }}</div>
        <div>
          <span class="grey--text">{{ vessel.type }}</span><br>
          <div>
            <v-icon small>location_on</v-icon>
            <span class="grey--text" v-html="toDMSForm(vessel.latitude, vessel.longitude)"></span>
          </div>
          <div>
            <v-icon small>crop_free</v-icon>
            <span class="grey--text">{{ vessel.zone_name }}</span>
          </div>
          <div>
            <v-icon small>directions_boat</v-icon>
            <span class="grey--text">{{ vessel.ais_status }}</span>
          </div>
          <div v-for="fleet in vessel.fleets">
            <div>
              <v-icon small>attachment</v-icon>
              <span class="grey--text"> {{ fleet }}</span>
            </div>
          </div>
        </div>
      </v-card-title>

      <v-divider inset></v-divider>

      <v-list dense>
        <v-tooltip right>
          <v-list-item @click="copyInfo('IMO', vessel.imo)" slot="activator">
            <v-list-item-action>
              <v-icon color="primary">fingerprint</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ vessel.imo }}</v-list-item-title>
              <v-list-item-sub-title>IMO Number</v-list-item-sub-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon>file_copy</v-icon>
            </v-list-item-action>
          </v-list-item>
          Click to copy
        </v-tooltip>

        <v-tooltip right>
          <v-list-item @click="copyInfo('MMSI', vessel.mmsi)" slot="activator">
            <v-list-item-action>
              <v-icon color="primary">settings_input_antenna</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ vessel.mmsi }}</v-list-item-title>
              <v-list-item-sub-title>MMSI Number</v-list-item-sub-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon>file_copy</v-icon>
            </v-list-item-action>
          </v-list-item>
          Click to copy
        </v-tooltip>

        <v-divider inset></v-divider>

        <v-tooltip right>
          <v-list-item @click="copyInfo('Coordinates', vessel.latitude + ', ' + vessel.longitude)" slot="activator">
            <v-list-item-action>
              <v-icon color="primary">fas fa-map-marked-alt</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>Latitude: {{ vessel.latitude }}&deg;</v-list-item-title>
              <v-list-item-title>Longitude: {{ vessel.longitude }}&deg;</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon>file_copy</v-icon>
            </v-list-item-action>
          </v-list-item>
          Click to copy
        </v-tooltip>

        <div v-show="infoFull">
          <v-tooltip right>
            <v-list-item @click="copyInfo('Destination', vessel.destination)" slot="activator">
              <v-list-item-action>
                <v-icon color="primary">arrow_right_alt</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ vessel.destination }}</v-list-item-title>
                <v-list-item-sub-title>Destination</v-list-item-sub-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>file_copy</v-icon>
              </v-list-item-action>
            </v-list-item>
            Click to copy
          </v-tooltip>

          <v-tooltip right>
            <v-list-item @click="copyInfo('ETA', vessel.eta)" slot="activator">
              <v-list-item-action>
                <v-icon color="primary">access_time</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ vessel.eta }}</v-list-item-title>
                <v-list-item-sub-title>ETA</v-list-item-sub-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>file_copy</v-icon>
              </v-list-item-action>
            </v-list-item>
            Click to copy
          </v-tooltip>

          <v-tooltip right>
            <v-list-item @click="copyInfo('Last AIS', prettyDateForm(vessel.ais_last_update))" slot="activator">
              <v-list-item-action>
                <v-icon color="primary">update</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ prettyDateForm(vessel.ais_last_update) }}</v-list-item-title>
                <v-list-item-sub-title>Position received</v-list-item-sub-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>file_copy</v-icon>
              </v-list-item-action>
            </v-list-item>
            Click to copy
          </v-tooltip>
          <v-divider inset></v-divider>

          <v-tooltip right>
            <v-list-item @click="copyInfo('Speed', vessel.speed)" slot="activator">
              <v-list-item-action>
                <v-icon color="primary">fas fa-tachometer-alt</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ vessel.speed }} Knots</v-list-item-title>
                <v-list-item-sub-title>Speed</v-list-item-sub-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>file_copy</v-icon>
              </v-list-item-action>
            </v-list-item>
            Click to copy
          </v-tooltip>

          <v-tooltip right>
            <v-list-item @click="copyInfo('Heading', vessel.heading)" slot="activator">
              <v-list-item-action>
                <v-icon color="primary">explore</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ vessel.heading }}&deg;</v-list-item-title>
                <v-list-item-sub-title>Heading</v-list-item-sub-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>file_copy</v-icon>
              </v-list-item-action>
            </v-list-item>
            Click to copy
          </v-tooltip>

          <v-tooltip right>
            <v-list-item @click="copyInfo('Course', vessel.course)" slot="activator">
              <v-list-item-action>
                <v-icon color="primary">show_chart</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ vessel.course }}&deg;</v-list-item-title>
                <v-list-item-sub-title>Course</v-list-item-sub-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>file_copy</v-icon>
              </v-list-item-action>
            </v-list-item>
            Click to copy
          </v-tooltip>

          <v-divider inset></v-divider>
          <v-tooltip right>
            <v-list-item @click="copyInfo('Tonnage', vessel.dead_weight)" slot="activator">
              <v-list-item-action>
                <v-icon color="primary">gradient</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ vessel.dead_weight }}</v-list-item-title>
                <v-list-item-sub-title>Tonnage</v-list-item-sub-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>file_copy</v-icon>
              </v-list-item-action>
            </v-list-item>
            Click to copy
          </v-tooltip>
        </div>
      </v-list>

      <div v-show="vessel.network_codes.includes('opa_90')">
        <v-divider></v-divider>
        <v-btn @click="smffInfo = true" block text>OPA-90 Network Information</v-btn>
      </div>

      <div v-show="vessel.network_codes.includes('ns') || vessel.network_codes.includes('npnc')">
        <v-divider></v-divider>
        <v-btn @click="nasaInfo = true; smffInfo = true" large block text
               style="font-family: nasamedium; font-size: 32px">NASA
        </v-btn>
      </div>

      <v-divider></v-divider>
      <v-tooltip top>
        <v-btn slot="activator" @click="infoFull = !infoFull" block text>
          <v-icon>{{ infoFull ? 'unfold_less' : 'more_horiz' }}</v-icon>
        </v-btn>
        {{ infoFull ? 'Show Less' : 'Show More' }}
      </v-tooltip>
      <v-divider></v-divider>
    </v-card>
    <v-dialog v-model="smffInfo" max-width="350px">
      <v-card>
        <v-card-title>
          <v-btn v-if="nasaInfo" text block large style="font-family: nasamedium; font-size: 32px; margin: 0">NASA
          </v-btn>
          <v-btn v-else text block large style="font-size: 32px; margin: 0">OPA-90</v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <span class="grey--text">SMFF Capabilities Listed</span><br>
          <smff-services :id="vessel.smff_service_id" type="vessels" :type_id="vessel.id"></smff-services>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text small @click="smffInfo = false; nasaInfo = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import { prettyDate, toDMS } from '../../../utils/map/helpers'
  import smffServices from './smffServices'

  export default {
    name: 'vesselInfoCard',
    components: {
      smffServices
    },
    props: ['id'],
    data () {
      return {
        infoFull: false,
        vessel: null,
        nasaInfo: false,
        smffInfo: false,
        noImagePhoto: '/images/no-image-other.png'
      }
    },
    methods: {
      getVesselData () {
        axios.get('/map/vessel/' + this.id)
          .then(res => {
            if (!res.data.data.photo) {
              res.data.data.photo = this.noImagePhoto
            }
            this.vessel = res.data.data
          })
      },

      toDMSForm (lat, lon) {
        return toDMS(lat, lon)
      },

      prettyDateForm (lastUpdate) {
        let today = new Date()
        today.setMinutes(today.getMinutes() + today.getTimezoneOffset())
        return prettyDate(today, new Date(lastUpdate))
      },

      copyInfo (name, value) {
        let vm = this
        this.$copyText(value).then(function (e) {
          vm.$store.dispatch('notification/message', name + ' copied.')
        }, function (e) {
          vm.$store.dispatch('notification/message', 'Can not copy.')
        })
      }
    },
    watch: {
      id () {
        this.getVesselData()
      }
    },
    mounted () {
      this.getVesselData()
    }
  }
</script>

<style scoped>
  @import "../../../assets/fonts/nasa/stylesheet.css";
</style>
