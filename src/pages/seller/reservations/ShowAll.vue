<template>
  <q-page class="flex">
    <div class="full-width q-pa-md" v-if="market && sellerDetails">
      <doc-header
        :caption="headerCaption"
        icon="storefront"
      >
        Anfragen für den {{market.next | getFormatedDate('DD.MM.')}} ({{market.dayOfWeek | getWeekdayStr}})
      </doc-header>
      <q-tabs
        v-model="tab"
        inline-label
        align="justify"
        class="text-primary"
        active-color="secondary"
      >
        <q-tab name="open">
          <template v-slot:default>
            <q-icon class="fas fa-box-open" style="font-size: 14px;"  />
            <div class="q-tab__label q-px-md" v-if="$q.screen.gt.sm">
              Offene Anfragen
              <q-badge floating color="primary">
                {{reservations.open.length}}
              </q-badge>
            </div>
          </template>
        </q-tab>
        <q-tab name="accepted">
          <template v-slot:default>
            <q-icon class="fas fa-check-circle" style="font-size: 14px;"  />
            <div class="q-tab__label q-px-md" v-if="$q.screen.gt.sm">
              Akzeptierte Anfragen
              <q-badge floating color="primary">
                {{reservations.accepted.length}}
              </q-badge>
            </div>
          </template>
        </q-tab>
        <q-tab name="rejected">
          <template v-slot:default>
            <q-icon class="fas fa-ban" style="font-size: 14px;"  />
            <div class="q-tab__label q-px-md" v-if="$q.screen.gt.sm">
              Abgelehnte Anfragen
              <q-badge floating color="primary">
                {{reservations.rejected.length}}
              </q-badge>
            </div>
          </template>
        </q-tab>
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <reservations-tab
          :reservations="reservations.open"
          labelEmptyList="Es liegen keine neuen Kundenanfragen vor."
          name='open'
          linkSuffix="accept"
        >
        </reservations-tab>
        <reservations-tab
          :reservations="reservations.accepted"
          labelEmptyList="Keine akzeptierten Kundenanfragen."
          name='accepted'
          linkSuffix="pack"
        >
        </reservations-tab>
        <reservations-tab
          :reservations="reservations.rejected"
          labelEmptyList="Keine abgelehnten Kundenanfragen."
          name='rejected'
          linkSuffix="show"
        >
        </reservations-tab>
      </q-tab-panels>
      <div align="right" class="q-mt-md">
      <q-btn @click="exportToExcel">
        Export akzeptierter Anfragen
      </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import reservationsTab from 'components/seller/reservations/reservationsTab'
import { date } from 'quasar'
const { formatDate } = date

export default {
  name: 'reservationsOverview',
  components: {
    reservationsTab
  },
  computed: {
    headerCaption: function () {
      return `${this.market.name} - ${this.sellerDetails.name}`
    }
  },
  data: function () {
    return {
      tab: 'open',
      reservations: {
        open: [],
        accepted: [],
        packed: [],
        rejected: []
      },
      market: null,
      sellerDetails: null
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
          const marketID = this.$route.params.marketID
          // Get market details
          const responseMarket = this.$axios.get(`/api/market/${marketID}`)
          const responseSellerDetails = this.$axios.get(`/api/market/${marketID}/seller/${sellerID}`)

          this.market = (await responseMarket).data.data
          var sellerDetails = (await responseSellerDetails).data.data
          sellerDetails.portfolio = JSON.parse(sellerDetails.portfolio)
          this.sellerDetails = sellerDetails

          const marketDay = formatDate(this.market.next, 'YYYY-MM-DD')
          const responseReservations = this.$axios.get(`/api/reservation/seller/${sellerID}/market/${marketID}?pickup=${marketDay}`, this.$auth.getAxiosHeader())
          this.filterReservations((await responseReservations).data.data)
        }
      } catch (error) {
        console.error(error)
      }
    },
    filterReservations: function (reservations) {
      const newReservations = {
        open: [],
        accepted: [],
        packed: [],
        rejected: []
      }
      reservations.forEach(element => {
        if (element.accepted === null) {
          // has not been accepted or rejected by seller
          newReservations.open.push(element)
        } else {
          if (element.accepted) {
            // has been accepted by seller
            newReservations.accepted.push(element)
          } else {
            // not yet been rejected
            newReservations.rejected.push(element)
          }
        }
      })
      this.reservations = newReservations
    },
    // Create excel export
    exportToExcel: async function () {
      try {
        const marketDay = formatDate(this.market.next, 'YYYY-MM-DD')
        const url = `/api/reservation/excel/${this.market.id}/${this.sellerDetails.id}/${marketDay}?status=accepted`
        const conf = this.$auth.getAxiosHeader()
        conf.responseType = 'blob'
        var response = await this.$axios.get(url, conf)
        const data = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = data
        link.setAttribute('download', 'file.xlsx')
        document.body.appendChild(link)
        link.click()
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted: async function () {
    await this.getMarketSellerOrders()
  }
}
</script>
