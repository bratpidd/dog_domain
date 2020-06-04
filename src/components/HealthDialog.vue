<template>
    <div class="flex-column">
        <div style="text-align: center"><h2>{{title}}</h2></div>
        <div class="flex-row"><p>Date:</p><input type="date" v-model="date"></div>
        <div class="flex-row"><p>Duration, days:</p><input type="number" v-model="duration"></div>
        <div class="flex-row"><p>Brand:</p><input type="text" v-model="brand"></div>
        <div class="flex-row">
            <button v-on:click="$emit('close')" class="button-style">Cancel</button>
            <button v-on:click="submitHandle" class="button-style push">Submit</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HealthDialog",
        data() {
            return {
                duration: 0,
                date: String,
                brand: '',
            }
        },
        props: {
            code: Number,
            dogId: Number,
            oldBrand: String,
            oldDuration: String
        },
        created() {
            let date = new Date();
            this.date = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0); //formatting for HTML input-date
            this.brand = this.oldBrand; //pre-filling previously used brand because it will likely match with a new one
            this.duration = this.oldDuration;

        },
        computed: {
            title() {
                switch (this.code) {
                    case 1: return 'Flea and Tick';
                    case 2: return 'Intestinal parasites';
                    case 3: return 'Vaccination';
                    default: return 'error'
                }
            },
        },
        methods: {
            submitHandle() {
                let objectToPass = {
                    code: this.code,
                    duration: this.duration,
                    date: this.date,
                    brand: this.brand,
                    dogId: this.dogId
                };
                this.$store.dispatch('updateMedication', objectToPass).then(() => {
                    this.$store.dispatch('getMedicationInfo').then(() => {
                        this.$root.$emit('medicationUpdated');
                    })
                });
                this.$emit('close');
            },
        }
    }
</script>

<style scoped>
    body, html {

    }

    .flex-row {
        display: flex;
        flex-direction: row;
        padding-left: 15px;
        padding-top: 15px;
    }

    .flex-column {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        display: flex;
        flex-direction: column;
    }

    p {
        width: 150px;
    }

    .button-style {
        width: 80px;
        margin-bottom: 15px;
        height: 40px;
        margin-right: 15px;
    }

</style>