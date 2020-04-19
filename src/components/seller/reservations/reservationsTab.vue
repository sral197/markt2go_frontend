<template>
  <q-tab-panel
    :name="name"
    class="q-pa-none"
  >
    <p v-if="reservations.length === 0">
      <i>{{labelEmptyList}}</i>
    </p>
    <q-list
      bordered
      separator
      class="full-width"
      v-if="reservations && reservations.length > 0">
      <q-item
        clickable
        @click="$router.push(`${$route.params.marketID}/${reservation.id}`)"
        v-ripple
        v-for="reservation in reservations" :key="reservation.id">
        <q-item-section>
          <q-item-label>{{reservation.lastname}}, {{reservation.firstname}}</q-item-label>
          <q-item-label caption>
            {{reservation.pickup | getFormatedDate('d') | getWeekdayStr}}, den
            {{reservation.pickup | getFormatedDate('DD.MM - HH:mm')}}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon name="arrow_forward_ios" color="primary" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-tab-panel>
</template>

<script>
export default {
  props: ['reservations', 'name', 'labelEmptyList']
}
</script>
