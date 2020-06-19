<template>
    <div class="overview">
        <div class="pagename"><h2>{{whoseProfile}}</h2></div>
        <div class="page">
            <div class="passport-info">
            <div class="flex-row flex-space-between lowres-column-reverse">
                <div v-if="!ownerFound"><h1>Oops!<br><br>Noone lives here :(</h1></div>
                <div class="flex-column" v-if="ownerFound">
                    <div class="passport-info-record">
                        <h1>{{ownerLoaded ? ownerToView.name : ""}}</h1>
                        <h3>{{ownerLoaded ? ownerToView.country : ""}}</h3>
                        <h3>{{ownerLoaded ? ownerToView.city : ""}}</h3>
                    </div>
                    <div class="passport-info-record" v-if="false">
                        <h2 v-if="ownerInfoExists.email && false">E-mail: <span class="record">{{ownerLoaded ? ownerToView.email : ""}}</span></h2>
                    </div>
                    <div class="passport-info-record">
                        <h2 v-if="ownerInfoExists.phone && false">Phone: <span class="record">{{ownerLoaded ? ownerToView.phone : ""}}</span></h2>
                        <button class="button-commit" v-on:click="goToEditOwner" v-if="showEditButton">Edit</button>
                    </div>

                    <div class="passport-info-record">
                        <h2>Dogs: <span class="record">{{ownerLoaded ? "" : ""}}</span></h2>
                        <div class="">
                            <table class="dogs-table">
                                <tr v-for="dog in ownerDogs" v-bind:key="dog.id">
                                    <router-link :to="{ name: 'dog', params: {dog_id: dog.id, tab: 'passport'}}"><td class="link-like">
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
                <div class="photo" v-bind:class="{'no-photo': true}" v-if="false">
                    <img class="image-photo" id="image-photo">
                    <div class="photo-placeholder" v-if="true">No photo</div>
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
            this.$store.commit('wipeData');
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