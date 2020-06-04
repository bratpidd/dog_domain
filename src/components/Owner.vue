<template>
    <div class="overview">
        <div class="pagename"><h2>{{whoseProfile}}</h2></div>
        <div class="page">
            <div class="passport-info"  v-if="!ownerFound"><h1>Oops!<br><br>Noone lives here :(</h1></div>
            <div class="passport-info"  v-if="ownerFound">
                <div class="passport-info-record">
                    <h1>{{ownerLoaded ? ownerToView.name : ""}}</h1>
                    <h3>{{ownerLoaded ? ownerToView.country : ""}}</h3>
                    <h3>{{ownerLoaded ? ownerToView.city : ""}}</h3>
                </div>
                <div class="passport-info-record">
                    <h2 v-if="ownerInfoExists.email">E-mail: <span class="record">{{ownerLoaded ? ownerToView.email : ""}}</span></h2>
                </div>
                <div class="passport-info-record">
                    <h2 v-if="ownerInfoExists.phone">Phone: <span class="record">{{ownerLoaded ? ownerToView.phone : ""}}</span></h2>
                    <button class="button-commit" v-on:click="goToEditOwner" v-if="showEditButton">Edit</button>
                </div>

                <div class="passport-info-record">
                    <h2>Dogs: <span class="record">{{ownerLoaded ? "" : ""}}</span></h2>
                    <div class="pushright">
                        <table class="dogs-table">
                            <tr v-for="dog in ownerDogs" v-bind:key="dog.id">
                                <td class="link-like" v-on:click="goToDog(dog.id)">
                                    {{dog.name}}
                                </td>
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
            <div class="photo">PHOTO</div>
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
                //if (ownerId === this.$store.state.user.id) {
                  //  return this.$store.state.user;
                //}
                let owner = this.$store.getters.ownerById(ownerId);
                this.validateOwnerInfo(owner);
                if (owner == null) {
                   // alert("owner - null!");
                }
                return owner;
            },
         /*   dogAge() {
                let delta = new Date (new Date() - new Date(this.dogToView.birthDate)); //delta in milliseconds
                let years = delta.getFullYear()-1970;
                let months = delta.getMonth();
                return years + ' years, ' + months + ' months';
            },*/

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
            goToDog(id) {
                this.$router.push({name: 'dog', params: {dog_id: id, tab: 'passport'}})
            }
        }
    }
</script>

<style scoped>

    * {
        margin: 0;
        padding:0;
    }

    h1, h2 {
        margin-bottom: 5px;
        margin-top: 5px;
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
        min-width: 200px;
        height: 300px;
        background-color: brown;
    }

    .passport-info {
        margin: 0px;
        line-height: 30px;
        display: flex;
        flex-direction: column;
        width: 800px;
    }

    .passport-info-record {
        position: relative;
        width: 100%;
        margin-left: 50px;
        margin-top: 50px;
    }

    .record {
        color: brown;
    }

    .pushright{margin-left: 30px;}

    .button-commit {
        display: inline;
        height: 30px;
        width: auto;
        padding-left: 8px;
        padding-right: 8px;
        font-size: 20px;
        margin-top: 30px;
    }

    .link-like {
        cursor: pointer;
        text-decoration: underline;
        color: darkblue;
        font-weight: bold;
    }

    .dogs-table, tr, td {
        padding-right: 80px;
        font-size: 19px;
    }
</style>