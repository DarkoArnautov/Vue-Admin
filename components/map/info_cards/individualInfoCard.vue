<template>
  <div v-if="user">
    <v-card flat>
      <v-img
          :src="user.photo"
          lazy-src="/images/DJS-16-9.png"
          height="130px"
      >
      </v-img>
      <v-card-title>
        <div class="headline">{{ user.first_name + ' ' + user.last_name }}</div>
        <div>
          <div v-if="address">
            <v-icon small>location_on</v-icon>
            <span class="grey--text" v-html="toDMSForm(address.latitude, address.longitude)"></span>
          </div>
          <div v-if="address">
            <v-icon small>crop_free</v-icon>
            <span class="grey--text">{{ address.zone_name }}</span>
          </div>
          <div v-for="network in user.networks">
            <div>
              <v-icon small>attachment</v-icon>
              <span class="grey--text"> {{ network }}</span>
            </div>
          </div>
        </div>
      </v-card-title>
      <div v-show="user.description">
        <v-divider></v-divider>
        <v-card flat>
          <v-card-title style="padding-bottom: 5px; padding-top: 5px" class="title">About {{ user.name }}
          </v-card-title>
          <v-divider inset></v-divider>
          <v-card-text style="padding-top: 3px; padding-bottom: 3px">
            {{ user.description }}
          </v-card-text>
        </v-card>
      </div>
      <v-divider inset></v-divider>
      <v-list dense two-line>
        <v-tooltip right>
          <v-list-item @click="copyInfo('Phone', user.mobile_number)" slot="activator">
            <v-list-item-action>
              <v-icon color="primary">fas fa-phone</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ user.mobile_number }}</v-list-item-title>
              <v-list-item-sub-title>Phone</v-list-item-sub-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon>file_copy</v-icon>
            </v-list-item-action>
          </v-list-item>
          Click to copy
        </v-tooltip>
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

        <v-tooltip right v-if="user.resume_link">
          <v-list-item @click="copyInfo('Resume Link', user.resume_link)" slot="activator">
            <v-list-item-action>
              <v-icon color="primary">fas fa-globe</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ user.resume_link }}</v-list-item-title>
              <v-list-item-sub-title>Resume Link</v-list-item-sub-title>
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
        <v-btn block text @click="pocInfo = true" :disabled="!user.company">Company POC</v-btn>
        <v-divider></v-divider>
        <v-list dense>
          <v-tooltip right v-if="user.email">
            <v-list-item @click="copyInfo('Individual E-mail', user.email)" slot="activator">
              <v-list-item-action>
                <v-icon color="primary">fas fa-envelope</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ user.email }}</v-list-item-title>
                <v-list-item-sub-title>E-mail</v-list-item-sub-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>file_copy</v-icon>
              </v-list-item-action>
            </v-list-item>
            Click to copy
          </v-tooltip>
        </v-list>
      </div>
      <div v-show="user.smff_service_id">
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
          <v-btn v-if="user.network_codes.includes('ns') || user.network_codes.includes('npnc')" text block large
                 style="font-family: nasamedium; font-size: 32px; margin: 0">NASA
          </v-btn>
          <span v-else
                style="font-size: 32px; margin: 0; text-align: center">{{user.first_name + ' ' + user.last_name}}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <span class="grey--text">SMFF Capabilities Listed</span><br>
          <smff-services :id="user.smff_service_id" type="individuals" :type_id="user.id"></smff-services>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text small @click="smffInfo = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="pocInfo" max-width="350px" v-if="user && user.company">
      <v-card>
        <v-card-title>
          <span style="font-size: 32px; margin: 0; text-align: center">{{user.company.name}}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <span class="grey--text">Point of Contact</span><br>
          <ul v-if="user.company.company_p_o_c">
            <li>First Name: {{ user.company.company_p_o_c.first_name }}</li>
            <li>Last Name: {{ user.company.company_p_o_c.last_name }}</li>
            <li>E-mail: {{ user.company.company_p_o_c.email }}</li>
            <li v-if="user.company.company_p_o_c.home_number">Home Number: {{ company.company_p_o_c.home_number }}</li>
            <li v-if="user.company.company_p_o_c.mobile_number">Mobile Number: {{ company.company_p_o_c.mobile_number
              }}
            </li>
          </ul>
          <v-alert v-else :value="true" type="info">No POC specified.</v-alert>
          <v-btn block small text class="error" nuxt :to="`/home/companies/view/${user.company.id}`" target="_blank">
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
    name: 'individualInfoCard',
    components: {
      smffServices
    },
    props: ['id', 'address_id'],
    data () {
      return {
        infoFull: false,
        user: null,
        address: null,
        smffInfo: false,
        pocInfo: false,
        noImagePhoto: '/images/no-image-individual.png'
      }
    },
    methods: {
      getData () {
        axios.get('/map/user/' + this.id)
          .then(res => {
            if (!res.data.data.photo) {
              res.data.data.photo = this.noImagePhoto
            }
            this.user = res.data.data
            this.getAddressData()
          })
      },

      getAddressData () {
        axios.get('/map/user/address/' + this.address_id)
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
