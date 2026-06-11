<template>
  <div class="login">

    <h1>
      {{
        isRegister
        ? "Register"
        : "Login"
      }}
    </h1>

    <!-- USERNAME -->
    <input
      v-model="username"
      placeholder="Username"
    />

    <!-- EMAIL -->
    <input
      v-if="isRegister"
      v-model="email"
      placeholder="Email"
    />

    <!-- PASSWORD -->
    <input
      v-model="password"
      type="password"
      placeholder="Password"
    />

    <!-- BUTTON -->
    <button @click="handleSubmit">

      {{
        isRegister
        ? "Daftar"
        : "Login"
      }}

    </button>

    <!-- SWITCH -->
    <p
      class="switch"
      @click="isRegister = !isRegister"
    >

      {{
        isRegister
        ? "Sudah punya akun?"
        : "Belum punya akun?"
      }}

    </p>

  </div>
</template>

<script setup>
import { ref } from "vue";

import {
  login,
  register
} from "../services/api";

const isRegister = ref(false);

const username = ref("");
const email = ref("");
const password = ref("");

const handleSubmit = async () => {

  // REGISTER
  if (isRegister.value) {

    const res = await register({

      username: username.value,
      email: email.value,
      password: password.value

    });

    alert(res.message);

    if (res.success) {
      isRegister.value = false;
    }

    return;
  }

  // LOGIN
 const res = await login({
  username: username.value,
  password: password.value
});

  if (res.success) {

    localStorage.setItem(
      "token",
      res.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    location.reload();

  } else {

    alert(res.message);

  }

};
</script>

<style>
h1{
  text-align:center;
  
}
.login{
  width:350px;
  margin:100px auto;
  color: #fff;
  display:flex;
  flex-direction:column;
  gap:12px;
}

input{
  padding:14px;
  border:none;
  border-radius:12px;
}

button{
  padding:14px;
  border:none;
  border-radius:12px;
  background:#22c55e;
  color:white;
  cursor:pointer;
}

.switch{
  text-align:center;
  cursor:pointer;
  color:#38bdf8;
}
</style>