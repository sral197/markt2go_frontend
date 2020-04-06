<template>
  <q-page class="flex">
    <div
      class="q-px-md q-pt-md full-width">
      <div>
        <div
          v-if="!$auth.loading &&
          !$auth.isAuthenticated"
          class="doc-note doc-note--warning q-ma-none">
          <p class="doc-note__title text-weight-bold">Du wurdest erfolgreich ausgeloggt.</p>
          <!--
          <p class="q-ma-none">
            Um dich wieder einzuloggen klicke hier.
            <span @click="login()"><u>hier</u></span> geht es zur Registrierung.
          </p>
          -->
        </div>
      </div>
    </div>
  </q-page>
</template>
<style scoped>
.doc-note--warning {
    background-color: #c1f4cd;
    border-color: #21ba45;;
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
  name: 'PageLogout',
  watch: {
    '$auth.loading': function (newVal) {
      this.redirectToRoot()
    }
  },
  methods: {
    redirectToRoot: function () {
      // If user is logged in and authenticated redirect to root.
      if (this.$auth && !this.$auth.loading && this.$auth.isAuthenticated) {
        this.$router.push('/')
      }
    }
  },
  mounted: function () {
    this.redirectToRoot()
  }
}
</script>
