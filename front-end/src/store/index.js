import Vue from 'vue';
import Vuex from 'vuex';

import alert from './modules/alert';
import user from './modules/user';
import votings from './modules/votings';
import votingDetails from './modules/voting-details';
import aws from './modules/aws';
import walletPassword from './modules/wallet-password';
import web3 from './modules/web3';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: [
    alert,
    user,
    votings,
    votingDetails,
    aws,
    walletPassword,
    web3
  ]
});
