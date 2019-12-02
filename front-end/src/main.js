import '@mdi/font/css/materialdesignicons.css';

const {
  VUE_APP_IDENTITY_POOL_ID,
  VUE_APP_AWS_REGION,
  VUE_APP_IMAGES_S3_BUCKET,
  VUE_APP_USER_POOL_ID,
  VUE_APP_USER_POOL_WEBCLIENT_ID
} = process.env;

const Auth = {
  identityPoolId: VUE_APP_IDENTITY_POOL_ID,
  region: VUE_APP_AWS_REGION,
  userPoolId: VUE_APP_USER_POOL_ID,
  userPoolWebClientId: VUE_APP_USER_POOL_WEBCLIENT_ID
};

const Storage = {
  AWSS3: {
    region: VUE_APP_AWS_REGION,
    bucket: VUE_APP_IMAGES_S3_BUCKET
  }
};

import Amplify from 'aws-amplify';
Amplify.configure({ Auth, Storage });

import VueApexChart from 'vue-apexcharts';
Vue.component('VueApexChart', VueApexChart);

import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import vuetify from './plugins/vuetify';

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
