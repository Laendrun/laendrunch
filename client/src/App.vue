<template>
  <div id="app container">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">Laendrun</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Tableau de bord</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view class="container pt-3" />
    <div class="footer text-center">
      <hr />
      <p>
        Developped with 🧡 by Simon Aeby -
        <i class="fab fa-github"></i>
        <a href="https://github.com/Laendrun?tab=repositories" target="_blank">GitHub</a>
      </p>
    </div>
  </div>
</template>