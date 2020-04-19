<template>
  <q-card style="width: 300px" class="q-pa-sm">
    <q-card-section class="q-pa-none">
      <q-item>
        <q-item-section avatar>
          <q-icon name="shopping_basket" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">Dein Warenkorb</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-separator />
    <q-card-section class="q-pa-none">
      <q-list>
        <q-item v-if="items.length === 0" dense>
          <q-item-section>
              <q-item-label><i>Keine Produkte im Warenkorb</i></q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-for="(item, index) in items" :key="item.id" dense>
        <q-item-section>
          <q-item-label>{{item.name}}</q-item-label>
          <q-item-label caption>{{item.amount | getAsDecimal}}{{item.unit}}</q-item-label>
        </q-item-section>
        <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
            <q-btn flat dense round icon="delete" @click="removeProduct(index)" color="primary" />
            </div>
        </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions align="right" class="q-mt-md">
      <q-btn v-close-popup color="primary" label="Schließen" />
    </q-card-actions>
  </q-card>
</template>

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
    },
    addProduct: function (newProduct) {
      this.items.push(newProduct)
    }
  }
}
</script>
