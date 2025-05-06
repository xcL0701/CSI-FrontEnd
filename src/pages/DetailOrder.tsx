import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Order, OrderItem, User } from "../types/type";
import ModalBayarSekarang from "../components/BayarSekarang";
import ModalDetailPembayaran from "../components/DetailPembayaran";
import { Helmet } from "react-helmet";

const OrderDetailPage = () => {
  const { id } = useParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [approvedTotalPaid, setApprovedTotalPaid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toNumber = (value: any) =>
    typeof value === "number" ? value : Number(value) || 0;

  const formatRupiah = (number: any) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(toNumber(number));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [orderRes, userRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-API-KEY": "iuy7tk8o6hjg5dews",
              Accept: "application/json",
            },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-API-KEY": "iuy7tk8o6hjg5dews",
            },
          }),
        ]);

        const orderData = orderRes.data.data || orderRes.data.order;
        const itemsData =
          orderRes.data.data?.items || orderRes.data.items || [];

        setOrder(orderData);
        setOrderItems(itemsData);
        setUser(userRes.data.data || userRes.data);

        const approvedPayments = (orderData.payments || []).filter(
          (p: any) => p.status === "approved"
        );
        const approvedSum = approvedPayments.reduce(
          (sum: number, p: any) => sum + toNumber(p.amount),
          0
        );
        setApprovedTotalPaid(approvedSum);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!order)
    return <div className="p-10 text-red-500">Data tidak ditemukan.</div>;

  const remainingBalance = toNumber(order.total_price) - approvedTotalPaid;
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Helmet>
        <title>Pesanan {order.id} - CSI Online</title>
      </Helmet>
      <div className="flex justify-center p-4">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] w-full max-w-[1130px]">
          {/* Sidebar */}
          <div className={`border-r border-gray-300 text-left ${isMobile ? 'block' : 'flex flex-col'}`}>
            {isMobile ? (
              <>
                <div className="p-6 border-b border-gray-300 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full  mr-2" />
                    <p className="font-semibold text-center">{user?.name}</p>
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
                )}
              </>
            ) : (
              <>
                <div className="p-6 border-b border-gray-300 flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mb-4" />
                  <p className="font-semibold text-center">{user?.name}</p>
                  <p className="text-sm text-gray-600 text-center">{user?.email}</p>
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
              </>
            )}
          </div>

          {/* Konten */}
          <div className="p-10">
            <h1 className="text-2xl font-bold mb-6 text-left">
              Riwayat Pembelian <span className="order-id">{order.id}</span>
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                {/* Icon kiri */}
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="w-14 h-14 flex items-center justify-center">
                    <img
                      src="/assets/images/logos/logont.png"
                      alt="logo"
                      className="w-14 h-14"
                    />
                  </div>
                  <div>
                    <p className="font-bold order-id">{order.id}</p>
                    <p className="text-sm text-gray-500 order-date">
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full order-status ${order.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : order.status === "installment"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "canceled"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                >
                  {order.status === "paid"
                    ? "Lunas"
                    : order.status === "installment"
                      ? "Cicilan"
                      : order.status === "canceled"
                        ? "Dibatalkan"
                        : "Belum Lunas"}
                </span>
              </div>

              {/* Daftar Item */}
              <div className="text-sm space-y-2 border-t pt-4 mt-5 order-items">
                <div className="border-b-2">
                  {orderItems.map((item, index) => (
                    <div
                      key={`${item.product_id}-${index}`}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
                    >
                      <span className="product-name">{item.product.name}</span>
                      <span className="item-total-price">{formatRupiah(item.total_price)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t pt-2 mt-4 font-medium order-subtotal">
                  <span>Subtotal</span>
                  <span>
                    {formatRupiah(
                      orderItems.reduce(
                        (acc, item) => acc + item.total_price,
                        0
                      )
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium order-shipping-cost border-b-2">
                  <span>Ongkos Kirim</span>
                  <span>{formatRupiah(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold mt-4 text-base order-total-price border-b-2">
                  <span>Total Harga</span>
                  <span>{formatRupiah(order.total_price)}</span>
                </div>
                <div
                  className={`flex mt-4 justify-between font-semibold order-remaining-balance ${remainingBalance > 0 ? "text-red-600" : "text-green-600"
                    }`}
                >
                  <span>Sisa Tagihan</span>
                  <span>{formatRupiah(remainingBalance)}</span>
                </div>
              </div>

              {/* Tombol */}
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 order-actions">
                <button
                  onClick={() => setIsDetailModalOpen(true)}
                  className="px-4 py-2 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 w-full sm:w-auto"
                >
                  Detail Pembayaran
                </button>
                {order.status !== "paid" && remainingBalance > 0 && (
                  <button
                    onClick={() => setIsPayModalOpen(true)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
                  >
                    Bayar Sekarang
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <ModalBayarSekarang
          open={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          order={order}
          remainingBalance={remainingBalance}
        />
        <ModalDetailPembayaran
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          orderId={order.id}
        />
      </div>
    </>
  );
};
export default OrderDetailPage;
