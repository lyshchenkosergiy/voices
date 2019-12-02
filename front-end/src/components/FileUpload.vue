<template>
  <div>
    <input v-show="false" ref="file" type="file" @change="emitFile">
    <div @click="openDialog">
      <slot name="activator"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    openDialog() {
      if (!this.disabled) {
        this.$refs.file.click();
      }
    },
    emitFile(event) {
      const file = event.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        this.$emit('file', { file, url });
      }
    }
  }
};
</script>