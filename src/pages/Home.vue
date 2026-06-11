<script setup>
const user = JSON.parse(
  localStorage.getItem("user")
);
</script>

<template>

  <div
    class="saldo-box"
    v-if="user && user.saldo !== undefined"
  >
    💰 Saldo:
    Rp {{ Number(user.saldo).toLocaleString() }}
  </div>

</template>

<style>
.saldo-box{
  background:#22c55e;
  color:white;
  padding:10px 20px;
  border-radius:12px;
  font-weight:bold;
  width:fit-content;
}
</style>