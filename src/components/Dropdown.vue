<template>
    <div class="dropdown" v-on:click="dropdownVisible = !dropdownVisible" v-click-outside="hideDropdown">
        <div class="nav-element">{{title || ""}}</div>
        <slot v-if="dropdownVisible"></slot>
    </div>
</template>

<script>
    export default {
        name: "Dropdown",
        data() {
            return {
                dropdownVisible : false,
            }
        },
        props : {
            title: String,
        },
        methods: {
            hideDropdown() {
                this.dropdownVisible = false;
            },
        },
    }
</script>

<style scoped>

</style>