<template>
  <v-dialog persistent v-model="show" max-width="600">
    <v-card>
      <v-card-title>
        Wallet password
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid">
          <v-text-field
            label="Password"
            type="password"
            :rules="[rule_required, rule_alpha_num, rule_length(6, 16)]"
            v-model="password"/>
          <v-text-field
            v-if="isCreating"
            label="Confirm password"
            type="password"
            :rules="[rule_required, rule_alpha_num, rule_length(6, 16), passwordMatch]"
            v-model="confirmPassword"/>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="primary"
          class="mx-auto"
          :disabled="!valid"
          @click="submitPassword">
          {{isCreating ? 'Create password' : 'Submit'}}
        </v-btn>
        <v-btn
          v-if="!isCreating"
          text
          color="error"
          class="mx-auto"
          @click="cancel">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import {
  WALLET_PASSWORD_SHOW,
  IS_CREATING_WALLET_PASSWORD,
  WALLET_PASSWORD_SUBMIT,
  SET_WALLET_PASSWORD_STATE
} from '../store/actions/wallet-password';
import ValidationRules from '../utils/validation-rules';

const defaultData = {
  password: '',
  confirmPassword: ''
};

export default {
  mixins: [ValidationRules],
  data: () => ({
    ...defaultData,
    valid: true
  }),
  computed: {
    ...mapGetters({
      show: WALLET_PASSWORD_SHOW,
      isCreating: IS_CREATING_WALLET_PASSWORD,
      submit: WALLET_PASSWORD_SUBMIT
    }),
    submitDisabled() {
      return this.isCreating
        ? (this.password !== this.confirmPassword || !this.password || !this.confirmPassword)
        : !this.password;
    }
  },
  methods: {
    ...mapMutations({
      setWalletPasswordState: SET_WALLET_PASSWORD_STATE
    }),
    submitPassword() {
      if (this.$refs.form.validate()) {
        this.submit(this.password);
        this.setWalletPasswordState({ show: false });
        this.reset();
      }
    },
    cancel() {
      this.submit();
      this.setWalletPasswordState({ show: false });
      this.reset();
    },
    passwordMatch() {
      return this.password === this.confirmPassword || 'Passwords should match!';
    },
    reset() {
      this.$refs.form && this.$refs.form.resetValidation();
      Object.assign(this, defaultData);
    }
  }
};
</script>


