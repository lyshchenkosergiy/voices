import Web3 from 'web3';
import { requestFunds } from '../../api/system';
import { abi, bytecode } from '../../utils/Voting';

import {
  GENERATE_WALLET,
  ENCRYPT_WALLET,
  DECRYPT_WALLET,
  ADD_WALLET,
  REMOVE_WALLET,
  SIGNED_WEB3_ACTION,
  WEB3_CREATE_VOTING,
  WEB3_CREATE_VARIANT,
  WEB3_ADD_MEMBER,
  WEB3_START_VOTING,
  WEB3_FINISH_VOTING,
  WEB3_ADD_VOTE,
  WEB3_RESULTS,
  WEB3_GET_RESULTS,
  WEB3_SET_STATE
} from '../actions/web3';
import { WALLET_PASSWORD } from '../actions/wallet-password';
import { PROFILE } from '../actions/user';
import { ALERT } from '../actions/alert';

const { VUE_APP_INFURA_URL } = process.env;
const web3 = new Web3(new Web3.providers.HttpProvider(VUE_APP_INFURA_URL));

export default {
  state: {
    results: []
  },
  getters: {
    [WEB3_RESULTS]: ({ results }) => results
  },
  mutations: {
    [WEB3_SET_STATE]: (state, data) => Object.assign(state, data)
  },
  actions: {
    // GENERAL ACTIONS
    [GENERATE_WALLET]: () => web3.eth.accounts.create(),
    // eslint-disable-next-line
    [ENCRYPT_WALLET]: ({}, { privateKey, password }) => web3.eth.accounts.encrypt(privateKey, password),
    // eslint-disable-next-line
    [DECRYPT_WALLET]: ({}, { encryptedWallet, password }) => web3.eth.accounts.decrypt(encryptedWallet, password),
    // eslint-disable-next-line
    [ADD_WALLET]: ({}, privateKey) => web3.eth.accounts.wallet.add(privateKey),
    // eslint-disable-next-line
    [REMOVE_WALLET]: ({}, publicKey) => web3.eth.accounts.wallet.remove(publicKey),
    // SIGNED_WEB3_ACTION
    [SIGNED_WEB3_ACTION]: async ({ rootGetters, dispatch }, tx) => {
      const profile = rootGetters[PROFILE];
      const password = await dispatch(WALLET_PASSWORD);
      if (password) {
        const { address, privateKey } = await dispatch(DECRYPT_WALLET, { encryptedWallet: profile.wallet, password });
        await dispatch(ADD_WALLET, privateKey);

        const gas = await tx.estimateGas({ from: address });
        const gasPrice = await web3.eth.getGasPrice();
        const value = new web3.utils.BN(gas).mul(new web3.utils.BN(gasPrice)).toString();

        await requestFunds({ address, value });

        const result = await tx.send({ from: address, gas, gasPrice });
        await dispatch(REMOVE_WALLET, address);
        return result;
      }
    },
    // VOTING ACTIONS
    [WEB3_CREATE_VOTING]: async ({ dispatch }) => {
      const instance = new web3.eth.Contract(abi);
      const tx = instance.deploy({ data: bytecode });
      const result = await dispatch(SIGNED_WEB3_ACTION, tx);
      return result ? result._address : false;
    },
    [WEB3_CREATE_VARIANT]: async ({ dispatch }, { address, name }) => {
      const instance = new web3.eth.Contract(abi, address);
      const tx = instance.methods.addVariant(web3.utils.asciiToHex(name));
      const result = await dispatch(SIGNED_WEB3_ACTION, tx);
      return result;
    },
    [WEB3_ADD_MEMBER]: async ({ dispatch }, { address, userPublicKey }) => {
      const instance = new web3.eth.Contract(abi, address);
      const tx = instance.methods.addVoter(userPublicKey);
      const result = await dispatch(SIGNED_WEB3_ACTION, tx);
      return result;
    },
    [WEB3_START_VOTING]: async ({ dispatch }, { address }) => {
      const instance = new web3.eth.Contract(abi, address);
      const tx = instance.methods.startVoting();
      const result = await dispatch(SIGNED_WEB3_ACTION, tx);
      return result;
    },
    [WEB3_FINISH_VOTING]: async ({ dispatch }, { address }) => {
      const instance = new web3.eth.Contract(abi, address);
      const tx = instance.methods.finishVoting();
      const result = await dispatch(SIGNED_WEB3_ACTION, tx);
      return result;
    },
    [WEB3_ADD_VOTE]: async ({ dispatch }, { address, name }) => {
      const instance = new web3.eth.Contract(abi, address);
      const tx = instance.methods.addVote(web3.utils.asciiToHex(name));
      const result = await dispatch(SIGNED_WEB3_ACTION, tx);
      return result;
    },
    [WEB3_GET_RESULTS]: async ({ commit, dispatch }, { address, variants }) => {
      try {
        const results = [];
        const instance = new web3.eth.Contract(abi, address);
        await Promise.all(variants.map(async ({ _id, name }) => {
          const value = await instance.methods.getResults(web3.utils.asciiToHex(_id)).call();
          results.push({ name, value });
        }));
        commit(WEB3_SET_STATE, { results });
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Loading results from blockchain failded!' });
      }
    }
  }
};
