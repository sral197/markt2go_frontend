<template>
  <q-page class="flex" v-if="reservation">
    <div
      v-if="reservation.accepted !== null && !reservation.accepted"
      class="q-pa-md full-width">
      <doc-header
      icon=""
      caption="Der Händler hat deine Anfrage leider abgelehnt.">
        Anfrage abgelehnt
      </doc-header>
      <q-separator />
      <div class="text-h6">Kommentar von {{reservation.seller.name}}:</div>
      <p class="text-body1">
        {{reservation.sellerComment}}
      </p>
    </div>
    <div class="q-pa-md full-width" v-else>
      <doc-header
      icon=""
      caption="">
      Vielen Dank für deine Anfrage
      </doc-header>
      <q-item>
        <q-item-section avatar>
          <q-icon
            v-if="reservation.accepted"
            name="check_circle_outline" class="headerColor" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-body1">Bestätigung durch <u>{{reservation.seller.name}}</u></q-item-label>
          <q-item-label caption>
            <p v-if="reservation.accepted">{{reservation.seller.name}} hat deine Anfrage geprüft und akzeptiert.</p>
            <p v-else>Die Anfrage wird aktuell durch {{reservation.seller.name}} geprüft. Wir informieren dich via E-Mail sobald die Anfrage bestätigt wurde.</p>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section avatar>
          <q-icon
            v-if="reservation.packed"
            name="check_circle_outline" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-body1">Abholung des Warenkorbs am <u>
              {{reservation.pickup | getFormatedDate('d')| getWeekdayStr}}, {{reservation.pickup | getFormatedDate('DD.MM.')}}
              gegen {{reservation.pickup | getFormatedDate('HH:mm')}} Uhr</u>
            </q-item-label>
          <q-item-label caption>Bitte hol deine Bestellung am Markttag
             zu der angegebenen Uhrzeit ab. Wir bitten dich - sofern möglich - bargeldlos zu bezahlen.</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced />
      <cnt-show-items
        class="q-pa-md"
        :items="reservation.items"
        :labels="{
          title: 'Dein angefragter Warenkorb',
          caption: null
        }" />
    </div>
  </q-page>
</template>
<style scoped>
  .headerColor {
    color: rgba(0, 0, 0, 0.7)
  }
</style>
<script>
import cntShowItems from 'components/cntShowItems'

export default {
  name: 'ShowReservationStatus',
  data  () {
    return {
      reservation: null
    }
  },
  components: {
    cntShowItems
  },
  watch: {
    '$store.state.auth.loading': async function (newVal) {
      if (!newVal) {
        await this.getReservation()
      }
    }
  },
  methods: {
    getReservation: async function () {
      try {
        const reservationID = this.$route.params.reservationID
        const response = await this.$axios.get(`/api/reservation/${reservationID}`, this.$auth.getAxiosHeader())
        if (!response.data.data) {
          // API returns null if reservation does not exist
          this.$router.push({ name: 'errorPage' })
        }
        this.reservation = response.data.data
      } catch (error) {
        console.log(error)
        this.$router.push({ name: 'errorPage' })
      }
    }
  },
  mounted: async function () {
    await this.getReservation()
  }
}
</script>
