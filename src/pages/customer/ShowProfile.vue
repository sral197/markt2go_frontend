
<template>
  <q-page class="flex">
    <div class="full-width">
      <doc-header
        icon="account_circle"
        caption="Bitte gib hier deine persönlichen Daten ein">
        Persönliche Daten
      </doc-header>
      <!--
      <div class="row">
        <div class="text-h6">Was passiert mit meinen Daten?</div>
        <div class="text-body2">
          Wir speichern deine Daten in einer nicht öffentlichen Datenbank.
          Sobald du eine Anfrage an einen Händler sendest, stellen wir diesem einige Informationen
          (Vorname, Nachname, E-Mail-Adresse und deine Telefonnnummer) zur Verfügung. Sofern es Unklarheiten zu deiner Anfrage gibt, kann der Händler dich so kontaktieren und die Anfrage kann dir auf dem Markt zugeordnet werden.
          Deine Adresse werden wir nicht an den Händler weitergeben sondern nutzen sie nur um dein Profil zu verifizieren. Für unser Autehentifizierungssystem nutzen wir den Service der Firma Auth0. Hier wird deine </div>
      </div>
      -->
      <div class="row q-pa-md">
        <div class="col-12 text-body1" v-if="user.isValidated">
          <q-icon
            name="check_circle_outline"
            color="positive"
            style="font-size: 2em;" />
          Dein Profil ist bereits durch uns verifiziert. Kontaktinformationen können nun nicht mehr geändert werden.
        </div>
        <div v-else class="col-12 text-body1">
          <q-icon
            name="error_outline"
            color="warning"
            style="font-size: 2em;" />
          Dein Profil ist noch nicht durch uns verifiziert. Bitte fülle alle Kontaktinformationen aus und warte auf die Bestätigung.
          </div>
      </div>
      <form @submit.prevent.stop="updateProfile" class="row q-mb-lg">
        <q-input
          ref="input_firstname"
          :readonly="user.isValidated"
          class="q-pa-md col-12 col-md-5"
          v-model="user.firstname"
          label='Vorname'
          counter maxlength='50'
          bottom-slots
          :rules="[val => !!val.trim() || 'Bitte einen Vornamen angeben']">
        </q-input>
        <q-input
          ref="input_lastname"
          class="q-pa-md col-12 col-md-7"
          v-model="user.lastname"
          :readonly="user.isValidated"
          label='Nachname'
          counter maxlength='50'
          bottom-slots
          :rules="[val => !!val.trim() || 'Bitte einen Nachnamen angeben']">
        </q-input>
        <q-input
          ref="input_street"
          class="q-pa-md col-12 col-md-5"
          :readonly="user.isValidated"
          v-model="user.address"
          label='Straße und Hausnummer'
          counter maxlength='50'
          bottom-slots
          :rules="[val => !!val.trim() || 'Bitte die Straße und Hausnummer angeben']">
          <template v-slot:prepend>
            <q-icon name="house" />
          </template>
        </q-input>
        <q-input
          ref="input_zipcode"
          class="q-pa-md col-12 col-md-2"
          :readonly="user.isValidated"
          v-model="user.zip"
          label='Postleitzahl'
          mask="#####"
          counter maxlength='5'
          bottom-slots
          :rules="[val => !!val.trim() || 'Bitte gibt deine Postleitzahl an']">
          <template v-slot:prepend>
            <q-icon name="place" />
          </template>
        </q-input>
        <q-input
          ref="input_town"
          class="q-pa-md col-12 col-md-5"
          :readonly="user.isValidated"
          v-model="user.town"
          label='Ort'
          counter maxlength='50'
          bottom-slots
          :rules="[val => !!val.trim() || 'Bitte gibt deinen Wohnort an']">
        </q-input>
        <q-input
          ref="input_phone"
          class="q-pa-md col-12 col-md-5"
          :readonly="user.isValidated"
          v-model="user.phone"
          mask="###################"
          label='Mobilfunknummer'
          hint="Der Händler wird dich bei Fragen über diese Nummer kontaktieren"
          counter maxlength='20'
          bottom-slots
          :rules="[val => !!val.trim() || 'Bitte gibt deine Telefonnummer an']">
          <template v-slot:prepend>
            <q-icon name="phone" />
          </template>
        </q-input>
        <q-input
          ref="input_email"
          class="q-pa-md col-12  col-md-7"
          v-model="$auth.user.email"
          label='Emailadresse'
          bottom-slots
          readonly>
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>
        <q-checkbox
        ref="cb_personalData"
        v-model="confirmPersonalData"
        :disable="checkboxLocked"
        class="q-my-md"
        label="Ich stimme zu, dass Markt2Go meine hier eingegebenen persönlichen Daten zu Verifizierungszwecken speichert." />
        <q-checkbox
        v-model="confirmSellerData"
        :disable="checkboxLocked"
        class=""
        label="Ich stimme zu, dass Markt2Go meine Kontaktdaten (Vor-, Nachname, Telefonnummer und E-Mail-Adresse) bei einer Anfrage den entsprechenden Händlern zur Verfügung stellt."/>
        <div
          class="full-width"
          align="right">
           <q-btn
            color="primary"
            @click="deleteProfile"
            >Benutzer löschen</q-btn>
          <q-btn
            v-if="!user.isValidated"
            color="primary"
            type="submit"
            class="q-ml-md"
            >Daten übermitteln</q-btn>
        </div>
      </form>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'PageIndex',
  data: function () {
    return {
      user: {
        lastname: '',
        firstname: '',
        address: '',
        zip: '',
        town: '',
        phone: '',
        mail: '',
        name: '',
        isValidated: false,
        isNew: true
      },
      confirmPersonalData: false,
      confirmSellerData: false,
      checkboxLocked: false
    }
  },
  watch: {
    '$store.state.auth.loading': function (loading) {
      this.getUser()
    }
  },
  mounted: function () {
    this.getUser()
  },
  methods: {
    getUser: function () {
      // Check if user is known to backend
      if (this.$store.state.auth.userExists) {
        this.user = { ...this.$store.state.auth.userDetails }
        this.confirmPersonalData = true
        this.confirmSellerData = true
        this.checkboxLocked = true
      }
    },
    updateProfile: async function () {
      try {
        if (!this.confirmPersonalData || !this.confirmSellerData) {
          this.$q.dialog({
            title: 'Bitte bestätigen',
            message: 'Um Markt2Go nutzen zu können, stimme bitte unseren Regeln zu.'
          })
          return
        }
        this.$refs.input_firstname.validate()
        this.$refs.input_lastname.validate()
        this.$refs.input_street.validate()
        this.$refs.input_zipcode.validate()
        this.$refs.input_town.validate()
        this.$refs.input_phone.validate()
        if (!this.$refs.input_firstname.hasError &&
            !this.$refs.input_lastname.hasError &&
            !this.$refs.input_street.hasError &&
            !this.$refs.input_zipcode.hasError &&
            !this.$refs.input_town.hasError &&
            !this.$refs.input_phone.hasError &&
            !this.user.isValidated) {
          if (this.user.isNew) {
            // POST for a new user
            this.$axios.post('/api/user', this.user, this.$auth.getAxiosHeader())
          } else {
            // PUT for an existing user
            this.$axios.put('/api/user', this.user, this.$auth.getAxiosHeader())
          }
          // Success notify
          this.$q.notify({
            message: 'Angaben wurden erfolgreich geändert. Bitte warte auf die Verifizierung durch uns.',
            type: 'positive'
          })
          this.$router.push('/')
        }
      } catch (error) {
        console.log(error)
        this.$router.push({ name: 'errorPage' })
      }
    },
    deleteProfile: async function () {
      /* */
      this.$q.dialog({
        title: 'Profil Löschen',
        message: 'Wir arbeiten aktuell an der automatisierten Löschfunktion. Bis zur fertigen umsetzung bitten wir dich uns eine kurze E-Mail an info@markt2go.de mit Nennung der genutzen E-Mail Adresse zu schicken. Anschließend löschen wir dein persönlichen Daten umgehend.'
      })
    }
  }
}
</script>
