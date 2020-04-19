<template>
  <div class="row">
    <div class="col-12">
      <product-picker
      :groups="groups"
      :reservationAllowed="reservationAllowed"
      :sellerName="sellerName"
      v-on:add-product="addProduct">
      </product-picker>
    </div>
  </div>
</template>

<script>
import productPicker from 'components/customer/Reservate/step1FillBasketBasketProductPicker'

export default {
  name: 'cntReservationStep1FillBasket',
  components: {
    productPicker
  },
  props: {
    groups: {
      required: true,
      type: Array
    },
    reservationAllowed: {
      required: true,
      type: Boolean
    },
    newReservation: {
      required: true,
      type: Object
    },
    sellerName: {
      required: true,
      type: String
    }
  },
  methods: {
    addProduct: function (newProduct) {
      this.newReservation.items.push(newProduct)
    }
  }
}
</script>
