<template>
  <v-card>
    <v-card-title>
      Create voting
    </v-card-title>
    <v-card-text>
      <v-text-field
        label="Name"
        v-model="name"
      ></v-text-field>
      <v-textarea
        label="Description"
        v-model="description"
      ></v-textarea>
      <v-checkbox
        v-model="anonymous"
        label="Anonymous"
        color="primary"
      ></v-checkbox>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="primary" class="mx-auto" @click="create" :loading="loading">Create</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const defaultData = {
  name: '',
  description: '',
  anonymous: false
};

export default {
  props: {
    loading: {
      type: Boolean,
      required: false
    }
  },
  watch: {
    loading(value) {
      !value && Object.assign(this, defaultData);
    }
  },
  data: () => ({
    ...defaultData
  }),
  methods: {
    create() {
      this.$emit('create', {
        name: this.name,
        description: this.description,
        anonymous: this.anonymous
      });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>