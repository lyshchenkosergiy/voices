<template>
  <div class="mx-auto auth-container mt-4">
    <v-card class="pa-4">
      <div class="d-flex flex-row justify-end align-center">
        Sign up
        <router-link to="/sign-up" class="ml-2">
          <v-btn icon class="primary">
            <v-icon color="white">mdi-arrow-right</v-icon>
          </v-btn>
        </router-link>
      </div>
      <div class="d-flex pa-4">
        <v-avatar class="mx-auto" size="150">
          <v-img src="../../assets/logo.jpg"></v-img>
        </v-avatar>
      </div>
      <v-text-field
        label="Email"
        v-model="email"
      ></v-text-field>
      <v-text-field
        type="password"
        label="Password"
        v-model="password"
      ></v-text-field>
      <v-btn
        class="d-block mt-4 mx-auto primary"
        @click="signIn"
      >sign in</v-btn>
    </v-card>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify';
import { mapActions } from 'vuex';
import { INIT } from '../../store/actions/user';

export default {
  data: () => ({
    email: '',
    password: ''
  }),
  methods: {
    ...mapActions({
      init: INIT
    }),
    async signIn() {
      try {
        await Auth.signIn(this.email, this.password);
        await this.init();
        this.$router.push({ name: 'Profile' });
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    if(this.$route.params.email) {
      this.email = this.$route.params.email;
      this.$router.replace({ name: 'SignIn', params: {} });
    }
  }
};
</script>
