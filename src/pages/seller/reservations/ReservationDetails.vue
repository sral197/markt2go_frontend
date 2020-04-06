<template>
  <q-page class="flex">
    <div class="full-width q-pa-md" v-if="market && sellerDetails && reservation">
      <doc-header
      icon="storefront"
      :caption="headerCaption">
        Anfrage für den {{market.next | getFormatedDate('DD.MM.')}} ({{market.dayOfWeek | getWeekdayStr}})
      </doc-header>
      <!-- Accept or Reject reservation request -->
      <div v-if="reservation.accepted === null">
        <single-reservation-details
          ref="cardCustomerDetails_accept"
          :reservation="reservation">
          <div class="q-ma-none text-h6">
            Nächster Schritt: Anfrage akzeptieren oder ablehnen
          </div>
        </single-reservation-details>
        <div  align="right">
          <q-btn
            flat
            label="Ablehnen"
            @click="updateStatus(false, false)" />
          <q-btn
            color="primary"
            label="Akzeptieren"
            @click="updateStatus(true, false)" />
        </div>
      </div>
      <!-- Just show status -->
      <div v-else>
        <single-reservation-details
          ref="cardCustomerDetails_pack"
          :reservation="reservation">
          <div class="q-ma-none text-h6">
            Die Bestellung wurde {{(reservation.accepted ? 'akzeptiert' : 'abgelehnt')}}
          </div>
        </single-reservation-details>
      </div>
    </div>
  </q-page>
</template>

<script>
import singleReservationDetails from 'components/seller/reservations/singleReservationDetails'

export default {
  name: 'ordersOverview',
  components: {
    singleReservationDetails
  },
  data: function () {
    return {
      reservation: undefined,
      market: undefined,
      sellerDetails: undefined,
      step: 2
    }
  },
  computed: {
    headerCaption: function () {
      return `${this.market.name} - ${this.sellerDetails.name}`
    }
  },
  watch: {
    '$store.state.auth.loading': async function (loading) {
      if (!loading) {
        await this.getMarketSellerOrders()
      }
    }
  },
  methods: {
    getMarketSellerOrders: async function () {
      try {
        const sellerID = this.$store.getters['auth/getSellerID']
        if (sellerID) {
          // const marketID = this.$route.params.marketID
          const reservationID = this.$route.params.reservationID
          // Get market details
          // const responseMarket = this.$axios.get(`/api/market/${marketID}`)
          // const responseSellerDetails = this.$axios.get(`/api/market/${marketID}/seller/${sellerID}`)
          const responseReservation = this.$axios.get(`/api/reservation/${reservationID}`, this.$auth.getAxiosHeader())
          this.reservation = (await responseReservation).data.data
          this.market = this.reservation.market
          this.sellerDetails = this.reservation.seller
        }
      } catch (error) {
        console.error(error)
      }
    },
    updateStatus: function (accepted) {
      try {
        // Check if comment is set on declined reservations (accepted = false)
        if (!accepted && !this.$refs.cardCustomerDetails_accept.validateCommentSet()) {
          return
        }
        const sellerID = this.$store.getters['auth/getSellerID']
        const reservationID = this.$route.params.reservationID
        if (sellerID) {
          const statusDTO = {
            accepted: accepted,
            packed: false,
            sellerComment: this.reservation.sellerComment
          }
          this.$axios.put(`/api/reservation/${reservationID}/setstatus`, statusDTO, this.$auth.getAxiosHeader())
          this.$q.notify({
            message: `Die Anfrage wurde ${(accepted ? 'akzeptiert' : 'abgelehnt')}. Der Kunde wurde via E-Mail benachrichtigt.`,
            type: 'positive'
          })
          this.navigateToOverview()
        }
      } catch (error) {
        console.error(error)
        this.$q.notify({
          message: 'Es ist etwas schief gegangen. Bitte versuche es erneut.',
          type: 'negative'
        })
      }
    },
    navigateToOverview: function () {
      const marketID = this.$route.params.marketID
      this.$router.push(`/seller/orders/${marketID}`)
    }
  },
  mounted: async function () {
    await this.getMarketSellerOrders()
  }
}
</script>
