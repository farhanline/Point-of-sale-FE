<template>
  <div class="app">

    <!-- LOGIN -->
    <div v-if="!isLogin" class="login-page">
      <div class="card">
        <h1>🔥 Ayam Bakar Bang Rudi🔥</h1>
        <p class="subtitle">Masuk / Daftar</p>

        <form @submit.prevent="login">
          <input type="text" v-model="username" placeholder="Username" required />
          <input type="password" v-model="password" placeholder="Password" required />
          <button type="submit" class="btn-login">Masuk</button>
        </form>
      </div>
    </div>

    <!-- BERANDA -->
    <div v-else class="home-page">

      <!-- HEADER -->
      <header>
        <h2>🍗 Ayam Bakar Bang Rudi</h2>

        <div class="header-right">
          <input type="text" v-model="carimenu" placeholder="Cari menu..." class="search"/>

          <div class="cart" @click="toggleCart">
            🛒
            <span class="badge" v-if="cart.length">{{ cart.length }}</span>
          </div>

          <button @click="logout">Keluar</button>
        </div>
      </header>

      <h3 class="welcome">Halo, {{ username }} 👋</h3>

      <!-- MAKANAN -->
      <h3 class="section-title">🍗 Menu Makanan</h3>
      <div class="products">
        <div class="product-card" v-for="item in filteredMakanan" :key="item.name">
          <img src="../src/assets/11.jfif" alt="">
          <h4>{{ item.name }}</h4>
          <p>{{ item.desc }}</p>
          <span>Rp {{ item.price }}</span>
          <button @click="addToCart(item)">Beli</button>
        </div>
      </div>

      <!-- MINUMAN -->
      <h3 class="section-title">🥤 Minuman Segar</h3>
      <div class="products">
        <div class="product-card" v-for="item in filteredMinuman" :key="item.name">
          <img src="../src/assets/12.jfif" alt="">
          <h4>{{ item.name }}</h4>
          <p>{{ item.desc }}</p>
          <span>Rp {{ item.price }}</span>
          <button @click="addToCart(item)">Beli</button>
        </div>
      </div>

      <!-- CART PANEL -->
      <div class="cart-panel" v-if="showCart">
        <h3>Keranjang</h3>

        <div v-if="cart.length === 0">Kosong</div>

        <div v-for="(item, index) in cart" :key="index" class="cart-item">
          <span>{{ item.name }}</span>
          <span>Rp {{ item.price }}</span>
        </div>

        <hr />
        <h4>Total: Rp {{ total }}</h4>

        <button class="checkout" @click="checkout">Checkout</button>
      </div>

      <!-- NOTIFIKASI -->
      <div v-if="showSuccess" class="success-popup">
        Pesanan berhasil, terima kasih 🙏
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      isLogin: false,
      search: '',
      showCart: false,
      showSuccess: false,
      cart: [],

      makanan: [
        { name: 'Ayam Bakar Madu', desc: 'Manis gurih', price: 25000, img: 'https://source.unsplash.com/300x200/?grilled-chicken' },
        { name: 'Ayam Bakar Pedas', desc: 'Pedas 🔥', price: 23000, img: 'https://source.unsplash.com/300x200/?spicy-chicken' },
        { name: 'Ayam Bakar Original', desc: 'Klasik', price: 20000, img: 'https://source.unsplash.com/300x200/?roasted-chicken' }
      ],

      minuman: [
        { name: 'Es Teh Manis', desc: 'Segar', price: 5000, img: 'https://source.unsplash.com/300x200/?iced-tea' },
        { name: 'Jus Jeruk', desc: 'Fresh 🍊', price: 10000, img: 'https://source.unsplash.com/300x200/?orange-juice' },
        { name: 'Es Coklat', desc: 'Creamy', price: 12000, img: 'https://source.unsplash.com/300x200/?chocolate-drink' }
      ]
    }
  },

  computed: {
    filteredMakanan() {
      return this.makanan.filter(i =>
        i.name.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    filteredMinuman() {
      return this.minuman.filter(i =>
        i.name.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    total() {
      return this.cart.reduce((sum, item) => sum + item.price, 0)
    }
  },

  methods: {
    login() {
      if (this.username && this.password) {
        this.isLogin = true
      } else {
        alert('Isi username dan password!')
      }
    },
    logout() {
      this.isLogin = false
      this.cart = []
    },
    addToCart(item) {
      this.cart.push(item)
    },
    toggleCart() {
      this.showCart = !this.showCart
    },
    checkout() {
      if (this.cart.length === 0) {
        alert('Keranjang masih kosong!')
        return
      }

      this.showSuccess = true
      this.cart = []
      this.showCart = false

      setTimeout(() => {
        this.showSuccess = false
      }, 3000)
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff512f, #dd2476);
}

/* LOGIN */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 300px;
  text-align: center;
}

.subtitle {
  color: gray;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ddd;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  background: #ff512f;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}


/* HEADER */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search {
  padding: 8px;
  border-radius: 8px;
  border: none;
}

.cart {
  position: relative;
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background: yellow;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}

/* PRODUCTS */
.products {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.product-card {
  background: white;
  border-radius: 15px;
  width: 220px;
  overflow: hidden;
}

.product-card img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.product-card button {
  margin: 10px;
  width: calc(100% - 20px);
}

/* CART */
.cart-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 250px;
  height: 100%;
  background: white;
  padding: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
}

/* SUCCESS */
.success-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #2ecc71;
  color: white;
  padding: 15px;
  border-radius: 10px;
}
</style>