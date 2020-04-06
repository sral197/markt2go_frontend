<template>
  <div>
    <div class="row">
      <q-input
        dense
        ref="input_seller"
        class="q-pa-md col-6 col-md-3"
        v-model="sellerDetails.name"
        label='Stand'
        bottom-slots
        readonly>
      </q-input>
      <q-field
        dense
        label='Abholzeit'
        bottom-slots
        stack-label
        readonly
        ref="input_pickuptime"
        class="q-pa-md col-6 col-md-3">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{timeslot.timestampUTC | getFormatedDate('DD.MM. - HH:mm')}} Uhr
          </div>
        </template>
      </q-field>
    </div>
    <div class="row">
       <q-field
        dense
        label='Name'
        bottom-slots
        stack-label
        readonly
        v-if="!$store.state.auth.loading"
        ref="input_name"
        class="q-pa-md col-6 col-md-3">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{`${$store.state.auth.userDetails.lastname}, ${$store.state.auth.userDetails.firstname}`}}
          </div>
        </template>
      </q-field>
      <q-input
        dense
        ref="input_phone"
        class="q-pa-md col-6 col-md-3"
        v-if="!$store.state.auth.loading"
        v-model="$store.state.auth.userDetails.phone"
        label='Telefon'
        bottom-slots
        readonly>
      </q-input>
      <q-input
        dense
        ref="input_mail"
        class="q-pa-md col-12 col-md-6"
        v-if="!$store.state.auth.loading"
        v-model="$store.state.auth.userDetails.mail"
        label='Email'
        bottom-slots
        readonly>
      </q-input>
      <cnt-show-items
        :items="items"
        :labels="{
          title: 'Dein Warenkorb',
          caption: 'Bitte prüfe deinen Einkauf'
        }">
      </cnt-show-items>
    </div>
  </div>
</template>
<script>
import cntShowItems from 'components/cntShowItems'

export default {
  props: ['items', 'timeslot', 'sellerDetails', 'market'],
  components: {
    cntShowItems
  }
}
</script>
