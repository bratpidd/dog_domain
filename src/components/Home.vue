<template>
    <div class="main-frame">
        <h1>Welcome to dog domain!</h1>
        <h2>Here you can maintain a tiny database about your dogs.</h2>
        <h2>Some handy medication tracking is also included!</h2>
        <div class="sign-in" v-if="!$parent.loggedIn">
            <div id="google-signin-btn-home" class="g-button"></div>
        </div>
        <div class="sign-in"></div>

    </div>
</template>

<script>
    export default {
        name: "Home",
        mounted() {
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
        width: 80%;
        color: black;
        height: 100%;
        align-self: center;
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .sign-in {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        flex: 1;
    }

    .g-button {
        margin-left: 20px;
    }

</style>