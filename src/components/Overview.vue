<template>
    <div class="overview">
        <div class="pagename">
            <div class="page-title">
                <h1>{{dogToView ? dogToView.name : ""}}</h1>
            </div>
        </div>
        <div class="nav-container">
            <router-link :to="{name: 'dog_passport', params: {dog_id: $route.params.dog_id}}" class="router-link">
                <div class="page-nav-element">Passport</div>
            </router-link>
            <router-link :to="{name: 'dog_health', params: {dog_id: $route.params.dog_id}}" class="router-link">
                <div class="page-nav-element">Health</div>
            </router-link>
            <div class="page-nav-element" v-if="false">Something Else</div>
        </div>
        <div class="page">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import {store} from '../main';
    export default {
        name: "overview",
        beforeRouteEnter(to, from, next) {
            store.dispatch('getDog', to.params.dog_id).then(() => {
                next();
            });
        },

        beforeRouteUpdate (to, from, next) {
            this.$store.dispatch('getDog', to.params.dog_id).then(() => {
                next();
            })
        },

        computed: {
            dogToView() {
                return this.$store.state.dogs[0];
            },
        },
    }
</script>

<style scoped>


    body {
        color: black;
    }

    .page-nav-element {
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
        text-decoration: none;
    }
    .page-nav-element:hover, .router-link-active{
        background-color: #D3D3D3 !important;
    }

    .router-link {
        background-color: #aaaaaa;
    }

    .nav-container {
        display: flex;
        width: 100%;
        flex-direction: row;
        background-color: #333333;
        height: 35px;
    }
    .nav-container a {
        text-decoration: none;
    }



</style>