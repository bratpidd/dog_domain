<template>
    <div class="overview">
        <div class="pagename"><h2>Your Profile</h2></div>
        <div class="page">
            <div class="passport-info"  v-if="!ownerFound"><h1>Oops!<br><br>Noone lives here :(</h1></div>
            <div class="passport-info"  v-if="ownerFound">
                <div class="passport-info-record">
                    <h1>{{ownerFound ? ownerToView.name : ""}}</h1>
                    <h3>{{ownerFound ? ownerToView.country : ""}}</h3>
                    <h3>{{ownerFound ? ownerToView.city : ""}}</h3>
                </div>
                <div class="passport-info-record">
                    <h2>E-mail: <span class="record">{{ownerFound ? ownerToView.email : ""}}</span></h2>
                </div>
                <div class="passport-info-record">
                    <h2>Phone: <span class="record">{{ownerFound ? ownerToView.phone : ""}}</span></h2>                    <button class="button-commit" v-on:click="goToEditOwner">Edit</button>
                </div>

                <div class="passport-info-record">
                    <h2>Dogs: <span class="record">{{ownerFound ? "" : ""}}</span></h2>
                    <div class="pushright">
                        <table class="dogs-table">
                            <tr v-for="dog in userDogs" v-bind:key="dog.id">
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
            }
        },
        computed: {
            ownerFound() {
                return (this.$store.getters.ownerById(Number(this.$route.params.owner_id)) != null);
            },

            userDogs() {
                return this.$store.getters.userDogs
            },

            ownerToView() {
                let owner = this.$store.getters.ownerById(Number(this.$route.params.owner_id));
                if (owner == null) {
                   // alert("null");
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
                return true;
            }
        },
        methods: {
            goToEditOwner() {
                this.$router.push({name: 'owner_edit'});
            },
            goToDog(id) {
                this.$router.push({name: 'dog', params: {dog_id: id}})
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