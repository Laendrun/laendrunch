<template>
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
          </div>
        </div>
        <!-- <div class="row-12" style="background: red">
          <div class="col-6 text-left" style="background: green">
            <p>{{ user.email }}</p>
            <p v-if="user.role_id === 1">Utilisateur</p>
            <p v-else>Administrateur</p>
          </div>
          <div class="col-6 text-right" style="background: blue">
            <p v-if="user.role_id === 1">Utilisateur</p>
            <p v-else>Administrateur</p>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["user", "parentTarget"]
};
</script>