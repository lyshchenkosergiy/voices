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
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          label="Email"
          v-model="email"
          :rules="[rule_required, rule_email]"
        ></v-text-field>
        <v-text-field
          type="password"
          label="Password"
          v-model="password"
          :rules="[rule_required, rule_alpha_num, rule_length(6, 16)]"
        ></v-text-field>
        <v-text-field
          type="password"
          label="Confirm password"
          v-model="confirmPassword"
          :rules="[rule_required, rule_alpha_num, rule_length(6, 16), passwordMatch]"
        ></v-text-field>
        <v-text-field
          label="First name"
          v-model="firstName"
          :rules="[rule_required, rule_alpha, rule_length(6, 16)]"
        ></v-text-field>
        <v-text-field
          label="Last name"
          v-model="lastName"
          :rules="[rule_required, rule_alpha, rule_length(6, 16)]"
        ></v-text-field>
      </v-form>
      <v-btn
        class="d-block mt-4 mx-auto primary"
        :disabled="!valid"
        :loading="loading"
        @click="signUp"
      >sign up</v-btn>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { SIGN_UP } from '../../store/actions/user';
import ValidationRules from '../../utils/validation-rules';

export default {
  mixins: [ValidationRules],
  data: () => ({
    valid: true,
    loading: false,
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  }),
  methods: {
    ...mapActions({
      signUpRequest: SIGN_UP
    }),
    async signUp() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        await this.signUpRequest({
          email: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName
        });
      }
      this.loading = false;
    },
    passwordMatch() {
      return this.password === this.confirmPassword || 'Passwords should match!';
    }
  }
};
</script>
