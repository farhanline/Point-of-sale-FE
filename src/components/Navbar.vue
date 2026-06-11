<script setup>
import {
  ref,
  onMounted
} from "vue";

import {
  getKas
} from "../services/api";

const kas = ref(0);

const user = ref(
  JSON.parse(
    localStorage.getItem("user")
  )
);

onMounted(async () => {

  try {

    const res = await getKas();

    kas.value = res.kas || 0;

  } catch (err) {

    console.log(err);

  }

});
</script>

<template>

  <div class="navbar">

    <h1>Warteg Kahfi Jaya</h1>

    <div
      class="saldo-card"
      v-if="user"
    >

      <div class="saldo-label">
        Kas Toko
      </div>

      <div class="saldo-value">
        Rp {{ Number(kas).toLocaleString() }}
      </div>

    </div>

  </div>

</template>

<style>
.navbar{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:15px 30px;
  background:#111;
  color:white;
}

.saldo-card{
  background:linear-gradient(
    135deg,
    #22c55e,
    #16a34a
  );

  padding:15px 25px;

  border-radius:18px;

  min-width:220px;

  box-shadow:
    0 10px 25px rgba(0,0,0,.3);
}

.saldo-label{
  font-size:13px;
  opacity:.8;
}

.saldo-value{
  font-size:28px;
  font-weight:bold;
  margin-top:5px;
}

.logout-btn{
  margin-top:10px;
  width:100%;
  padding:10px;
  border:none;
  border-radius:10px;
  background:#ef4444;
  color:white;
  font-weight:bold;
  cursor:pointer;
}
</style>