<template>
    <div class="passport-info" v-if="isDataLoaded">
        <div class="flex-row flex-space-between lowres-column-reverse">
            <div class="flex-column">
                <div class="passport-info-record">
                    <h1>{{dogToView ? dogToView.breed : ""}}</h1>
                    <h2>{{dogToView ? dogToView.sex : ""}}</h2>
                </div>
                <div class="passport-info-record">
                    <h2>Age: <span class="record">{{dogToView ? dogAge : ""}}</span></h2>
                    <div class="push-right">Birth Date: {{dogToView ? dogToView.birthdate : ""}}</div>
                </div>
                <div class="passport-info-record">
                    <h2>Color: <span class="record">{{dogToView ? dogToView.color : ""}}</span></h2>
                </div>
                <div class="passport-info-record">
                    <h2>Tattoo: <span class="record">{{dogToView ? dogToView.tattoo : ""}}</span></h2>
                </div>
                <div class="passport-info-record">
                    <h2>Owner: <span class="record link-like" v-on:click="goToOwner">{{dogOwner ? dogOwner.name : ""}}</span></h2>
                    <div class="push-right">
                        {{dogOwner.country ? dogOwner.country+', ' : ""}} {{dogOwner.city ? dogOwner.city : ""}} <br v-if="dogOwner.country || dogOwner.city">
                    </div>
                    <button class="button-commit" v-on:click="goToEdit" v-if="showEditButton">Edit</button>
                </div>
            </div>
            <div class="photo" v-bind:class="{'no-photo': dogToView.imgUrl === ''}">
                <img class="image-photo" id="image-photo" :src="dogToView.imgUrl">
                <div class="photo-placeholder" v-if="dogToView.imgUrl === ''">No photo</div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "DogSummary",
        data() {
            return {
                isDataLoaded: false,
            }
        },
        watch: {
            '$route.params.dog_id': function () { //if switched to another dog all data will be reloaded
                this.reloadData();
            }
        },
        created() {
            this.reloadData();
        },
        computed: {
            dogToView() {
                return this.$store.state.dogs[0];
            },
            dogAge() {
                let delta = new Date (new Date() - new Date(this.dogToView.birthdate)); //delta in milliseconds
                let years = delta.getFullYear()-1970;
                let months = delta.getMonth();
                let yearsText = (years !== 0) ? `${years} years, ` : '';
                let result = `${yearsText}${months} months`;
                return result;
            },
            dogOwner() {
                let ownerId = this.dogToView ? this.dogToView.owner_id : "";
                return this.$store.getters.ownerById(ownerId);
            },
            showEditButton() {
                return this.dogToView.owner_id === this.$store.state.user.id;
            },
        },
        methods: {
            goToEdit() {
                this.$router.push({name: 'dog_edit', params: {dog_id: this.$route.params.dog_id}});
            },
            goToOwner() {
                this.$router.push({name: 'owner', params: {owner_id: this.dogToView.owner_id}})
            },
            reloadData() {
                this.isDataLoaded = false;
                this.$store.commit('wipeData'); //wipes all but user-related data
                let dog_id = this.$route.params.dog_id;
                this.$store.dispatch('getDog', dog_id).then(() => {
                    this.isDataLoaded = true;
                });
            },
        },


    }
</script>

<style scoped>
    .push-right {
        margin-left: 30px;
    }

    h1, h2 {
        margin-bottom: 5px;
        margin-top: 5px;
    }
</style>