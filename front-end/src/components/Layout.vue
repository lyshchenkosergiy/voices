<template>
  <div>
    <v-toolbar>
      <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-message</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-calendar</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" absolute temporary :width="fullWidth ? '100%' : '200'">
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-btn icon @click="drawer=!drawer">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="d-flex flex-column align-center">
        <v-avatar class="mx-auto" size="150">
          <v-img :src="avatar"></v-img>
        </v-avatar>
        <div class="mt-4">{{profile.email}}</div>
        <v-list class="mt-4">
          <v-list-item
            v-for="route in routes"
            :key="route.routePath"
            link
            :to="route.routePath"
          >
            <v-list-item-icon>
              <v-icon>{{ route.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ route.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-btn @click="out" class="mt-4 primary mx-auto">
          Sign out
        </v-btn>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { PROFILE, SIGN_OUT } from '../store/actions/user';

const routes = [{
  title: 'Profile',
  routePath: '/profile',
  icon: 'mdi-home'
}, {
  title: 'Available votings',
  routePath: '/available-votings',
  icon: 'mdi-widgets'
}, {
  title: 'My votings',
  routePath: '/my-votings',
  icon: 'mdi-gavel'
}];

export default {
  data: () => ({
    drawer: false,
    routes
  }),
  computed: {
    ...mapGetters({
      profile: PROFILE
    }),
    fullWidth() {
      return this.$vuetify.breakpoint.xs;
    },
    avatar() {
      return this.profile.avatar || require('../assets/user.png');
    }
  },
  methods: {
    ...mapActions({
      signOut: SIGN_OUT
    }),
    out() {
      this.$router.push({ name: 'SignIn' });
      this.signOut();
    }
  }
};
</script>

