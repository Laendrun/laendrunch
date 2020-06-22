<template>
  <section>
    <h1>Dashboard</h1>

    <div class="container">
      <div class="alert alert-danger" role="alert" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="alert alert-success" role="alert" v-if="successMessage">{{ successMessage }}</div>
      <div v-if="loading">
        <img src="../assets/infinity.svg" />
      </div>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#profile">Profil</a>
        </li>
        <li class="nav-item">
          <button @click="logout" class="nav-link">Déconnexion</button>
        </li>
      </ul>
      <div id="tab-content" class="tab-content">
        <!-- Users tab -->
        <div class="tab-pane fade active show" id="profile">
          <form class="mt-3" @submit.prevent="patch_email">
            <div class="form-row">
              <div class="col-5">
                <input
                  type="text"
                  class="form-control"
                  name="email"
                  :placeholder="user.email"
                  v-model="modifiedUser.email"
                />
              </div>
              <div class="col">
                <label for="email">Addresse email</label>
              </div>
              <div class="col">
                <button type="submit" class="btn btn-primary">Changer</button>
              </div>
            </div>
          </form>
          <form class="mt-3" @submit.prevent="patch_username">
            <div class="form-row">
              <div class="col-5">
                <input
                  type="text"
                  class="form-control"
                  name="username"
                  :placeholder="user.username"
                  v-model="modifiedUser.username"
                />
              </div>
              <div class="col">
                <label for="username">Nom d'utilisateur</label>
              </div>
              <div class="col">
                <button type="submit" class="btn btn-primary">Changer</button>
              </div>
            </div>
          </form>
          <form class="mt-3" @submit.prevent="patch_password">
            <div class="form-row">
              <div class="col-5">
                <input
                  type="password"
                  name="password"
                  v-model="modifiedUser.password"
                  class="form-control"
                />
              </div>
              <div class="col">
                <label for="password">Mot de passe</label>
              </div>
              <div class="col">
                <button type="submit" class="btn btn-primary">Changer</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Joi from "@hapi/joi";
const email_schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  username: Joi.optional(),
  password: Joi.optional()
});
const username_schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  password: Joi.optional(),
  email: Joi.optional()
});
const password_schema = Joi.object({
  password: Joi.string()
    .trim()
    .min(10)
    .required(),
  email: Joi.optional(),
  username: Joi.optional()
});
const USER_URL = "//api.laendrun.ch/user";
const PATCH_USERNAME = "//api.laendrun.ch/user/username";
const PATCH_PASSWORD = "//api.laendrun.ch/user/password";
const PATCH_EMAIL = "//api.laendrun.ch/user/email";
export default {
  data: () => ({
    user: "",
    modifiedUser: {
      username: "",
      password: "",
      email: ""
    },
    errorMessage: "",
    successMessage: "",
    loading: false
  }),
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    patch_email() {
      this.errorMessage = "";
      this.successMessage = "";
      const body = {
        email: this.modifiedUser.email
      };
      const { error, value } = email_schema.validate(this.modifiedUser);
      if (!error) {
        this.loading = true;
        fetch(PATCH_EMAIL, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.token}`
          },
          body: JSON.stringify(body)
        })
          .then(response => {
            if (response.ok) {
              this.loading = false;
              this.successMessage = "Adresse email modifiée";
            }
          })
          .catch(error => {
            this.loading = false;
            this.errorMessage = error.message;
          });
      } else {
        this.errorMessage = error.message;
      }
    },
    patch_username() {
      this.errorMessage = "";
      this.successMessage = "";
      const body = {
        username: this.modifiedUser.username
      };
      const { error, value } = username_schema.validate(this.modifiedUser);
      if (!error) {
        this.loading = true;
        fetch(PATCH_USERNAME, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.token}`
          },
          body: JSON.stringify(body)
        })
          .then(response => {
            if (response.ok) {
              this.loading = false;
              this.successMessage = "Nom d'utilisateur modifié";
            } else {
              this.loading = false;
              if (response.status == 409) {
                this.errorMessage =
                  "Nom d'utilisateur indisponible, merci d'en choisir un autre";
              } else {
                this.errorMessage = `Erreur: ${response.status} ${response.statusText}`;
              }
            }
          })
          .catch(error => {
            this.loading = false;
            this.errorMessage = error.message;
          });
      } else {
        this.errorMessage = error.message;
      }
    },
    patch_password() {
      this.errorMessage = "";
      this.successMessage = "";
      const body = {
        password: this.modifiedUser.password
      };
      const { error, value } = password_schema.validate(this.modifiedUser);
      if (!error) {
        this.loading = true;
        fetch(PATCH_PASSWORD, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.token}`
          },
          body: JSON.stringify(body)
        })
          .then(response => {
            if (response.ok) {
              this.loading = false;
              this.successMessage = "Mot de passe modifié";
            } else {
              this.loading = false;
              this.errorMessage = `Erreur: ${response.status} ${response.statusText}`;
            }
          })
          .catch(error => {
            this.loading = false;
            this.errorMessage = error.message;
          });
      } else {
        this.errorMessage = error.message;
      }
    }
  },
  mounted() {
    fetch(USER_URL, {
      headers: {
        authorization: `Bearer ${localStorage.token}`
      }
    })
      .then(res => res.json())
      .then(result => {
        this.user = result;
      });
  }
};
</script>