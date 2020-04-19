<template>
  <div>
    <q-tabs
    v-if="groups"
    v-model="tab"
    inline-label
    align="justify"
    class="text-primary"
    active-color="secondary">
      <q-tab
      v-for="group in groupsVisible"
      :key="group.name"
      :name="group.name"
      :label="group.name">
      </q-tab>
      <q-btn-dropdown
        v-if="groupsHidden.length !== 0"
        auto-close stretch flat label="Mehr...">
        <q-list>
          <q-item clickable
          @click="tab = group.name"
          v-for="group in groupsHidden"
          :key="group.name">
            <q-item-section>{{group.name}}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-tabs>
    <q-tab-panels
      v-model="tab">
      <q-tab-panel
      v-for="group in groups"
      :key="group.name"
      :name="group.name"
      class="q-pa-none">
        <q-list
        separator>
          <q-item
          clickable
          v-ripple
          v-for="product in group.products"
          :key="product.name"
          @click="openDialog(product)">
            <q-item-section>
              {{product.name}}
            </q-item-section>
            <q-item-section side>
              {{product.price | getAsCurrency}}/{{product.unit}}
            </q-item-section>
            <q-item-section avatar side>
              <q-icon name="add" color="primary" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog v-model="dialogOpen" v-if="newProduct && unitSettings[newProduct.unit]">
      <q-card style="width: 300px" class="q-px-sm q-pb-md">
        <form @submit.prevent.stop="sendOrder">
          <q-card-section>
            <div class="text-h6 text-primary">{{newProduct.name}}</div>
            <div class="text-body1">{{newProduct.price | getAsCurrency}}/{{newProduct.unit}}</div>
          </q-card-section>
          <q-separator />
          <q-card-section v-if="newProduct.description">
            <div class="text-body1">{{newProduct.description}}</div>
          </q-card-section>
          <q-separator v-if="newProduct.description" />
          <q-card-section class="q-pa-none">
            <q-item dense>
            <q-item-section class="block">
                <q-chip
                clickable
                @click="setAmountUnit(chip.amount, newProduct.unit)"
                v-for="chip in unitSettings[newProduct.unit].chips" :key="chip.label">
                {{chip.label}}
                </q-chip>
            </q-item-section>
            </q-item>
          </q-card-section>
          <q-item dense>
            <q-item-section>
            <q-input
                dense
                ref="input_amount"
                v-model="newProduct.amount"
                label='Menge'
                type="number"
                bottom-slots
                :rules="[val => !!val || 'Bitte eine Mengenangabe angeben']"
                :suffix="newProduct.unit"
                :step="unitSettings[newProduct.unit].step"
                :min="unitSettings[newProduct.unit].min"
                :max="unitSettings[newProduct.unit].max"
                >
            </q-input>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat v-close-popup color="primary" label="Abbrechen" />
            <q-btn color="primary" round icon="add" @click="addProduct" />
          </q-card-actions>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>

import { unitSettings, units } from 'assets/app.config'

export default {
  props: {
    groups: {
      type: Array,
      required: true
    },
    reservationAllowed: {
      type: Boolean,
      required: true
    },
    sellerName: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      dialogOpen: false,
      tab: '',
      newProduct: {
        name: '',
        unit: '',
        amount: '',
        desciption: null,
        articleId: null
      },
      units: units,
      unitSettings: unitSettings
    }
  },
  computed: {
    splitIndex: function () {
      return this.$q.screen.gt.xs ? 3 : 1
    },
    groupsVisible: function () {
      return this.groups.slice(0, this.splitIndex)
    },
    groupsHidden: function () {
      return this.groups.slice(this.splitIndex, this.groups.length)
    }
  },
  mounted: function () {
    // select first tab
    if (this.groups &&
    this.groups.length > 0) {
      this.tab = this.groups[0].name
    }
  },
  methods: {
    openDialog: function (productDesc) {
      if (this.reservationAllowed) {
        this.newProduct = {
          amount: parseFloat(this.unitSettings[productDesc.unit].chips[0].amount),
          name: productDesc.name,
          unit: productDesc.unit,
          price: productDesc.price,
          description: productDesc.description,
          articleId: productDesc.articleId
        }
        this.dialogOpen = true
      } else {
        // reservation is not allowed
        if (!this.$auth.loading &&
          this.$auth.isAuthenticated &&
          this.$auth.user &&
          !this.$auth.user.email_verified
        ) {
          // profile exists, bus is not verified/confirmed
          this.$q.dialog({
            title: 'Bitte bestätige deine E-Mail-Adresse',
            message: `Um eine Anfrage an den ${this.sellerName} senden zu können, musst du deine E-Mail-Adresse zunächst verifizieren. Öffne dazu dein E-Mail Postfach z.B. in Outlook und klicke auf den Link "E-Mail Adresse bestätigen", den du von uns bekommen hast.`,
            persistent: true,
            ok: {
              label: 'Zurück'
            }
          })
        } else {
          // user does not have an profile
          this.$q.dialog({
            title: 'Bitte logge dich ein',
            message: `Um eine Anfrage an den ${this.sellerName} senden zu können, musst du dich einloggen. Falls du noch kein Profil auf Markt2Go besitzt, kannst du dies hier kostenfrei erstellen. Lediglich deine E-Mail Adresse ist erforderlich.`,
            persistent: true,
            ok: {
              push: true,
              label: 'Zum Login'
            },
            cancel: {
              push: true,
              label: 'Abbrechen'
            }
          }).onOk(() => {
            const targetURL = `${window.location}`
            this.$auth.loginWithRedirect({ redirect_uri: targetURL })
          })
        }
      }
    },
    setAmountUnit: function (amount, unit) {
      this.newProduct.amount = parseFloat(amount)
    },
    addProduct: function () {
      // validate amount
      // Take care that amount is numeric
      this.newProduct.amount = parseFloat(this.newProduct.amount)
      this.$refs.input_amount.validate()
      if (!this.$refs.input_amount.hasError) {
        this.$emit('add-product', { ...this.newProduct })
        this.dialogOpen = false
      }
    }
  }
}
</script>
