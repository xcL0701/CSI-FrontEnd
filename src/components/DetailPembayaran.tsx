import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Payment } from "../types/type";

type Props = {
  open: boolean;
  onClose: () => void;
  orderId: string;
};

const ModalDetailPembayaran: React.FC<Props> = ({ open, onClose, orderId }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const authToken = localStorage.getItem("token");
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!open || !authToken || !apiKey) return;
    let isMounted = true;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/payments`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-API-KEY": apiKey,
        },
      })
      .then((res) => {
        if (isMounted) setPayments(res.data.payments);
      })
      .catch((err) => {
        if (isMounted) console.error("Gagal mengambil data pembayaran:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [open, orderId, authToken, apiKey]);

  if (!open) return null;

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);

  const formatTanggal = (isoString?: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "Disetujui",
          className: "bg-green-100 text-green-600 border-green-300",
        };
      case "rejected":
        return {
          label: "Ditolak",
          className: "bg-red-100 text-red-600 border-red-300",
        };
      case "pending":
      default:
        return {
          label: "Menunggu",
          className: "bg-orange-100 text-orange-600 border-orange-300",
        };
    }
  };

  return (
    <>
      {/* Modal Detail */}
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
          <button className="absolute top-3 right-4 text-xl" onClick={onClose}>
            ✕
          </button>

          <div className="mb-4">
            <div className="font-bold text-sm">Detail Pembayaran</div>
          </div>

          <div className="space-y-4 text-sm">
            {payments.length > 0 ? (
              payments.map((payment) => {
                const statusInfo = statusLabel(payment.status);
                const imageUrl = `${import.meta.env.VITE_API_URL}/storage/${
                  payment.proof
                }`;
                return (
                  <div key={payment.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                      <span>{formatRupiah(payment.amount)}</span>
                    </div>
                    <div className="text-xs text-gray-500 text-left">
                      {formatTanggal(payment.paid_at)}
                    </div>
                    <div
                      className="bg-gray-200 h-24 rounded-md flex items-center justify-center text-gray-500 overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(imageUrl)}
                    >
                      <img
                        src={imageUrl}
                        alt="Bukti Transfer"
                        className="h-full object-contain transition duration-200 hover:scale-105"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500">
                Belum ada pembayaran yang tercatat.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Fullscreen */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
};

export default ModalDetailPembayaran;
