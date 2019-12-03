<template>
  <v-card elevation="100" class="info-card relative">
    <v-img height="150px" class="white--text" :src="voting.avatar || require('../assets/voting.jpg')">
      <v-card-title class="align-end fill-height">
        <span class="w-full ellipsis">
          {{voting.name}}
        </span>
      </v-card-title>
    </v-img>
    <div class="absolute top-label white--text" v-if="isAcceptedMember">(member)</div>
    <div class="absolute top-label white--text" v-if="isRequested">(requested)</div>
    <div class="absolute top-label white--text" v-if="isDeclined">(declined)</div>
    <v-card-text>
      <p class="ellipsis">
        <span class="font-weight-bold">Description: </span>
        <v-tooltip top max-width="400">
          <template v-slot:activator="{ on }">
            <span v-on="on" >{{voting.description}}</span>
          </template>
          <span class="ignore">{{voting.description}}</span>
        </v-tooltip>
      </p>
      <div class="font-weight-bold d-flex flex-row justify-space-between">
        <div>
          <p>Variants - {{voting.variants.length}}</p>
          <p>Members - {{acceptedMembers}}</p>
          <p>Status - {{voting.state}}</p>
        </div>
        <div v-if="voting.anonymous">
          <p>Anonymous</p>
        </div>
      </div>
    </v-card-text>
    <v-card-actions >
      <router-link class="mx-auto" :to="'/voting/' + voting._id">
        <v-btn color="primary" text>
          Details
        </v-btn>
      </router-link>
      <v-btn v-if="my && isCreated" @click="remove" class="mx-auto" color="error" text>Delete</v-btn>
      <v-btn v-if="!my && !userMember && isCreated" @click="join" class="mx-auto" color="info" text>Join</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    voting: {
      type: Object,
      required: true
    },
    my: {
      type: Boolean,
      required: false,
      default: false
    },
    userId: {
      type: String,
      required: true
    }
  },
  computed: {
    isCreated() {
      return this.voting.state === 'Created';
    },
    userMember() {
      return this.voting.members.find(({ userId }) => userId === this.userId);
    },
    acceptedMembers() {
      return this.voting.members.filter(({ state }) => state === 'Accepted').length;
    },
    isAcceptedMember() {
      return this.userMember && this.userMember.state === 'Accepted';
    },
    isRequested() {
      return this.userMember && this.userMember.state === 'Requested';
    },
    isDeclined() {
      return this.userMember && this.userMember.state === 'Declined';
    }
  },
  methods: {
    remove() {
      this.$emit('remove', this.voting);
    },
    join() {
      this.$emit('join', this.voting);
    }
  }
};
</script>