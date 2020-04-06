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
          <span class="gt-sm"> - Marktstand Administration</span>
        </q-toolbar-title>
        <q-separator dark vertical />
        <q-btn
          stretch
          flat
          label="Logout"
          @click="logout"
          v-if="!$auth.loading && $auth.isAuthenticated" />
        <q-btn
          stretch
          flat
          label="Login"
          @click="login"
          v-if="!$auth.loading && !$auth.isAuthenticated"
          />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item>
            <q-img
              src="/statics/logo.png"
              spinner-color="white"
              style="height: 200px; max-width: 200px;margin-top:-30px"
            />
        </q-item>
        <q-item
        style="margin-top:-50px"
          clickable
          tag="a"
          to="/seller/sellerDetails"
          active-class="text-secondary"
          class="text-primary">
          <q-item-section
            avatar
          >
            <q-icon name="storefront" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Marktstand Details</q-item-label>
            <q-item-label caption>
              Passe dein Angebot an
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          to="/seller/orders"
          v-if="!$auth.loading && $auth.isAuthenticated"
          active-class="text-secondary"
          class="text-primary">
          <q-item-section
            avatar>
            <q-icon name="assistant" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Anfragen</q-item-label>
            <q-item-label caption>
              Verwalte deine Kundenanfragen
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <!--
      {{!$store.state.auth.loading && $store.state.auth.userExists ? $store.state.auth.userDetails : ''}}
      -->
      <!-- {{showProgressSpinner}} ({{axiosRequestCounter}}) -->
      <router-view class="doc-main q-pa-xs" />
    </q-page-container>
  </q-layout>
</template>
<style scoped>
  .doc-note--warning {
      background-color: #ffc0c6;
      border-color: #c10015;;
  }
  .doc-note {
      border-radius: 4px;
      padding: 16px 24px;
      font-size: 1em;
      border-width: 0 5px;
      border-style: solid;
      letter-spacing: .5px;
  }
  .doc-main {
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
  }
</style>
<script>

export default {
  name: 'MainLayout',
  components: {
  },
  data () {
    return {
      drawer: false,
      axiosRequestCounter: 0
    }
  },
  computed: {
    showProgressSpinner: function () {
      return this.$auth.loading ||
        this.axiosRequestCounter > 0
    }
  },
  watch: {
    '$auth.loading': async function () {
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
          if (!response.data.data || !response.data.data.sellerId) {
            this.$router.push('/')
          }
          this.$store.commit('auth/setUser', response.data.data)
        } catch (error) {
          console.error(error)
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
