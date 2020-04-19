<template>
  <div>
    <div class="row">
      <!-- Groups -->
      <div class="col-12 col-md-5">
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
                <q-btn class="gt-xs" size="12px" color="primary" flat dense round icon="expand_less" @click="moveGroup(groups, groupIndex,-1)" />
                <q-btn class="gt-xs" size="12px" color="primary" flat dense round icon="expand_more" @click="moveGroup(groups, groupIndex,1)" />
                <q-btn size="12px" color="primary" flat dense round icon="edit"  @click="editGroup(group)" />
                <q-btn size="12px" color="primary" flat dense round icon="delete"  @click="removeGroup(groupIndex, group.name)" />
              </div>
            </q-item-section>
          </q-item>
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
                @click="addGroup" />
            </q-item-section>
          </q-item>
          <!--
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
          -->
        </q-list>
      </div>
      <!-- Products -->
      <edit-products
        class="col-12 col-md-7"
        :selectedGroup="selectedGroup"
       />
    </div>
  </div>
</template>

<script>

import editProducts from 'components/seller/sellerProfile/editOfferProducts'

export default {
  props: {
    groups: {
      type: Array,
      required: true
    }
  },
  components: {
    editProducts
  },
  data: function () {
    return {
      selectedGroup: null
    }
  },
  methods: {
    addGroup: function (newGroupName) {
      this.$q.dialog({
        title: 'Neue Warengruppe',
        message: 'Wie lautet der Name der Warengruppe?',
        prompt: {
          model: '',
          type: 'text',
          isValid: val => val.trim().length > 0
        },
        cancel: true,
        persistent: true
      }).onOk(newGroupName => {
        newGroupName = newGroupName.trim()
        var sameGroupNames = this.groups.filter(group => group.name.toLowerCase() === newGroupName.toLowerCase())
        if (sameGroupNames.length > 0) {
          this.showDialog('Die Warengruppe wurde nicht hinzugefügt', 'Ein Warengruppe mit demselben Namen existiert bereits.')
        }
        if (newGroupName.length === 0 ||
          sameGroupNames.length !== 0) {
          return
        }
        this.groups.push({
          name: newGroupName,
          products: []
        })
        // select new group
        this.selectedGroup = this.groups[this.groups.length - 1]
      })
    },
    editGroup: function (group) {
      const groupNameEdit = group.name
      this.$q.dialog({
        title: 'Warengruppe ändern',
        message: 'Wie lautet der neue Name?',
        prompt: {
          model: groupNameEdit,
          type: 'text',
          isValid: val => val.trim().length > 0
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        group.name = data
      })
    },
    // Remove group
    removeGroup: function (groupIndex, name) {
      // unselect current group
      let message = `Soll die Warengruppe "${name}" wirklich gelöscht werden?`
      message = `${message} Alle Produkte dieser Warengruppe werdern ebenfalls gelöscht.`
      this.$q.dialog({
        title: 'Achtung',
        message: message,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.groups.splice(groupIndex, 1)
        this.selectedGroup = null
      })
    },
    // Move group
    moveGroup: function (array, curIndex, step) {
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
