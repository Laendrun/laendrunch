<template>
  <div id="app container">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">Laendrun</router-link>

      <div class="collapse navbar-collapse" id="navbarColor02">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Connexion</router-link>
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

