<template>
  <section>
    <div class="card">
      <div class="card-header" :id="user.headingId">
        <h5 class="mb-0">
          <button
            v-if="user.role_id === 2"
            class="btn btn-link collapsed"
            type="button"
            data-toggle="collapse"
            :data-target="user.collapseIdTarget"
            aria-expanded="false"
            :aria-controls="user.collapseId"
          >🛡{{ user.username }}</button>
          <button
            v-else
            class="btn btn-link collapsed"
            type="button"
            data-toggle="collapse"
            :data-target="user.collapseIdTarget"
            aria-expanded="false"
            :aria-controls="user.collapseId"
          >{{ user.username }}</button>
        </h5>
      </div>
      <div
        :id="user.collapseId"
        class="collapse"
        :aria-labelledby="user.headingId"
        :data-parent="parentTarget"
      >
        <div class="card-body">
          <div class="row">
            <div class="col-sm">
              <p>{{ user.email }}</p>
              <p v-if="user.role_id === 1">Utilisateur</p>
              <p v-else>Administrateur</p>
            </div>
            <div class="col-sm">
              <button v-on:click="$emit('deleteUser', user._id)" class="btn btn-secondary">❌</button>
              <button
                data-toggle="modal"
                :data-target="user.modalIdTarget"
                class="btn btn-secondary"
              >✏</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" :id="user.modalId" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ user.username }}</h5>
            <div class="alert alert-danger" role="alert" v-if="errorMessage">{{ errorMessage }}</div>
            <div class="alert alert-success" role="alert" v-if="successMessage">{{ successMessage }}</div>
            <div v-if="loading">
              <img src="../assets/infinity.svg" />
            </div>
          </div>
          <div class="modal-body">
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
            <form class="mt-3" @submit.prevent="patch_role_id(user._id)">
              <div class="form-row">
                <div class="col-5">
                  <input
                    type="text"
                    name="role_id"
                    :placeholder="user.role_id"
                    v-model="modifiedUser.role_id"
                    class="form-control"
                  />
                </div>
                <div class="col">
                  <label for="role_id">ID de rôle</label>
                </div>
                <div class="col">
                  <button type="submit" class="btn btn-primary">Changer</button>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" data-dismiss="modal">Fermer</button>
          </div>
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
    .required()
});
const username_schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
});
const password_schema = Joi.object({
  password: Joi.string()
    .trim()
    .min(10)
    .required()
});
const role_id_schema = Joi.object({
  role_id: Joi.number()
    .min(1)
    .max(2)
    .required(),
  user_id: Joi.number().required()
});
const USER_URL = "//api.laendrun.ch/user";
const PATCH_USERNAME = "//api.laendrun.ch/user/username";
const PATCH_PASSWORD = "//api.laendrun.ch/user/password";
const PATCH_EMAIL = "//api.laendrun.ch/user/email";
const PATCH_ROLE_ID = "//api.laendrun.ch/user/role_id";
export default {
  data: () => ({
    errorMessage: "",
    successMessage: "",
    loading: false,
    modifiedUser: {
      username: "",
      password: "",
      email: "",
      role_id: ""
    }
  }),
  methods: {
    patch_email() {
      this.errorMessage = "";
      this.successMessage = "";
      const body = {
        email: this.modifiedUser.email
      };
      const { error, value } = email_schema.validate(body);
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
      const { error, value } = username_schema.validate(body);
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
      const { error, value } = password_schema.validate(body);
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
    },
    patch_role_id(id) {
      this.errorMessage = "";
      this.successMessage = "";
      const body = {
        role_id: this.modifiedUser.role_id,
        user_id: id
      };
      const { error, value } = role_id_schema.validate(body);
      if (!error) {
        this.loading = true;
        fetch(PATCH_ROLE_ID, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.token}`
          },
          body: JSON.stringify(body)
        }).then(response => {
          if (response.ok) {
            this.loading = false;
            this.successMessage = "Rôle modifié";
            this.$emit("update");
          } else {
            this.loading = false;
            this.errorMessage = `Erreur: ${response.status} ${response.statusText}`;
          }
        });
      } else {
        this.errorMessage = error.message;
      }
    }
  },
  props: ["user", "parentTarget"]
};
</script>