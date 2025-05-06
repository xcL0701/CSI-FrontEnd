import React from "react";
import { Order } from "../types/type";

interface Props {
  open: boolean;
  onClose: () => void;
  order: Order;
  remainingBalance: number;
}

const formatRupiah = (number: string | number) => {
  const num = Number(String(number).replace(/\D/g, ""));
  return "Rp. " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const ModalBayarSekarang: React.FC<Props> = ({
  open,
  onClose,
  order,
  remainingBalance,
}) => {
  if (!open) return null;

  const [amount, setAmount] = React.useState("");
  const [rawAmount, setRawAmount] = React.useState("");
  const [proof, setProof] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [audio] = React.useState(
    new Audio("/assets/sound/cash-register-purchase-87313.mp3")
  );

  const handleSubmit = async () => {
    if (!rawAmount || !proof) {
      alert("Jumlah bayar dan bukti transfer wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("order_id", String(order.id));
    formData.append("amount", rawAmount);
    formData.append("proof", proof);
    const token = localStorage.getItem("token");

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": "iuy7tk8o6hjg5dews",
        },
      });

      if (!res.ok) throw new Error("Gagal mengirim pembayaran");
      audio.volume = 0.3;
      audio.play();
      alert("Pembayaran berhasil dikirim!");
      onClose();
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
        <button className="absolute top-3 right-4 text-xl" onClick={onClose}>
          ✕
        </button>

        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="font-bold text-sm">{order.id}</div>
            <div className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
          <span className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full border border-orange-300">
            {order.status === "paid"
              ? "Lunas"
              : order.status === "installment"
              ? "Cicilan"
              : order.status === "canceled"
              ? "Dibatalkan"
              : "Belum Lunas"}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between font-semibold mt-5">
            <span>Sisa Tagihan</span>
            <span>{formatRupiah(remainingBalance)}</span>
          </div>

          <div>
            <div className="text-s font-medium mb-1 text-left mt-10">
              Transfer Ke
            </div>
            <div className="flex items-center gap-5">
              <img src="/assets/images/logos/bca.svg" alt="BCA" />
              <div>
                <p className="text-s font-semibold">
                  PT Crusher Spares Indonesia
                </p>
                <p className="text-s text-left text-gray-600">1234567890123</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-left">
              Jumlah Bayar *
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Rp. 0"
              value={amount}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setRawAmount(value);
                setAmount(formatRupiah(value));
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-left">
              Bukti Transfer *
            </label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="proof-upload"
                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded text-sm"
              >
                Pilih File
              </label>
              <span className="text-sm text-gray-600">
                {proof ? proof.name : "Belum ada file dipilih"}
              </span>
            </div>

            <input
              id="proof-upload"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
                const maxSize = 5 * 1024 * 1024;

                if (!allowedTypes.includes(file.type)) {
                  alert("Hanya gambar JPG atau PNG yang diperbolehkan.");
                  return;
                }

                if (file.size > maxSize) {
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

          <button
            className="w-full bg-green-600 text-white rounded-lg py-2 mt-4 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading || !rawAmount || !proof}
          >
            {loading ? "Mengirim..." : "Konfirmasi Pembayaran"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalBayarSekarang;
