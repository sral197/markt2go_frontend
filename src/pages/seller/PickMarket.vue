<template>
  <q-page class="flex">
    <div class="full-width q-pa-md">
    <card-select-market
      ref="card_selectMarket"
      :markets="marketsOfSeller"
      title='Übersicht Wochenmärkte'
      caption='Bitte wähle einen deiner Marktstände aus'
      icon='place'
      :breadcrumbStack="breadcrumbStack"
      v-on:marketSelected="navigateToMarket"
    >
    </card-select-market>
    </div>
  </q-page>
</template>

<script>
import cardSelectMarket from 'components/cntSelectMarket'

export default {
  components: {
    cardSelectMarket
  },
  name: 'sellerDetails',
  data: function () {
    return {
      breadcrumbStack: [],
      marketsOfSeller: null
    }
  },
  watch: {
    '$store.state.auth.loading': async function (newVal) {
      if (!newVal) {
        await this.getMarketsOfUser()
      }
    }
  },
  methods: {
    navigateToMarket: function (marketID) {
      this.$router.push(`${marketID}`)
    },
    getMarketsOfUser: async function () {
      try {
        if (!this.$store.state.auth.loading &&
        this.$store.state.auth.userExists &&
        this.$store.state.auth.userDetails.sellerId) {
          const sellerID = this.$store.state.auth.userDetails.sellerId
          const response = await this.$axios.get(`/api/seller/${sellerID}/market/`)
          this.marketsOfSeller = response.data.data
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  mounted: async function () {
    await this.getMarketsOfUser()
  }
}
</script>
