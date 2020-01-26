<template>
    <div class="overview">
        <div class="pagename">
            <h2 v-if="editAllowed">Edit Your Pet Info</h2>
            <h2 v-if="newDogAllowed">Register A New Dog</h2>
        </div>
        <div class="page">
            <div class="passport-info">
                <div class="passport-info-record">
                    <form name="fuckoff" autocomplete="off">
                        <h3>Name: </h3><input autocomplete="jdty" v-model="dogInput.name"><br>
                        <h3>Breed: </h3><input autocomplete="hasdf" v-model="dogInput.breed"><br>
                        <h3>Sex: </h3>
                        <select id="sex" v-model="dogInput.sex">
                            <option>Male</option>
                            <option>Female</option>
                        </select><br>
                        <h3>Birth Date: </h3><input autocomplete="ogds" type="date" v-model="dogInput.birthDate"><br>
                        <h3>Color: </h3><input autocomplete="nfgcv" v-model="dogInput.color"><br>
                        <h3>Tattoo: </h3><input autocomplete="jjfds" v-model="dogInput.tattoo"><br>
                    </form>
                    <button class="button-commit" v-on:click="commitNewDog" v-if="newDogAllowed">Create Profile</button>
                    <button class="button-commit" v-on:click="commitUpdate" v-if="editAllowed">Save</button>
                </div>
            </div>
            <div class="photo">PHOTO</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "newDog",
        mounted() {
            this.$root.$on('new_dog_clicked',() => {
                this.resetInputs();
            });
        },
        data () {
            return {
                dogInput: {
                    name: "",
                    breed: "",
                    sex: "",
                    birthDate: "",
                    color: "",
                    tattoo: ""
                }
            }
        },
        computed: {
            dogToEdit() {
                return this.$store.getters.dogById(Number(this.$route.params.dog_id))
            },
            editAllowed() {
                let dogFound = (this.dogToEdit !== undefined);
                return dogFound && this.dogToEdit.ownerId === this.$store.state.userId //dog from the URL exists and belongs to the current user
            },
            newDogAllowed() {
                return this.$route.name === 'dog_new';
            }
        },
        methods: {
            commitNewDog() {
                let objectToPass = JSON.parse(JSON.stringify(this.dogInput));   //need to prevent dogInput from being linked to vuex store
                let redirectIndex = String(this.dogInput.id);
                if (this.newDogAllowed) {
                    this.$store.commit('dogPush', objectToPass);
                    this.$router.push({name: 'dog', params: {dog_id: redirectIndex}})
                }
            },

            commitUpdate() {
                let objectToPass = JSON.parse(JSON.stringify(this.dogInput));   //need to prevent dogInput from being linked to vuex store
                let redirectIndex = String(this.dogInput.id);
                if (this.editAllowed) {
                    this.$store.commit('dogUpdate', objectToPass);
                    this.$router.push({name: 'dog', params: {dog_id: redirectIndex}})
                }
            },

            resetInputs() {
                this.dogInput = {
                    ownerId: this.$store.state.userId,
                    name: "",
                    breed: "",
                    sex: "",
                    birthDate: "",
                    color: "",
                    tattoo: "DDD",
                    id: 2
                }
            }
        },
        created: function() {
            if (!this.editAllowed && !this.newDogAllowed) {
                this.$router.push('/');
            }
            this.resetInputs();
            if (this.editAllowed) {
                this.dogInput = JSON.parse(JSON.stringify(this.dogToEdit)); //since dogInput is all about v-models, it has to be a separate object to leave vuex store unmodified
            }
            //TODO: identify a new dog's ID and assign here (or not)
        }
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