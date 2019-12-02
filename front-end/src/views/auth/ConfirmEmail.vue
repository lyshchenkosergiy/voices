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
        <v-btn icon class="primary mr-2" @click="() => resendConfirmationCode(email)">
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
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          class="mt-4"
          label="Your confirmation code"
          v-model="confirmationCode"
          :rules="[rule_required, rule_num, rule_length(6)]"
        ></v-text-field>
      </v-form>
      <v-btn
        class="d-block mt-4 mx-auto primary"
        :disabled="!valid"
        :loading="loading"
        @click="confirmSignUp"
      >Send</v-btn>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import {
  CONFIRM_SIGN_UP,
  RESEND_CONFIRM_SIGN_UP_CODE
} from '../../store/actions/user';
import ValidationRules from '../../utils/validation-rules';

export default {
  mixins: [ValidationRules],
  data: () => ({
    valid: true,
    loading: false,
    email: '',
    confirmationCode: ''
  }),
  methods: {
    ...mapActions({
      confirmSignUpRequest: CONFIRM_SIGN_UP,
      resendConfirmationCode: RESEND_CONFIRM_SIGN_UP_CODE
    }),
    async confirmSignUp() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        await this.confirmSignUpRequest({
          email: this.email,
          confirmationCode: this.confirmationCode
        });
      }
      this.loading = false;
    }
  },
  mounted() {
    this.$route.params.email
      ? (this.email = this.$route.params.email)
      : this.$router.push({ name: 'SignUp' });
  }
};
</script>
