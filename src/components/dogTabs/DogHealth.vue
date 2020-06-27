<template>
    <div class="passport-info">
        <div class="flex-row flex-space-between">
            <div class="flex-column" >
                <div class="passport-info-record">
                    <h1>Health</h1>
                </div>
                <div class="flex-column med-graphics-container" v-if="healthLoaded" id="medGraphics">
                    <div class="flex-row passport-info-record" v-for="code in [1,2,3]" :key="code">
                        <countdown :data="getMedicationByCode(code)"></countdown>
                        <div class="button-update-container">
                            <button class="button-commit button-update" v-on:click="showHealthDialog(code)" v-if="showEditButton">Update</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="photo lowres-hidden" v-if="false">PHOTO</div>
        </div>
    </div>
</template>

<script>
    import Countdown from "../Countdown";
    import HealthDialog from "../HealthDialog";
    export default {
        name: "DogHealth",
        data() {
            return {
                healthLoaded: false,
            }
        },
        components: {Countdown},
        created() {
            this.loadData();
        },
        watch: {
            '$route.params.dog_id': function () { //if switched to another dog all data will be reloaded
                this.loadData();
            }
        },
        computed: {
            dogToView() {
                return this.$store.state.dogs[0];
            },
            showEditButton() {
                return this.dogToView.owner_id === this.$store.state.user.id;
            },
        },
        methods: {
            getMedicationByCode(code) {
                return this.$store.state.medication.find(med => med.code === String(code)) || {code: String(code)};
            },
            loadData() {
                this.healthLoaded = false;
                let dog_id = this.$route.params.dog_id;
                //this.$store.commit('wipeData'); //wipes all but user-related data
                //this.$store.dispatch('getDog', dog_id).then(() => {
                    this.$store.dispatch('getMedicationInfo', dog_id).then(() => {
                        this.healthLoaded = true;
                    });
                //});
            },
            showHealthDialog(code) {
                const medRecord = this.getMedicationByCode(code);
                this.$modal.show(HealthDialog,{
                    code: code,
                    dogId: this.dogToView.id,
                    oldBrand: medRecord.brand || '',
                    oldDuration: medRecord.duration || ''
                });
            },
        }
    }
</script>

<style scoped>
    .med-graphics-container {
        max-width: 600px;
    }

    .button-update {
        height: 100%;
    }

    .button-update-container {
        margin-left: 15px;
        margin-top: 30px;
        margin-bottom: 40px;
        height: 42px;
    }
</style>