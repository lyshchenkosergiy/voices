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
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          label="Email"
          v-model="email"
          type="email"
          :rules="[rule_required, rule_email]"
        ></v-text-field>
        <v-text-field
          type="password"
          label="Password"
          v-model="password"
          :rules="[rule_required, rule_alpha_num, rule_length(6, 16)]"
        ></v-text-field>
      </v-form>
      <v-btn
        class="d-block mt-4 mx-auto primary"
        :disabled="!valid"
        :loading="loading"
        @click="signIn"
      >sign in</v-btn>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { SIGN_IN } from '../../store/actions/user';
import ValidationRules from '../../utils/validation-rules';

export default {
  mixins: [ValidationRules],
  data: () => ({
    valid: true,
    loading: false,
    email: '',
    password: ''
  }),
  methods: {
    ...mapActions({
      signInRequest: SIGN_IN
    }),
    async signIn() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        await this.signInRequest({
          email: this.email,
          password: this.password
        });
      }
      this.loading = false;
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
