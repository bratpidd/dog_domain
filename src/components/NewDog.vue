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
                            <div class="wannabe-h3">Name: </div><input autocomplete="jdty" v-model="dogInput.name"><br>
                            <div class="wannabe-h3">Breed: </div><input autocomplete="hasdf" v-model="dogInput.breed"><br>
                            <div class="wannabe-h3">Sex: </div>
                            <select id="sex" v-model="dogInput.sex">
                                <option>Male</option>
                                <option>Female</option>
                            </select><br>
                            <div class="wannabe-h3">Birth Date: </div><input autocomplete="ogds" type="date" v-model="dogInput.birthdate"><br>
                            <div class="wannabe-h3">Color: </div><input autocomplete="nfgcv" v-model="dogInput.color"><br>
                            <div class="wannabe-h3">Tattoo: </div><input autocomplete="jjfds" v-model="dogInput.tattoo"><br>
                    </form>

                </div>
            </div>
            <div class="photo">PHOTO</div>
        </div>
        <button class="button-commit" v-on:click="commitNewDog" v-if="newDogAllowed">Create Profile</button>
        <button class="button-commit" v-on:click="commitUpdate" v-if="editAllowed">Save</button>
    </div>
</template>

<script>
    export default {
        name: "newDog",
        mounted() {
            this.$root.$on('new_dog_clicked',() => {
                this.resetInputs();
            });
            if (this.editAllowed) {
                this.$store.dispatch('getDog', this.$route.params.dog_id).then(() => {
                    this.dogInput = JSON.parse(JSON.stringify(this.$store.state.dogs[0]));
                });
            }
        },
        data () {
            return {
                dogInput: {
                    name: "",
                    breed: "",
                    sex: "",
                    birthdate: "",
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
                return this.$route.name === 'dog_edit';
            },
            newDogAllowed() {
                return this.$route.name === 'dog_new';
            }
        },
        methods: {
            commitNewDog() {
                let objectToPass = JSON.parse(JSON.stringify(this.dogInput));   //prevent dogInput from being linked to vuex store (although it must be safe here)
                //let redirectIndex = String(this.dogInput.id);
                if (this.newDogAllowed) {
                    this.$store.dispatch('newDog', objectToPass);
                    //this.$store.commit('dogPush', objectToPass);
                    //this.$router.push({name: 'dog', params: {dog_id: redirectIndex}})
                }
            },

            commitUpdate() {
                let objectToPass = JSON.parse(JSON.stringify(this.dogInput));   //need to prevent dogInput from being linked to vuex store. although it must be already unlinked, see "created" below
                let redirectIndex = String(this.dogInput.id);
                this.$store.dispatch('updateDog', objectToPass).then(() => {
                    this.$store.dispatch('getUserInfo');
                    if (this.editAllowed) {
                        //this.$store.commit('dogUpdate', objectToPass);
                        this.$router.push({name: 'dog', params: {dog_id: redirectIndex, tab: 'passport'}})
                    }
                });
            },

            resetInputs() {
                this.dogInput = {
                    //ownerId: this.$store.state.user.id,
                    name: "",
                    breed: "",
                    sex: "",
                    birthdate: "",
                    color: "",
                    tattoo: "",
                    //id: 2
                }
            }
        },
        created: function() {
            //if (!this.editAllowed && !this.newDogAllowed) {
            //    this.$router.push('/');
            //}
            //this.resetInputs();


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

    .wannabe-h3 {
        width: 130px;
        font-size: 1.17em;
        font-weight: bolder;
        display: inline-block;
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


    .button-commit {
        height: 30px;
        width: auto;
        padding-left: 8px;
        padding-right: 8px;
        font-size: 20px;
        margin-top: 30px;
        margin-left: 50px;
    }

    @media screen and (max-width: 600px) {
        .page {
            flex-direction: column;
        }

        .photo {
            margin-left: 50px;
        }

    }

</style>