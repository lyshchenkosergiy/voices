<template>
  <div class="pa-6 py-md-0 d-flex flex-column-reverse align-center flex-sm-row justify-space-between">
    <div class="text-center text-sm-left mt-4 mt-md-0">
      <h2>Email</h2>
      <p>{{profile.email}}</p>
      <h2>First name</h2>
      <p>{{profile.firstName}}</p>
      <h2>Last name</h2>
      <p>{{profile.lastName}}</p>
    </div>
    <div class="d-flex flex-column align-center">
      <v-avatar :size="avatarSize" class="mt-4">
        <v-img :src="avatarUrl"></v-img>
      </v-avatar>
      <FileUpload :disabled="avatarUploading" @file="changeAvatar" class="my-4">
        <template #activator>
          <v-btn :disabled="avatarUploading" class="primary">
            {{avatarUploading ? 'Uploading...' : 'Change image'}}
          </v-btn>
        </template>
      </FileUpload>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { PROFILE, UPDATE_PROFILE } from '../store/actions/user';
import { UPLOAD_FILE } from '../store/actions/aws';

import FileUpload from '../components/FileUpload';

export default {
  components: {
    FileUpload
  },
  data: () => ({
    avatarUrl: '',
    avatarUploading: false
  }),
  computed: {
    ...mapGetters({
      profile: PROFILE
    }),
    avatarSize() {
      return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs ? 150 : 250;
    }
  },
  methods: {
    ...mapActions({
      uploadFile: UPLOAD_FILE,
      updateProfile: UPDATE_PROFILE
    }),
    async changeAvatar({ file, url }) {
      this.avatarUploading = true;
      const previousValue = this.avatarUrl;
      try {
        this.avatarUrl = url;
        const avatar = await this.uploadFile({ file, name: this.profile.userId, scope: 'voices-avatars' });
        await this.updateProfile({ avatar });
        this.avatarUrl = this.profile.avatar;
      } catch (e) {
        this.avatarUrl = previousValue;
      }
      this.avatarUploading = false;
    }
  },
  mounted() {
    this.avatarUrl = this.profile.avatar || require('../assets/user.png');
  }
};
</script>
