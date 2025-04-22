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
  const [selectedMachineType, setSelectedMachineType] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [, setCartItems] = useState([]);

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
      setCartItems(data); // Update state keranjang
    } catch (err) {
      console.error("Gagal fetch keranjang:", err);
    }
  };

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
              (p: { machine: { slug: string } }) =>
                p.machine && p.machine.slug === mesinParam
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
      setFilteredProducts(products.filter((p) => p.machine.slug === selected));
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
      <br />
      <section className="w-full max-w-[1130px] mx-auto mb-5 min-h-[600px] flex flex-col justify-between">
        {/* Header + Filter/Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 w-full">
          <h2 className="font-bold text-[32px] w-full md:w-auto text-left">
            Katalog Produk 3D
          </h2>

          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <select
              value={selectedMachineType}
              onChange={handleFilterChange}
              className="border border-gray-300 px-3 py-1.5 rounded-full text-sm"
            >
              {machineTypes.map((type) => (
                <option key={type.slug} value={type.slug}>
                  {type.name}
                </option>
              ))}
            </select>
            <div className="relative w-full md:w-[250px]">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Cari nama barang..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 pl-8 pr-3 py-1.5 rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Produk Grid / Empty State */}
        <div className="flex-grow">
          {loading ? (
            <div className="text-center text-gray-500 py-20">
              <p>Memuat produk...</p>
            </div>
          ) : currentItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-[30px] mb-5">
              {currentItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCartSuccess={fetchCartItems}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10 col-span-full">
              <p className="text-xl font-semibold">Produk tidak ditemukan 😢</p>
              <p className="mt-2">
                Coba pilih jenis mesin lain atau hubungi CS kami untuk bantuan.
              </p>
            </div>
          )}
        </div>

        {/* Footer: WhatsApp & Pagination */}
        <div className="mt-auto">
          <div className="mt-8 text-right">
            <p className="text-sm text-gray-500">
              Tidak menemukan produk yang Anda cari?
            </p>
            <a
              href="https://wa.me/6281947139720"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-4 bg-green-600 text-white px-3 rounded-md shadow hover:bg-green-700 transition"
            >
              Hubungi CS via WhatsApp
            </a>
          </div>

          {/* Pagination + Jumlah Per Halaman */}
          <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Jumlah per halaman */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tampilkan:</span>
              {[20, 40, 80].map((jumlah) => (
                <button
                  key={jumlah}
                  onClick={() => {
                    setCurrentPage(1);
                    setItemsPerPage(jumlah);
                  }}
                  className={`px-3 py-1 rounded-md text-sm transition ${
                    itemsPerPage === jumlah
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                  }`}
                >
                  {jumlah}
                </button>
              ))}
              <span className="text-sm text-gray-600">per halaman</span>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-3 text-sm">
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
        </div>
      </section>
    </>
  );
}
