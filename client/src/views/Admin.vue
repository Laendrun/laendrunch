<template>
  <section>
    <h1>Admin Dashboard</h1>
    <h2 v-if="!users || !messages">Récupération des informations en cours...</h2>

    <div class="container">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#users">
            Utilisateurs
            <span class="badge badge-info badge-pill">{{ usersCount }}</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#messages">
            Messages
            <span class="badge badge-info badge-pill">{{ messagesCount }}</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#createUser">Créer un utilisateur</a>
        </li>
        <li class="nav-item">
          <button @click="logout" class="nav-link">Déconnexion</button>
        </li>
      </ul>
      <div id="tab-content" class="tab-content">
        <!-- Users tab -->
        <div class="tab-pane fade active show mb-2" id="users">
          <div class="alert alert-danger" role="alert" v-if="errorMessage">{{ errorMessage }}</div>
          <div class="alert alert-success" role="alert" v-if="successMessage">{{ successMessage }}</div>
          <div v-if="loading">
            <img src="../assets/infinity.svg" />
          </div>
          <div class="accordion" id="userAccordion">
            <accordion-user-item
              v-for="user in users"
              :user="user"
              parentTarget="#userAccordion"
              v-on:deleteUser="deleteUser($event)"
              :key="user._id"
            />
          </div>
        </div>
        <!-- Messages tab -->
        <div class="tab-pane fade mb-2" id="messages">
          <div class="row mt-3">
            <div class="col-sm">
              <div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input" id="all_emails" />
                <label
                  class="custom-control-label"
                  v-on:click="fetch_all_messages"
                  for="all_emails"
                >Afficher tous les messages</label>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <email-card v-for="message in messages" :message="message" :key="message._id" />
          </div>
        </div>
        <!-- Create User tab -->
        <div class="tab-pane fade mb-2" id="createUser">
          <div class="alert alert-danger" role="alert" v-if="errorMessage">{{ errorMessage }}</div>
          <div class="alert alert-success" role="alert" v-if="successMessage">{{ successMessage }}</div>
          <div v-if="loading">
            <img src="../assets/infinity.svg" />
          </div>
          <small v-if="!loading" class="mb-1">
            Les champs avec
            <span style="color: red">*</span> sont requis.
          </small>
          <div v-if="!loading" class="row-12 mt-3">
            <form @submit.prevent="create">
              <fieldset>
                <div class="form-group">
                  <label for="username">
                    <span style="color: red">*</span>Nom d'utilisateur
                  </label>
                  <input
                    required
                    type="text"
                    class="form-control"
                    id="username"
                    placeholder="Entrez un nom d'utilisateur"
                    v-model="newUser.username"
                  />
                </div>
                <div class="form-group">
                  <label for="email">
                    <span style="color: red">*</span>Addresse email
                  </label>
                  <input
                    required
                    type="text"
                    class="form-control"
                    id="email"
                    placeholder="Entrez une addresse email"
                    v-model="newUser.email"
                  />
                </div>
                <div class="form-group">
                  <label for="password">
                    <span style="color: red">*</span>Mot de passe
                  </label>
                  <input
                    required
                    type="password"
                    class="form-control"
                    id="password"
                    placeholder="Entrez un mot de passe"
                    v-model="newUser.password"
                  />
                </div>
                <div class="form-group">
                  <label for="role_id">ID de rôle</label>
                  <input
                    type="text"
                    class="form-control"
                    id="role_id"
                    placeholder="Entrez un ID de rôle"
                    v-model="newUser.role_id"
                  />
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-primary">Créer</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Joi from "@hapi/joi";
import AccordionUserItem from "../components/AccordionUserItem.vue";
import EmailCard from "../components/EmailCard";
const USER_URL = "//api.laendrun.ch/user";
const MESSAGE_URL = "//api.laendrun.ch/email";
const CREATE_URL = "//api.laendrun.ch/auth/create";
const DELETE_URL = "//api.laendrun.ch/user/delete";

const create_schema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .min(10)
    .trim()
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  role_id: Joi.number().optional()
});

export default {
  data: () => ({
    loading: false,
    all_messages: false,
    errorMessage: "",
    successMessage: "",
    users: "",
    messages: "",
    newUser: {
      password: "",
      username: "",
      email: "",
      role_id: undefined
    }
  }),
  components: {
    AccordionUserItem,
    EmailCard
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    create() {
      this.errorMessage = "";
      this.successMessage = "";
      const { error, value } = create_schema.validate(this.newUser);
      if (!error) {
        this.loading = true;
        fetch(CREATE_URL, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.token}`
          },
          body: JSON.stringify(this.newUser)
        })
          .then(response => {
            if (response.ok) {
              this.loading = false;
              this.successMessage = "Utilisateur créé";
              setTimeout(() => {
                this.successMessage = "";
              }, 3000);
              this.fetch_users();
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
    fetch_all_messages() {
      this.all_messages = !this.all_messages;
      if (this.all_messages) {
        fetch(MESSAGE_URL, {
          headers: {
            authorization: `Bearer ${localStorage.token}`
          }
        })
          .then(res => res.json())
          .then(result => {
            this.messages = result.emails;
          });
      } else {
        this.fetch_messages();
      }
    },
    fetch_users() {
      fetch(USER_URL, {
        headers: {
          authorization: `Bearer ${localStorage.token}`
        }
      })
        .then(res => res.json())
        .then(result => {
          result.users.forEach(user => {
            user.headingId = `heading${user._id}`;
            user.collapseId = `collapse${user._id}`;
            user.collapseIdTarget = `#collapse${user._id}`;
          });
          this.users = result.users;
        });
    },
    fetch_messages() {
      fetch(`${MESSAGE_URL}/?to=contact@laendrun.ch`, {
        headers: {
          authorization: `Bearer ${localStorage.token}`
        }
      })
        .then(res => res.json())
        .then(result => {
          this.messages = result.emails;
        });
    },
    deleteUser(id) {
      this.loading = true;
      fetch(`${DELETE_URL}/?id=${id}`, {
        method: "DELETE",
        headers: {
          "contente-type": "application/json",
          authorization: `Bearer ${localStorage.token}`
        }
      }).then(response => {
        if (response.ok) {
          this.loading = false;
          this.successMessage = "Utilisateur supprimé";
          setTimeout(() => {
            this.successMessage = "";
          }, 3000);
        } else {
          this.loading = false;
          this.errorMessage = `Erreur: ${response.status} ${response.statusText}`;
        }
        this.fetch_users();
      });
    }
  },
  mounted() {
    this.fetch_users();
    this.fetch_messages();
  },
  computed: {
    messagesCount() {
      return this.messages.length;
    },
    usersCount() {
      return this.users.length;
    }
  }
};
</script>