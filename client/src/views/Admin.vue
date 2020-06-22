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
          <button @click="logout" class="nav-link">Déconnexion</button>
        </li>
      </ul>
      <div id="tab-content" class="tab-content">
        <!-- Users tab -->
        <div class="tab-pane fade active show" id="users">
          <div class="accordion" id="userAccordion">
            <accordion-user-item
              v-for="user in users"
              :user="user"
              parentTarget="#userAccordion"
              :key="user._id"
            />
          </div>
        </div>
        <!-- Messages tab -->
        <div class="tab-pane fade" id="messages">
          <div class="row mt-3">
            <email-card v-for="message in messages" :message="message" :key="message._id" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AccordionUserItem from "../components/AccordionUserItem.vue";
import EmailCard from "../components/EmailCard";
const USER_URL = "//api.laendrun.ch/user";
const MESSAGE_URL = "//api.laendrun.ch/email";

export default {
  data: () => ({
    users: "",
    messages: ""
  }),
  components: {
    AccordionUserItem,
    EmailCard
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
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
        result.users.forEach(user => {
          user.headingId = `heading${user._id}`;
          user.collapseId = `collapse${user._id}`;
          user.collapseIdTarget = `#collapse${user._id}`;
        });
        this.users = result.users;
      });
    fetch(MESSAGE_URL, {
      headers: {
        authorization: `Bearer ${localStorage.token}`
      }
    })
      .then(res => res.json())
      .then(result => {
        this.messages = result.emails;
      });
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