import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

const UserProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token tidak ditemukan");

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": "iuy7tk8o6hjg5dews",
          },
        });

        setUser(res.data.data || res.data);
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!user) return <div className="p-10 text-red-500">Gagal memuat data.</div>;

  return (
    <>
      <Helmet>
        <title>{user.name} - Crusher Spares Indonesia</title>
      </Helmet>
      <div className="flex justify-center p-4">
        <div className="grid grid-cols-[250px_1fr] w-full max-w-5xl">
          {/* Kolom Kiri: Profil atas + Menu bawah */}
          <div className="flex flex-col border-r border-gray-300 text-left">
            {/* Atas: Profil */}
            <div className="p-6 border-b border-gray-300 flex flex-col items-center">
              <img
                src="/assets/images/photos/photo-1.png"
                alt="User"
                className="w-18"
              />
              <p className="font-semibold text-center">{user.name}</p>
              <p className="text-sm text-gray-600 text-center">{user.email}</p>
            </div>

            {/* Bawah: Menu */}
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

          {/* Kolom Kanan: Konten Profil */}
          <div className="p-10">
            <h2 className="text-2xl font-bold mb-8 text-[#1E2749]">
              Profil Saya
            </h2>

            <div className="space-y-6 text-sm text-left">
              <div className="flex items-center">
                <span className="w-40 text-gray-400">Username</span>
                <span className="text-black font-medium">{user.name}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 text-gray-400">Email</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 text-gray-400">Nomor Telepon</span>
                <span>{user.phone || "-"}</span>
              </div>
              <div className="flex items-start">
                <span className="w-40 text-gray-400">Alamat</span>
                <span>{user.address || "-"}</span>
              </div>

              <div className="flex justify-end">
                <a
                  href="/profil/edit"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Ubah
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
