<template>
  <q-page class="flex">
    <div class="full-width"
    v-if="markets">
      <cnt-select-market
        ref="cnt_selectMarket"
        :markets="markets"
        title='Wochenmärkte in deiner Region'
        caption='Nutze den Filter um nach deinem Wochenmarkt zu suchen'
        icon='place'
        :breadcrumbList="breadcrumbList"
        v-on:marketSelected="navigateToMarket">
      </cnt-select-market>
    </div>
  </q-page>
</template>
<script>
import cntSelectMarket from 'components/cntSelectMarket'

export default {
  name: 'ShowMarkets',
  components: {
    cntSelectMarket
  },
  data: function () {
    return {
      breadcrumbList: [],
      markets: []
    }
  },
  methods: {
    // Get all markets via REST API
    getMarkets: async function () {
      try {
        const response = await this.$axios.get('/api/market')
        this.markets = response.data.data.filter(x => x.visible)
      } catch (error) {
        console.error(error)
        this.$router.push({ name: 'errorPage' })
      }
    },
    navigateToMarket: function (id) {
      this.$router.push(`market/${id}`)
    }
  },
  mounted: function () {
    this.getMarkets()
  }
}
</script>
