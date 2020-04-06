<template>
  <q-page class="flex">
    <div class="full-width"
    v-if="market && sellerDetails">
      <doc-header
      :caption="headerCaption"
      icon="storefront"
      :breadcrumbList="breadcrumbList">
        {{sellerDetails.name}}
      </doc-header>
        <seller-desc
          :sellerDetails="sellerDetails"
          :reservationAllowed="reservationAllowed">
        </seller-desc>
        <q-separator />
        <q-stepper
          v-model="step"
          ref="stepper"
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
          <step-fill-basked
            :groups="sellerDetails.portfolio"
            :reservationAllowed="reservationAllowed"
            :newReservation="newReservation"
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
            <step-select-timeslot
              :timeslot="newReservation.timeslot"
              :marketID="$route.params.marketID"
              :sellerID="$route.params.sellerID"
              v-on:selectTimeslot="selectTimeslot">
            </step-select-timeslot>
          </q-step>

          <q-step
            :name="3"
            title="Bestätigung"
            icon="assignment"
            :header-nav="step > 3"
          >
            <step-confirm-reservation
              :items="newReservation.items"
              :timeslot="newReservation.timeslot"
              :sellerDetails="sellerDetails"
              :market="market">
            </step-confirm-reservation>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation>
              <div  align="right">
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
      </div>
  </q-page>
</template>

<script>
import sellerDesc from 'components/customer/cntReservate/sellerDesc'

import stepFillBasked from 'components/customer/cntReservate/step1FillBasket'
import stepSelectTimeslot from 'components/customer/cntReservate/step2SelectTimeslot'
import stepConfirmReservation from 'components/customer/cntReservate/step3ConfirmReservation'

export default {
  name: 'PageIndex',
  components: {
    sellerDesc,
    stepFillBasked,
    stepSelectTimeslot,
    stepConfirmReservation
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
        }
      }
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
        !this.$store.state.auth.loading &&
        this.$store.state.auth.userExists &&
        this.$store.state.auth.userDetails.isValidated &&
        this.sellerDetails &&
        this.sellerDetails.reservationPossible
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
      // Send order
      this.sendOrder()
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
          items: []
        }
        this.newReservation.items.forEach(element => {
          newReservation.items.push(element)
        })
        var response = await this.$axios.post('/api/reservation/',
          newReservation,
          this.$auth.getAxiosHeader())
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
    }
  },
  mounted: function () {
    const marketID = this.$route.params.marketID
    const sellerID = this.$route.params.sellerID
    this.getMarketSellerDetails(sellerID, marketID)
  }
}
</script>
