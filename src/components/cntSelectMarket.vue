<template>
  <div>
    <doc-header
    :caption="caption"
    :icon="icon"
    :breadcrumbList="breadcrumbList">
      {{title}}
    </doc-header>
    <div class="q-pa-md">
      <q-input
      v-model="search"
      label="Filtern"
      class="full-width q-pa-sm">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <p v-if="filteredMarkets && filteredMarkets.length === 0" class="q-pa-sm text-body1">
        <i>Keinen Wochenmarkt gefunden.</i>
      </p>
      <div class="row">
        <div
          v-for="market in filteredMarkets"
          :key="market.id"
          class="col-12 col-md-4 q-pa-sm">
          <q-card
            bordered
            @click="marketSelected(market.id)"
            class="cursor-pointer no-shadow">
            <q-item clickable>
              <q-item-section>
                <q-item-label class="text-primary text-body1">{{market.name}}</q-item-label>
                <q-item-label caption>
                  {{market.location}} -
                  {{market.dayOfWeek | getWeekdayStr}}, {{market.next | getFormatedDate('DD.MM.')}}
                  {{market.startTime}} bis {{market.endTime}}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'cntCardSelectMarket',
  props: {
    caption: String,
    title: String,
    icon: String,
    markets: Array,
    breadcrumbList: Array
  },
  data: function () {
    return {
      search: ''
    }
  },
  computed: {
    filteredMarkets: function () {
      // ignore less than three characters
      if (this.search.trim().length === 0) {
        return this.markets
      }
      // filter name and category
      return this.markets.filter(market =>
        (market.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
        market.location.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
      )
    }
  },
  methods: {
    marketSelected: function (id) {
      // emit
      this.$emit('marketSelected', id)
    }
  }
}
</script>
