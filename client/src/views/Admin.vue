<template>
  <section>
    <h1>Admin Dashboard</h1>
    <h2 v-if="!users || !messages">Récupération des informations en cours...</h2>

    <div class="container">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#users">Utilisateurs</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#messages">Messages</a>
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
        <div class="tab-pane fade" id="messages"></div>
      </div>
    </div>
  </section>
</template>

          // <div class="card text-white bg-dark mb-3" style="max-width: 20rem;">
          //   <div class="card-header">Header</div>
          //   <div class="card-body">
          //     <h4 class="card-title">Dark card title</h4>
          //     <p
          //       class="card-text"
          //     >Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          //   </div>
          // </div>

<script>
import AccordionUserItem from "../components/AccordionUserItem.vue";
const USER_URL = "//api.laendrun.ch/user";
const MESSAGE_URL = "//api.laendrun.ch/email";

export default {
  data: () => ({
    users: "",
    messages: ""
  }),
  components: {
    AccordionUserItem
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
        console.log(this.messages);
      });
  }
};
</script>