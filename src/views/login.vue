<template>
    <div id="login">
        <h1>Login</h1>
        <input type="text" name="username" v-model="input.username" placeholder="Username" />
        <input type="password" name="password" v-model="input.password" placeholder="Password" />
        <button type="button" v-on:click="login()">Login</button>
    </div>
    <div>
      <button type="button" v-on:click="register()">register</button>
    </div>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'Login',
        data() {
            return {
                input: {
                    username: "toto@toto.com",
                    password: "totototo"
                }
            }
        },
        methods: {
            register(){
              this.$router.replace({ name: "Todos" });
            }
            login() {
                if ("" == this.input.username || "" == this.input.password) {
                    console.log("A username and password must be present");

                    return;
                }

                const response = axios.post("http://138.68.74.39/api/login?email=" + this.input.username + "&password=" + this.input.password)
                .then(function (response) {
                        if (200 != response.status) {
                            return;
                        }

                        localStorage.setItem("tokenBearer", response.data.token)
                    }
                ) // connection api

                this.$router.replace({ name: "Todos" });
            }
        }
    }
</script>
