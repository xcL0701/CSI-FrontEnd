import { useCart } from "../contexts/CartContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

export default function Keranjang() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [shippingMethod, setShippingMethod] = useState<
    "" | "pickup" | "delivery"
  >("");

  // Ambil shipping method dari backend saat komponen mount
  useEffect(() => {
    const fetchShippingMethod = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/cart/shipping`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Api-Key": import.meta.env.VITE_API_KEY,
            },
          }
        );

        const savedMethod = res.data?.shipping_method;

        if (savedMethod === "pickup" || savedMethod === "delivery") {
          setShippingMethod(savedMethod);
        } else {
          setShippingMethod("pickup");
          await updateShippingMethod("pickup");
        }
      } catch (err) {
        console.error("Gagal mengambil metode pengiriman:", err);
      }
    };

    fetchShippingMethod();
  }, []);

  const updateShippingMethod = async (method: "pickup" | "delivery") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/shipping`,
        { shipping_method: method },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Api-Key": import.meta.env.VITE_API_KEY,
          },
        }
      );
    } catch (err) {
      console.error("Gagal update metode pengiriman:", err);
    }
  };

  const handleWhatsAppRedirect = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const username = user.name || "Nama tidak diketahui";
    const email = user.email || "Email tidak diketahui";
    const alamat = user.address || "Alamat tidak diketahui";

    const metode = shippingMethod === "pickup" ? "Ambil di Tempat" : "Diantar";

    const itemList = cart
      .map((item) => `- ${item.product?.name || "Produk"} x${item.quantity}`)
      .join("\n");

    const message = `Halo, saya ingin meminta penawaran.\n\nNama: ${username}\nEmail: ${email}\nMetode Pengiriman: ${metode}\nAlamat: ${alamat}\n\nBarang:\n${itemList}\n\n`;

    const encodedMessage = encodeURIComponent(message);

    const phoneNumber = "6281947139720";
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Helmet>
        <title>Keranjang Saya - Crusher Spares Indonesia</title>
      </Helmet>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Keranjang Saya</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">Keranjang masih kosong.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kiri: Daftar Produk */}
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-6 border p-4 rounded-lg shadow bg-white"
                >
                  <img
                    src={
                      item.product?.thumbnail
                        ? `${import.meta.env.VITE_API_URL}/storage/${
                            item.product.thumbnail
                          }`
                        : "/assets/images/no-image.png"
                    }
                    alt={item.product?.name}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div className="flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-left">
                      {item.product?.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-left">
                      {item.product?.machine?.name || "Tanpa informasi mesin"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className="p-1 bg-gray-100 rounded"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-gray-700"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 15.75a.75.75 0 0 1-.53-.22l-6-6a.75.75 0 1 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 0 1 1.06 1.06l-6 6a.75.75 0 0 1-.53.22Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    <span className="px-2 font-semibold">{item.quantity}</span>

                    <button
                      className="p-1 bg-gray-100 rounded"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-gray-700"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 8.25a.75.75 0 0 1 .53.22l6 6a.75.75 0 0 1-1.06 1.06L12 9.56l-5.47 5.47a.75.75 0 1 1-1.06-1.06l6-6a.75.75 0 0 1 .53-.22Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    <button
                      className="ml-3 hover:text-red-600"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-red-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.75 3a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 .75.75V4.5h3a.75.75 0 0 1 0 1.5h-.665l-.56 12.325A2.25 2.25 0 0 1 17.276 20.5H6.724a2.25 2.25 0 0 1-2.249-2.175L3.915 6H3.25a.75.75 0 0 1 0-1.5h3V3Zm1.561 6.47a.75.75 0 0 1 .719.53l.97 6a.75.75 0 1 1-1.458.26l-.97-6a.75.75 0 0 1 .74-.79Zm6.909.53a.75.75 0 0 1 1.458.26l-.97 6a.75.75 0 1 1-1.458-.26l.97-6Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Kanan: Ringkasan & Aksi */}
            <div className="bg-white p-6 rounded-lg shadow space-y-4 h-fit">
              <h3 className="text-xl font-semibold text-left mb-2">
                Ringkasan Belanja
              </h3>
              <p className="text-gray-700 text-left mb-4">
                Total Barang:{" "}
                <span className="font-bold">{totalItemCount}</span>
              </p>
              <div className="mb-4 text-left">
                <label
                  htmlFor="shippingMethod"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Metode Pengiriman:
                </label>
                <select
                  id="shippingMethod"
                  value={shippingMethod}
                  onChange={(e) => {
                    const selected = e.target.value as "pickup" | "delivery";
                    setShippingMethod(selected);
                    updateShippingMethod(selected);
                  }}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="" disabled>
                    Pilih Metode Pengiriman
                  </option>
                  <option value="pickup">Ambil di Tempat</option>
                  <option value="delivery">Diantar</option>
                </select>
              </div>
              <button
                onClick={handleWhatsAppRedirect}
                disabled={!shippingMethod}
                className={`mt-4 px-4 py-2 rounded text-white ${
                  !shippingMethod
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600"
                }`}
              >
                Lanjut Penawaran
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
