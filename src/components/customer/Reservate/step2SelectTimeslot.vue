<template>
  <div class="row">
    <div
      class="col-6 col-md-3 q-pa-xs"
      v-for="slot in slots"
      :key="slot.timestampUTC">
      <q-icon
        :name="slot.icon"
        :color="slot.color" />
      <q-radio
        v-model="selectedSlot"
        :val="slot"
        @input="$emit('selectTimeslot',slot)">
        {{slot.timestampUTC | getFormatedDate('HH:mm')}} ({{slot.reservationCount}})
      </q-radio>
    </div>
    <div class="col-12 text-body2">
      In Klammern ist die Anzahl der Kunden angegeben, die zu diesem Zeitpunkt ebenfalls ihren Einkauf abholen möchten.
    </div>
  </div>
</template>
<script>

import { date } from 'quasar'

export default {
  props: {
    timeslot: Object,
    marketID: String, // value is coming from URL parameter
    sellerID: String // value is coming from URL parameter
  },
  data: function () {
    return {
      slots: [],
      selectedSlot: null
    }
  },
  mounted: async function () {
    var slots = await this.getTimeslots()
    // Set recommodation based on customer number
    this.slots = this.setIcons(slots)
    this.setTimeslotByDatetime(this.timeslot.timestampUTC)
  },
  methods: {
    getTimeslots: async function () {
      try {
        const response = await this.$axios.get(`/api/timeslot/${this.marketID}/${this.sellerID}`, this.$auth.getAxiosHeader())
        return response.data.data
      } catch (error) {
        console.error(error)
      }
    },
    setTimeslotByDatetime: function (timestampUTC) {
      if (!timestampUTC) {
        return
      }
      this.slots.forEach(slot => {
        if (date.isSameDate(slot.timestampUTC, timestampUTC)) {
          this.selectedSlot = slot
        }
      })
    },
    setIcons: function (slots) {
      // Calc mean and standard deviation of customers per slot
      let sum = 0
      slots.forEach(slot => {
        sum += slot.reservationCount
      })
      const mean = sum / slots.length
      const data = []
      slots.forEach(item => data.push(item.reservationCount))
      const deviation = Math.sqrt(data.reduce(function (sq, n) {
        return sq + Math.pow(n - mean, 2)
      }, 0) / (data.length - 1))
      // IF customers/slot < mean-deviation OR customer < 3 THEN thumb_up
      // IF customers/slot > mean+deviation THEN thumb_down
      slots.forEach(slot => {
        if (slot.reservationCount < (mean - deviation) || slot.reservationCount < 3) {
          slot.icon = 'thumb_up'
          slot.color = 'positive'
        } else if (slot.reservationCount > (mean + deviation)) {
          slot.icon = 'thumb_down'
          slot.color = 'negative'
        } else {
          slot.icon = ''
        }
      })
      return slots
    }
  }
}
</script>
