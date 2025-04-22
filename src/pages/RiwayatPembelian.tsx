import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Order } from "../types/type";
import { Helmet } from "react-helmet";

const PurchaseHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  useParams();

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

        const resOrders = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": "iuy7tk8o6hjg5dews",
            Accept: "application/json",
          },
        });

        setOrders(resOrders.data.data || resOrders.data);
      } catch (err) {
        console.error("Gagal mengambil data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(search.toLowerCase())
  );

  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!user) return <div className="p-10 text-red-500">Gagal memuat data.</div>;

  return (
    <>
      <Helmet>
        <title>Riwayat Pembelian - Crusher Spares Indonesia</title>
      </Helmet>
      <div className="flex justify-center p-4">
        <div className="grid grid-cols-[250px_1fr] w-full max-w-[1130px]">
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
              <a href="/profil" className="block text-gray-700">
                Profil Saya
              </a>
              <a href="/profil/favorit" className="block text-gray-700">
                Barang Yang Disukai
              </a>
              <a
                href="/profil/riwayat-pembelian"
                className="font-semibold block text-gray-800"
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

          {/* Konten Kanan */}
          <div className="p-10 flex flex-col w-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="font-bold text-[28px] w-full md:w-auto text-left">
                Riwayat Pembelian Saya
              </h2>
              <div className="relative w-full md:w-[300px]">
                <input
                  type="text"
                  placeholder="🔍 Cari ID Transaksi..."
                  className="border border-gray-300 pl-4 pr-3 py-1.5 rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const firstItem = order.order_items?.[0];
                  const thumbnail = firstItem?.product?.thumbnail;
                  const itemCount = order.order_items?.length || 0;

                  return (
                    <div
                      key={order.id}
                      className="flex justify-between items-start gap-4 bg-white rounded-xl shadow-md p-4 border"
                    >
                      {/* Thumbnail & Info Produk */}
                      <div className="flex items-start gap-4 flex-1 m-3">
                        <div className="w-16 h-16 rounded overflow-hidden flex items-center justify-center">
                          {thumbnail ? (
                            <img
                              src={`/storage/${thumbnail}`}
                              alt="Thumbnail"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span>📦</span>
                          )}
                        </div>

                        <div className="text-left">
                          <Link
                            to={`/profil/riwayat-pembelian/${order.id}`}
                            className="font-bold text-blue-600 hover:underline"
                          >
                            {order.id}
                          </Link>
                          <p className="text-sm text-gray-600">
                            {firstItem?.product?.name}
                            {itemCount > 1 && (
                              <span className="text-xs text-gray-400">
                                <br />+{itemCount - 1} Barang lainnya
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Info Kanan */}
                      <div className="text-sm text-right min-w-[180px] m-3">
                        <p className="mb-1">
                          Total: <b>{formatRupiah(order.total_price)}</b>
                        </p>
                        <p className="mb-1">
                          Tanggal:{" "}
                          {new Date(order.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p>
                          Status:{" "}
                          <span
                            className={`font-semibold text-xs px-2 py-1 rounded-full ${
                              order.status === "paid"
                                ? "text-green-600 bg-green-100"
                                : "text-orange-600 bg-orange-100"
                            }`}
                          >
                            {order.status === "paid" ? "Lunas" : "Belum Lunas"}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-10 col-span-full">
                  <p className="text-xl font-semibold">
                    Belum ada riwayat pembelian 😢
                  </p>
                  <p className="mt-2">Yuk mulai belanja dari katalog kami!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseHistoryPage;
