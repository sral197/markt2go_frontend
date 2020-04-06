<template>
  <div>
    <div class="row">
      <p class="q-pa-md">
        <slot></slot>
      </p>
    </div>
    <div class="row">
      <q-field
          dense
          label='Kunde'
          bottom-slots
          stack-label
          readonly
          ref="input_name"
          class="q-pa-md col-12 col-md-3">
          <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">
              {{`${reservation.user.lastname}, ${reservation.user.firstname}`}}
          </div>
          </template>
      </q-field>
      <q-field
          dense
          label='Abholzeit'
          bottom-slots
          stack-label
          readonly
          ref="input_pickup"
          class="q-pa-md col-12 col-md-3">
          <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">
              {{reservation.pickup | getFormatedDate('d') | getWeekdayStr}},
              {{reservation.pickup | getFormatedDate('DD.MM. - HH:mm')}}
          </div>
          </template>
      </q-field>
      <q-field
          dense
          label='Telefonnummer'
          bottom-slots
          stack-label
          readonly
          ref="input_phone"
          class="q-pa-md col-12 col-md-3">
          <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">
              {{reservation.user.phone}}
          </div>
          </template>
      </q-field>
      <q-field
          dense
          label='Email'
          bottom-slots
          stack-label
          readonly
          ref="input_email"
          class="q-pa-md col-12 col-md-3">
          <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{reservation.user.mail}}
          </div>
          </template>
      </q-field>
    </div>
    <div class="row">
      <cnt-show-items
        :items="reservation.items"
        :labels="{
          title: 'Warenkorb des Kunden',
          caption: null
        }"
        :showArticleId='true'
      >
      </cnt-show-items>
    </div>
    <div class="q-pa-md">
      <q-input
        style="height:100px"
        v-model="reservation.sellerComment"
        filled
        type="textarea"
        stack-label
        label="Deine Nachricht an den Kunden"
        bottom-slots
        counter maxlength="500"
        :readonly="commentReadonly"
        error-message="Bitte gib eine Nachricht an den Kunden ein."
        :error="commentRequired"
      />
    </div>
  </div>
</template>
<script>
import cntShowItems from 'components/cntShowItems'

export default {
  components: {
    cntShowItems
  },
  data: function () {
    return {
      commentRequired: false
    }
  },
  props: {
    reservation: Object,
    commentReadonly: Boolean
  },
  methods: {
    validateCommentSet: function () {
      // check if seller comment is set, show validation text and return the result
      var comment = this.reservation.sellerComment
      this.commentRequired = (!comment || comment.trim().length === 0)
      return !this.commentRequired
    }
  }
}
</script>
