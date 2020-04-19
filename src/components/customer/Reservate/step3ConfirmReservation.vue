<template>
  <div class="row">
    <div class="col-12 col-md-6">
      <div class="row q-pb-lg">
        <h2
        class="q-my-none q-px-md col-12">
         Händler
        </h2>
        <q-input
          dense
          ref="input_market"
          class="q-px-md q-pb-md col-6"
          v-model="market.name"
          label='Markt'
          bottom-slots
          readonly>
        </q-input>
        <q-input
          dense
          ref="input_seller"
          class="q-px-md q-pb-md col-6"
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
          class="q-px-md q-pb-md col-12">
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">
              {{timeslot.timestampUTC | getFormatedDate('d') | getWeekdayStr}},
              {{timeslot.timestampUTC | getFormatedDate('DD.MM. - HH:mm')}} Uhr
            </div>
          </template>
        </q-field>
        <h2
        class="q-my-none q-px-md col-12">
         Deine Kontaktdaten
        </h2>
        <q-input
          dense
          ref="input_firstname"
          class="q-px-md q-pb-md col-12 col-md-4"
          v-model="user.firstname"
          :rules="[val => !!val.trim() || '']"
          label='Vorname'>
        </q-input>
        <q-input
          dense
          ref="input_lastname"
          class="q-px-md q-pb-md col-12 col-md-8"
          v-model="user.lastname"
          label='Nachname'
          :rules="[val => !!val.trim() || '']">
        </q-input>
        <q-input
          dense
          ref="input_phone"
          class="q-px-md col-12"
          v-if="!$store.state.auth.loading"
          v-model="user.phone"
          :rules="[val => !!val.trim() || '']"
          label='Telefon'>
        </q-input>
      </div>
    </div>
    <div class="col-12 col-md-6">
      <cnt-show-items
        :items="items"
        :labels="{
          title: 'Dein Warenkorb'
        }">
      </cnt-show-items>
    </div>
    <div class="col-12 q-pt-lg">
      <q-checkbox
        :color="showCheckboxError ? 'negative' : 'primary'"
        :keep-color="showCheckboxError"
        v-model="user.rulesAccepted"
        :label='`Ich stimme zu, dass Markt2Go meine Kontaktdaten (Vor-, Nachname und Telefonnummer) an ${sellerDetails.name} zum Zweck der Anfrageabwicklung weiterleitet.`'/>
      <q-checkbox
        :class="{'q-pt-md' : this.$q.screen.lt.md}"
        v-model="user.rememberMe"
        :label='`Optional: Meine Kontaktdaten (Vor-, Nachname und Telefonnummer) für zukünftige Anfragen speichern.`'/>
    </div>
  </div>
</template>
<script>
import cntShowItems from 'components/cntShowItems'

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    timeslot: {
      type: Object,
      required: true
    },
    sellerDetails: {
      type: Object,
      required: true
    },
    market: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    showCheckboxError: function () {
      return this.rulesNotAcceptedValidated && !this.user.rulesAccepted
    }
  },
  components: {
    cntShowItems
  },
  data: function () {
    return {
      rulesNotAcceptedValidated: false
    }
  },
  methods: {
    validate: function () {
      // Contact information need to be set
      this.$refs.input_firstname.validate()
      this.$refs.input_lastname.validate()
      this.$refs.input_phone.validate()

      if (this.$refs.input_firstname.hasError ||
        this.$refs.input_lastname.hasError ||
        this.$refs.input_phone.hasError) {
        this.$q.dialog({
          title: 'Bitte gib deine Kontaktdaten an',
          message: 'Bitte gib all deine Kontaktdaten an (Vor- und Nachname sowie Telefonnummer). Die Daten werden ausschliesslich zur Abwicklung deiner Anfrage genutzt und - sofern du keine Speicherung wünscht - am Ende des Markttages gelöscht.',
          persistent: true
        })
        return false
      }
      // user has to accept the rules
      if (!this.user.rulesAccepted) {
        this.$q.dialog({
          title: 'Bitte stimme der Übermittlung der Kontaktdaten zu',
          message: `Bitte stimme der Übermittlung deiner Kontaktdaten an ${this.sellerDetails.name} zu. Die Daten werden ausschliesslich zur Abwicklung deiner Anfrage genutzt und - sofern du keine Speicherung wünscht - am Ende des Markttages gelöscht.`,
          persistent: true
        })
        this.rulesNotAcceptedValidated = true
        return false
      }
      return true
    }
  }
}
</script>
