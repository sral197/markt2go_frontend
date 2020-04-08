<template>
  <div>
    <doc-header>
        Deine Anfragen
    </doc-header>
    <div class="q-pa-md">
      <q-list
      class="q-pa-xs"
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
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      reservations: []
    }
  },
  methods: {
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
  },
  mounted: function () {
    this.getReservaitonsOfUser()
  }
}
</script>
