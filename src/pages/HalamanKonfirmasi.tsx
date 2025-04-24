import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios";
import formatRupiah from "../utils/formatRupiah";
import { Order, OrderItem } from "../types/type";
import { Helmet } from "react-helmet";

export default function PaymentConfirmationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [proof, setProof] = useState<File | null>(null);

  const authToken = localStorage.getItem("token");
  const apiKey = import.meta.env.VITE_API_KEY;
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!order) return alert("Data order belum tersedia.");
    if (!proof) return alert("Upload bukti transfer!");

    if (proof.size > 5 * 1024 * 1024) {
      return alert("Ukuran file maksimal 5MB");
    }
    if (!["image/jpeg", "image/png", "application/pdf"].includes(proof.type)) {
      return alert("Format file harus JPG, PNG, atau PDF");
    }

    const formData = new FormData();
    formData.append("order_id", order.id.toString());
    formData.append(
      "amount",
      (order.initial_payment || order.total_price).toString()
    );
    formData.append("proof", proof);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/payments`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-API-KEY": apiKey,
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim bukti pembayaran!");
    }
  };

  useEffect(() => {
    if (!authToken || !apiKey) {
      alert("Anda harus login terlebih dahulu.");
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/payment/confirmation/${token}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-API-KEY": apiKey,
        },
      })
      .then((res) => {
        setOrder(res.data.order);
        setItems(res.data.items);
      })
      .catch((err) => {
        console.error(err);

        if (err.response?.status === 410) {
          alert("Link pembayaran sudah digunakan.");
        } else if (err.response?.status === 404) {
          alert("Link tidak valid atau tidak ditemukan.");
        } else {
          alert("Terjadi kesalahan saat mengambil data.");
        }

        navigate("/");
      });
  }, [token, navigate, authToken, apiKey]);

  if (!order) return <div className="text-center py-20">Loading...</div>;

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  if (submitted) {
    return (
      <div className="text-center px-4 py-20">
        <h2 className="text-2xl font-bold mb-4">
          Mohon Tunggu, Kami Sedang Mengecek Pembayaran Anda
        </h2>
        <div className="text-6xl mb-6">🧾</div>
        <p className="mb-2">
          Silakan menunggu maksimal 1x24 jam untuk proses verifikasi pembayaran
          di hari kerja (Senin–Jumat, pukul 08.00–17.00 WIB).
        </p>
        <p className="mb-2">
          Pembayaran yang dilakukan di luar jam kerja akan diproses pada hari
          kerja berikutnya.
        </p>
        <p className="mb-6">
          Anda akan menerima notifikasi via email atau WhatsApp setelah
          pembayaran diverifikasi oleh tim admin.
        </p>
        <a
          href="/profil/riwayat-pembelian"
          className="inline-block bg-white text-black px-6 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          Cek Riwayat Pembelian
        </a>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Konfirmasi Pembayaran - Crusher Spares Indonesia</title>
      </Helmet>
      <div className="w-full max-w-[1130px] mx-auto py-10 mb-5 px-4 lg:px-0 min-h-[600px]">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <h3 className="font-bold text-2xl mb-4">Barang</h3>
            {items.map((item, idx) => (
              <div key={idx} className="text-left flex items-center justify-between bg-white p-4 rounded shadow mb-3">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.product?.thumbnail
                        ? `${import.meta.env.VITE_API_URL}/storage/${item.product.thumbnail}`
                        : "/placeholder.png"
                    }
                    className="w-20 h-20 object-cover rounded"
                    alt={item.product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                  <div>
                    <div className="font-bold text-base">{item.product.name}</div>
                    <div className="text-sm text-gray-600">Harga: {formatRupiah(item.unit_price)}</div>
                  </div>
                </div>
                <div className="text-sm">Qty: {item.quantity}</div>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3 bg-white p-5 rounded shadow text-left">
            <h2 className="text-lg font-semibold text-center mb-4">Ringkasan Belanja</h2>
            <div className="mb-1">Total Barang: {totalItems}</div>
            <div className="mb-1">
              Harga Barang: {formatRupiah(order.total_price - (order.shipping_cost || 0))}
            </div>
            <div className="mb-1">Harga Ongkir: {formatRupiah(order.shipping_cost || 0)}</div>
            <div className="font-semibold mb-1">
              Total: {formatRupiah(order.total_price)}
            </div>
            <div className="text-green-600 font-bold mb-4">
              Dibayar: {formatRupiah(order.initial_payment || order.total_price)}
            </div>

            <div className="mb-3">
              <div className="mb-1 font-semibold">Transfer ke:</div>
              <div className="flex items-center gap-3">
                <img src="/assets/images/logos/bca.svg" alt="BCA" className="w-12 h-6" />
                <div>
                  <div className="font-semibold">PT Crusher Spares Indonesia</div>
                  <div className="text-sm">1234567890123</div>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="block font-semibold text-sm mb-1">Bukti Transfer *</label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded text-sm"
                >
                  Pilih File
                </label>
                <span className="text-sm text-gray-600">
                  {proof ? proof.name : "Belum ada file dipilih"}
                </span>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
                    alert("Hanya gambar JPG atau PNG yang diperbolehkan.");
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    alert("Ukuran file maksimal 5MB.");
                    return;
                  }

                  setProof(file);
                }}
              />
              {proof && (
                <div className="mt-3 relative">
                  <img
                    src={URL.createObjectURL(proof)}
                    alt="Preview Bukti Transfer"
                    className="max-h-60 w-full object-contain rounded border"
                  />
                  <button
                    onClick={() => setProof(null)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" onClick={handleSubmit}>
              Konfirmasi Pembayaran
            </button>

            <div className="mt-4 text-sm text-right">
              Ada kesalahan dalam pesanan?<br/>
              <a
                href="https://wa.me/6281947139720"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 bg-green-600 text-white px-4 py-1 rounded-md shadow hover:bg-green-700 transition"
              >
                Hubungi CS via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
