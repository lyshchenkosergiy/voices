<template>
  <v-app>
    <div v-if="initLoading" class="pre-loader d-flex align-center">
      <v-progress-circular
        class="mx-auto"
        indeterminate
        color="primary"
        size="128"
      ></v-progress-circular>
    </div>
    <template v-else>
      <Layout v-if="profile"/>
      <div class="container py-0 py-md-12">
        <router-view/>
      </div>
      <AlertContainer />
    </template>
    <WalletPassword />
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { INIT, PROFILE, INIT_LOADING } from './store/actions/user';
import Layout from './components/Layout';
import AlertContainer from './components/AlertContainer';
import WalletPassword from './components/WalletPassword';

export default {
  components: {
    Layout,
    AlertContainer,
    WalletPassword
  },
  computed: {
    ...mapGetters({
      initLoading: INIT_LOADING,
      profile: PROFILE
    })
  },
  methods: {
    ...mapActions({
      init: INIT
    })
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
.pre-loader {
  height: 100vh;
}

.auth-container {
  max-width: 300px;
}

.float-button {
  position: fixed;
  bottom: 16px;
  right: 16px;
}

.info-card .v-card__text {
  max-height: 200px;
}

a {
  text-decoration: none;
}

a.link:hover {
  text-decoration: underline;
}

p {
  margin-bottom: 0!important;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis .ignore {
  white-space: wrap;
}

.w-full {
  width: 100%;
}

.v-btn:not(.v-btn--round) {
  min-width: 120px!important;
}

@media screen and (max-width: 600px) {
  .v-btn:not(.v-btn--round) {
    min-width: 0!important;
  }
}
</style>
