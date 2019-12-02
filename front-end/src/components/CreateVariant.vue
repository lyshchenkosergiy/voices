<template>
  <v-card>
    <v-card-title>
      Create variant
    </v-card-title>
    <v-card-text>
      <div class="d-flex flex-column align-center" v-if="editableVariant">
        <v-avatar size="150" class="mt-4">
          <v-img :src="avatar || require('../assets/variant.jpg')"></v-img>
        </v-avatar>
        <FileUpload :disabled="avatarUploading" @file="changeAvatar" class="my-4">
          <template #activator>
            <v-btn :disabled="avatarUploading" class="primary">
              {{avatarUploading ? 'Uploading...' : 'Change image'}}
            </v-btn>
          </template>
        </FileUpload>
      </div>
      <v-text-field
        label="Name"
        v-model="name"
      ></v-text-field>
      <v-textarea
        label="Description"
        v-model="description"
      ></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :loading="loading"
        text
        color="primary"
        class="mx-auto"
        :disabled="editDisabled"
        @click="createOrUpdate">
        {{editableVariant ? 'Edit' : 'Create'}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import { UPLOAD_FILE } from '../store/actions/aws';
import FileUpload from '../components/FileUpload';

const defaultData = {
  name: '',
  description: '',
  avatar: '',
  avatarUploading: false,
  avatarFile: null
};

export default {
  components: {
    FileUpload
  },
  props: {
    editableVariant: {
      type: Object,
      required: false
    },
    loading: {
      type: Boolean,
      required: false
    }
  },
  data: () => ({
    ...defaultData
  }),
  computed: {
    editDisabled() {
      return (
        this.editableVariant &&
        this.name === this.editableVariant.name &&
        this.description === this.editableVariant.description &&
        this.avatar === this.editableVariant.avatar
      );
    }
  },
  methods: {
    ...mapActions({
      uploadFile: UPLOAD_FILE
    }),
    async createOrUpdate() {
      if (this.editableVariant && this.avatar !== this.editableVariant.avatar) {
        this.avatarUploading = true;
        this.avatar = await this.uploadFile({ file: this.avatarFile, name: this.editableVariant._id, scope: 'voices-variants' });
        this.avatarUploading = false;
      }
      const data = {
        name: this.name,
        description: this.description,
        avatar: this.avatar
      };
      this.$emit(this.editableVariant ? 'update' : 'create', data);
    },
    cancel() {
      this.$emit('cancel');
    },
    changeAvatar({ file, url }) {
      this.avatar = url;
      this.avatarFile = file;
    }
  },
  mounted() {
    Object.assign(this, this.editableVariant || defaultData);
  }
};
</script>