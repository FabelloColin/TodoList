<template>
    <body>
            <h1 class="loginh1">Login</h1>
            <div id="login">
            <input type="text" class="new-todo" name="username" v-model="input.username" placeholder="Username" />
            <input type="password" class="new-todo" name="password" v-model="input.password" placeholder="Password" />
            <ul>
                <li><button type="button" v-on:click="login()">Login</button></li>
                <li><button type="button" v-on:click="register()">register</button></li>
            </ul>
    </div>
    </body>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'Login',
        data() {
            return {
                input: {
                    username: "Email",
                    password: "Mdp"
                }
            }
        },
        methods: {
            register(){
              this.$router.replace({ name: "register" });
            },
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
