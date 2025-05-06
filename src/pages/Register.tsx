import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { Helmet } from "react-helmet";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.name || !form.password) {
      setError("Semua field wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, form, {
        headers: {
          "X-API-KEY": "iuy7tk8o6hjg5dews",
        },
      });

      alert("Berhasil register! Silakan login.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Daftar - CSI Online</title>
      </Helmet>
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <img
            src="/assets/images/logos/logowt.png"
            alt="Logo"
            className="logo self-center"
          />
          <h1 className="login-title">Daftar</h1>

          <label className="input-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="contoh@email.com"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="input-label" htmlFor="name">
            Nama
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nama lengkap atau nama perusahaan"
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label className="input-label" htmlFor="phone">
            Nomor HP
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="08**********"
            className="input-field"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <label className="input-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Minimal 6 karakter dan gabungan dari huruf dan angka"
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label className="input-label" htmlFor="address">
            Alamat
          </label>
          <textarea
            id="address"
            placeholder="Alamat lengkap rumah atau perusahaan"
            className="input-field"
            rows={3}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          {error && <p className="error-text">{error}</p>}

          <button
            type="submit"
            className="submit-btn bg-blue-500 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Loading..." : "Buat Akun"}
          </button>

          <p className="switch-register">
            Sudah punya akun? <a href="/login">Masuk</a>
          </p>
        </form>
      </div>
    </>
  );
}
