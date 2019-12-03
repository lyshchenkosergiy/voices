<template>
  <v-dialog @click:outside="emitEdited" v-model="dialog" max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn class="float-button" color="primary" fab v-on="on">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Create variant</v-card-title>
      <v-card-text>
        <div class="d-flex flex-column align-center" v-if="editableVariant">
          <v-avatar size="150" class="mt-4">
            <v-img :src="avatar || require('../assets/variant.jpg')"></v-img>
          </v-avatar>
          <FileUpload :disabled="avatarUploading" @file="changeAvatar" class="my-4">
            <template #activator>
              <v-btn
                :disabled="avatarUploading"
                class="primary"
              >{{avatarUploading ? 'Uploading...' : 'Change image'}}</v-btn>
            </template>
          </FileUpload>
        </div>
        <v-form ref="form" v-model="valid">
          <v-text-field
            label="Name"
            v-model="name"
            :rules="[rule_required, rule_length(6, 16)]"/>
          <v-textarea
            label="Description"
            v-model="description"
            :rules="[rule_required, rule_length(6, 200)]"/>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :loading="loading"
          text
          color="primary"
          class="mx-auto"
          :disabled="disabled"
          @click="createOrUpdate">
          {{editableVariant ? 'Edit' : 'Create'}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { ADD_VARIANT, UPDATE_VARIANT_REQUEST } from '../store/actions/voting-details';
import { UPLOAD_FILE } from '../store/actions/aws';
import ValidationRules from '../utils/validation-rules';

import FileUpload from '../components/FileUpload';

const defaultData = {
  name: '',
  description: '',
  avatar: '',
  avatarUploading: false,
  avatarFile: null
};

export default {
  mixins: [ValidationRules],
  components: {
    FileUpload
  },
  props: {
    editableVariant: {
      type: Object,
      required: false
    },
    votingId: {
      type: String,
      required: true
    }
  },
  watch: {
    editableVariant(value) {
      if (value) {
        Object.assign(this, value);
        this.dialog = true;
      } else {
        this.dialog = false;
      }
    },
    dialog(value) {
      if (value && !this.editableVariant) {
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
  computed: {
    disabled() {
      return !this.valid || (
        this.editableVariant &&
        this.name === this.editableVariant.name &&
        this.description === this.editableVariant.description &&
        this.avatar === this.editableVariant.avatar
      );
    }
  },
  methods: {
    ...mapActions({
      uploadFile: UPLOAD_FILE,
      addVariant: ADD_VARIANT,
      updateVariantRequest: UPDATE_VARIANT_REQUEST
    }),
    emitEdited() {
      this.$emit('edited');
    },
    async createOrUpdate() {
      this.loading = true;
      if (this.editableVariant) {
        if (this.avatar !== this.editableVariant.avatar) {
          this.avatarUploading = true;
          this.avatar = await this.uploadFile({
            file: this.avatarFile,
            name: this.editableVariant._id,
            scope: 'voices-variants'
          });
          this.avatarUploading = false;
        }
      }

      const variantData = {
        name: this.name,
        description: this.description,
        avatar: this.avatar
      };

      const result = this.editableVariant
        ? await this.updateVariantRequest({ variantData, id: this.editableVariant._id })
        : await this.addVariant({ ...variantData, votingId: this.votingId });
      result && (this.dialog = false);
      this.emitEdited();
      this.loading = false;
    },
    changeAvatar({ file, url }) {
      this.avatar = url;
      this.avatarFile = file;
    }
  }
};
</script>