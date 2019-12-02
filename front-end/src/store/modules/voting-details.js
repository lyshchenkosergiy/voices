import Vue from 'vue';
import {
  getVotingById,
  createVotingVariant,
  deleteVotingVariant,
  updateVotingVariant,
  startVoting,
  finishVoting,
  acceptMember,
  declineMember,
  vote,
  updateVoting
} from '../../api/votings';

import {
  VOTING_DETAILS,
  VOTING_DETAILS_LOADING,
  SET_VOTING_DETAILS_STATE,
  GET_VOTING_DETAILS,
  ADD_VARIANT,
  DELETE_VARIANT,
  UPDATE_VARIANT,
  UPDATE_VARIANT_REQUEST,
  START_VOTING,
  FINISH_VOTING,
  UPDATE_MEMBER,
  ACCEPT_MEMBER,
  DECLINE_MEMBER,
  VOTE,
  UPDATE_VOTING
} from '../actions/voting-details';
import {
  WEB3_CREATE_VARIANT,
  WEB3_ADD_MEMBER,
  WEB3_START_VOTING,
  WEB3_ADD_VOTE,
  WEB3_FINISH_VOTING
} from '../actions/web3';
import { ALERT } from '../actions/alert';

export default {
  state: {
    votingDetails: null,
    votingDetailsLoading: false
  },
  getters: {
    [VOTING_DETAILS]: ({ votingDetails }) => votingDetails,
    [VOTING_DETAILS_LOADING]: ({ votingDetailsLoading }) => votingDetailsLoading
  },
  mutations: {
    [SET_VOTING_DETAILS_STATE]: (state, data) => Object.assign(state, data),
    [UPDATE_MEMBER]: ({ votingDetails }, data) => {
      const index = votingDetails.members.findIndex(({ _id }) => _id === data._id);
      Vue.set(votingDetails.members, index, data);
    },
    [UPDATE_VARIANT]: ({ votingDetails }, data) => {
      const index = votingDetails.variants.findIndex(({ _id }) => _id === data._id);
      if (data.avatar) {
        data.avatar += `#${Date.now()}`;
      }
      Vue.set(votingDetails.variants, index, data);
    }
  },
  actions: {
    [GET_VOTING_DETAILS]: async ({ commit }, id) => {
      commit(SET_VOTING_DETAILS_STATE, { votingDetailsLoading: true });
      try {
        const { data: votingDetails } = await getVotingById(id);
        commit(SET_VOTING_DETAILS_STATE, { votingDetailsLoading: false, votingDetails });
      } catch (e) {
        commit(SET_VOTING_DETAILS_STATE, { votingDetailsLoading: false });
      }
    },
    [ADD_VARIANT]: async ({ getters, state, commit, dispatch }, variantData) => {
      try {
        const { data } = await createVotingVariant(variantData);

        const { address } = getters[VOTING_DETAILS];
        const success = await dispatch(WEB3_CREATE_VARIANT, { address, name: data._id });
        if (success) {
          const votingDetails = { ...state.votingDetails, variants: [...state.votingDetails.variants, data] };
          commit(SET_VOTING_DETAILS_STATE, { votingDetails });
          dispatch(ALERT, { message: 'Variant added!', type: 'success' });
          return true;
        } else {
          await deleteVotingVariant(data._id);
          throw new Error();
        }
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Variant adding failed!', type: 'error' });
      }
    },
    [DELETE_VARIANT]: async ({ state, dispatch }, variantId) => {
      try {
        const { data } = await deleteVotingVariant(variantId);
        const index = state.votingDetails.variants.findIndex(({ _id }) => _id === data);
        state.votingDetails.variants.splice(index, 1);
        dispatch(ALERT, { message: 'Variant deleted!', type: 'success' });
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Variant deleting failed!', type: 'error' });
      }
    },
    [UPDATE_VARIANT_REQUEST]: async ({ dispatch, commit }, { id, variantData }) => {
      try {
        const { data } = await updateVotingVariant(id, variantData);
        commit(UPDATE_VARIANT, data);
        dispatch(ALERT, { message: 'Variant updated!', type: 'success' });
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Variant updating failed!', type: 'error' });
      }
    },
    [START_VOTING]: async ({ getters, dispatch }) => {
      try {
        const { address, _id } = getters[VOTING_DETAILS];
        const success = await dispatch(WEB3_START_VOTING, { address });
        if (success) {
          await startVoting(_id);
          dispatch(ALERT, { message: 'Voting started!', type: 'success' });
        }
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Voting starting failed!', type: 'error' });
      }
    },
    [FINISH_VOTING]: async ({ getters, dispatch }) => {
      try {
        const { address, _id } = getters[VOTING_DETAILS];
        const success = await dispatch(WEB3_FINISH_VOTING, { address });
        if (success) {
          await finishVoting(_id);
          dispatch(ALERT, { message: 'Voting finished!', type: 'success' });
        }
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Voting finishing failed!', type: 'error' });
      }
    },
    [ACCEPT_MEMBER]: async ({ getters, commit, dispatch }, { _id, userPublicKey }) => {
      try {
        const { address } = getters[VOTING_DETAILS];
        const success = await dispatch(WEB3_ADD_MEMBER, { address, userPublicKey });
        if (success) {
          const { data } = await acceptMember(_id);
          commit(UPDATE_MEMBER, data);
          dispatch(ALERT, { message: 'Join request accepted!', type: 'success' });
        }
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Join request accepting failed!', type: 'error' });
      }
    },
    [DECLINE_MEMBER]: async ({ commit, dispatch }, memberId) => {
      try {
        const { data } = await declineMember(memberId);
        commit(UPDATE_MEMBER, data);
        dispatch(ALERT, { message: 'Join request declined!', type: 'success' });
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Join request declining failed!', type: 'error' });
      }
    },
    [VOTE]: async ({ getters, dispatch }, voteData) => {
      try {
        const { address } = getters[VOTING_DETAILS];
        const result = await dispatch(WEB3_ADD_VOTE, { address, name: voteData.variantId });
        if (result) {
          const { transactionHash } = result;
          Object.assign(voteData, { transactionHash });
          await vote(voteData);
          dispatch(ALERT, { message: 'Your vote added!', type: 'success' });
        }
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Adding of you vote failed!', type: 'error' });
      }
    },
    [UPDATE_VOTING]: async ({ state, dispatch, commit }, votingData) => {
      try {
        const { data } = await updateVoting(state.votingDetails._id, votingData);
        const votingDetails = { ...state.votingDetails, ...data };
        commit(SET_VOTING_DETAILS_STATE, { votingDetails });
        dispatch(ALERT, { message: 'Voting updated!', type: 'success' });
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Voting updating failed!', type: 'error' });
      }
    }
  }
};
