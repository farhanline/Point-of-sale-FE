<script setup>
import { ref } from "vue";
import Navbar from "./components/Navbar.vue";
import Kasir from "./pages/Kasir.vue";
import Login from "./pages/Login.vue";

const token = localStorage.getItem("token");
</script>

<template>
  <div v-if="!token">
    <Login />
  </div>

  <div v-else>
    <Navbar />
    <Kasir />
  </div>
</template>