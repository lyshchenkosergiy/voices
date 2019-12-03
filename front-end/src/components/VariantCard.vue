<template>
  <v-card elevation="100" class="info-card relative">
    <v-img height="150px" class="white--text" :src="variant.avatar || require('../assets/variant.jpg')">
      <v-card-title class="align-end fill-height">
        <span class="w-full ellipsis">
          {{variant.name}}
        </span>
      </v-card-title>
    </v-img>
    <div class="absolute top-label white--text" v-if="selected">(your choice)</div>
    <v-card-text>
      <p class="ellipsis">
        <span class="font-weight-bold">In contract: </span>
        <v-tooltip top max-width="400">
          <template v-slot:activator="{ on }">
            <span v-on="on" >{{inContract}}</span>
          </template>
          <span class="ignore">{{inContract}}</span>
        </v-tooltip>
      </p>
      <p class="ellipsis">
        <span class="font-weight-bold">Description: </span>
        <v-tooltip top max-width="400">
          <template v-slot:activator="{ on }">
            <span v-on="on" >{{variant.description}}</span>
          </template>
          <span class="ignore">{{variant.description}}</span>
        </v-tooltip>
      </p>
    </v-card-text>
    <v-card-actions >
      <v-btn v-if="canVote" @click="vote" class="mx-auto" color="info" text>Vote</v-btn>
      <v-btn v-if="canEdit" @click="edit" class="mx-auto" color="info" text>Edit</v-btn>
      <v-btn v-if="canDelete" @click="remove" class="mx-auto" color="error" text>Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    variant: {
      type: Object,
      required: true
    },
    canVote: {
      type: Boolean,
      required: false,
      default: false
    },
    canDelete: {
      type: Boolean,
      required: false,
      default: false
    },
    canEdit: {
      type: Boolean,
      required: false,
      default: false
    },
    selected: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    inContract() {
      return 'ELm' + this.variant._id;
    }
  },
  methods: {
    remove() {
      this.$emit('remove', this.variant);
    },
    vote() {
      this.$emit('vote', this.variant);
    },
    edit() {
      this.$emit('edit', this.variant);
    }
  }
};
</script>
