<template>
  <div class="chart-wrapper">
    <VueApexChart
      type="donut"
      :options="{ labels }"
      :series="series"/>
  </div>
</template>

<script>
export default {
  props: {
    labels: {
      type: Array,
      required: true
    },
    series: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  max-width: 450px;
}
</style>
