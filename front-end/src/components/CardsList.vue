<template>
  <div class="d-flex align-center">
    <template v-if="!loading">
      <v-layout row wrap v-if="items.length">
        <v-flex v-for="item in items" :key="item[itemKey]" sm6 md4 lg3 class="pa-2">
          <slot name="card" :item="item"></slot>
        </v-flex>
      </v-layout>
      <div v-else class="empty-container mx-auto">
        {{ emptyText }}
      </div>
    </template>
    <v-progress-circular
      v-else
      class="mt-12 mx-auto"
      indeterminate
      color="primary"
      size="64"/>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    itemKey: {
      type: String,
      required: true
    },
    emptyText: {
      type: String,
      required: false,
      default: 'No items!'
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>

<style>
.empty-container {
  padding: 40px 0;
  text-align: center;
}
</style>

