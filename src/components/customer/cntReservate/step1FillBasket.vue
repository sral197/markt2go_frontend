<template>
  <div class="row">
    <div class="col-12" :class="{'col-md-7' : reservationAllowed}">
      <cnt-select-products
      :groups="groups"
      :reservationAllowed="reservationAllowed"
      v-on:add-product="addProduct">
      </cnt-select-products>
    </div>
    <div class="col-12 col-md-5" v-if="reservationAllowed">
      <cnt-basket-overview
        :items="newReservation.items">
      </cnt-basket-overview>
    </div>
  </div>
</template>

<script>
import cntSelectProducts from 'components/customer/cntReservate/cntSelectProduct'
import cntBasketOverview from 'components/customer/cntReservate/cntBasketOverview'

export default {
  name: 'cntReservationStep1FillBasket',
  components: {
    cntSelectProducts,
    cntBasketOverview
  },
  props: {
    groups: Array,
    reservationAllowed: Boolean,
    newReservation: Object
  },
  methods: {
    addProduct: function (newProduct) {
      this.newReservation.items.push(newProduct)
    }
  }
}
</script>
