import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

const UserProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Sesuaikan angka 768px sesuai breakpoint mobile Anda
    };

    // Set initial value
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!user) return <div className="p-10 text-red-500">Gagal memuat data.</div>;

  return (
    <>
      <Helmet>
        <title>{user.name} - CSI Online</title>
      </Helmet>
      <div className="flex justify-center p-4 text-left">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
          {/* Kolom Kiri (Menu) */}
          <div className="border border-gray-300 rounded-lg overflow-hidden md:block">
            {isMobile ? (
              <>
                <div className="p-6 border-b border-gray-300 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src="/assets/images/photos/photo-1.png"
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover mr-2"
                    />
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
                    {isMenuOpen ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    )}
                  </button>
                </div>
                {isMenuOpen && (
                  <nav className="p-6 space-y-4 text-sm">
                    <a href="/profil" className="font-semibold block text-gray-700">
                      Profil Saya
                    </a>
                    <a href="/profil/favorit" className="block text-gray-700">
                      Barang Yang Disukai
                    </a>
                    <a href="/profil/riwayat-pembelian" className="block text-gray-700">
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
                )}
              </>
            ) : (
              <>
                {/* Atas: Profil (Desktop) */}
                <div className="p-6 border-b border-gray-300 flex flex-col items-center text-left">
                  <img
                    src="/assets/images/photos/photo-1.png"
                    alt="User"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <p className="font-semibold mt-2">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                {/* Bawah: Menu (Desktop) */}
                <nav className="p-6 space-y-4 text-sm text-left">
                  <a href="/profil" className="font-semibold block text-gray-700">
                    Profil Saya
                  </a>
                  <a href="/profil/favorit" className="block text-gray-700">
                    Barang Yang Disukai
                  </a>
                  <a href="/profil/riwayat-pembelian" className="block text-gray-700">
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
              </>
            )}
          </div>

          {/* Kolom Kanan (Detail Profil) */}
          <div className="p-6 borde rounded-lg text-left">
            <h2 className="text-2xl font-bold mb-6 text-[#1E2749]">Profil Saya</h2>
            <div className="space-y-5 text-sm text-left">
              <div className="flex flex-col sm:flex-row sm:items-center text-left">
                <span className="w-40 text-gray-400 ">Username</span>
                <span className="text-black font-medium">{user.name}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="w-40 text-gray-400">Email</span>
                <span>{user.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="w-40 text-gray-400">Nomor Telepon</span>
                <span>{user.phone || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start">
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