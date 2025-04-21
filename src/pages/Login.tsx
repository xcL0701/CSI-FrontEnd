import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext"; // ⬅️ Tambahkan ini
import "../index.css";
import { Helmet } from "react-helmet";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ⬅️ Gunakan login dari context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        form,
        {
          headers: {
            "X-API-KEY": "iuy7tk8o6hjg5dews",
          },
        }
      );

      const { token, user } = response.data;
      login(user, token); // ⬅️ Simpan pakai context
      alert("Berhasil login!");
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Crusher Spares Indonesia</title>
      </Helmet>
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <img
            src="/assets/images/logos/logowt.png"
            alt="Logo"
            className="logo self-center"
          />
          <h1 className="login-title">Login</h1>

          <label className="input-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="input-label" htmlFor="password">
            Password
          </label>
          <div className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="input-field pr-10"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEye className="eye-icon active" />
              ) : (
                <FiEyeOff className="eye-icon" />
              )}
            </span>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button
            type="submit"
            className="submit-btn bg-blue-500 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Loading..." : "Masuk"}
          </button>

          <p className="switch-register">
            Tidak punya akun? <a href="/register">Daftar</a>
          </p>
        </form>
      </div>
    </>
  );
}
