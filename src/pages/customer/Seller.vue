<template>
  <q-page class="flex">
    <div class="full-width"
    v-if="market && filteredSellers">
      <doc-header
        caption=""
        icon="storefront"
        :breadcrumbList="breadcrumbList">
          {{market.name}}
          <!--am {{market.dayOfWeek | getWeekdayStr}}
          {{market.startTime}} - {{market.endTime}} Uhr -->
      </doc-header>
      <div class="q-pa-md">
        <h2
        class="q-my-none q-px-sm">
          Bei welchem Marktstand möchtest du etwas für {{market.dayOfWeek | getWeekdayStr}}, den {{market.next | getFormatedDate('DD.MM.')}} anfragen?
        </h2>
        <q-input
        v-model="search"
        label="Filtern"
        class="q-pa-sm">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <p v-if="filteredSellers.length === 0" class="q-pa-sm">
          <i>Keine Marktstände gefunden.</i>
        </p>
        <div class="row">
          <div
            v-for="seller in filteredSellers"
            :key="seller.id"
            class="col-12 col-md-6 q-pa-sm">
              <q-card
                bordered
                @click="navigateToSeller(market, seller)"
                class="cursor-pointer no-shadow">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-body1 text-primary">{{seller.name}}</q-item-label>
                    <q-item-label caption>{{seller.category}}</q-item-label>
                  </q-item-section>
                  <q-item-section class="gt-sm" avatar v-if="seller.creditCardAccepted || seller.debitCardAccepted">
                      <q-icon  style="font-size: 20px;" name="far fa-credit-card" color="secondary"/>
                      <q-tooltip content-class="text-body1">
                        Bargeldlose Zahlungsmöglichkeiten:
                        {{seller | getPaymentMethodOfSeller}}
                      </q-tooltip>
                  </q-item-section>
                  <q-item-section avatar class="gt-sm">
                      <q-icon name="schedule" color="secondary"/>
                      <q-tooltip content-class="text-body1">
                        Anfragen bis:
                        {{ seller.lastReservation | getFormatedDate('d') | getWeekdayStr}}
                        {{ seller.lastReservation | getFormatedDate('DD.MM. HH:mm')}} Uhr
                      </q-tooltip>
                  </q-item-section>
                </q-item>
              <q-separator />
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'ShowSeller',
  data: function () {
    return {
      sellers: [],
      search: '',
      market: null,
      marketID: 0
    }
  },
  computed: {
    breadcrumbList: function () {
      return [{ label: this.market ? this.market.name : '', icon: 'place', to: '/market' }]
    },
    filteredSellers: function () {
      // ignore less than three characters
      if (this.search.trim().length === 0) {
        return this.sellers
      }
      // filter name and category
      return this.sellers.filter(seller =>
        (seller.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
        seller.category.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
      )
    }
  },
  methods: {
    // Get all sellers of a market via REST Api
    getSellersOfMarket: async function (marketID) {
      try {
        const sellersProm = this.$axios.get(`/api/market/${marketID}/seller`)
        const marketProm = this.$axios.get(`/api/market/${marketID}`)
        const response = await Promise.all([sellersProm, marketProm])
        this.sellers = response[0].data.data.filter(x => x.visible)
        this.market = response[1].data.data
      } catch (error) {
        console.error(error)
        this.$router.push({ name: 'errorPage' })
      }
    },
    navigateToSeller: function (market, seller) {
      if (seller.reservationPossible) {
        this.$router.push(`/market/${market.id}/${seller.id}`)
      } else {
        // Reservations not accepted by seller anymore
        const dayOfWeekLastReservation = this.$options.filters.getFormatedDate(seller.lastReservation, 'd')
        const dayOfWeekLastReservationString = this.$options.filters.getWeekdayStr(dayOfWeekLastReservation)
        const timeLastReservation = this.$options.filters.getFormatedDate(seller.lastReservation, 'HH:mm')
        const marketDay = this.$options.filters.getWeekdayStr(this.market.dayOfWeek)
        const toDateString = `${dayOfWeekLastReservationString} ${timeLastReservation} Uhr`
        this.$q.dialog({
          title: 'Anfrage für diese Woche sind nicht mehr möglich',
          message: `Für diese Woche ${marketDay} akzeptiert ${seller.name} keine Anfragen mehr. Der Händler akzeptiert Anfragen bis ${toDateString}.`,
          persistent: true
        })
      }
    }
  },
  mounted: function () {
    this.getSellersOfMarket(this.$route.params.marketID)
  }
}
</script>
