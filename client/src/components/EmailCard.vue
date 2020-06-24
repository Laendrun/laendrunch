<template>
  <div class="col-sm-4">
    <div class="card border-dark mb-3" style="max-width: 20rem;">
      <div class="card-header">
        <div class="row">
          <div class="col-sm text-left">De: {{ message.fromName }}</div>
          <div class="col-sm text-right">
            <button v-on:click="$emit('deleteMessage', message._id)" class="btn btn-secondary">❌</button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <h4 class="card-title">À: {{ message.to_mail }}</h4>
        <p class="card-text">Sujet: {{ message.subject }}</p>
        <p class="card-text">Message: {{ message.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["message"]
};
</script>