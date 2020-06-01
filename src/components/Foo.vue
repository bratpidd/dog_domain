<template>
    <div>
        PAGE CONTENT {{param}}
        <button v-on:click="$emit('close')">KLOZE</button>
    </div>
</template>

<script>
    export default {
        name: "Foo",
        props: [
            'param'
        ]
    }
</script>

<style scoped>

</style>