<template>
  <div class="q-px-md q-pt-md">
    <!-- Breadcrumb -->
    <div class="q-gutter-sm">
      <q-breadcrumbs v-if="breadcrumbList && breadcrumbList.length > 0">
        <q-breadcrumbs-el icon="home" to="/market" />
        <q-breadcrumbs-el v-for="(breadcrumb) in breadcrumbList" :key="breadcrumb.to"
          :label="breadcrumb.label"
          :icon="breadcrumb.icon"
          :to="breadcrumb.to" />
      </q-breadcrumbs>
    </div>
    <!-- Title -->
    <h1 class="q-mb-none">
      <q-item>
        <q-item-section avatar v-if="icon">
          <q-icon
          :name="icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <slot />
          </q-item-label>
          <q-item-label caption>{{caption}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
    </h1>
  </div>
</template>
<style scoped>

</style>

<script>
export default {
  name: 'componentDocHeader',
  props: {
    icon: String,
    caption: String,
    breadcrumbList: Array
  }
}
</script>
