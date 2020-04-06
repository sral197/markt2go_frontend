<template>
  <div :class="{'q-pl-md' : this.$q.screen.gt.sm}">
    <q-item class="headerColor">
      <q-item-section avatar>
        <q-icon name="shopping_basket" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6">Warenkorb</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-list>
      <q-item v-if="items.length === 0" dense>
        <q-item-section>
            <q-item-label><i>Keine Produkte im Warenkorb</i></q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-for="(item, index) in items" :key="item.id" dense>
      <q-item-section>
        <q-item-label>{{item.name}}</q-item-label>
        <q-item-label caption>{{item.amount}}{{item.unit}}</q-item-label>
      </q-item-section>
      <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
          <q-btn flat dense round icon="delete" @click="removeProduct(index)" color="primary" />
          </div>
      </q-item-section>
      </q-item>
    </q-list>
</div>
</template>
<style scoped>
  .headerColor {
    color: rgba(0, 0, 0, 0.7)
  }
</style>

<script>
export default {
  props: {
    items: Array
  },
  data: function () {
    return {
    }
  },
  methods: {
    removeProduct: function (index) {
      this.items.splice(index, 1)
      // this.$emit('removeProduct', index)
    },
    addProduct: function (newProduct) {
      this.items.push(newProduct)
    }
  }
}
</script>
