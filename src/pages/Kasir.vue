  <template>
    <div class="app">

      <!-- LEFT -->
      <div class="left">

        <!-- HEADER -->
        <div class="header">

          <h6>List Makanan Dan Minuman</h6>

          <input
            v-model="search"
            placeholder="Cari produk..."
            class="search"
          />

        </div>

        <!-- ADMIN FORM -->
        <div
          class="admin-form"
          v-if="user?.role === 'admin'"
        >

          <input
            v-model="namaProduk"
            placeholder="Nama produk"
            class="search"
          />

          <input
            v-model="hargaProduk"
            placeholder="Harga produk"
            class="search"
            type="number"
          />

          <input
            v-model="stokProduk"
            placeholder="Stok produk"
            class="search"
            type="number"
          />

          <button
            class="add-btn"
            @click="tambahProduk"
          >
            + Tambah Produk
          </button>

        </div>

        <div
    v-if="editId"
    class="admin-form"
  >

    <input
      v-model="editNama"
      placeholder="Nama produk"
      class="search"
    />

    <input
      v-model="editHarga"
      placeholder="Harga"
      class="search"
      type="number"
    />

    <input
      v-model="editStok"
      placeholder="Stok"
      class="search"
      type="number"
    />

    <button
      class="add-btn"
      @click="simpanEdit"
    >
      Simpan
    </button>

  </div>

        <!-- PRODUK -->
        <div class="produk-grid">

          <div
            class="produk-card"
            v-for="p in filteredProduk"
            :key="p.id"
            @click="tambahKeKeranjang(p)"
          >

            <h3>{{ p.nama }}</h3>

            <p>Rp {{ p.harga }}</p>   

            <p>Stok: {{ p.stok }}</p>

            <!-- ADMIN -->
            <div
              v-if="isAdmin"
              class="admin-action"
            >

            <button
              class="edit-btn"
              @click.stop="mulaiEdit(p)"
            >
              Edit
            </button>

              <button
                class="delete-btn"
                @click.stop="hapusProduk(p.id)"
              >
                Hapus
              </button>

            </div>

          </div>

        </div>

      </div>

      <!-- RIGHT -->
      <div class="right">

        <h2>🛒 Keranjang</h2>

        <div class="cart-list">

          <div
            class="cart-item"
            v-for="item in cart"
            :key="item.id"
          >

            <div>
              <h4>{{ item.nama }}</h4>
              <p>{{ item.qty }} x {{ item.harga }}</p>
            </div>

            <h4>
              Rp {{ item.qty * item.harga }}
            </h4>

          </div>

        </div>

        <div class="total-box">

          <h2>Total</h2>

          <h1>Rp {{ total }}</h1>
          
        </div>

        <input
    v-model="bayar"
    class="bayar-input"
    placeholder="Input uang bayar"
    type="number"
  />

        <button
          class="checkout-btn"
          @click="checkout"
        >
          Bayar Sekarang
        </button>

        <button
          class="checkout-btn hold-btn"
          @click="hold"
        >
          Hold Transaksi
        </button>

        <h2 style="margin-top:30px">
          🧊 Hold
        </h2>

        <div
          class="cart-item"
          v-for="h in holdData"
          :key="h.id"
        >

          <div>
            Hold #{{ h.id }}
          </div>

          <button
            @click="recall(h.id)"
          >
            Recall
          </button>

        </div>

      </div>

    </div>
  </template>

  <script setup>
  import { ref, computed, onMounted } from "vue";

  import Swal from "sweetalert2";

  import {
    getProduk,
    createTransaksi,
    holdTransaksi,
    getHold,
    recallHold,
    createProduk,
    deleteProduk,
    updateProduk
  } from "../services/api";

  const produk = ref([]);
  const cart = ref([]);
  const total = ref(0);
  const bayar = ref("");
  const search = ref("");

  const holdData = ref([]);
  const namaProduk = ref("");
  const hargaProduk = ref("");
  const stokProduk = ref("");
  const editId = ref(null);
  const editNama = ref("");
  const editHarga = ref("");
  const editStok = ref("");


  // ====================================
  // TAMBAH PRODUK
  // ====================================
  const tambahProduk = async () => {

    if (
      !namaProduk.value ||
      !hargaProduk.value ||
      !stokProduk.value
    ) {

      return Swal.fire({
        icon: "warning",
        title: "Lengkapi data produk"
      });

    }

    const res = await createProduk({

      nama: namaProduk.value,

      harga: Number(hargaProduk.value),

      stok: Number(stokProduk.value)

    });

    Swal.fire({

      icon: res.success
        ? "success"
        : "error",

      title: res.message

    });

    if (res.success) {

      // RESET INPUT
      namaProduk.value = "";
      hargaProduk.value = "";
      stokProduk.value = "";

      // REFRESH PRODUK
      const data = await getProduk();

      produk.value = data.data;

    }

  };

  // ====================================
  // AMBIL USER LOGIN
  // ====================================
const user = JSON.parse(
  localStorage.getItem("user")
) || {};

  const isAdmin =
    user?.role === "admin";

  // ====================================
  // AMBIL PRODUK
  // ====================================
  onMounted(async () => {

    const resProduk = await getProduk();

    produk.value = resProduk.data;

    loadHold();
  });

  // ====================================
  // LOAD HOLD
  // ====================================
  const loadHold = async () => {

    const res = await getHold();

    if (res.success) {
      holdData.value = res.data;
    }
  };

  // ====================================
  // SEARCH
  // ====================================
  const filteredProduk = computed(() => {

    return produk.value.filter((p) =>
      p.nama.toLowerCase().includes(
        search.value.toLowerCase()
      )
    );

  });

  // ====================================
  // TAMBAH CART
  // ====================================
  const tambahKeKeranjang = (p) => {

    const existing = cart.value.find(
      i => i.id === p.id
    );

    if (existing) {
      existing.qty++;
    } else {

      cart.value.push({
        ...p,
        qty: 1
      });

    }

    hitungTotal();
  };

  // ====================================
  // TOTAL
  // ====================================
  const hitungTotal = () => {

    total.value = cart.value.reduce(
      (sum, item) =>
        sum + item.harga * item.qty,
      0
    );

  };

  // ====================================
  // CHECKOUT
  // ====================================
  const checkout = async () => {

    if (cart.value.length === 0) {

      return Swal.fire({
        icon: "warning",
        title: "Keranjang kosong"
      });

    }

    const items = cart.value.map(i => ({
      id: i.id,
      qty: i.qty
    }));

    Swal.fire({
      title: "Memproses...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {

  const payload = {
    items,
    bayar: Number(bayar.value)
  };

      const res = await createTransaksi(payload);

      // gagal
      if (!res.success) {

        return Swal.fire({
          icon: "error",
          title: "Gagal",
          text: res.message
        });

      }
      
      // =========================
      // STRUK
      // =========================
      const strukItems = cart.value.map(item => `
        <div style="
          display:flex;
          justify-content:space-between;
          margin:8px 0;
        ">
          <span>
            ${item.nama} x${item.qty}
          </span>

          <b>
            Rp ${(item.qty * item.harga)
              .toLocaleString()}
          </b>
        </div>
      `).join("");

      Swal.fire({

        width: 500,

        background: "#0f172a",

        color: "white",

        title: "🧾 STRUK PEMBELIAN",

        html: `

          <div style="
            text-align:left;
            background:#1e293b;
            padding:20px;
            border-radius:15px;
          ">

            <div style="
              text-align:center;
              margin-bottom:20px;
            ">
              <h2>
                POINT OF SALE
              </h2>

              <p>
                ${new Date()
                  .toLocaleString()}
              </p>
            </div>

            ${strukItems}

            <hr style="
              border:1px dashed #475569;
              margin:15px 0;
            ">

<div style="
  display:flex;
  justify-content:space-between;
">
  <span>Total</span>

  <b>
    Rp ${total.value.toLocaleString()}
  </b>
</div>

<div style="
  display:flex;
  justify-content:space-between;
  margin-top:10px;
">
  <span>Bayar</span>

  <b>
    Rp ${Number(bayar.value).toLocaleString()}
  </b>
</div>

<div style="
  display:flex;
  justify-content:space-between;
  margin-top:10px;
">
  <span>Kembalian</span>

  <b>
    Rp ${(
      Number(bayar.value) - total.value
    ).toLocaleString()}
  </b>
</div>

</div>

        `,

        confirmButtonText: "Selesai"

      });

      // reset
      cart.value = [];
      total.value = 0;
      bayar.value = "";

    } catch (err) {

      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Terjadi error"
      });

    }

  };

  // ====================================
  // HOLD
  // ====================================
  const hold = async () => {

    if (cart.value.length === 0) {

      return Swal.fire({
        icon: "warning",
        title: "Keranjang kosong"
      });

    }

    const items = cart.value.map(i => ({
      id: i.id,
      qty: i.qty
    }));

    const res = await holdTransaksi({
      items
    });

    Swal.fire({
      icon: res.success
        ? "success"
        : "error",

      title: res.message
    });

    if (res.success) {

      cart.value = [];

      total.value = 0;

      loadHold();
    }
  };

  const hapusProduk = async (id) => {

    const res = await deleteProduk(id);

    Swal.fire({
      icon: res.success
        ? "success"
        : "error",

      title: res.message
    });

    if (res.success) {

      const data = await getProduk();

      produk.value = data.data;
    }
  };

  //===========================
  // EDIT PRODUK
  //===========================

  const mulaiEdit = (p) => {

    editId.value = p.id;

    editNama.value = p.nama;

    editHarga.value = p.harga;

    editStok.value = p.stok;

  };

  const simpanEdit = async () => {

    const res = await updateProduk(
      editId.value,
      {
        nama: editNama.value,
        harga: editHarga.value,
        stok: editStok.value
      }
    );

    Swal.fire({

      icon: res.success
        ? "success"
        : "error",

      title: res.message

    });

    if (res.success) {

      editId.value = null;

      const data = await getProduk();

      produk.value = data.data;

    }

  };

  // ====================================
  // RECALL HOLD
  // ====================================
  const recall = async (id) => {

    const res = await recallHold(id);

    if (res.success) {

      cart.value = res.data.items.map(i => ({

        id: i.id,
        nama: i.nama,
        harga: Number(i.harga),
        qty: Number(i.qty)

      }));

      hitungTotal();

      Swal.fire({
        icon: "success",
        title: "Hold dipanggil"
      });

      loadHold();
    }
  };
  </script>

  <style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
  }

  body {
    background: #0f172a;
  }

  .app {
    display: flex;
    min-height: 100vh;
    color: white;
  }

  /* LEFT */
  .left {
    width: 70%;
    padding: 25px;
  }

  /* HEADER */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .header h1 {
    font-size: 32px;
  }

  .search {
    width: 300px;
    padding: 14px;
    border: none;
    border-radius: 12px;
    outline: none;
    background: #1e293b;
    color: white;
  }

  /* GRID */
  .produk-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  /* CARD */
  .produk-card {
    background: #1e293b;
    padding: 15px;
    border-radius: 18px;
    cursor: pointer;
    transition: 0.3s;
  }

  .produk-card:hover {
    transform: translateY(-5px);
  }

  .produk-card img {
    width: 100%;
    border-radius: 15px;
  }

  .produk-card h3 {
    margin-top: 15px;
  }

  .produk-card p {
    margin-top: 10px;
    color: #38bdf8;
  }

  /* RIGHT */
  .right {
    width: 30%;
    background: #111827;
    padding: 25px;
    border-left: 1px solid #1e293b;
  }

  .right h2 {
    margin-bottom: 20px;
  }

  /* CART */
  .cart-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .cart-item {
    background: #1e293b;
    padding: 15px;
    border-radius: 14px;
    display: flex;
    justify-content: space-between;
  }

  .total-box {
    margin-top: 25px;
    background: #1e293b;
    padding: 20px;
    border-radius: 16px;
  }

  .total-box h1 {
    margin-top: 10px;
    color: #4ade80;
  }

  /* INPUT */
  .bayar-input {
    width: 100%;
    padding: 14px;
    margin-top: 20px;
    border: none;
    border-radius: 12px;
    background: #1e293b;
    color: white;
  }

  /* BUTTON */
  .checkout-btn {
    width: 100%;
    padding: 15px;
    margin-top: 20px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(
      90deg,
      #22c55e,
      #16a34a
    );
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s;
  }

  .checkout-btn:hover {
    transform: scale(1.02);
  }

  .hold-btn{
    background:#f59e0b;
    margin-top:10px;
  }

  .admin-form{
    display:flex;
    gap:10px;
    margin-bottom:25px;
  }

  .add-btn{
    border:none;
    padding:14px 20px;
    border-radius:12px;
    background:#22c55e;
    color:white;
    cursor:pointer;
    font-weight:bold;
  }

  .admin-action{
    margin-top:15px;
  }

  .delete-btn{
    width:100%;
    padding:10px;
    border:none;
    border-radius:10px;
    background:#ef4444;
    color:white;
    cursor:pointer;
    font-weight:bold;
  }

  .edit-btn{
    width:100%;
    padding:10px;
    border:none;
    border-radius:10px;
    background:#3b82f6;
    color:white;
    cursor:pointer;
    font-weight:bold;
    margin-bottom:10px;
  }
  </style>