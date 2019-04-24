<template>
  <div class="roleman">
    <role :ishow="toggle"></role>
    <user :ishow="!toggle"></user>
  </div>
</template>

<script>
  import role from "./role"
  import user from "./user"

  export default {
    components: {
      role, user
    },
    name: "roleman",
    data() {
      return {
        activeName: 'first',
      }
    },
    created: function () {

    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    computed: {
      toggle() {
        return this.$store.state.sys.switchRoleMan;
      }
    }
  }
</script>

<style scoped>

</style>
