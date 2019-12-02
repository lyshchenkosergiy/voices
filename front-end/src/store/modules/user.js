import { Auth } from 'aws-amplify';

import { getMe, initProfile, updateProfile } from '../../api/user';

import { ALERT } from '../actions/alert';
import { GENERATE_WALLET, ENCRYPT_WALLET } from '../actions/web3';
import { WALLET_PASSWORD } from '../actions/wallet-password';
import router from '../../router';

import {
  PROFILE,
  SET_USER_STATE,
  INIT,
  INIT_LOADING,
  SIGN_OUT,
  UPDATE_PROFILE,
  SIGN_IN,
  SIGN_UP,
  CONFIRM_SIGN_UP,
  RESEND_CONFIRM_SIGN_UP_CODE
} from '../actions/user';

export default {
  state: {
    profile: null,
    initLoading: true
  },
  getters: {
    [PROFILE]: ({ profile }) => profile,
    [INIT_LOADING]: ({ initLoading }) => initLoading
  },
  mutations: {
    [SET_USER_STATE]: (state, data) => {
      if (data.profile && data.profile.avatar) {
        data.profile.avatar += `#${Date.now()}`;
      }
      Object.assign(state, data);
    }
  },
  actions: {
    [SIGN_IN]: async ({ dispatch }, { email, password }) => {
      try {
        await Auth.signIn(email, password);
      } catch (error) {
        return dispatch(ALERT, { message: error.message || 'Wrong login or password!', type: 'error' });
      }
      await dispatch(INIT);
      router.push({ name: 'Profile' });
    },
    [SIGN_UP]: async ({ dispatch }, { email, password, firstName, lastName }) => {
      try {
        await Auth.signUp({
          username: email,
          password: password,
          attributes: {
            email,
            family_name: lastName,
            given_name: firstName
          }
        });
      } catch (error) {
        return dispatch(ALERT, { message: error.message || 'Sign up failed!', type: 'error' });
      }
      router.push({ name: 'ConfirmEmail', params: { email } });
    },
    [CONFIRM_SIGN_UP]: async ({ dispatch }, { email, confirmationCode }) => {
      try {
        await Auth.confirmSignUp(email, confirmationCode);
        dispatch(ALERT, { message: 'Email confired!', type: 'success' });
      } catch (error) {
        return dispatch(ALERT, { message: error.message || 'Confirming failed!', type: 'error' });
      }
      router.push({ name: 'SignIn', params: { email } });
    },
    [RESEND_CONFIRM_SIGN_UP_CODE]: async ({ dispatch }, email) => {
      try {
        await Auth.resendSignUp(email);
        dispatch(ALERT, { message: 'Code re-sended!', type: 'success' });
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Code re-sending failed!', type: 'error' });
      }
    },
    [INIT]: async ({ commit, dispatch }) => {
      commit(SET_USER_STATE, { initLoading: true });
      try {
        const user = await Auth.currentAuthenticatedUser();
        let { data: profile } = await getMe();
        if (!profile) {
          const password = await dispatch(WALLET_PASSWORD, true);
          const { privateKey } = await dispatch(GENERATE_WALLET);
          const wallet = JSON.stringify(await dispatch(ENCRYPT_WALLET, { privateKey, password }));
          const { attributes: {
            email,
            given_name: firstName,
            family_name: lastName
          } } = user;
          ({ data: profile } = await initProfile({ wallet, firstName, lastName, email }));
        }
        commit(SET_USER_STATE, { initLoading: false, profile });
      } catch (error) {
        if (error !== 'not authenticated') {
          dispatch(ALERT, { message: error.message || 'Application init failed!', type: 'error' });
        }
        commit(SET_USER_STATE, { initLoading: false });
      }
    },
    [SIGN_OUT]: async ({ commit, dispatch }) => {
      try {
        await Auth.signOut();
        commit(SET_USER_STATE, { profile: null });
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Log out failed!', type: 'error' });
      }
    },
    [UPDATE_PROFILE]: async ({ dispatch, commit }, profileData) => {
      try {
        const { data: profile } = await updateProfile(profileData);
        commit(SET_USER_STATE, { profile });
        dispatch(ALERT, { message: 'Profile updated!', type: 'success' });
      } catch (error) {
        dispatch(ALERT, { message: error.message || 'Profile updating failed!', type: 'error' });
      }
    }
  }
};
