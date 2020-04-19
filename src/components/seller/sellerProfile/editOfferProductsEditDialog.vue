<template>
  <q-dialog
  v-model="dialogOpen"
  v-if="selectedProduct"
  ref="dialog"
  @show="$refs.input_productname.focus()">
    <q-card style="width: 300px" class="q-px-sm q-pb-md">
      <form @submit.prevent.stop="confirm()">
        <q-card-section>
          <div class="text-h6 text-primary" v-if="showTitle">Neues Produkt</div>
          <div class="text-h6 text-primary">{{selectedProduct.name}}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <q-input
            dense
            ref="input_productname"
            v-model="selectedProduct.name"
            label='Produktname'
            counter maxlength="50"
            bottom-slots
            class="col-12"
            :rules="[val => !!val.trim() || 'Bitte ein Produktnamen angeben']">
            </q-input>
          <q-input
            dense
            ref="input_price"
            v-model="selectedProduct.price"
            label='Preis'
            bottom-slots
            type="number"
            class="col-7"
            step="0.01"
            min="0"
            :rules="[
                val => !!val || 'Feld ist leer',
                val => !isNaN(val) || 'Keine Zahl',
                val => val >= 0 || 'Negativer Preis'
            ]">
            </q-input>
            <q-select
            ref="select_unit"
            dense
            bottom-slots
            class="col-5"
            v-model="selectedProduct.unit"
            :options="unitsTemplate"
            label="Einheit">
            <template v-slot:prepend>
                €/
            </template>
            </q-select>
            <q-input
            dense
            ref="input_articleId"
            v-model="selectedProduct.articleId"
            label='Artikelnummer (optional)'
            counter maxlength="30"
            bottom-slots
            class="col-12">
            </q-input>

            <q-input
              dense
              ref="input_description"
              v-model="selectedProduct.description"
              label='Kurzbeschreibung (optional)'
              counter maxlength="100"
              bottom-slots
              type="textarea"
              style="height:100px"
              class="col-12">
              </q-input>
          </div>
        </q-card-section>
        <q-item dense>
          <q-item-section>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat v-close-popup color="primary" label="Abbrechen" />
          <q-btn color="primary" round :icon="mode === 'edit' ? 'edit' : 'add'" type="submit" />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
</template>

<script>
import { units } from 'assets/app.config'

export default {
  props: {
    mode: {
      required: true,
      type: String
    }
  },
  data: function () {
    return {
      unitsTemplate: units,
      dialogOpen: false,
      selectedProduct: null,
      productIndex: null
    }
  },
  computed: {
    showTitle: function () {
      return this.selectedProduct.name.trim().length === 0
    }
  },
  methods: {
    showDialog: function (product, productIndex) {
      this.selectedProduct = { ...product }
      if (!this.selectedProduct.articleId) {
        this.selectedProduct.articleId = ''
      }
      if (!this.selectedProduct.description) {
        this.selectedProduct.description = ''
      }
      this.productIndex = productIndex
      this.dialogOpen = true
    },
    confirm: function () {
      this.selectedProduct.name = this.selectedProduct.name.trim()
      this.selectedProduct.description = this.selectedProduct.description.trim()
      this.selectedProduct.articleId = this.selectedProduct.articleId.trim()
      this.selectedProduct.price = parseFloat(this.selectedProduct.price)

      this.$refs.input_productname.validate()
      this.$refs.input_price.validate()
      this.$refs.select_unit.validate()
      //
      if (!this.$refs.input_productname.hasError &&
        !this.$refs.input_price.hasError &&
        !this.$refs.select_unit.hasError) {
        this.$emit('confirmed', this.selectedProduct, this.productIndex)
        this.$refs.dialog.hide()
      }
    }
  }
}
</script>
