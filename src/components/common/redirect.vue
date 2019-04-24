<template>
  <div class="redirect">

  </div>
</template>

<script>
  export default {
    name: "redirect",
    data() {
      return {}
    },
    created() {
      const path = this.$route.params.path;
      this.$router.push(path);
    }
  }
</script>

<style scoped>

</style>
