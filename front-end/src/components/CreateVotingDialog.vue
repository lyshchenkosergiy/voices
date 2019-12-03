<template>
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn class="float-button" color="primary" fab v-on="on">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Create voting
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid">
          <v-text-field
            label="Name"
            v-model="name"
            :rules="[rule_required, rule_length(6, 16)]"/>
          <v-textarea
            label="Description"
            v-model="description"
            :rules="[rule_required, rule_length(6, 200)]"/>
          <v-checkbox
            v-model="anonymous"
            label="Anonymous"
            color="primary"/>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="primary"
          class="mx-auto"
          @click="create"
          :disabled="!valid"
          :loading="loading">
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { CREATE_VOTING } from '../store/actions/votings';
import ValidationRules from '../utils/validation-rules';

const defaultData = {
  name: '',
  description: '',
  anonymous: false
};

export default {
  mixins: [ValidationRules],
  watch: {
    dialog(value) {
      if (value) {
        this.$refs.form && this.$refs.form.resetValidation();
        Object.assign(this, defaultData);
      }
    }
  },
  data: () => ({
    ...defaultData,
    valid: true,
    dialog: false,
    loading: false
  }),
  methods: {
    ...mapActions({
      createVoting: CREATE_VOTING
    }),
    async create() {
      this.loading = true;
      const result = await this.createVoting({
        name: this.name,
        description: this.description,
        anonymous: this.anonymous
      });
      if (result) {
        this.dialog = false;
      }
      this.loading = false;
    }
  }
};
</script>