import {
  getVotings,
  getMyVotings,
  createVoting,
  deleteVoting,
  joinVoting
} from '../../api/votings';

import { ALERT } from '../actions/alert';
import { WEB3_CREATE_VOTING, DECRYPT_WALLET } from '../actions/web3';
import { WALLET_PASSWORD } from '../actions/wallet-password';
import { PROFILE } from '../actions/user';

import {
  VOTINGS,
  MY_VOTINGS,
  VOTINGS_LOADING,
  MY_VOTINGS_LOADING,
  SET_VOTINGS_STATE,
  GET_VOTINGS,
  GET_MY_VOTINGS,
  CREATE_VOTING,
  DELETE_VOTING,
  JOIN_VOTING
} from '../actions/votings';

export default {
  state: {
    votings: [],
    myVotings: [],
    votingsLoading: false,
    myVotingsLoading: false
  },
  getters: {
    [VOTINGS]: ({ votings }) => votings,
    [MY_VOTINGS]: ({ myVotings }) => myVotings,
    [VOTINGS_LOADING]: ({ votingsLoading }) => votingsLoading,
    [MY_VOTINGS_LOADING]: ({ myVotingsLoading }) => myVotingsLoading
  },
  mutations: {
    [SET_VOTINGS_STATE]: (state, data) => Object.assign(state, data)
  },
  actions: {
    [GET_VOTINGS]: async ({ commit }) => {
      commit(SET_VOTINGS_STATE, { votingsLoading: true });
      try {
        const { data: votings } = await getVotings();
        commit(SET_VOTINGS_STATE, { votingsLoading: false, votings });
      } catch (e) {
        commit(SET_VOTINGS_STATE, { votingsLoading: false });
      }
    },
    [GET_MY_VOTINGS]: async ({ commit }) => {
      commit(SET_VOTINGS_STATE, { myVotingsLoading: true });
      try {
        const { data: myVotings } = await getMyVotings();
        commit(SET_VOTINGS_STATE, { myVotingsLoading: false, myVotings });
      } catch (e) {
        commit(SET_VOTINGS_STATE, { myVotingsLoading: false });
      }
    },
    [CREATE_VOTING]: async ({ state, commit, dispatch }, votingData) => {
      try {
        const address = await dispatch(WEB3_CREATE_VOTING);
        if (address) {
          const { data } = await createVoting({ ...votingData, address });
          const myVotings = [ ...state.myVotings, { ...data, members: [], variants: [] } ];
          commit(SET_VOTINGS_STATE, { myVotings });
          dispatch(ALERT, { message: 'Voting created!', type: 'success' });
          return true;
        }
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Voting creating failed!', type: 'error' });
      }
    },
    [DELETE_VOTING]: async ({ state, dispatch }, votingId) => {
      try {
        const { data } = await deleteVoting(votingId);
        const index = state.myVotings.findIndex(({ _id }) => _id === data);
        state.myVotings.splice(index, 1);
        dispatch(ALERT, { message: 'Voting deleted!', type: 'success' });
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Voting deleting failed!', type: 'error' });
      }
    },
    [JOIN_VOTING]: async ({ dispatch, rootGetters }, votingId) => {
      try {
        const profile = rootGetters[PROFILE];
        const password = await dispatch(WALLET_PASSWORD);
        if (password) {
          const { address } = await dispatch(DECRYPT_WALLET, { encryptedWallet: profile.wallet, password });
          await joinVoting({ votingId, userPublicKey: address });
          dispatch(ALERT, { message: 'Join request created!', type: 'success' });
        }
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Join request creating failed!', type: 'error' });
      }
    }
  }
};
