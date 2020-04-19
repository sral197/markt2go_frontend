<template>
  <q-list
  class="full-height"
  :class="{'q-pl-md' : this.$q.screen.gt.sm}">
      <q-item-label header>
        <span v-if="selectedGroup" class="text-h6">Warengruppe: {{selectedGroup.name}}</span>
        <span v-else class="text-h6">Keine Warengruppe ausgewählt</span>
      </q-item-label>
      <q-separator v-if="selectedGroup" />
      <div v-if="selectedGroup">
      <q-item
      v-if="selectedGroup && selectedGroup.products.length === 0"
      class="q-my-sm">
        <q-item-section
        @click="selectedGroup = group">
            <q-item-label>
            <i>Keine Produkte zu dieser Warengruppe angelegt.</i>
            </q-item-label>
        </q-item-section>
      </q-item>
      <q-item
      v-for="(product, productIndex) in selectedGroup.products"
      :key="product.name"
      class="q-my-sm">
        <q-item-section>
          <q-item-label>
          {{ product.name }}
          <q-btn
          v-if="!!product.description"
          class="gt-xs text-grey-8"
          size="12px"
          flat dense round icon="info"
          @click="showDialog('Kurzbeschreibung', product.description)"
          />
          <span v-if="!!product.articleId">
              <i>({{product.articleId}})</i>
          </span>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
          <q-item-label>{{ product.price | getAsCurrency }}/{{product.unit}}</q-item-label>
      </q-item-section>
      <q-item-section side>
          <div class="text-grey-8 q-gutter-xs">
          <q-btn class="gt-xs" size="12px" color="primary" flat dense round icon="expand_less" @click="moveProduct(productIndex,-1)" />
          <q-btn class="gt-xs" size="12px" color="primary" flat dense round icon="expand_more" @click="moveProduct(productIndex,1)" />
          <q-btn size="12px" color="primary" flat dense round icon="edit" @click="$refs.editDialog.showDialog(product, productIndex)" />
          <q-btn size="12px" color="primary" flat dense round icon="delete" @click="removeProduct( productIndex, product.name, false)" />
          </div>
      </q-item-section>
      </q-item>
      </div>
      <q-separator />
      <q-item>
        <q-item-section>
        </q-item-section>
        <q-item-section side>
          <q-btn
          round
          dense
          flat
          align="right"
          color="primary"
          icon="add"
          @click="addProduct"
          v-if="selectedGroup" />
        </q-item-section>
      </q-item>
      <edit-dialog
      ref="editDialog"
      mode="edit"
      @confirmed="productEdited">
      </edit-dialog>
      <edit-dialog
      ref="addDialog"
      mode="add"
      @confirmed="productAdded">
      </edit-dialog>
  </q-list>
</template>

<script>
import editDialog from 'components/seller/sellerProfile/editOfferProductsEditDialog'

export default {
  props: {
    selectedGroup: Object
  },
  components: {
    editDialog
  },
  data: function () {
    return {
    }
  },
  computed: {
    products: function () {
      return this.selectedGroup.products
    }
  },
  methods: {
    addProduct: function (newProduct) {
      this.$refs.addDialog.showDialog({
        unit: 'kg',
        name: '',
        description: '',
        articleId: '',
        price: null
      }, null)
    },
    // Remove product
    removeProduct: function (productIndex, name) {
      // unselect current group
      const message = `Soll das Produkt "${name}" wirklich gelöscht werden?`
      this.$q.dialog({
        title: 'Achtung',
        message: message,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.products.splice(productIndex, 1)
      })
    },
    // Move item in array (groups and products)
    moveProduct: function (curIndex, step) {
      const newIndex = curIndex + step
      if (newIndex >= this.products.length || newIndex < 0) {
        return
      }
      this.products.splice(newIndex, 0, this.products.splice(curIndex, 1)[0])
    },
    // Show description in dialog
    showDialog: function (title, description) {
      this.$q.dialog({
        title: title,
        message: description
      })
    },
    // Event from dialog: Product has been edited
    productEdited: function (editedProduct, index) {
      if (this.doesProductNameExistAlready(editedProduct.name, index)) {
        this.showDialog('Produkt nicht geändert', 'Ein Produkt mit demselben Namen existiert in dieser Warengruppe bereits.')
      } else {
        this.$set(this.selectedGroup.products, index, editedProduct)
      }
    },
    // Event from dialog: Product has been added
    productAdded: function (newProduct, index) {
      if (this.doesProductNameExistAlready(newProduct.name)) {
        this.showDialog('Produkt nicht hinzugefügt', 'Ein Produkt mit demselben Namen existiert in dieser Warengruppe bereits.')
      } else {
        this.selectedGroup.products.push(newProduct)
      }
    },
    // Check if the product name already exists
    doesProductNameExistAlready: function (productName, index) {
      productName = productName.trim()
      var sameProductNames = this.selectedGroup.products.filter((product, i) => product.name.toLowerCase() === productName.toLowerCase() && i !== index)
      return sameProductNames.length !== 0
    }
  }
}
</script>
