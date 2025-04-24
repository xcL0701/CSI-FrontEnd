import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types/type";
import ProductCard from "../components/ProductCard";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Helmet } from "react-helmet";

export default function KatalogProduk() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedMachineType, setSelectedMachineType] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [, setCartItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const machineTypes = [
    { name: "Semua", slug: "semua" },
    ...Array.from(
      new Set(
        products
          .filter((p) => p.machine && p.machine.name && p.machine.slug)
          .map((p) =>
            JSON.stringify({ name: p.machine.name, slug: p.machine.slug })
          )
      )
    ).map((json) => JSON.parse(json)),
  ];

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Api-Key": import.meta.env.VITE_API_KEY,
        },
      });

      if (!response.ok) throw new Error("Gagal mengambil keranjang");

      const data = await response.json();
      setCartItems(data);
    } catch (err) {
      console.error("Gagal fetch keranjang:", err);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchCartItems();
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products`, {
        headers: {
          "X-API-KEY": import.meta.env.VITE_API_KEY,
        },
      })
      .then((res) => {
        const all = res.data;
        setProducts(all);
        const mesinParam = searchParams.get("mesin");
        if (mesinParam && mesinParam !== "semua") {
          setFilteredProducts(
            all.filter(
              (p: Product) => p.machine && p.machine.slug === mesinParam
            )
          );
          setSelectedMachineType(mesinParam);
        } else {
          setFilteredProducts(all);
        }
      })
      .catch((err) => {
        console.error("Gagal fetch produk:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedMachineType(selected);
    setCurrentPage(1);
    if (selected === "semua") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.machine?.slug === selected));
    }
  };

  const filteredBySearch = filteredProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBySearch.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBySearch.length / itemsPerPage);

  return (
    <>
      <Helmet>
        <title>Katalog - Crusher Spares Indonesia</title>
      </Helmet>
      <section className="w-full max-w-[1200px] mx-auto px-4 py-6">
        {/* Header + Filter/Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="font-bold text-2xl md:text-3xl w-full md:w-auto text-left">
            Katalog Produk 3D
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={selectedMachineType}
              onChange={handleFilterChange}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full sm:w-auto"
            >
              {machineTypes.map((type) => (
                <option key={type.slug} value={type.slug}>
                  {type.name}
                </option>
              ))}
            </select>
            <div className="relative w-full sm:w-[250px]">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Cari nama barang..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 pl-8 pr-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Produk Grid / Empty State */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">
            <p>Memuat produk...</p>
          </div>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-10">
            {currentItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCartSuccess={fetchCartItems}
                size={isMobile ? "sm" : "md"}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg font-semibold">Produk tidak ditemukan 😢</p>
            <p className="mt-2">
              Coba pilih jenis mesin lain atau hubungi CS kami untuk bantuan.
            </p>
          </div>
        )}

        {/* WhatsApp & Pagination */}
        <div className="flex flex-col gap-6 md:flex-row justify-between items-center mt-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              Tidak menemukan produk yang Anda cari?
            </p>
            <a
              href="https://wa.me/6281947139720"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 bg-green-600 text-white px-4 py-1 rounded-md shadow hover:bg-green-700 transition"
            >
              Hubungi CS via WhatsApp
            </a>
          </div>

          {/* Jumlah per halaman */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Tampilkan:</span>
            {[20, 40, 80].map((jumlah) => (
              <button
                key={jumlah}
                onClick={() => {
                  setCurrentPage(1);
                  setItemsPerPage(jumlah);
                }}
                className={`px-3 py-1 rounded-md transition ${itemsPerPage === jumlah
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
              >
                {jumlah}
              </button>
            ))}
            <span className="text-gray-600">per halaman</span>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-3 text-sm mt-4 md:mt-0">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              &lt;
            </button>
            <span className="text-gray-600">
              {currentPage} dari {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
