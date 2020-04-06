<template>
  <q-page class="flex">
    <div
    v-if="sellerDetails && market"
    class="full-width q-pa-md">
      <doc-header
        icon="storefront"
        caption="Passe deine Beschreibung sowie deine angebotenen Waren an">
        {{this.market.name}} - {{this.sellerDetails.name}}
      </doc-header>
      <q-tabs
        v-model="tab"
        inline-label
        align="justify"
        class="text-primary"
        active-color="secondary">
        <q-tab name="details" icon="details" label="Beschreibung" />
        <q-tab name="products" icon="local_grocery_store" label="Waren" />
      </q-tabs>
      <!-- Tab Panels -->
      <q-tab-panels v-model="tab">
        <q-tab-panel name="details">
          <edit-seller-details
            :sellerDetails="sellerDetails"
            :market="market">
          </edit-seller-details>
        </q-tab-panel>
        <q-tab-panel name="products">
          <edit-products
            :groups="sellerDetails.portfolio">
          </edit-products>
        </q-tab-panel>
      </q-tab-panels>
      <!-- Button menu -->
      <div  align="right" class="q-mt-md">
        <q-btn
          @click="showPreview = true"
          label="Vorschau" />
        <q-btn
          @click="updateSellerDetails"
          color="primary"
          label="Übernehmen" />
      </div>
      <!-- Dialog -->
      <q-dialog v-model="showPreview">
        <q-card class="q-px-sm q-pb-md" style="width:600px;height:600px">
           <seller-desc
            :sellerDetails="sellerDetails"
            :reservationAllowed="true">
          </seller-desc>
          <q-separator />
          <step1-fill-basket
            :groups="sellerDetails.portfolio"
            :reservationAllowed="true"
            :newReservation="newReservation">
          </step1-fill-basket>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import editSellerDetails from 'components/seller/sellerProfile/editSellerDetails'
import editProducts from 'components/seller/sellerProfile/editProducts'
import step1FillBasket from 'components/customer/cntReservate/step1FillBasket'
import sellerDesc from 'components/customer/cntReservate/sellerDesc'

export default {
  components: {
    editSellerDetails,
    editProducts,
    step1FillBasket,
    sellerDesc
  },
  name: 'sellerDetails',
  data: function () {
    return {
      tab: 'details',
      market: null,
      sellerDetails: null,
      showPreview: false,
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
      return `${this.market.name} - ${this.sellerDetails.name}: Angebot für ${dayOfWeek}, ${date}`
    }
  },
  watch: {
    '$store.state.auth.loading': async function (newVal) {
      if (!newVal) {
        await this.getMarketAndSellerDetails()
      }
    }
  },
  methods: {
    // Get market and seller details
    getMarketAndSellerDetails: async function () {
      try {
        const sellerID = this.$store.getters['auth/getSellerID']
        if (sellerID) {
          const marketID = this.$route.params.marketID
          const marketProm = this.$axios.get(`/api/market/${marketID}`)
          const sellerDetailsProm = this.$axios.get(`/api/market/${marketID}/seller/${sellerID}`)
          const response = await Promise.all([marketProm, sellerDetailsProm])
          this.market = response[0].data.data
          var sellerDetails = response[1].data.data
          sellerDetails.portfolio = JSON.parse(sellerDetails.portfolio)
          this.sellerDetails = sellerDetails
        }
      } catch (error) {
        console.error(error)
      }
    },
    updateSellerDetails: async function () {
      // Update /api/selller/{id}/market
      try {
        const sellerID = this.$store.getters['auth/getSellerID']
        const marketID = parseFloat(this.$route.params.marketID)
        if (this.sellerDetails) {
          const payload = { ...this.sellerDetails }
          payload.portfolio = JSON.stringify(this.sellerDetails.portfolio)
          // API side uses sellerID and marketID as identifier
          payload.sellerId = sellerID
          payload.marketId = marketID
          payload.id = undefined
          await this.$axios.put(`/api/seller/${payload.sellerId}/market`, payload,
            this.$auth.getAxiosHeader())
          this.$q.notify({
            message: 'Die Daten wurden aktualisiert',
            type: 'positive'
          })
        }
      } catch (error) {
        console.error(error)
        this.$router.push({ name: 'errorPageSeller' })
      }
    }
  },
  mounted: async function () {
    await this.getMarketAndSellerDetails()
  }
}
</script>
