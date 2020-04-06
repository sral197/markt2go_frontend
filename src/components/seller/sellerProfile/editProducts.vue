<template>
  <div>
    <div class="row">
      <!-- Groups -->
      <div class="col-12 col-md-4">
        <q-list class="full-height">
          <q-item-label header>
            <span class="text-h6">Warengruppen</span>
          </q-item-label>
          <q-separator />
          <q-item
          v-if="groups.length === 0"
          clickable
          v-ripple>
            <q-item-section
            @click="selectedGroup = group">
              <q-item-label>
                <i>Keine Warengruppen angelegt.</i>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
          v-for="(group, groupIndex) in groups"
          :key="group.name"
          clickable
          :active="selectedGroup === group"
          v-ripple>
            <q-item-section
            @click="selectedGroup = group">
              <q-item-label>{{ group.name}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" color="primary" flat dense round icon="expand_less" @click="moveItem(groups, groupIndex,-1)" />
                <q-btn class="gt-xs" size="12px" color="primary" flat dense round icon="expand_more" @click="moveItem(groups, groupIndex,1)" />
                <q-btn
                size="12px"
                color="primary"
                flat dense round
                icon="delete"
                @click="removeItem(groups, groupIndex, group.name, true)" />
              </div>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section>
              <div class="row">
                <div class="col-12 text-body1">
                  Warengruppe hinzufügen
                </div>
                <q-input
                dense
                class="col-12"
                ref="input_newGroup"
                v-model="newGroupName"
                label='Warengruppe'
                bottom-slots
                counter maxlength="20"
                :rules="[val => !!val || 'Bitte eine Warengruppe angeben']">
                  <template v-slot:append>
                    <q-btn
                    round dense flat
                    icon="add"
                    @click="addGroup(newGroupName)" />
                  </template>
                </q-input>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- Products -->
      <div class="col-12 col-md-8">
        <q-list
        class="full-height"
        :class="{'q-pl-md' : this.$q.screen.gt.sm}">
          <q-item-label header>
            <span v-if="selectedGroup" class="text-h6">Warengruppe - {{selectedGroup.name}}</span>
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
                <q-btn class="gt-xs" size="12px" color="primary" flat dense round icon="expand_less" @click="moveItem(selectedGroup.products ,productIndex,-1)" />
                <q-btn class="gt-xs" size="12px" color="primary" flat dense round icon="expand_more" @click="moveItem(selectedGroup.products, productIndex,1)" />
                <q-btn size="12px" color="primary" flat dense round icon="delete" @click="removeItem(selectedGroup.products, productIndex, product.name, false)" />
              </div>
            </q-item-section>
          </q-item>
          </div>
          <q-separator />
          <q-item>
            <q-item-section>
              <form @submit.prevent.stop="addProduct(newProduct)">
                <div class="row" v-if="selectedGroup">
                  <span class="col-12 text-body1">
                    Produkt hinzufügen
                  </span>
                  <q-input
                    dense
                    ref="input_newproduct"
                    v-model="newProduct.name"
                    label='Produktname'
                    counter maxlength="50"
                    bottom-slots
                    class="col-12 col-md-7"
                    :rules="[val => !!val.trim() || 'Bitte ein Produktnamen angeben']">
                  </q-input>
                  <q-input
                    dense
                    ref="input_newprice"
                    v-model="newProduct.price"
                    label='Preis'
                    bottom-slots
                    type="number"
                    class="col-7 col-md-2"
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
                    class="col-5 col-md-3"
                    v-model="newProduct.unit"
                    :options="unitsTemplate"
                    label="Einheit">
                    <template v-slot:prepend>
                      €/
                    </template>
                  </q-select>
                  <q-input
                    dense
                    ref="input_newdescription"
                    v-model="newProduct.description"
                    label='Kurzbeschreibung (optional)'
                    counter maxlength="100"
                    bottom-slots
                    class="col-12 col-md-7">
                  </q-input>
                  <q-input
                    dense
                    ref="input_newarticleId"
                    v-model="newProduct.articleId"
                    label='Artikelnummer (optional)'
                    counter maxlength="30"
                    bottom-slots
                    class="col-11 col-md-4">
                  </q-input>
                  <div class="col-1">
                    <q-btn
                    round
                    dense
                    flat
                    color="primary"
                    icon="add"
                    type="submit" />
                  </div>
                </div>
              </form>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
import { units } from 'assets/app.config'

export default {
  props: {
    groups: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      newProduct: {
        unit: 'kg',
        name: '',
        description: '',
        articleId: '',
        price: null
      },
      unitsTemplate: units,
      selectedGroup: null,
      newGroupName: ''
    }
  },
  methods: {
    addGroup: function (newGroupName) {
      newGroupName = newGroupName.trim()
      this.$refs.input_newGroup.validate()
      // Find group names with same name
      var sameGroupNames = this.groups.filter(group => group.name.toLowerCase() === newGroupName.toLowerCase())
      if (sameGroupNames.length > 0) {
        this.showDialog('Die Warengruppe wurde nicht hinzugefügt', 'Ein Warengruppe mit demselben Namen existiert beireits.')
      }
      if (newGroupName.length === 0 ||
        sameGroupNames.length !== 0 ||
        this.$refs.input_newGroup.hasError) {
        return
      }
      this.groups.push({
        name: newGroupName,
        products: []
      })
      // select new group
      this.selectedGroup = this.groups[this.groups.length - 1]
    },
    addProduct: function (newProduct) {
      newProduct.name = newProduct.name.trim()
      newProduct.description = newProduct.description.trim()
      newProduct.articleId = newProduct.articleId.trim()
      newProduct.price = parseFloat(newProduct.price)

      this.$refs.input_newproduct.validate()
      this.$refs.input_newprice.validate()
      this.$refs.select_unit.validate()
      // Find existing products with same name
      var sameProductName = this.selectedGroup.products.filter(product => product.name.toLowerCase().trim() === newProduct.name.toLowerCase())
      if (sameProductName.length > 0) {
        this.showDialog('Das Produkt wurde nicht hinzugefügt', 'Ein Produkt mit demselben Namen existiert beireits.')
      }
      if (!this.$refs.input_newproduct.hasError &&
        !this.$refs.input_newprice.hasError &&
        !this.$refs.select_unit.hasError &&
        sameProductName.length === 0) {
        this.selectedGroup.products.push({ ...newProduct })
      }
    },
    // Remove item out of array (groups and products)
    removeItem: function (array, productIndex, name) {
      // unselect current group
      let message = `Soll der Eintrag "${name}" wirklich gelöscht werden?`
      if (array === this.groups) {
        message = `${message} Alle Produkte dieser Warengruppe werdern ebenfalls gelöscht.`
      }
      this.$q.dialog({
        title: 'Achtung',
        message: message,
        cancel: true,
        persistent: true
      }).onOk(() => {
        array.splice(productIndex, 1)
        if (array === this.groups) {
          this.selectedGroup = null
        }
      })
    },
    // Move item in array (groups and products)
    moveItem: function (array, curIndex, step) {
      const newIndex = curIndex + step
      if (newIndex >= array.length || newIndex < 0) {
        return
      }
      array.splice(newIndex, 0, array.splice(curIndex, 1)[0])
    },
    // Show description in dialog
    showDialog: function (title, description) {
      this.$q.dialog({
        title: title,
        message: description
      })
    }
  }
}
</script>
