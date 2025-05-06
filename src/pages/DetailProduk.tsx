import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../types/type";
import axios from "axios";
import { BsSun, BsMoon } from "react-icons/bs";
import { FiPlus, FiShare2 } from "react-icons/fi";
import { Helmet } from "react-helmet";
import { useCart } from "../contexts/CartContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isDarkBg, setIsDarkBg] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const { fetchCartItems } = useCart();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [audio] = useState(new Audio("/assets/sound/coin-3-42413.mp3"));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products`, {
        headers: {
          "X-API-KEY": "iuy7tk8o6hjg5dews",
        },
      })
      .then((res) => {
        const found = res.data.find((p: Product) => p.slug === slug);
        setProduct(found);
      });
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    const token = localStorage.getItem("token");
    const fetchLikeStatus = async () => {
      setLikesCount(product.likes?.length || 0);

      if (token) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Api-Key": import.meta.env.VITE_API_KEY,
              "Content-Type": "application/json",
            },
          });
          const user = await res.json();

          const userLiked = !!product.likes?.some(
            (like) => like.user_id === user.id
          );
          setLiked(userLiked);
        } catch (error) {
          console.error("Gagal cek like user", error);
        }
      }
    };

    fetchLikeStatus();
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const container = viewerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const model3D = product.model_3d;

    if (model3D && model3D.trim() !== "") {
      const viewer = document.createElement("model-viewer");
      viewer.setAttribute(
        "src",
        `${import.meta.env.VITE_API_URL}/${product.model_3d}`
      );

      viewer.setAttribute("alt", product.name);
      viewer.setAttribute("auto-rotate", "");
      viewer.setAttribute("camera-controls", "");
      viewer.setAttribute("shadow-intensity", "0.5");
      viewer.setAttribute("exposure", "0.8");
      viewer.setAttribute("environment-image", "neutral");
      viewer.setAttribute("interaction-prompt", "none");

      viewer.style.width = "100%";
      viewer.style.height = isMobile ? "300px" : "400px";
      viewer.style.backgroundColor = isDarkBg ? "#1a1a1a" : "#ffffff";

      container.appendChild(viewer);
    }
  }, [product, isDarkBg, isMobile]);

  useEffect(() => {
    const container = thumbnailRef.current;
    const activeThumb = container?.children[selectedImageIndex] as HTMLElement;

    if (activeThumb && container) {
      const offset =
        activeThumb.offsetLeft -
        container.clientWidth / 2 +
        activeThumb.clientWidth / 2;

      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, [selectedImageIndex]);

  if (!product) return <div>Loading...</div>;

  const has3DModel = product.model_3d;

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
          body: JSON.stringify({ product_id: product?.id }),
        }
      );

      const data = await res.json();
      setLiked(data.liked);
      setLikesCount(data.likes_count);
    } catch (err) {
      console.error("Gagal like/unlike:", err);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link produk berhasil disalin ke clipboard!");
    } catch (err) {
      console.error("Gagal menyalin link:", err);
      alert("Gagal menyalin link ke clipboard");
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu!");
      return;
    }

    try {
      audio.play(); // Putar suara sebelum fetch
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
    <>
      <Helmet>
        <title>{product.name} - CSI Online</title>
      </Helmet>
      <div className="w-full pb-5">
        {/* SECTION 3D */}
        {has3DModel && (
          <div className="w-full flex flex-col items-center justify-center mb-4">
            <div ref={viewerRef} className="w-full"></div>
            <button
              onClick={() => setIsDarkBg((prev) => !prev)}
              className="switch-btn mt-3 text-sm flex items-center gap-2 border px-4 py-2 rounded-full"
            >
              {isDarkBg ? <BsSun /> : <BsMoon />}
              {isDarkBg ? "Background Terang" : "Background Gelap"}
            </button>
          </div>
        )}

        {/* SECTION KONTEN */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row items-start justify-center gap-10 md:pr-30 md:pl-20 pt-6">
            {/* Gambar Produk */}
            <div className="w-full max-w-[400px]">
              {product.product_photos.length > 0 && (
                <div className="w-full h-[320px] rounded-xl border overflow-hidden mb-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/storage/${
                      product.product_photos[selectedImageIndex].photo
                    }`}
                    alt={`Foto ${selectedImageIndex + 1}`}
                    className="object-contain w-full h-full transition-opacity duration-300"
                  />
                </div>
              )}

              <div className="relative flex items-center">
                {/* Panah Kiri */}
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev > 0 ? prev - 1 : product.product_photos.length - 1
                    )
                  }
                  className="absolute left-0 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-100"
                >
                  &#8592;
                </button>

                {/* Thumbnails */}
                <div
                  ref={thumbnailRef}
                  className="flex gap-2 overflow-x-auto px-10 w-full scrollbar-hide"
                >
                  {product.product_photos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`w-[60px] h-[60px] flex-shrink-0 rounded border-2 ${
                        i === selectedImageIndex
                          ? "border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}/storage/${
                          photo.photo
                        }`}
                        alt={`Thumb ${i + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>

                {/* Panah Kanan */}
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev < product.product_photos.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="absolute right-0 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-100"
                >
                  &#8594;
                </button>
              </div>
            </div>

            {/* Detail Produk */}
            <div className="flex-1 text-left">
              <h2 className="text-2xl font-bold mb-3">{product.name}</h2>
              <p className="text-base mb-1 text-gray-600">
                Tipe Mesin:{" "}
                <span className="font-semibold">{product.machine?.name}</span>
              </p>
              <p className="text-base font-semibold mt-4">Deskripsi:</p>
              <p className="text-base text-gray-700 mt-1 leading-relaxed whitespace-pre-line">
                {product.desc}
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="w-full md:w-[300px] bg-white p-4 rounded-xl shadow-md space-y-4">
              <button
                onClick={handleAddToCart}
                className="mb-5 bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 px-4 rounded-full w-full flex items-center justify-center gap-2 text-base"
              >
                <span className="text-xl">
                  <FiPlus />
                </span>{" "}
                Tambah ke Keranjang
              </button>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-white font-medium flex-1 ${
                    liked
                      ? "bg-pink-400 hover:bg-pink-500"
                      : "bg-pink-300 hover:bg-pink-400"
                  }`}
                >
                  <span>{liked ? "❤️" : "🤍"}</span> {likesCount} Suka
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-400 hover:bg-blue-500 text-white font-medium flex-1"
                >
                  <span>
                    <FiShare2 />
                  </span>{" "}
                  Bagikan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
