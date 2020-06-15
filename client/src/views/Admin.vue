<template>
  <section>
    <h1>Admin Dashboard</h1>
    <h2 v-if="!users">Récupération des informations en cours...</h2>
    <h2 v-if="users">Utilisateurs</h2>

    <div class="container">
      <div class="row">
        <div class="col-sm-4" v-for="user in users" :key="user._id">
          <div
            class="card text-white bg-dark mb-3"
            style="max-width: 20rem;"
            v-if="user.role_id === 2"
          >
            <div class="card-header">{{ user.username }}</div>
            <div class="card-body">
              <p class="card-text">{{ user.email }}</p>
              <p class="card-text">Administrateur</p>
            </div>
          </div>

          <div class="card bg-light mb-3" style="max-width: 20rem;" v-else>
            <div class="card-header">{{ user.username }}</div>
            <div class="card-body">
              <p class="card-text">{{ user.email }}</p>
              <p class="card-text">Administrateur</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const USER_URL = "//api.laendrun.ch/user";

export default {
  data: () => ({
    users: ""
  }),
  mounted() {
    fetch(USER_URL, {
      headers: {
        authorization: `Bearer ${localStorage.token}`
      }
    })
      .then(res => res.json())
      .then(result => {
        this.users = result.users;
      });
  }
};
</script>