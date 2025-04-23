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

        navigate("/"); // redirect ke beranda
      });
  }, [token, navigate, authToken, apiKey]);

  if (!order) return <div>Loading...</div>;

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
      <div className="text-left w-full max-w-[1130px] mx-auto py-10 mb-5 min-h-[600px] flex flex-row justify-between">
        <div className="payment-items pr-5">
          <h3 className="font-bold text-[32px] w-full md:w-auto text-left">
            Barang
          </h3>
          {items.map((item, idx) => (
            <div key={idx} className="payment-item-card bg-white">
              <div className="payment-item-info">
                <img
                  src={
                    item.product?.thumbnail
                      ? `${import.meta.env.VITE_API_URL}/storage/${item.product.thumbnail}`
                      : "/placeholder.png"
                  }
                  className="w-24 h-24 object-cover rounded"
                  alt={item.product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
                <div>
                  <div className="font-bold text-lg">{item.product.name}</div>
                  <div>Harga: {formatRupiah(item.unit_price)}</div>
                </div>
              </div>
              <div className="self-center">Quantity: {item.quantity}</div>
            </div>
          ))}
        </div>

        <div className="payment-summary">
          <h2 className="text-center mb-4">Ringkasan Belanja</h2>
          <div>Total Barang: {totalItems}</div>
          <div>
            Harga Barang:{" "}
            {formatRupiah(order.total_price - (order.shipping_cost || 0))}
          </div>
          <div>Harga Ongkir: {formatRupiah(order.shipping_cost || 0)}</div>
          <div className="font-semibold">
            Total: {formatRupiah(order.total_price)}
          </div>
          <div className="highlight">
            Total yang Dibayar:{" "}
            {formatRupiah(order.initial_payment || order.total_price)}
          </div>

          <div className="payment-transfer-info mb-5">
            <div className="mb-1">Transfer ke:</div>
            <div className="bank-info">
              <img src="/assets/images/logos/bca.svg" alt="BCA" />
              <div>
                <div className="font-semibold">PT Crusher Spares Indonesia</div>
                <div>1234567890123</div>
              </div>
            </div>
          </div>

          <div className="payment-proof">
            <label className="font-semibold text-sm mb-1 block">
              Bukti Transfer *
            </label>

            <div className="flex items-center gap-4">
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

                if (
                  !["image/jpeg", "image/png", "image/jpg"].includes(file.type)
                ) {
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
              <div className="mt-3 relative inline-block">
                <img
                  src={URL.createObjectURL(proof)}
                  alt="Preview Bukti Transfer"
                  className="max-w-full max-h-60 rounded border"
                />
                <button
                  onClick={() => setProof(null)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button className="payment-button" onClick={handleSubmit}>
            Konfirmasi Pembayaran
          </button>

          <div className="payment-wa-link text-right">
            Ada kesalahan dalam pesanan?
            <a
              href="https://wa.me/6281947139720"
              target="_blank"
              rel="noopener noreferrer"
              className="payment-wa-button"
            >
              Hubungi CS via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
