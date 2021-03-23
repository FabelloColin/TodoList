
<template>
  <body>
      <div id="register" class="register">
        <h1 class="loginh1">Register</h1>
        <form @submit.prevent="login" id="form" >
          <div>
            <label for="username">username</label>
            <input name="username" v-model="input.username" placeholder="username">
          </div>
          <div>
            <label for="email">Email</label>
            <input name="email" type="email" v-model="input.email" placeholder="Adresse électronique">
          </div>
          <div>
            <label for="password">password</label>
            <input name="password" v-model="input.password" placeholder="password" type="password">
          </div>
          <button type="button" v-on:click="register()">register</button>
        </form>
      </div>
  </body>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Register',
    data() {
        return {
            input: {
                username: "",
                email: "",
                password: ""
            }
        }
    },
  methods: {
    register() {
    {
        if ("" == this.input.username || "" == this.input.password || "" == this.input.email) {
            console.log("A username, Email and password must be present");

            return;
        }

        const response = axios.post("http://138.68.74.39/api/register?name=" + this.input.username + "&email=" + this.input.email + "&password=" + this.input.password)
        .then(function (response) {
                if (200 != response.status) {
                    return;
                }else if (409 == response.status) {
                    console.log("Erreur, email ou nom déjà prit");
                }

                localStorage.setItem("tokenBearer", response.data.token)
            }
        ) // connection api

        this.$router.replace({ name: "login" });
    }
  }
  }
}

</script>