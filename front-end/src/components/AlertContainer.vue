<template>
  <div class="alert-container">
    <v-alert
      v-for="(alert, index) in alerts"
      :key="index"
      :type="alert.type"
      class="alert"
    >
    <div class="alert-close" @click="() => close(alert)"></div>
    {{alert.message}}
    </v-alert>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { ALERT_STATE, REMOVE_ALERT } from '../store/actions/alert';

export default {
  computed: {
    ...mapGetters({
      alerts: ALERT_STATE
    })
  },
  methods: {
    ...mapMutations({
      removeAlert: REMOVE_ALERT
    }),
    close(alert) {
      alert.canClose && this.removeAlert(alert);
    }
  }
};
</script>

<style>
.alert-container {
  position: fixed;
  top: 10px;
  right: 10px;
  width: 90%;
  max-width: 300px;
  z-index: 1000;
}

.alert-close {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.alert {
  cursor: pointer;
}
</style>
