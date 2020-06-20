<template>
  <div class="col-sm-4">
    <div class="card border-dark mb-3" style="max-width: 20rem;">
      <div class="card-header">De: {{ message.fromName }}</div>
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
  props: ["message", "boi"]
};
</script>