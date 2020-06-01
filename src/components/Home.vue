<template>
    <div class="main-frame">
        <h1>Welcome to dog domain!</h1>
        <h2>Here you can maintain a tiny database about your dogs.</h2>
        <h2>Some handy health-care tracking is also included!</h2>
        <div class="sign-in" v-if="!$parent.loggedIn">
            <div id="google-signin-btn-home" class="g-button"></div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Home",
        mounted() {
            //this.$root.$on ('home_clicked',() => {
              //  this.$parent.renderGBtn('google-signin-btn-home');
               // alert ('hk');
            //});
            //this.$parent.renderGBtn('google-signin-btn-home');
            if (this.$parent.gbtnHomeRenderRequest) {
                this.$parent.renderGBtn('google-signin-btn-home');
                this.$parent.gbtnHomeRenderRequest = false;
            }
            window.addEventListener("google-loaded", () => {
                this.$parent.renderGBtn('google-signin-btn-home');
            });
        },
    }
</script>

<style scoped>
    .main-frame {
        padding-top: 15%;
        text-align: center;
        width: 100%;
        color: black;
    }

    .sign-in {
        margin-top: 40%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .g-button {
        margin-left: 20px;
    }

</style>