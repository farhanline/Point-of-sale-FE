  const BASE_URL = "http://localhost:3000";

  // produk
  export const getProduk = async () => {
    const res = await fetch(`${BASE_URL}/produk`);
    return res.json();
  };

  // transaksi
  export const createTransaksi = async (data) => {
    const res = await fetch(`${BASE_URL}/transaksi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  };

  // hold
  export const holdTransaksi = async (data) => {
    const res = await fetch(`${BASE_URL}/transaksi/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  };

  export const getHold = async () => {
    const res = await fetch(`${BASE_URL}/transaksi/hold`);
    return res.json();
  };

  export const recallHold = async (id) => {
    const res = await fetch(`${BASE_URL}/transaksi/hold/${id}`);
    return res.json();
  };

  // history
  export const getHistory = async () => {
    const res = await fetch(`${BASE_URL}/transaksi/history`);
    return res.json();
  };

  export const login = async (data) => {
    const res = await fetch(`http://localhost:3000/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return res.json();
  };

  export const getMember = async () => {

    const res = await fetch(
      "http://localhost:3000/member"
    );

    return await res.json();
  };


  export const topupSaldo = async (data) => {

  const res = await fetch(
    "http://localhost:3000/auth/topup",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  return await res.json();
};

// tambah produk
export const createProduk = async (data) => {

  const res = await fetch(
    `${BASE_URL}/produk`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  return await res.json();
};

export const register = async (data) => {

  const res = await fetch(
    "http://localhost:3000/auth/register",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  return await res.json();
};

export const deleteProduk = async (id) => {

  const res = await fetch(
    `${BASE_URL}/produk/${id}`,
    {
      method: "DELETE"
    }
  );

  return await res.json();
};

export const updateProduk = async (id, data) => {

  const res = await fetch(
    `${BASE_URL}/produk/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  return await res.json();

};

// ==========================
// GET KAS
// ==========================
export const getKas = async () => {

  const res = await fetch(
    `${BASE_URL}/transaksi/kas`
  );

  return await res.json();

};