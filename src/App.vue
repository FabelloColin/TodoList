<!-- <template>
  <div id="app">

    <todos v-model="todos"></todos>
    <button @click="addTodo">Ajouter une tache</button>
  </div>
</template>

<script src='./router/create.js'></script>-->
<template>
    <div id="app">
        <div id="nav">
            <router-link v-if="this.isAuthenticated()" to="logout" v-on:click.native="this.logout()" replace>Logout</router-link>
        </div>
        <router-view @authenticated="this.isAuthenticated()" />
    </div>
</template>

<script>
    export default {
        name: 'App',
        //verification
        mounted() {
            if(true === this.isAuthenticated()) {
                return;
            }

            this.$router.replace({ name: "login" });
        },
        //authentification
        methods: {
            isAuthenticated() {
                if (null === localStorage.getItem('tokenBearer')) {
                    return false;
                }

                return true;
            },
            logout() {
                localStorage.removeItem('tokenBearer');

                this.$router.replace({ name: "login" });
            }
        }
    }
</script>