<template>
    <div class="overview">
        <div class="pagename"><h1>{{dogToView ? dogToView.name : ""}}</h1>

        </div>
        <div class="nav-container">
            <div class="page-nav-element" v-bind:class="{ 'nav-selected' : selectedView.passport }" v-on:click="passportClick">Passport</div>
            <div class="page-nav-element" v-bind:class="{ 'nav-selected' : selectedView.health }" v-on:click="healthClick">Health</div>
            <div class="page-nav-element">Something Else</div>
        </div>
        <div class="page" v-if="dogToView">
            <div class="passport-info" v-if=selectedView.health>
                <div class="passport-info-record">
                    <h1>Health</h1>
                </div>
                <div class="flex-column" v-if="healthLoaded">
                    <div class="flex-row">
                        <countdown title="Flea and tick"
                                   v-bind:date="healthInfo[0] ? healthInfo[0].date : 0"
                                   v-bind:duration="healthInfo[0] ? healthInfo[0].duration : 0"
                                   v-bind:brand="healthInfo[0] ? healthInfo[0].brand : 0">
                        </countdown>
                        <button class="button-commit button-update" v-on:click="showHealthDialog(1)" v-if="showEditButton">Update</button>
                    </div>
                    <div class="flex-row">
                        <countdown title="Intestinal parasites"
                                   v-bind:date="healthInfo[1] ? healthInfo[1].date : 0"
                                   v-bind:duration="healthInfo[1] ? healthInfo[1].duration : 0"
                                   v-bind:brand="healthInfo[1] ? healthInfo[1].brand : 0">
                        </countdown>
                        <button class="button-commit button-update" v-on:click="showHealthDialog(2)" v-if="showEditButton">Update</button>
                    </div>
                    <div class="flex-row">
                        <countdown title="Vaccination"
                                   v-bind:date="healthInfo[2] ? healthInfo[2].date : 0"
                                   v-bind:duration="healthInfo[2] ? healthInfo[2].duration : 0"
                                   v-bind:brand="healthInfo[2] ? healthInfo[2].brand : 0">
                        </countdown>
                        <button class="button-commit button-update" v-on:click="showHealthDialog(3)" v-if="showEditButton">Update</button>
                    </div>
                </div>
            </div>

            <div class="passport-info" v-if=selectedView.passport>
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
                        {{dogOwner ? dogOwner.country : ""}}, {{dogOwner ? dogOwner.city : ""}} <br>
                        E-mail: {{dogOwner ? dogOwner.email : ""}} <br>
                        Phone: {{dogOwner ? dogOwner.phone : ""}}
                    </div>
                    <button class="button-commit" v-on:click="goToEdit" v-if="showEditButton">Edit</button>
                </div>

            </div>
            <div class="photo">PHOTO</div>
        </div>
    </div>
</template>

<script>
    import Countdown from "./Countdown";
    // eslint-disable-next-line no-unused-vars
    import Foo from "./Foo";
    import HealthDialog from "./HealthDialog";

    export default {
        name: "overview",
        components: {Countdown},
        data() {
            return {
                healthInfo: [],
                healthLoaded: false,
                }
        },
        mounted() {
            this.$root.$on('medicationUpdated', () => {
                this.loadCurrentTabData(true);
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
                return years + ' years, ' + months + ' months';
            },
            dogOwner() {
                let ownerId = this.dogToView ? this.dogToView.owner_id : "";
                return this.$store.getters.ownerById(ownerId);
            },
            showEditButton() {
                return this.dogToView ? this.dogToView.owner_id === this.$store.state.user.id : false;
                //return true;
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
                this.$store.commit('wipeData'); //wipes all but user-related data
                let dog_id = this.$route.params.dog_id;
                this.$store.dispatch('getDog', dog_id);
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

    .canvas {
        height: 210px;
        width: 300px;
    }

    .flex-row {
        display: flex;
    flex-direction: row
    }

    .flex-column {
        display: flex;
        flex-direction: column;
    }

    .padding-5{
        padding: 5px;
    }

    .margin-5{
        margin: 5px;
    }

    .text-center {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .med-info {
        display: flex;
        height: 40px;
        width: 130px;
        margin-top: 15px;
        margin-bottom: 15px;
        margin-left: 8px;
    }

    .date-field {
        height: 20px;
        font-size: 12px;
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
        flex-direction: row;
    }

    .page-nav-element {
        background-color: #aaaaaa;
        border-left-style: solid;
        height: 100%;
        padding-left: 12px;
        padding-right: 12px;
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
        height: 20px;
    }

    .page-nav-element:hover {
        background-color: #D3D3D3;
    }

    .nav-selected {
        background-color: #d3d3d3 !important;
    }

    .push-last {
        margin-right: 0%;
    }

    .push-first {margin-left: auto}

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
        width: 600px;
    }

    .passport-info-record {
        position: relative;
        padding-bottom: 50px;
        width: 100%;
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

    .button-update {
        margin-top: 20px;
        margin-left: 50px;
    }

    .link-like {
        cursor: pointer;
        text-decoration: underline;
    }
</style>