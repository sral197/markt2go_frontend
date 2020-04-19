<template>
  <q-page>
    <q-banner v-if="userNotSignedIn"
      rounded class="doc-note doc-note--warning q-ma-md">
      <p class="q-ma-none text-body1 text-weight-bold">Achtung</p>
      <p class="q-ma-none text-body2">Anfragen über Markteinkäufe sind erst möglich nachdem du dich eingeloggt hast.</p>
      <template v-slot:action>
        <q-btn flat label="Anmelden/Registrieren" @click="login" />
      </template>
    </q-banner>
    <q-banner v-if="emailNotVerified"
      rounded class="doc-note doc-note--warning q-ma-md">
      <p class="q-ma-none text-body1 text-weight-bold">Achtung</p>
      <p class="q-ma-none text-body2">Deine E-Mail-Adresse ist noch nicht bestätigt. Öffne Dein E-Mail-Postfach und klicke auf den Link "E-Mail Adresse bestätigen".</p>
    </q-banner>
    <router-view />
  </q-page>
</template>

<style scoped>
  .doc-note--warning {
      background-color: #f8dca0;
      border-color: #efaf21;;
  }
  .doc-note {
      border-radius: 4px;
      padding: 16px 24px;
      font-size: 1em;
      border-width: 0 5px;
      border-style: solid;
      letter-spacing: .5px;
  }
</style>

<script>
export default {
  computed: {
    userNotSignedIn: function () {
      return (!this.$auth.loading &&
              !this.$auth.isAuthenticated)
    },
    emailNotVerified: function () {
      return (!this.$auth.loading &&
              !this.userNotSignedIn &&
              !this.$auth.user.email_verified)
    }
  },
  methods: {
    login: function () {
      const targetURL = `${window.location}`
      this.$auth.loginWithRedirect({ redirect_uri: targetURL })
    }
  }
}
</script>
