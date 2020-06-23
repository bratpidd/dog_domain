<template>
    <div class="overview">
        <div class="pagename">
            <div class="page-title">
                <h1>{{dogToView ? dogToView.name : ""}}</h1>
            </div>
        </div>
        <div class="nav-container">
            <div class="page-nav-element" v-bind:class="{ 'nav-selected' : selectedView.passport }" v-on:click="passportClick">Passport</div>
            <div class="page-nav-element" v-bind:class="{ 'nav-selected' : selectedView.health }" v-on:click="healthClick">Health</div>
            <div class="page-nav-element" v-if="false">Something Else</div>
        </div>
        <div class="page">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: "overview",
        computed: {
            selectedView() {
                return {health: this.$route.name === 'dog_health', passport: this.$route.name === 'dog_passport'}
            },
            dogToView() {
                return this.$store.state.dogs[0];
            },
        },
        methods: {
            healthClick() {
                if (!this.selectedView.health) {
                    this.$router.push({path: `/dog/${this.dogToView.id}/health`});
                }
            },
            passportClick() {
                if (!this.selectedView.passport) {
                    this.$router.push({path: `/dog/${this.dogToView.id}/passport`});
                }
            },
        }
    }
</script>

<style scoped>


    body {
        color: black;
    }

    .page-nav-element {
        background-color: #aaaaaa;
        border-right-style: solid;
        border-color: #333333;
        height: 35px;
        padding-left: 15px;
        padding-right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: black;
        cursor: pointer;
        align-self: center;
        margin-top: auto;
    }

    .nav-container {
        display: flex;
        width: 100%;
        flex-direction: row;
        background-color: #333333;
        height: 35px;
    }

    .page-nav-element:hover, .nav-selected {
        background-color: #D3D3D3;
    }


</style>