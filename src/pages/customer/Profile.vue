
<template>
  <q-page class="flex">
    <div class="full-width">
      <doc-header
        icon="account_circle">
        Dein Profil und Deine Anfragen
      </doc-header>
      <h2
      class="q-my-none q-px-sm">
        Deine Kontaktdaten
      </h2>
      <div class="q-pa-md">
        <form @submit.prevent.stop="updateProfile" class="row">
          <q-input
            ref="input_firstname"
            class="q-pa-xs col-12 col-md-3"
            v-model="user.firstname"
            label='Vorname'
            counter maxlength='50'
            bottom-slots
            :rules="[val => !!val.trim() || 'Bitte einen Vornamen angeben']">
          </q-input>
          <q-input
            ref="input_lastname"
            class="q-pa-xs col-12 col-md-5"
            v-model="user.lastname"
            label='Nachname'
            counter maxlength='50'
            bottom-slots
            :rules="[val => !!val.trim() || 'Bitte einen Nachnamen angeben']">
          </q-input>
          <q-input
            ref="input_phone"
            class="q-pa-xs col-12 col-md-4"
            v-model="user.phone"
            mask="###################"
            label='Mobilfunknummer'
            counter maxlength='20'
            bottom-slots
            :rules="[val => !!val.trim() || 'Bitte gibt deine Telefonnummer an']">
            <template v-slot:prepend>
              <q-icon name="phone" />
            </template>
          </q-input>
          <div
            class="full-width  q-mt-lg"
            align="right">
            <q-btn
              color="primary"
              @click="deleteProfile"
              flat
              >Profil löschen</q-btn>
            <q-btn
              color="primary"
              type="submit"
              class="q-ml-md"
              >Kontaktdaten speichern</q-btn>
          </div>
        </form>
      </div>
      <q-separator class="q-mx-sm" />
      <h2
        class="q-mb-none q-px-sm">
          Deine aktuellen Anfragen
        </h2>
      <q-list
      class="q-px-md"
      separator>
        <q-item v-if="reservations.length === 0" dense>
          <q-item-section>
            <q-item-label><i>Du hast keine aktuellen Anfragen</i></q-item-label>
          </q-item-section>
        </q-item>
        <q-item
        clickable
        v-ripple
        v-for="reservation in reservations"
        :key="reservation.id"
        @click="navigateToReservation(reservation)">
          <q-item-section avatar>
            <q-icon name="done" color="primary" v-if="reservation.accepted">
              <q-tooltip content-class="text-body2">
                {{reservation.seller.name}} hat deine Anfrage akzeptiert.
              </q-tooltip>
            </q-icon>
          </q-item-section>
          <q-item-section>
            {{reservation.seller.name}} ({{reservation.market.name}})
          </q-item-section>
          <q-item-section side>
            {{reservation.pickup | getFormatedDate('DD.MM. - HH:mm')}} Uhr
          </q-item-section>
          <q-item-section avatar side>
            <q-icon name="arrow_forward_ios" color="primary" />
          </q-item-section>
        </q-item>
      </q-list>
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
      reservations: []
    }
  },
  watch: {
    '$store.state.auth.loading': function (loading) {
      this.setUser()
      this.getReservaitonsOfUser()
    }
  },
  mounted: function () {
    this.setUser()
    this.getReservaitonsOfUser()
  },
  methods: {
    setUser: function () {
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
        if (this.user.isNew) {
          // POST for a new user
          await this.$axios.post('/api/user', this.user, this.$auth.getAxiosHeader())
        } else {
          // PUT for an existing user
          await this.$axios.put('/api/user', this.user, this.$auth.getAxiosHeader())
        }
        // Success notify
        this.$q.notify({
          message: 'Angaben wurden erfolgreich geändert.',
          type: 'positive'
        })
        this.getUser()
      } catch (error) {
        console.log(error)
        this.$router.push({ name: 'errorPage' })
      }
    },
    deleteProfile: function () {
      try {
        // delete user
        const userID = this.$auth.user.sub
        this.$q.dialog({
          title: 'Achtung',
          message: 'Möchest du dein Benutzerprofil wirklich unwiederuflich löschen?',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          var respose = await this.$axios.delete(`/api/user/${userID}`, this.$auth.getAxiosHeader())
          if (respose.data.success) {
            // logout user
            let logoutURL = '' + window.location
            logoutURL = `${logoutURL.split('#')[0]}#/logout`
            this.$auth.logout({
              returnTo: logoutURL
            })
          } else {
            console.log(respose.data)
            this.$router.push({ name: 'errorPage' })
          }
        })
      } catch (error) {
        console.error(error)
        this.$router.push({ name: 'errorPage' })
      }
    },
    getUser: async function () {
      if (!this.$auth.loading && this.$auth.isAuthenticated) {
        try {
          await this.$store.dispatch('auth/updateUserData')
        } catch (error) {
          console.error(error)
          this.$router.push({ name: 'errorPage' })
        }
      }
    },
    getReservaitonsOfUser: async function () {
      try {
        const userID = this.$auth.user.sub
        const resopnse = await this.$axios.get(`/api/reservation/user/${userID}`, this.$auth.getAxiosHeader())
        this.reservations = this.sortByPickupDate(resopnse.data.data)
      } catch (error) {
        console.log(error)
        this.$router.push({ name: 'errorPage' })
      }
    },
    navigateToReservation: function (reservation) {
      this.$router.push(`/status/${reservation.id}`)
    },
    sortByPickupDate: function (reservations) {
      return reservations.sort(function (res1, res2) {
        return res1.pickup > res2.pickup
      })
    }
  }
}
</script>
