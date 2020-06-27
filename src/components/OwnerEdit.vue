<template>
    <div class="overview">
        <div class="pagename">
            <h2>Edit Your Info</h2>
        </div>
        <div class="page">
            <div class="passport-info">
                <div class="passport-info-record">
                    <form name="fuckoff" autocomplete="off">
                        <h3>Name: </h3><input autocomplete="jdty" v-model="ownerInput.name"><br>
                        <h3>Country: </h3><input autocomplete="hasdf" v-model="ownerInput.country"><br>
                        <h3>City: </h3><input autocomplete="nfgcv" v-model="ownerInput.city"><br>
                        <h3>E-mail: </h3><input autocomplete="nfgcv" v-model="ownerInput.email"><br>
                        <h3>Phone: </h3><input autocomplete="jjfds" v-model="ownerInput.phone"><br>
                    </form>
                    <button class="button-commit" v-on:click="commitUpdate">Save</button>
                </div>
            </div>
            <div class="photo" v-if="false">PHOTO</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ownerEdit",
        data () {
            return {
                ownerInput: {
                    id: "",
                    name: "",
                    country: "",
                    city: "",
                    email: "",
                    phone: "",
                }
            }
        },
        computed: {
            editAllowed() {
                return true;
            },
        },
        methods: {
            commitUpdate() {
                let objectToPass = JSON.parse(JSON.stringify(this.ownerInput));   //need to prevent Input from being linked to vuex store
                let redirectIndex = String(this.ownerInput.id);
                if (this.editAllowed) {
                    //this.$store.commit('ownerUpdate', objectToPass);
                    this.$store.dispatch('updateUser', objectToPass).then(() => {
                        //this.$store.dispatch('getUserInfo').then(() => {
                        this.$router.push({name: 'owner', params: {owner_id: redirectIndex}})
                        //})
                    });
                }
            },
        },
        created: function() {
            this.ownerInput = JSON.parse(JSON.stringify(this.$store.state.user));
        },
        mounted() {
            this.$root.$on('user_data_loaded',() => {
                this.ownerInput = JSON.parse(JSON.stringify(this.$store.state.user));
            });
        },
    }
</script>

<style scoped>

    * {
        margin: 0;
        padding:0;
    }

    h1, h2, h3, h4 {
        margin-bottom: 5px;
        margin-top: 5px;
        display: inline;
    }

    body {
        color: black;
    }

    .pagename {
        background-color: #333333;
        display:flex;
        height: 60px;
        padding-left: 0px;
        text-align: left;
        width: 100%;
        color: white;
        align-items: center;
    }

    .page {
        display: flex;
        width: 100%;
        color: black;
        text-align: left;
        flex-direction: row;
        justify-content: space-between;
    }

    .overview {
        display: flex;
        flex-direction: column;
        padding:0px;
        margin-top: 0px;
        height: 100%;
        width: 100%;
        position: relative;
        align-items: flex-start;
    }

    .photo {
        width: 200px;
        height: 300px;
        background-color: brown;
    }

    .passport-info {
        margin: 50px;
        line-height: 30px;

        display: flex;
        flex-direction: column;
        width: 500px;
    }

    .passport-info-record {
        position: relative;
        padding-bottom: 50px;
        width: 100%;
    }

    .button-commit {
        height: 30px;
        width: auto;
        padding-left: 8px;
        padding-right: 8px;
        font-size: 20px;
        margin-top: 30px;
    }

    .record {
        color: brown;
    }

</style>