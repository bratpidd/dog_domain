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
        <div class="page" v-if="dataLoaded && this.$parent.userDataLoaded">

            <div class="passport-info" v-if=selectedView.health>
                <div class="flex-row flex-space-between">
                    <div class="flex-column" >
                        <div class="passport-info-record">
                            <h1>Health</h1>
                        </div>
                        <div class="flex-column" v-if="healthLoaded" style="max-width: 600px;">
                            <div class="flex-row passport-info-record">
                                <countdown title="Flea and tick"
                                           v-bind:date="healthInfo[0] ? healthInfo[0].date : 0"
                                           v-bind:duration="healthInfo[0] ? healthInfo[0].duration : 0"
                                           v-bind:brand="healthInfo[0] ? healthInfo[0].brand : 0">
                                </countdown>
                                <div class="button-update-container">
                                    <button class="button-commit button-update" v-on:click="showHealthDialog(1)" v-if="showEditButton">Update</button>
                                </div>
                            </div>
                            <div class="flex-row passport-info-record">
                                <countdown title="Intestinal parasites"
                                           v-bind:date="healthInfo[1] ? healthInfo[1].date : 0"
                                           v-bind:duration="healthInfo[1] ? healthInfo[1].duration : 0"
                                           v-bind:brand="healthInfo[1] ? healthInfo[1].brand : 0">
                                </countdown>
                                <div class="button-update-container">
                                    <button class="button-commit button-update" v-on:click="showHealthDialog(2)" v-if="showEditButton">Update</button>
                                </div>
                            </div>
                            <div class="flex-row passport-info-record">
                                <countdown title="Vaccination"
                                           v-bind:date="healthInfo[2] ? healthInfo[2].date : 0"
                                           v-bind:duration="healthInfo[2] ? healthInfo[2].duration : 0"
                                           v-bind:brand="healthInfo[2] ? healthInfo[2].brand : 0">
                                </countdown>
                                <div class="button-update-container">
                                    <button class="button-commit button-update" v-on:click="showHealthDialog(3)" v-if="showEditButton">Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="photo lowres-hidden" v-if="false">PHOTO</div>
                </div>
            </div>

            <div class="passport-info" v-if=selectedView.passport>
                <div class="flex-row flex-space-between lowres-column-reverse">
                    <div class="flex-column">
                        <div class="passport-info-record">
                            <h1 v-if="false">{{dogToView ? dogToView.name : ""}}</h1>
                            <h1>{{dogToView ? dogToView.breed : ""}}</h1>
                            <h2>{{dogToView ? dogToView.sex : ""}}</h2>
                        </div>
                        <div class="passport-info-record">
                            <h2>Age: <span class="record">{{dogToView ? dogAge : ""}}</span></h2>
                            <div class="pushright">Birth Date: {{dogToView ? dogToView.birthdate : ""}}</div>
                        </div>
                        <div class="passport-info-record">
                            <h2>Color: <span class="record">{{dogToView ? dogToView.color : ""}}</span></h2>
                        </div>
                        <div class="passport-info-record">
                            <h2>Tattoo: <span class="record">{{dogToView ? dogToView.tattoo : ""}}</span></h2>
                        </div>
                        <div class="passport-info-record">
                            <h2>Owner: <span class="record link-like" v-on:click="goToOwner">{{dogOwner ? dogOwner.name : ""}}</span></h2>
                            <div class="pushright">
                                {{dogOwner.country ? dogOwner.country+', ' : ""}} {{dogOwner.city ? dogOwner.city : ""}} <br v-if="dogOwner.country || dogOwner.city">
                                {{(dogOwner && false) ? "E-mail: " + dogOwner.email : ""}} <br v-if="dogOwner.phone">
                                {{(dogOwner.phone && false) ? "Phone: " + dogOwner.phone : ""}}
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
        </div>
    </div>
</template>

<script>
    import Countdown from "./Countdown";
    import HealthDialog from "./HealthDialog";

    export default {
        name: "overview",
        components: {Countdown},
        data() {
            return {
                healthInfo: [],
                healthLoaded: false,
                dataLoaded: false,
                }
        },
        mounted() {
            this.$root.$on('medicationUpdated', () => {
                this.loadCurrentTabData(true);
            });

            this.$root.$on ('user_data_loaded', () => {

            });

        },
        watch: {
            '$route.params.dog_id': function () { //if switched to another dog all data will be reloaded
                this.reloadData();
                this.loadCurrentTabData(true);
            },
            '$route.params.tab': function () { //if switched to another (but not passport since it always loads) tab then just need to load corresponding data
                this.loadCurrentTabData(false);
            }
        },
        created() {
            this.reloadData();
            this.loadCurrentTabData(true);
        },

        computed: {

            selectedView() {
                return {health: this.$route.params.tab === 'health', passport: this.$route.params.tab === 'passport'}
            },
            dogToView() {
                return this.$store.state.dogs[0];
            },
            dogAge() {
                let delta = new Date (new Date() - new Date(this.dogToView.birthdate)); //delta in milliseconds
                let years = delta.getFullYear()-1970;
                let months = delta.getMonth();
                let yearsText = (years !== 0) ? years + ' years, ' : '';
                let result = yearsText + months + ' months';
                return result;
            },
            dogOwner() {
                let ownerId = this.dogToView ? this.dogToView.owner_id : "";
                return this.$store.getters.ownerById(ownerId);
            },
            showEditButton() {
                return (this.$parent.userDataLoaded) ? this.dogToView.owner_id === this.$store.state.user.id : false;
            },

        },
        methods: {

            loadCurrentTabData(wipe = true) {
                let dog_id = this.$route.params.dog_id;
                switch (this.$route.params.tab) {
                    case 'health':
                        if (!this.healthLoaded || wipe) {
                            this.healthLoaded = false;
                            this.$store.dispatch('getMedicationInfo', dog_id).then(() => {
                                let med1 = this.$store.state.medication.find(c => c.code === '1');
                                let med2 = this.$store.state.medication.find(c => c.code === '2');
                                let med3 = this.$store.state.medication.find(c => c.code === '3');
                                this.healthInfo = [];
                                this.healthInfo.push(med1, med2, med3);
                                this.healthLoaded = true;
                            });
                        }
                        break;
                    case 'whatever': break;
                    default: break;
                }
            },

            showHealthDialog(code) {
                this.$modal.show(HealthDialog,{
                    code: code,
                    dogId: this.dogToView.id,
                    oldBrand: this.healthInfo[code-1] ? this.healthInfo[code-1].brand : '',
                    oldDuration: this.healthInfo[code-1] ? this.healthInfo[code-1].duration : ''
                });

            },

            goToEdit() {
                this.$router.push({name: 'dog_edit', params: {dog_id: this.$route.params.dog_id}});
            },
            goToOwner() {
                this.$router.push({name: 'owner', params: {owner_id: this.dogToView.owner_id}})
            },
            reloadData() {
                this.dataLoaded = false;
                this.$store.commit('wipeData'); //wipes all but user-related data
                let dog_id = this.$route.params.dog_id;
                this.$store.dispatch('getDog', dog_id).then(() => {
                    this.dataLoaded = true;
                });


            },
            healthClick() {
                if (!this.selectedView.health) {
                    this.$router.push({name: 'dog', params: {dog_id: this.dogToView.id, tab: 'health'}})
                }
            },
            passportClick() {
                if (!this.selectedView.passport) {
                this.$router.push({name: 'dog', params: {dog_id: this.dogToView.id, tab: 'passport'}})
                }
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

    .pushright{margin-left: 30px;}

    .button-update {
        height: 100%;
    }

    .button-update-container {
        margin-left: 15px;
        margin-top: 30px;
        margin-bottom: 40px;
    }

    @media screen and (max-width: 600px) {


    }

</style>