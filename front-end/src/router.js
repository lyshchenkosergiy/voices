import Vue from 'vue';
import Router from 'vue-router';
import { Auth } from 'aws-amplify';

import Profile from './views/Profile';
import AvailableVotings from './views/AvailableVotings';
import MyVotings from './views/MyVotings';
import VotingDetails from './views/VotingDetails';

import SignIn from './views/auth/SignIn';
import SignUp from './views/auth/SignUp';
import ConfirmEmail from './views/auth/ConfirmEmail';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [{
    path: '/profile',
    name: 'Profile',
    component: Profile
  }, {
    path: '/available-votings',
    name: 'AvailableVotings',
    component: AvailableVotings
  }, {
    path: '/my-votings',
    name: 'MyVotings',
    component: MyVotings
  }, {
    path: '/voting/:id',
    name: 'VotingDetails',
    component: VotingDetails
  }, {
    path: '/sign-in/:email?',
    name: 'SignIn',
    component: SignIn,
    meta: { auth: true }
  }, {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
    meta: { auth: true }
  }, {
    path: '/confirm-email/:email',
    name: 'ConfirmEmail',
    component: ConfirmEmail,
    meta: { auth: true }
  }, {
    path: '*',
    redirect: '/profile'
  }]
});

router.beforeResolve(async (to, from, next) => {
  let user;
  try {
    user = await Auth.currentAuthenticatedUser();
  } catch (e) {
    console.log('Not authorized!');
  }
  if (!to.meta.auth && !user) {
    next('sign-in');
  }
  if (to.meta.auth && user) {
    next('profile');
  }
  next();
});

export default router;
