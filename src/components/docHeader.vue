<template>
  <div class="q-px-md q-pt-md">
    <!-- Breadcrumb -->
    <div class="q-gutter-sm">
      <q-breadcrumbs v-if="breadcrumbList">
        <q-breadcrumbs-el label=" " icon="home" to="/market" :class="{headerColor : breadcrumbList.length === 0}" />
        <q-breadcrumbs-el v-for="(breadcrumb, i) in breadcrumbList" :key="breadcrumb.to"
          :label="breadcrumb.label"
          :icon="breadcrumb.icon"
          :to="breadcrumb.to"
          :class="{headerColor : i === breadcrumbList.length - 1}" />
      </q-breadcrumbs>
    </div>
    <!-- Title -->
    <q-item>
      <q-item-section avatar v-if="icon">
        <q-icon
          :name="icon"
          style="font-size:30px"
          class="headerColor"
          />
      </q-item-section>
      <q-item-section>
        <q-item-label class="headerColor text-h4">
          <slot />
        </q-item-label>
        <q-item-label caption>{{caption}}</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator color="grey-6" />
  </div>
</template>
<style scoped>
  .headerColor {
    color: rgba(0, 0, 0, 0.7)
  }
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
