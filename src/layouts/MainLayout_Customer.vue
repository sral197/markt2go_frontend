<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar height="75px">
        <q-btn
          stretch
          flat
          icon="menu"
          aria-label="Menu"
          @click="drawer = !drawer"
        />
        <q-separator dark vertical />
        <q-toolbar-title>
          Markt2Go.de
          <span class="gt-sm"> - Stell dein Wochenmarkteinkauf online zusammen!</span>
        </q-toolbar-title>
        <q-separator dark vertical />
        <q-btn
          stretch
          flat
          label="Abmelden"
          @click="logout"
          v-if="!$auth.loading && $auth.isAuthenticated" />
        <q-btn
          stretch
          flat
          label="Anmelden"
          @click="login"
          v-if="!$auth.loading && !$auth.isAuthenticated"
          />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="drawer"
      bordered
      content-class="bg-grey-1">
      <q-list>
        <q-item>
            <q-img
              src="/statics/logo.png"
              style="height: 200px; max-width: 200px;margin-top:-30px"
            />
        </q-item>
        <q-item
          clickable
          tag="a"
          style="margin-top:-50px"
          to="/info"
          active-class="text-secondary"
          class="text-primary">
          <q-item-section
            avatar
          >
            <q-icon name="info" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Wilkommen</q-item-label>
            <q-item-label caption>
              Was ist Markt2Go?
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          to="/market"
          active-class="text-secondary"
          class="text-primary">
          <q-item-section
            avatar
          >
            <q-icon name="room" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Märkte</q-item-label>
            <q-item-label caption>
              Stell deinen Wochenmarkteinkauf zusammen
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          to="/profile"
          active-class="text-secondary"
          class="text-primary"
          v-if="!$auth.loading && $auth.isAuthenticated">
          <q-item-section
            avatar>
            <q-icon name="account_circle" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Profildaten und Anfragen</q-item-label>
            <q-item-label caption>
              Deine persönlichen Daten sowie aktuelle Anfragen
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="fixed-bottom q-pa-md">
        <div>
          <router-link to="/seller"
          class="router-link text-body1"
          v-if="showSellerLink">
              Händlerbereich
          </router-link>
        </div>
        <div>
          <router-link to="/contact"
          class="router-link text-body1">
            Impressum und Kontakt
          </router-link>
        </div>
        <div>
          <router-link to="/privacy"
          class="router-link text-body1">
            Hinweise zum Datenschutz
          </router-link>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
        <!--
        Auth Loading: {{ this.$auth.loading }} <br />
        User Loading: {{ this.$store.state.auth.loading }} <br />
        Auth isAuthenticated: {{ this.$auth.isAuthenticated }} <br />
        User Exists: {{this.$store.state.auth.userExists}} <br />
        User isValidated: {{ this.$store.state.auth.userDetails ? this.$store.state.auth.userDetails.isValidated : '' }} <br />
        Auth emailVerified: {{ this.$auth.user.email_verified }} <br />
        -->
      <router-view class="doc-main q-pa-xs" />
    </q-page-container>
  </q-layout>
</template>
<style lang="sass" scoped>
.doc-main
  max-width: 900px
  margin-left: auto
  margin-right: auto

.router-link
  text-decoration: none
  color: $primary
  &:hover
    color: $secondary
</style>>
<script>

export default {
  name: 'MainLayout',
  components: {
  },

  data () {
    return {
      axiosRequestCounter: 0,
      drawer: false
    }
  },
  computed: {
    showProgressSpinner: function () {
      return this.$auth.loading ||
        this.axiosRequestCounter > 0
    },
    showSellerLink: function () {
      return (this.$store.state.auth.userDetails &&
      this.$store.state.auth.userDetails.sellerId)
    }
  },
  watch: {
    '$auth.loading': async function (newValue) {
      await this.getUser()
    },
    showProgressSpinner: function (newValue) {
      if (newValue) {
        this.$q.loading.show({
          delay: 100 // ms
        })
      } else {
        this.$q.loading.hide()
      }
    }
  },
  methods: {
    logout: function () {
      let logoutURL = '' + window.location
      logoutURL = `${logoutURL.split('#')[0]}#/logout`
      this.$auth.logout({
        returnTo: logoutURL
      })
    },
    login: function () {
      const targetURL = `${window.location}`
      this.$auth.loginWithRedirect({ redirect_uri: targetURL })
    },
    getUser: async function () {
      if (!this.$auth.loading && this.$auth.isAuthenticated) {
        try {
          const userID = this.$auth.user.sub
          const response = await this.$axios.get(`/api/user/${userID}`, this.$auth.getAxiosHeader())
          // API returns null if user is unknown
          this.$store.commit('auth/setUser', response.data.data)
        } catch (error) {
          console.error(error)
          this.$router.push({ name: 'errorPage' })
        }
      }
    }
  },
  mounted: function () {
    // AXIOS interceptors for spinner functionality
    this.$axios.interceptors.request.use((config) => {
      this.axiosRequestCounter++
      return config
    }, (error) => {
      this.axiosRequestCounter--
      return Promise.reject(error)
    })
    this.$axios.interceptors.response.use((response) => {
      this.axiosRequestCounter--
      return response
    }, (error) => {
      this.axiosRequestCounter--
      return Promise.reject(error)
    })
    this.getUser()
  }
}
</script>
