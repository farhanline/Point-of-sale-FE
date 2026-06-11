<template>
  <div class="card" @click="$emit('add', produk)">
    <img :src="produk.gambar" />
    <h3>{{ produk.nama }}</h3>
    <p>Rp {{ produk.harga }}</p>
  </div>

  <button
  v-if="isAdmin"
  class="delete-btn"
  @click.stop="hapusProduk(p.id)"
>
  Hapus
</button>
</template>

<script setup>
defineProps(["produk"]);
</script>

<style>
.card {
  background: white;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.card:hover {
  transform: scale(1.05);
}

.card img {
  width: 100%;
  border-radius: 10px;
}

.delete-btn{
  margin-top:10px;
  width:100%;
  padding:10px;
  border:none;
  border-radius:10px;
  background:#ef4444;
  color:white;
  cursor:pointer;
}
</style>