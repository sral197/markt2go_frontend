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
          <span class="gt-sm"> - Bestell deinen Wochenmarkteinkauf vor!</span>
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
      content-class="bg-grey-1">
      <q-list>
        <q-item>
            <q-img
              src="/statics/logo.png"
              spinner-color="white"
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
              Zeige alle Wochenmärkte
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
            <q-item-label>Profildaten</q-item-label>
            <q-item-label caption>
              Deine persönlichen Daten
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="fixed-bottom q-pa-md">
        <div>
          <router-link to="/seller"
          style="text-decoration: none;"
          v-if="profileValid && $store.state.auth.userDetails && $store.state.auth.userDetails.sellerId">
            <div
              class="text-body1 text-primary"
              >Händlerbereich</div>
          </router-link>
        </div>
        <div>
          <router-link to="/contact"
          style="text-decoration: none;">
            <div
              class="text-body1 text-primary"
              >Impressum und Kontakt</div>
          </router-link>
        </div>
        <div>
          <router-link to="/privacy"
          style="text-decoration: none;">
            <div class="text-body1 text-primary">Hinweise zum Datenschutz</div>
          </router-link>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <div
        class="q-px-md q-pt-md doc-main"
        style="font-weight: 500;">
        <div>
          <!-- Alert to ask user to register -->
          <div
            v-if="showAlertUserNotRegistered"
            class="doc-note doc-note--warning">
            <p class="q-ma-none text-body1 text-weight-bold">Login erforderlich</p>
            <p class="q-ma-none text-body2">
              <a href="#" @click="login()">Hier</a> geht es zur Registrierung und zum Login.
            </p>
          </div>
          <!-- Alert to ask user to completly submit account details -->
          <div
            v-if="showAlertUserNotVerified"
            class="doc-note doc-note--warning">
            <p class="text-body1 text-weight-bold">Profil noch nicht verifiziert</p>
            <ul>
              <li
                v-if="!$auth.user.email_verified"
                class="q-ma-none text-body2">
                Deine Emailadresse wurde noch nicht bestätigt. Bitte öffne dein Email Postfach und klicke auf den Bestätigungslink.
              </li>
              <li
                v-if="!$store.state.auth.userExists || !$store.state.auth.userDetails.isValidated"
                class="q-ma-none text-body2">
                <a @click="$router.push('/profile')">
                  Dein Profil ist noch nicht durch uns verifiziert. Bitte vervollständige die Kontaktinformationen <a href="#profile" to="$router.push('/profile')">hier</a>. Die anschließende Verifizierung kann ein paar Stunden dauern.
                </a>
              </li>
            </ul>
          </div>
        </div>
        <!--
        Auth Loading: {{ this.$auth.loading }} <br />
        User Loading: {{ this.$store.state.auth.loading }} <br />
        Auth isAuthenticated: {{ this.$auth.isAuthenticated }} <br />
        User Exists: {{this.$store.state.auth.userExists}} <br />
        User isValidated: {{ this.$store.state.auth.userDetails ? this.$store.state.auth.userDetails.isValidated : '' }} <br />
        Auth emailVerified: {{ this.$auth.user.email_verified }} <br />
        -->
      </div>
      <router-view class="doc-main q-pa-xs" />
    </q-page-container>
  </q-layout>
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
      axiosRequestCounter: 0,
      drawer: false
    }
  },
  computed: {
    showAlertUserNotRegistered: function () {
      return (!this.$auth.loading &&
              !this.$auth.isAuthenticated &&
              this.$route.path !== '/logout')
    },
    showAlertUserNotVerified: function () {
      return (!this.$auth.loading &&
        this.$auth.isAuthenticated &&
        !this.$store.state.auth.loading && (
        !this.$store.state.auth.userExists ||
        !this.$store.state.auth.userDetails.isValidated ||
        !this.$auth.user.email_verified
      )
      )
    },
    profileValid: function () {
      return !this.$auth.loading &&
        this.$auth.isAuthenticated &&
        this.$auth.user.email_verified
    },
    showProgressSpinner: function () {
      return this.$auth.loading ||
        this.axiosRequestCounter > 0
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
