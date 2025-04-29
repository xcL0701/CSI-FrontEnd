import { useNavigate } from "react-router-dom";
import { Product } from "../types/type";
import { useCart } from "../contexts/CartContext";
import { useEffect, useState } from "react";

type ProductCardProps = {
  product: Product;
  onAddToCartSuccess?: () => Promise<void>;
  size?: "sm" | "md"; // ✅ Tambahkan opsi ukuran
};

export default function ProductCard({
  product,
  size = "md",
}: ProductCardProps) {
  const navigate = useNavigate();
  const thumbnail = product.thumbnail || product.product_photos?.[0]?.photo;
  const { fetchCartItems } = useCart();
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${product.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Api-Key": import.meta.env.VITE_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Gagal fetch product detail");

        const data = await res.json();
        setLikesCount(data.likes?.length || 0);

        if (token) {
          const userRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/user`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Api-Key": import.meta.env.VITE_API_KEY,
                "Content-Type": "application/json",
              },
            }
          );

          const user = await userRes.json();
          const userLiked = data.likes?.some(
            (like: any) => like.user_id === user.id
          );
          setLiked(userLiked);
        }
      } catch (err) {
        console.error("Error fetching likes", err);
      }
    };

    fetchLikes();
  }, []);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login untuk menyukai produk!");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products-like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Api-Key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ product_id: product.id }),
        }
      );

      const data = await res.json();
      setLiked(data.liked);
      setLikesCount(data.likes_count);
    } catch (err) {
      console.error("Gagal like/unlike:", err);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu!");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menambahkan ke keranjang");
      }

      alert("Produk berhasil ditambahkan ke keranjang!");
      fetchCartItems();
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menambahkan ke keranjang");
    }
  };

  return (
    <div
      className={`${
        size === "sm" ? "w-[180px] h-[320px]" : "w-[260px] h-[400px]"
      } rounded-lg shadow-md border border-black flex flex-col overflow-hidden bg-gray-800`}
    >
      <div
        className={`bg-white p-2 ${
          size === "sm" ? "h-[150px]" : "h-[230px]"
        } flex items-center justify-center`}
      >
        <img
          src={`${import.meta.env.VITE_API_URL}/storage/${thumbnail}`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3
            className={`${
              size === "sm" ? "text-sm" : "text-base"
            } font-bold hover:underline cursor-pointer transition duration-150 text-white mb-2 text-left`}
            onClick={() => navigate(`/produk/${product.slug}`)}
          >
            {product.name}
          </h3>
          <p
            className={`${
              size === "sm" ? "text-[10px]" : "text-xs"
            } text-white mt-1 text-left`}
          >
            {product.machine?.name || "Tipe mesin tidak tersedia"}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 ${
              size === "sm" ? "text-xs" : "text-sm"
            } text-white hover:text-red-400 transition`}
          >
            <span>{liked ? "❤️" : "🤍"}</span> {likesCount} Suka
          </button>
          <button
            onClick={handleAddToCart}
            className={`bg-orange-500 hover:bg-orange-600 text-white ${
              size === "sm" ? "py-1 text-xs" : "py-2 text-sm"
            } rounded-full`}
          >
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
