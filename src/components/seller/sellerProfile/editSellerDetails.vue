<template>
  <div class="row">
    <div class="col-12 col-md-6">
      <div class="text-h2">Reservierungen akzeptieren bis:</div>
      {{ lastReservation | getFormatedDate('d') | getWeekdayStr}}
      {{ lastReservation | getFormatedDate('DD.MM. HH:mm')}} Uhr
        <q-slider v-model="sellerDetails.lastReservationOffset"
      :min="-48"
      :max="0"
      :step="1" />
    </div>
    <div class="col-12 offset-md-1 col-md-5">
      <div class="text-h2">Akzeptierte Zahlungsarten:</div>
      <q-checkbox v-model="sellerDetails.creditCardAccepted" label="Kreditkarte" />
      <q-checkbox v-model="sellerDetails.debitCardAccepted" label="EC-Karte" />
    </div>
    <q-input
      class="col-12"
      dense
      ref="input_description"
      v-model="sellerDetails.description"
      label='Beschreibung'
      type="textarea"
      filled
      stack-label
      counter maxlength="500"
      bottom-slots />
  </div>
</template>

<script>
import { date } from 'quasar'
const { addToDate } = date

export default {
  props: ['sellerDetails', 'market'],
  data: function () {
    return {
    }
  },
  watch: {
    // Update lastReservation (required for preview component)
    lastReservation: function (newValue) {
      this.sellerDetails.lastReservation = newValue
    }
  },
  computed: {
    lastReservation: function () {
      // observe offset and calculate date out of it
      return addToDate(this.market.next, { hours: this.sellerDetails.lastReservationOffset })
    }
  }
}
</script>
