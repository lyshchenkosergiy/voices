<template>
  <div class="mx-auto auth-container mt-4">
    <v-card class="pa-4">
      <div class="d-flex flex-row align-center">
        <router-link to="/sign-in" class="mr-2">
          <v-btn icon class="primary">
            <v-icon color="white">mdi-arrow-left</v-icon>
          </v-btn>
        </router-link>
        Sign in
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
      <v-text-field
        type="password"
        label="Confirm password"
        v-model="confirmPassword"
      ></v-text-field>
      <v-text-field
        label="First name"
        v-model="firstName"
      ></v-text-field>
      <v-text-field
        label="Last name"
        v-model="lastName"
      ></v-text-field>
      <v-btn
        class="d-block mt-4 mx-auto primary"
        @click="signUp"
      >sign up</v-btn>
    </v-card>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  data: () => ({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  }),
  methods: {
    async signUp() {
      try {
        await Auth.signUp({
          username: this.email,
          password: this.password,
          attributes: {
            email: this.email,
            family_name: this.lastName,
            given_name: this.firstName
          }
        });
        this.$router.push({ name: 'ConfirmEmail', params: { email: this.email } });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
