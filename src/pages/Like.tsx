import { useEffect, useState } from "react";
import axios from "axios";
import { FaMagnifyingGlass } from "react-icons/fa6";
import ProductCard from "../components/ProductCard";
import { Product } from "../types/type";
import { Helmet } from "react-helmet";

const UserLikedProductsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Sesuaikan breakpoint jika perlu
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const resUser = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": "iuy7tk8o6hjg5dews",
            Accept: "application/json",
          },
        });

        setUser(resUser.data.data || resUser.data);

        const resLikes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products-like`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-API-KEY": "iuy7tk8o6hjg5dews",
              Accept: "application/json",
            },
          }
        );
        setLikedProducts(resLikes.data.data || resLikes.data);
        setFilteredProducts(resLikes.data.data || resLikes.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle pencarian + reset pagination
  useEffect(() => {
    const filtered = likedProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, likedProducts]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Determine the number of columns for the grid (same logic as KatalogProduk)
  const gridCols = isMobile ? 2 : 4;

  if (loading) return <div className="p-10">Loading...</div>;
  if (!user) return <div className="p-10 text-red-500">Gagal memuat data.</div>;

  return (
    <>
      <Helmet>
        <title>Barang Yang Disukai - Crusher Spares Indonesia</title>
      </Helmet>
      <div className="flex justify-center p-4">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] w-full max-w-[1130px]">
          {/* Sidebar */}
          <div className={`border-r border-gray-300 text-left ${isMobile ? 'block' : 'flex flex-col'}`}>
            {isMobile ? (
              <>
                <div className="p-6 border-b border-gray-300 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src="/assets/images/photos/photo-1.png"
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover mr-2"
                    />
                    <p className="font-semibold text-center">{user.name}</p>
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
                    <a href="/profil" className=" block text-gray-700">
                      Profil Saya
                    </a>
                    <a
                      href="/profil/favorit"
                      className="font-semibold block text-gray-800"
                    >
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
                )}
              </>
            ) : (
              <>
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
                  <a href="/profil" className=" block text-gray-700">
                    Profil Saya
                  </a>
                  <a
                    href="/profil/favorit"
                    className="font-semibold block text-gray-800"
                  >
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
              </>
            )}
          </div>

          {/* Konten Kanan */}
          <div className="pt-10 flex flex-col w-full">
            {/* Header dan Search */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="font-bold text-[28px] w-full md:w-auto">
                Barang yang Disukai
              </h2>
              <div className="relative w-full md:w-[300px]">
                <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Cari nama barang..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 pl-8 pr-3 py-1.5 rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Grid Produk */}
            <div className="flex-grow self-center">
              {filteredProducts.length > 0 ? (
                <>
                  <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-${gridCols} gap-2 mb-5`}>
                    {currentProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        size="sm"
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-6">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                      >
                        Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm rounded border ${
                              page === currentPage
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500 py-10 col-span-full">
                  <p className="text-xl font-semibold">
                    Belum ada produk disukai 😢
                  </p>
                  <p className="mt-2">
                    Yuk cari produk favorit kamu di katalog!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLikedProductsPage;