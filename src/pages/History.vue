<template>
  <div class="history">
    <h1>📜 History Transaksi</h1>

    <div v-for="h in history" :key="h.id" class="card">
      <p>ID: {{ h.id }}</p>
      <p>Total: Rp {{ h.total }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getHistory } from "../services/api";

const history = ref([]);

onMounted(async () => {
  const res = await getHistory();
  history.value = res.data;
});
</script>

<style>
.history {
  padding: 20px;
}

.card {
  background: #eee;
  padding: 10px;
  margin-bottom: 10px;
}
</style>