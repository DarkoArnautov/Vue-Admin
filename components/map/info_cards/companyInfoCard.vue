<template>
  <div v-if="company">
    <v-card flat>
      <v-img
          :src="company.photo"
          lazy-src="/images/DJS-16-9.png"
          height="130px"
      >
      </v-img>
      <v-card-title>
        <div class="headline">{{ company.name }}</div>
        <div>
          <div v-if="address">
            <v-icon small>location_on</v-icon>
            <span class="grey--text" v-html="toDMSForm(address.latitude, address.longitude)"></span>
          </div>
          <div v-if="address">
            <v-icon small>crop_free</v-icon>
            <span class="grey--text">{{ address.zone_name }}</span>
          </div>
          <div v-for="network in company.networks">
            <div>
              <v-icon small>attachment</v-icon>
              <span class="grey--text"> {{ network }}</span>
            </div>
          </div>
        </div>
      </v-card-title>
      <div v-show="company.description">
        <v-divider></v-divider>
        <v-card flat>
          <v-card-title style="padding-bottom: 5px; padding-top: 5px" class="title">About {{ company.name }}
          </v-card-title>
          <v-divider inset></v-divider>
          <v-card-text style="padding-top: 3px; padding-bottom: 3px">
            {{ company.description }}
          </v-card-text>
        </v-card>
      </div>
      <v-divider inset></v-divider>
      <v-list dense two-line>
        <v-tooltip right v-if="address && address.phone">
          <v-list-item @click="copyInfo('Phone', address.phone)" slot="activator">
            <v-list-item-action>
              <v-icon color="primary">fas fa-phone</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ address.phone }}</v-list-item-title>
              <v-list-item-sub-title>Phone</v-list-item-sub-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon>file_copy</v-icon>
            </v-list-item-action>
          </v-list-item>
          Click to copy
        </v-tooltip>
      </v-list>
      <v-list dense three-line>
        <v-tooltip right v-if="address">
          <v-list-item
              @click="copyInfo('Address', `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`)"
              slot="activator">
            <v-list-item-action>
              <v-icon color="primary">fas fa-map-marker-alt</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              {{ `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}` }}
            </v-list-item-content>

            <v-list-item-action>
              <v-icon>file_copy</v-icon>
            </v-list-item-action>
          </v-list-item>
          Click to copy
        </v-tooltip>
      </v-list>
      <v-list dense two-line>
        <v-tooltip right v-if="company.website">
          <v-list-item @click="copyInfo('Website', company.website)" slot="activator">
            <v-list-item-action>
              <v-icon color="primary">fas fa-globe</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ company.website }}</v-list-item-title>
              <v-list-item-sub-title>Company Website</v-list-item-sub-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon>file_copy</v-icon>
            </v-list-item-action>
          </v-list-item>
          Click to copy
        </v-tooltip>
      </v-list>
      <div v-show="infoFull">
        <v-divider inset></v-divider>
        <v-list dense>
          <v-tooltip right v-if="address">
            <v-list-item @click="copyInfo('Coordinates', address.latitude + ', ' + address.longitude)"
                         slot="activator">
              <v-list-item-action>
                <v-icon color="primary">fas fa-map-marked-alt</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>Latitude: {{ address.latitude }}&deg;</v-list-item-title>
                <v-list-item-title>Longitude: {{ address.longitude }}&deg;</v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>file_copy</v-icon>
              </v-list-item-action>
            </v-list-item>
            Click to copy
          </v-tooltip>
        </v-list>
        <v-divider></v-divider>
        <v-btn block text @click="pocInfo = true">Company POC</v-btn>
        <v-divider></v-divider>
        <v-list dense>
          <v-tooltip right v-if="company.email">
            <v-list-item @click="copyInfo('Company E-mail', company.email)" slot="activator">
              <v-list-item-action>
                <v-icon color="primary">fas fa-envelope</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ company.email }}</v-list-item-title>
                <v-list-item-sub-title>Company E-mail</v-list-item-sub-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>file_copy</v-icon>
              </v-list-item-action>
            </v-list-item>
            Click to copy
          </v-tooltip>

          <v-tooltip right v-if="company.phone">
            <v-list-item @click="copyInfo('Phone', company.phone)" slot="activator">
              <v-list-item-action>
                <v-icon color="primary">fas fa-phone-square</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ company.phone }}</v-list-item-title>
                <v-list-item-sub-title>Company Phone</v-list-item-sub-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>file_copy</v-icon>
              </v-list-item-action>
            </v-list-item>
            Click to copy
          </v-tooltip>
        </v-list>
      </div>
      <div v-show="company.smff_service_id">
        <v-divider></v-divider>
        <v-btn @click="smffInfo = true" block text>SMFF Capabilities</v-btn>
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
          <v-btn v-if="company.network_codes.includes('ns') || company.network_codes.includes('npnc')" text block large
                 style="font-family: nasamedium; font-size: 32px; margin: 0">NASA
          </v-btn>
          <span v-else style="font-size: 32px; margin: 0; text-align: center">{{company.name}}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <span class="grey--text">SMFF Capabilities Listed</span><br>
          <smff-services :id="company.smff_service_id" type="companies" :type_id="company.id"></smff-services>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text small @click="smffInfo = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="pocInfo" max-width="350px">
      <v-card>
        <v-card-title>
          <span style="font-size: 32px; margin: 0; text-align: center">{{company.name}}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <span class="grey--text">Point of Contact</span><br>
          <ul v-if="company.poc">
            <li>First Name: {{ company.poc.first_name }}</li>
            <li>Last Name: {{ company.poc.last_name }}</li>
            <li>E-mail: {{ company.poc.email }}</li>
            <li v-if="company.poc.home_number">Home Number: {{ company.poc.home_number }}</li>
            <li v-if="company.poc.mobile_number">Mobile Number: {{ company.poc.mobile_number }}</li>
          </ul>
          <v-alert v-else :value="true" type="info">No POC specified.</v-alert>
          <v-btn block small text class="error" nuxt :to="`/home/companies/view/${company.id}`" target="_blank">
            Edit Company POC
          </v-btn>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text small @click="pocInfo = false">Close</v-btn>
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
    name: 'companyInfoCard',
    components: {
      smffServices
    },
    props: ['id', 'address_id'],
    data () {
      return {
        infoFull: false,
        company: null,
        address: null,
        smffInfo: false,
        pocInfo: false,
        noImagePhoto: '/images/no-image-other.png'
      }
    },
    methods: {
      getData () {
        axios.get('/map/company/' + this.id)
          .then(res => {
            if (!res.data.data.photo) {
              res.data.data.photo = this.noImagePhoto
            }
            this.company = res.data.data
            this.getAddressData()
          })
      },

      getAddressData () {
        axios.get('/map/company/address/' + this.address_id)
          .then(res => {
            this.address = res.data.data
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
        this.getData()
      },
      address_id () {
        this.getAddressData()
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>

<style scoped>
  @import "../../../assets/fonts/nasa/stylesheet.css";
</style>
