<template>
  <q-card class="no-shadow no-border full-width">
    <q-card-section class="q-pa-none">
      <q-item>
        <q-item-section avatar>
            <q-icon name="shopping_basket" />
        </q-item-section>
        <q-item-section>
            <q-item-label class="text-h2">{{labels.title}}</q-item-label>
            <q-item-label caption v-if="labels.caption">{{labels.caption}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-separator inset />
    <q-card-section class="q-pa-none">
      <ul class="q-ma-none">
        <q-list dense>
          <q-item
          v-for="(item, index) in items" :key="index">
            <q-item-section>
              <li>
                <p class="q-ma-none">
                  {{item.name}}
                  {{ showArticleId && item.articleId ? `(Artikelnummer: ${item.articleId})` : ''}}
                </p>
              </li>
            </q-item-section>
            <q-item-section side>
              {{item.amount  | getAsDecimal}} {{item.unit}}
            </q-item-section>
          </q-item>
        </q-list>
      </ul>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  props: ['items', 'labels', 'showArticleId']
}
</script>
