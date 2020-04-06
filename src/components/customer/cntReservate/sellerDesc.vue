<template>
  <div v-if="sellerDetails">
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4">
        <q-item class="q-pa-none">
          <q-item-section avatar side >
            <q-icon
              name="schedule"
              color="secondary"
              />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h4">
              <slot />
            </q-item-label>
            <q-item-label class="text-body2">
              <div>Anfragen möglich bis:</div>
              <i>
              {{ sellerDetails.lastReservation | getFormatedDate('d') | getWeekdayStr}}
              {{ sellerDetails.lastReservation | getFormatedDate('DD.MM. HH:mm')}}
              </i>
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <div class="col-12 col-sm-6 col-md-5">
        <q-item class="q-pa-none" v-if="sellerDetails.creditCardAccepted || sellerDetails.debitCardAccepted">
          <q-item-section avatar side >
            <q-icon name="far fa-credit-card" style="font-size:20px" color="secondary" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="breadcrumbActive text-h4">
              <slot />
            </q-item-label>
            <q-item-label class="text-body2">
              <div>Bargeldlose Zahlung möglich:</div>
              <i>{{sellerDetails | getPaymentMethodOfSeller}}</i>
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
    <q-separator />
    <div class="row q-my-md" >
      <div class="col-12 text-h6 headerColor">Beschreibung des Händlers</div>
      <div class="text-body2">{{sellerDetails.description}}</div>
    </div>
  </div>
</template>
<style scoped>
  .headerColor {
    color: rgba(0, 0, 0, 0.7)
  }
</style>
<script>

export default {
  props: {
    sellerDetails: Object
  },
  data: function () {
    return {
    }
  },
  mounted: function () {
  },
  methods: {
  }
}
</script>
