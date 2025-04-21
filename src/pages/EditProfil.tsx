import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Helmet } from "react-helmet";

const EditProfilePage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": "iuy7tk8o6hjg5dews",
            "Content-Type": "application/json",
          },
        });
        const data = res.data;
        setUser(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_URL}/api/user`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": "iuy7tk8o6hjg5dews",
          "Content-Type": "application/json",
        },
      });

      const updatedUser = {
        ...user!,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser)); // <-- penting ini

      setSuccess(true);
    } catch (error) {
      console.error("Gagal update profil:", error);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!user) return <div className="p-10 text-red-500">Gagal memuat data.</div>;

  return (
    <>
      <Helmet>
        <title>Edit Profil - Crusher Spares Indonesia</title>
      </Helmet>
      <div className="flex justify-center p-4 w-full">
        <div className="grid grid-cols-[250px_1fr] w-full max-w-5xl">
          {/* Sidebar */}
          <div className="flex flex-col border-r border-gray-300 text-left">
            <div className="p-6 border-b border-gray-300 flex flex-col items-center">
              <img
                src="/assets/images/photos/photo-1.png"
                alt="User"
                className="w-18"
              />
              <p className="font-semibold text-center">{user.name}</p>
              <p className="text-sm text-gray-600 text-center">{user.email}</p>
            </div>

            <nav className="p-6 space-y-4 text-sm flex-1">
              <a href="/profil" className="font-semibold block text-gray-700">
                Profil Saya
              </a>
              <a href="/profil/favorit" className="block text-gray-700">
                Barang Yang Disukai
              </a>
              <a
                href="/profil/riwayat-pembelian"
                className="block text-gray-700"
              >
                Riwayat Pembelian Saya
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="block text-red-600"
              >
                Keluar
              </button>
            </nav>
          </div>

          {/* Konten Form */}
          <div className="p-10 w-full">
            <h2 className="text-2xl font-bold mb-6 text-[#1E2749]">
              Ubah Profil
            </h2>

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                Profil berhasil diperbarui!
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 max-w-5xl text-sm text-left"
            >
              <div className="grid md:grid-cols-[250px_1fr] grid-cols-[120px_1fr] max-w-6xl w-full">
                <label className="text-gray-600">Username</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded "
                />
              </div>

              <div className="grid md:grid-cols-[250px_1fr] grid-cols-[120px_1fr] max-w-6xl w-full">
                <label className="text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="grid md:grid-cols-[250px_1fr] grid-cols-[120px_1fr] max-w-6xl w-full">
                <label className="text-gray-600">Nomor Telepon</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="grid md:grid-cols-[250px_1fr] grid-cols-[120px_1fr] max-w-6xl w-full">
                <label className="text-gray-600 mt-2">Alamat</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <a
                  href="/profil"
                  className="text-gray-600 hover:underline self-center"
                >
                  Batal
                </a>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;
