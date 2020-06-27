<template>
    <div class="overview">
        <div class="pagename"><h2>{{whoseProfile}}</h2></div>
        <div class="page">
            <div class="passport-info">
            <div class="flex-row flex-space-between lowres-column-reverse">
                <div v-if="!ownerFound"><h1>Oops!<br><br>Noone lives here :(</h1></div>
                <div class="flex-column" v-if="ownerLoaded">
                    <div class="passport-info-record">
                        <h1>{{ownerToView.name}}</h1>
                        <h3>{{ownerToView.country}}</h3>
                        <h3>{{ownerToView.city}}</h3>
                    </div>
                    <div class="passport-info-record">
                        <button class="button-commit" v-on:click="goToEditOwner" v-if="showEditButton">Edit</button>
                    </div>

                    <div class="passport-info-record" >
                        <h2>Dogs: </h2>
                        <div>
                            <table class="dogs-table">
                                <tr v-for="dog in ownerDogs" v-bind:key="dog.id">
                                    <router-link :to="{ name: 'dog_passport', params: {dog_id: dog.id}}"><td class="link-like">
                                        {{dog.name}}
                                        </td></router-link>
                                    <td>
                                        {{dog.breed}}
                                    </td>
                                    <td>
                                        {{dog.sex}}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "owner",
        data() {
            return {
                ownerLoaded: false,
                ownerFound: true,  //"presumably"
                ownerInfoExists: {
                    phone: false,
                    email: false,
                }
            }
        },
        created() {
            //this.$store.commit('wipeData');
            this.$store.dispatch('getOwnerInfo', this.$route.params.owner_id).then(()=> {
                this.ownerLoaded = true;
            }).catch(()=>{
                this.ownerFound = false;
            });
        },
        computed: {
            whoseProfile() {
                if (this.$route.params.owner_id === this.$store.state.user.id) {
                    return "Your Profile";
                } else {return "Owner Profile";}
            },

            ownerDogs() {
                return this.$store.getters.getOwnerDogs(this.$route.params.owner_id);
            },

            ownerToView() {
                let ownerId = this.$route.params.owner_id;
                let owner = this.$store.getters.ownerById(ownerId);
                this.validateOwnerInfo(owner);
                if (owner == null) {
                   // alert("owner - null!");
                }
                return owner;
            },

            showEditButton() {
                return this.$route.params.owner_id === this.$store.state.user.id;
            }
        },
        methods: {
            validateOwnerInfo (owner) {
                if (owner.phone) {
                    this.ownerInfoExists.phone = true;
                }
                if (owner.email) {
                    this.ownerInfoExists.email = true;
                }
            },

            goToEditOwner() {
                this.$router.push({name: 'owner_edit'});
            },
        }
    }
</script>

<style scoped>

    h1, h2 {
        margin-bottom: 5px;
        margin-top: 5px;
    }

    body {
        color: black;
    }

    .dogs-table, tr, td {
        padding-right: 20px;
        font-size: 19px;
    }

    @media screen and (max-width: 600px) {
        .dogs-table, tr, td {
            font-size: 17px;
        }
    }
</style>