<template>
  <q-page class="flex">
    <div class="full-width"
    v-if="market && sellerDetails">
      <doc-header
      icon="storefront"
      :breadcrumbList="breadcrumbList">
        Dein Einkauf bei {{sellerDetails.name}}
      </doc-header>
        <div class="q-px-md">
          <q-stepper
            v-model="step"
            ref="stepper"
            class="q-pa-sm"
            color="primary"
            animated
            flat
            header-nav
            :contracted="$q.screen.lt.md">
            <q-step
              :name="1"
              title="Stelle deine Anfrage zusammen"
              icon="settings"
              :done="step > 1"
              :header-nav="step > 1">
            <h2
            v-if="step === 1"
            class="q-my-none q-px-sm">
              Welche Produkte möchtest du bei {{sellerDetails.name}} anfragen?
            </h2>
              <q-separator />
            <seller-desc
              :sellerDetails="sellerDetails"
              :reservationAllowed="reservationAllowed"
              class="q-px-sm">
            </seller-desc>
            <step-fill-basked
              :groups="sellerDetails.portfolio"
              :reservationAllowed="reservationAllowed"
              :newReservation="newReservation"
              :sellerName="sellerDetails.name"
            >
            </step-fill-basked>
            </q-step>
            <q-step
              :name="2"
              title="Wähle einen Abholzeitpunkt"
              icon="schedule"
              :done="step > 2"
              :header-nav="step > 2"
            >
              <h2
              v-if="step === 2"
              class="q-my-none q-px-sm">
                Wann möchtest du deine Produkte am
                {{market.dayOfWeek | getWeekdayStr}} abholen?
              </h2>
              <q-separator />
              <step-select-timeslot
                :timeslot="newReservation.timeslot"
                :marketID="$route.params.marketID"
                :sellerID="$route.params.sellerID"
                v-on:selectTimeslot="selectTimeslot">
              </step-select-timeslot>
            </q-step>

            <q-step
              :name="3"
              title="Kontaktdaten"
              icon="assignment"
              :header-nav="step > 3"
            >
              <h2
              v-if="step === 3"
              class="q-my-none q-px-sm">
                Sind folgende Angaben korrekt?
              </h2>
              <q-separator />
              <step-confirm-reservation
                ref="stepconfirmreservation"
                :items="newReservation.items"
                :timeslot="newReservation.timeslot"
                :sellerDetails="sellerDetails"
                :market="market"
                :user="newReservation.user">
              </step-confirm-reservation>
            </q-step>

            <template v-slot:navigation>
              <q-stepper-navigation class="row">
                <div class="col-12 col-6-md">
                  <q-btn @click="showBasket = true" flat v-if="step === 1 && reservationAllowed" icon="shopping_basket" label="Dein Warenkorb" color="primary">
                    <q-badge color="secondary" floating>{{newReservation.items.length}}</q-badge>
                  </q-btn>
                </div>
                <div class="col-12 col-6-md" align="right">
                  <q-btn
                    flat
                    v-if="step > 1"
                    color="primary"
                    @click="$refs.stepper.previous()"
                    label="Zurück" />
                  <q-btn
                    :disabled="!reservationAllowed"
                    @click="validateAndNext"
                    color="primary"
                    :label="step === 3 ? 'Anfragen' : 'Weiter'" />
                </div>
              </q-stepper-navigation>
            </template>
          </q-stepper>
          <q-dialog v-model="showBasket">
            <basket-overview :items="newReservation.items" />
          </q-dialog>
        </div>
      </div>
  </q-page>
</template>
<style scoped>
.q-stepper__step >>> .q-stepper__step-inner {
  padding-top: 0px !important
}
</style>

<script>
import sellerDesc from 'components/customer/Reservate/sellerDesc'

import basketOverview from 'components/customer/Reservate/step1FillBasketBasketOverview'
import stepFillBasked from 'components/customer/Reservate/step1FillBasket'
import stepSelectTimeslot from 'components/customer/Reservate/step2SelectTimeslot'
import stepConfirmReservation from 'components/customer/Reservate/step3ConfirmReservation'

export default {
  name: 'PageIndex',
  components: {
    sellerDesc,
    stepFillBasked,
    stepSelectTimeslot,
    stepConfirmReservation,
    basketOverview
  },
  data  () {
    return {
      step: 1,
      sellerDetails: null,
      market: null,
      newReservation: {
        items: [],
        timeslot: {
          timestampUTC: null,
          reservationCount: null
        },
        user: {
          firstname: '',
          lastname: '',
          phone: '',
          rememberMe: false,
          rulesAccepted: false
        }
      },
      showBasket: false
    }
  },
  computed: {
    headerCaption: function () {
      const dayOfWeek = this.$options.filters.getWeekdayStr(this.market.dayOfWeek)
      const date = this.$options.filters.getFormatedDate(this.market.next, 'DD.MM')
      return `${this.market.name} -  ${dayOfWeek}, ${date} ${this.market.startTime} bis ${this.market.endTime}`
    },
    breadcrumbList: function () {
      return [
        { label: this.market ? this.market.name : '', icon: 'place', to: `/market/${this.market.id}` },
        { label: this.sellerDetails ? this.sellerDetails.name : '', icon: 'storefront', to: '' }]
    },
    reservationAllowed: function () {
      return !this.$auth.loading &&
        this.$auth.isAuthenticated &&
        this.$auth.user.email_verified &&
        this.sellerDetails &&
        this.sellerDetails.reservationPossible
    }
  },
  watch: {
    '$store.state.auth.loading': function () {
      this.fillOutUserDetails()
    }
  },
  methods: {
    validateAndNext: function () {
      if (this.step === 1) {
        // At least one product in the baseket
        if (this.newReservation.items.length === 0) {
          this.$q.notify({
            type: 'negative',
            message: 'Bitte lege mindestens ein Produkt in deinen Warenkorb'
          })
          return
        }
        // Set the timeslot
        return this.$refs.stepper.next()
      } else if (this.step === 2) {
        // Timeslot has to be selected
        if (!this.newReservation.timeslot.timestampUTC) {
          this.$q.notify({
            type: 'negative',
            message: 'Bitte wähle den gewünschten Abholzeitpunkt.'
          })
          return
        }
        return this.$refs.stepper.next()
      }
      // Last step
      if (this.$refs.stepconfirmreservation.validate()) {
        // Send order
        this.sendOrder()
      }
    },
    // Get the selected seller via REST API
    getMarketSellerDetails: async function (sellerID, marketID) {
      try {
        const marketProm = this.$axios.get(`/api/market/${marketID}`)
        const sellerDetailsProm = this.$axios.get(`/api/market/${marketID}/seller/${sellerID}`)
        const response = await Promise.all([marketProm, sellerDetailsProm])
        // Parse Portfolio field
        response[1].data.data.portfolio = JSON.parse(response[1].data.data.portfolio)
        this.market = response[0].data.data
        this.sellerDetails = response[1].data.data
      } catch (error) {
        console.error(error)
        this.$router.push({ name: 'errorPage' })
      }
    },
    selectTimeslot: function (timeslot) {
      this.newReservation.timeslot.timestampUTC = timeslot.timestampUTC
      this.newReservation.timeslot.reservationCount = timeslot.reservationCount
    },
    // Sent reservation to api.
    sendOrder: async function () {
      try {
        // validate pickup time
        var newReservation = {
          userID: this.$auth.user.sub,
          marketID: this.market.id,
          sellerID: this.sellerDetails.id,
          pickup: this.newReservation.timeslot.timestampUTC,
          userComment: '', // Feature not implemented yet.
          items: [],
          firstName: this.newReservation.user.firstname,
          lastName: this.newReservation.user.lastname,
          phone: this.newReservation.user.phone,
          rememberMe: this.newReservation.user.rememberMe,
          rulesAccepted: this.newReservation.user.rulesAccepted
        }
        this.newReservation.items.forEach(element => {
          newReservation.items.push(element)
        })
        // sent reservation
        var response = await this.$axios.post('/api/reservation/',
          newReservation,
          this.$auth.getAxiosHeader())
        // Get new user data (may have changed)
        await this.$store.dispatch('auth/updateUserData')
        // success
        this.$q.notify({
          message: 'Bestellung wurde erfolgreich übermittelt.',
          type: 'positive'
        })
        this.$router.push(`/status/${response.data.data.id}`)
      } catch (error) {
        console.error(error)
        this.$router.push({ name: 'errorPage' })
      }
    },
    fillOutUserDetails: function () {
      if (!this.$store.state.auth.loading &&
      this.$store.state.auth.userExists &&
      this.$store.state.auth.userDetails) {
        this.newReservation.user.firstname = this.$store.state.auth.userDetails.firstname
        this.newReservation.user.lastname = this.$store.state.auth.userDetails.lastname
        this.newReservation.user.phone = this.$store.state.auth.userDetails.phone
      }
    }
  },
  mounted: function () {
    const marketID = this.$route.params.marketID
    const sellerID = this.$route.params.sellerID
    this.getMarketSellerDetails(sellerID, marketID)
    this.fillOutUserDetails()
  }
}
</script>
