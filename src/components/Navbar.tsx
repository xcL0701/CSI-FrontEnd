import { useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext"; // ← Tambah ini

export default function Navbar() {
  const { user, token } = useAuth();
  const { cart } = useCart(); // ← Ambil dari context
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const cartCount = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <nav className="bg-white z-50">
      <div className="flex items-center justify-between w-full max-w-[1130px] py-[22px] mx-auto z-50">
        {/* Logo */}
        <a href="/">
          <img src="/assets/images/logos/logont.png" alt="logo" />
        </a>

        {/* Menu */}
        <ul className="flex items-center gap-[50px] w-fit">
          <li>
            <a href="/">Beranda</a>
          </li>
          <li>
            <a href="/katalog">Produk</a>
          </li>
          <li>
            <a href="/tentang">Tentang</a>
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {token && user ? (
            <>
              {/* Keranjang */}
              <a
                href="/keranjang"
                className="relative flex items-center gap-2 rounded-full border border-[#000929] py-2 px-4 h-10"
              >
                <MdOutlineShoppingCart className="size-6" />
                <span className="font-semibold">Keranjang</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </a>

              {/* Profil */}
              <div className="relative">
                <div
                  onClick={() => setShowProfileMenu(true)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#000929] flex items-center justify-center">
                    <img
                      src="/assets/images/photos/photo-1.png"
                      alt="User"
                      className="w-full"
                    />
                  </div>
                  <span className="font-semibold">{user.name}</span>
                </div>

                {showProfileMenu && (
                  <ProfileDropdown onClose={() => setShowProfileMenu(false)} />
                )}
              </div>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="border border-[#000929] py-2 px-4 rounded-md font-semibold"
              >
                Masuk
              </a>
              <a
                href="/register"
                className="border border-[#000929] py-2 px-4 rounded-md font-semibold"
              >
                Daftar
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
