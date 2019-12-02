<template>
  <v-card elevation="100" class="info-card">
    <v-card-title>
      <v-avatar class="mx-auto" size="150">
        <v-img :src="profile.avatar || require('../assets/user.png')"></v-img>
      </v-avatar>
    </v-card-title>
    <v-card-text class="mt-4">
      <p class="ellipsis">
        <span class="font-weight-bold">First name: </span>
        <v-tooltip top max-width="400">
          <template v-slot:activator="{ on }">
            <span v-on="on" >{{profile.firstName}}</span>
          </template>
          <span class="ignore">{{profile.firstName}}</span>
        </v-tooltip>
      </p>
      <p class="ellipsis">
        <span class="font-weight-bold">Last name: </span>
        <v-tooltip top max-width="400">
          <template v-slot:activator="{ on }">
            <span v-on="on" >{{profile.lastName}}
              <span style="float:right;" v-if="isOwn"> (You)</span>
            </span>
          </template>
          <span class="ignore">{{profile.lastName}}</span>
        </v-tooltip>
      </p>
    </v-card-text>
    <v-card-actions v-if="isMemberCard">
      <template v-if="isRequested">
        <v-btn text @click="accept" color="success" class="mx-auto">
          Accept
        </v-btn>
        <v-btn text @click="decline" color="error" class="mx-auto">
          Decline
        </v-btn>
      </template>
      <template v-else>
        <v-btn text color="error" class="mx-auto">Declined</v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { PROFILE } from '../store/actions/user';

export default {
  props: {
    profile: {
      type: Object,
      required: true
    },
    isMemberCard: {
      type: Boolean,
      required: false,
      default: false
    },
    isRequested: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      ownProfile: PROFILE
    }),
    isOwn() {
      return this.profile.userId === this.ownProfile.userId;
    }
  },
  methods: {
    accept() {
      this.$emit('accept');
    },
    decline() {
      this.$emit('decline');
    }
  }
};
</script>