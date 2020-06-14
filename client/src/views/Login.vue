<template>
  <section>
    <div class="jumbotron">
      <h1 class="display-3">Connexion</h1>
      <div v-if="loading">
        <img src="../assets/infinity.svg" />
      </div>
      <div class="alert alert-danger" role="alert" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="alert alert-success" role="alert" v-if="successMessage">{{ successMessage }}</div>
      <form @submit.prevent="login()">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input type="text" class="form-control" id="username" v-model="user.username" />
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Mot de passe</label>
          <input type="password" class="form-control" id="password" v-model="user.password" />
        </div>
        <button type="submit" class="btn btn-primary">Se connecter</button>
      </form>
    </div>
  </section>
</template>

<script>
import Joi from "@hapi/joi";

const LOGIN_URL = "//api.laendrun.ch/auth/login";

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .min(10)
    .required()
});

export default {
  data: () => ({
    loading: false,
    errorMessage: "",
    successMessage: "",
    user: {
      username: "",
      password: ""
    }
  }),
  methods: {
    login() {
      this.errorMessage = "";
      if (this.validUser()) {
        this.loading = true;
        const body = {
          username: this.user.username,
          password: this.user.password
        };

        fetch(LOGIN_URL, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(body)
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            return response.json().then(error => {
              throw new Error(error.message);
            });
          })
          .then(result => {
            localStorage.token = result.token;
            this.loading = false;
            this.successMessage = "Connecté";
            this.$router.push("/dashboard");
          })
          .catch(error => {
            this.loading = false;
            this.errorMessage = error.message;
          });
      }
    },
    validUser() {
      const result = schema.validate(this.user);
      if (!result.error) {
        return true;
      }

      if (result.error.message.includes("username")) {
        this.errorMessage = "Nom d'utilisateur invalide 😭";
      } else {
        this.errorMessage = "Mot de passe invalide 😭";
      }

      return false;
    }
  }
};
</script>