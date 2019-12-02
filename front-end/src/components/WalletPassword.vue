<template>
  <v-dialog persistent v-model="show" max-width="600">
    <v-card>
      <v-card-title>
        Wallet password
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Password"
          type="password"
          v-model="password"
        ></v-text-field>
        <v-text-field
          v-if="isCreating"
          label="Confirm password"
          type="password"
          v-model="confirmPassword"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="primary"
          class="mx-auto"
          :disabled="isCreating ? password !== confirmPassword : false"
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

const defaultData = {
  password: '',
  confirmPassword: ''
};

export default {
  data: () => ({
    ...defaultData
  }),
  computed: {
    ...mapGetters({
      show: WALLET_PASSWORD_SHOW,
      isCreating: IS_CREATING_WALLET_PASSWORD,
      submit: WALLET_PASSWORD_SUBMIT
    })
  },
  methods: {
    ...mapMutations({
      setWalletPasswordState: SET_WALLET_PASSWORD_STATE
    }),
    submitPassword() {
      this.submit(this.password);
      this.setWalletPasswordState({ show: false });
      Object.assign(this, defaultData);
    },
    cancel() {
      this.submit();
      this.setWalletPasswordState({ show: false });
      Object.assign(this, defaultData);
    }
  }
};
</script>


