import {
  WALLET_PASSWORD_SHOW,
  IS_CREATING_WALLET_PASSWORD,
  WALLET_PASSWORD_SUBMIT,
  SET_WALLET_PASSWORD_STATE,
  WALLET_PASSWORD
} from '../actions/wallet-password';

export default {
  state: {
    show: false,
    isCreating: false,
    submit: null
  },
  getters: {
    [WALLET_PASSWORD_SHOW]: ({ show }) => show,
    [IS_CREATING_WALLET_PASSWORD]: ({ isCreating }) => isCreating,
    [WALLET_PASSWORD_SUBMIT]: ({ submit }) => submit
  },
  mutations: {
    [SET_WALLET_PASSWORD_STATE]: (state, data) => Object.assign(state, data)
  },
  actions: {
    [WALLET_PASSWORD]: ({ commit }, isCreating = false) =>
      new Promise((submit) => commit(SET_WALLET_PASSWORD_STATE, ({ show: true, isCreating, submit })))
  }
};
