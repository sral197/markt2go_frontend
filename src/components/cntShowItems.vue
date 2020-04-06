<template>
    <q-card class="no-shadow no-border full-width">
      <q-card-section class="q-pa-none">
        <q-item class="headerColor">
          <q-item-section avatar>
              <q-icon name="shopping_basket" />
          </q-item-section>
          <q-item-section>
              <q-item-label class="text-h6">{{labels.title}}</q-item-label>
              <q-item-label caption v-if="labels.caption">{{labels.caption}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div class="row">
          <div class="col-12 col-md-4 q-mb-xs"
          v-for="(item, index) in items" :key="index">
          <ul>
            <li>
              <p class="q-ma-none">
                {{item.name}}
                {{ showArticleId && item.articleId ? `(Artikelnummer: ${item.articleId})` : ''}}
              </p>
              <p style="color:rgba(0, 0, 0, 0.54)" class=" col-4 text-caption">
                {{item.amount}}{{item.unit}}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<style scoped>
  .headerColor {
    color: rgba(0, 0, 0, 0.7)
  }
</style>
<script>
export default {
  props: ['items', 'labels', 'showArticleId']
}
</script>
