<template>
  <div class="mx-auto auth-container mt-4">
    <v-card class="pa-4">
      <div class="d-flex flex-row align-center">
        <router-link to="/sign-up">
          <v-btn icon class="primary mr-2">
            <v-icon color="white">mdi-arrow-left</v-icon>
          </v-btn>
        </router-link>
        Sign up
      </div>
      <div class="mt-3 d-flex flex-row align-center">
        <v-btn icon class="primary mr-2" @click="resendConfirmationCode">
          <v-icon color="white">mdi-email</v-icon>
        </v-btn>
        Recend code
      </div>
      <div class="d-flex pa-4">
        <v-avatar class="mx-auto" size="150">
          <v-img src="../../assets/logo.jpg"></v-img>
        </v-avatar>
      </div>
      <div class="text-center">
        We sent confirmation code to {{ email }}
      </div>
      <v-text-field
        class="mt-4"
        label="Your confirmation code"
        v-model="confirmationCode"
      ></v-text-field>
      <v-btn
        class="d-block mt-4 mx-auto primary"
        @click="confirmSignUp"
      >Send</v-btn>
    </v-card>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  data: () => ({
    email: '',
    confirmationCode: ''
  }),
  methods: {
    async confirmSignUp() {
      try {
        await Auth.confirmSignUp(this.email, this.confirmationCode);
        this.$router.push({ name: 'SignIn', params: { email: this.email } });
      } catch (error) {
        console.log(error);
      }
    },
    async resendConfirmationCode() {
      try {
        await Auth.resendSignUp(this.email);
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.$route.params.email
      ? (this.email = this.$route.params.email)
      : this.$router.push({ name: 'SignUp' });
  }
};
</script>
